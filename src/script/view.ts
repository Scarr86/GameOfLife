import { isArray } from "lodash";
import Canvas from "./convas";
import Kingdom from "./kingdom";
function fill(arr, val) {
  isArray(arr)
    ? arr.forEach((v, i, arr) => (isArray(v) ? fill(v, val) : (arr[i] = val)))
    : "";
}
export default class View {
  constructor(private canvas: Canvas, private model: Kingdom) {
    this.paint();
  }

  paint() {
    this.canvas.clear();
    this.model.map.forEach((rows: boolean[], y, arrRows) => {
      rows.forEach((b, x) => {
        if (b) {
          this.canvas.drawRectangle(
            x,
            y,
            this.model.resolution,
            this.model.resolution
          );
        }
        // this.canvas.drawRectangle(
        //   x,
        //   y,
        //   this.model.resolution,
        //   this.model.resolution,
        //   b ? this.model.lifeColor : this.model.deathColor
        // );
      });
    });
  }
}
