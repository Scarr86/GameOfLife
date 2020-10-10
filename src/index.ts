import { fromEvent, interval, Observable, Subscription } from "rxjs";
import {
  repeatWhen,
  switchMap,
  switchMapTo,
  takeUntil,
  tap,
} from "rxjs/operators";
import Canvas from "./script/convas";
import Kingdom from "./script/kingdom";
import { AndStratgy, Condition, NearbyStratgy, Rule } from "./script/rule";
import View from "./script/view";

const $canvas: HTMLElement = document.querySelector(".canvas");
const $btnStart = document.getElementById("btn-start");
const $btnStop = document.getElementById("btn-stop");
const $resolutionInput = document.getElementById(
  "resolution"
) as HTMLInputElement;
const $densityInput = document.getElementById("density") as HTMLInputElement;

let stop$ = fromEvent($btnStop, "click").pipe(
  tap((ev) => {
    let target = ev.target as HTMLButtonElement;
    target.textContent = target.textContent == "Stop" ? "Pause" : "Stop";
  })
);
let start$ = fromEvent($btnStart, "click");

const TIME_CYCLE_LIFE = 100;

let canvas: Canvas = new Canvas($canvas);
let kingdom: Kingdom;
let view: View;
let rule: Rule;
let timerCycleLife: Subscription = null;

function newKingdom(time: number): Observable<any> {
  kingdom = new Kingdom(
    canvas.width,
    canvas.height,
    Number($resolutionInput.value),
    Number(+$densityInput.max + +$densityInput.min - +$densityInput.value)
  );

  rule = new Rule(
    kingdom,
    new AndStratgy([new Condition(3, (a, b) => a === b)]),
    new AndStratgy([
      new Condition(3, (a, b) => a <= b),
      new Condition(2, (a, b) => a >= b),
    ]),
    new NearbyStratgy(kingdom)
  );
  view = new View(canvas, kingdom);
  return interval(time).pipe(
    tap(() => {
      rule.nextCycleLife();
      view.paint();
      console.log("new Cycle  Life");
    })
  );
}
timerCycleLife = start$
  .pipe(
    tap(() => ($btnStop.textContent = "Stop")),
    switchMap(() =>
      newKingdom(TIME_CYCLE_LIFE).pipe(
        takeUntil(stop$),
        repeatWhen(() => stop$)
      )
    )
  )
  .subscribe();

canvas.onMouseMoveLCM().subscribe(([x, y]) => {
  if (kingdom && kingdom.setLife(x, y)) {
    view && view.paint();
  }
});
canvas.onMouseMoveRCM().subscribe(([x, y]) => {
  if (kingdom && kingdom.setDeath(x, y)) {
    view && view.paint();
  }
});
