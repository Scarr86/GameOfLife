export default class Kingdom {
  lifeColor = "crimson";
  deathColor = "#242424";
  map: Array<boolean[]>;
  constructor(w, h, public resolution = 25, private density = 2) {
    const rows = h / resolution;
    const cols = w / resolution;
    console.log("all :", rows * cols);

    this.map = Array.from({ length: rows }, () =>
      Array.from(
        { length: cols },
        () => !Boolean(Math.floor(Math.random() *  density))
      )
    );
  }
  print() {
    console.log(this.map);
  }
  setLife(x, y) {
    let row = Math.min(Math.floor(y / this.resolution), this.map.length - 1);
    let col = Math.min(
      Math.floor(x / this.resolution),
      this.map[row].length - 1
    );
    if (this.map[row][col]) {
      return false;
    } else {
      this.map[row][col] = true;
      return true;
    }
  }
  setDeath(x, y) {
    let row = Math.min(Math.floor(y / this.resolution), this.map.length - 1);
    let col = Math.min(
      Math.floor(x / this.resolution),
      this.map[row].length - 1
    );
    if (!this.map[row][col]) {
      return false;
    } else {
      this.map[row][col] = false;
      return true;
    }
  }
  copyMap() {
    return this.map.map((r) => r.slice());
  }
}
