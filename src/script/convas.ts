import {
  animationFrameScheduler,
  from,
  fromEvent,
  merge,
  Observable,
} from "rxjs";
import {
  distinctUntilChanged,
  finalize,
  map,
  observeOn,
  switchMapTo,
  takeUntil,
  tap,
  throttleTime,
  filter,
} from "rxjs/operators";

export default class Canvas {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private mouseMoveLCM: Observable<MouseEvent>;
  private mouseMoveRCM: Observable<MouseEvent>;

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  constructor(el: HTMLElement) {
    const { width, height } = el.getBoundingClientRect();
    let canvas = document.createElement("canvas");
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);
    this.canvas = canvas;
    el.append(canvas);
    this.ctx = canvas.getContext("2d");
    this.clear();

    // fromEvent(canvas, "click").subscribe((ev: MouseEvent) =>
    //   console.log(ev.offsetX, ev.offsetY)
    // );
    let mouseDown = fromEvent<MouseEvent>(this.canvas, "mousedown");
    let mouseMove = fromEvent<MouseEvent>(this.canvas, "mousemove");
    let mouseUp = fromEvent<MouseEvent>(document.body, "mouseup");

    let mouseMoveLCM = mouseDown.pipe(
      filter((ev) => ev.which === 1),
      switchMapTo(mouseMove.pipe(takeUntil(mouseUp)))
      //   throttleTime(10, animationFrameScheduler)
    );
    this.mouseMoveLCM = merge(
      mouseMoveLCM,
      mouseDown.pipe(filter((ev) => ev.which === 1))
    );

    // ======
    let contexmenu = fromEvent<MouseEvent>(this.canvas, "contextmenu")
      .pipe(tap((ev) => ev.preventDefault()))
      .subscribe();

    let mouseMoveRCM = mouseDown.pipe(
      filter((ev) => ev.which === 3),
      switchMapTo(mouseMove.pipe(takeUntil(mouseUp)))
      //   throttleTime(10, animationFrameScheduler)
    );
    this.mouseMoveRCM = merge(
      mouseMoveRCM,
      mouseDown.pipe(filter((ev) => ev.which === 3))
    );
  }
  onClick() {
    return fromEvent(this.canvas, "click").pipe(
      map((ev: MouseEvent) => [ev.offsetX, ev.offsetY])
    );
  }
  onMouseMoveLCM() {
    return this.mouseMoveLCM.pipe(map((ev) => [ev.offsetX, ev.offsetY]));
  }
  onMouseMoveRCM() {
    return this.mouseMoveRCM.pipe(map((ev) => [ev.offsetX, ev.offsetY]));
  }
  drawSquare(x, y, z, fillStyle = "crimson") {
    this.drawRectangle(x, y, z, z, fillStyle);
  }
  drawRectangle(x, y, w, h, fillStyle = "crimson") {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(w * x, h * y, w, h);
  }
  clear(fillStyle = "#242424") {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
