import Kingdom from "./kingdom";

export class Condition {
  constructor(private base, private conditionFn: (a, b) => boolean) {}
  isTruthy(num) {
    return this.conditionFn(num, this.base);
  }
}

export class AndStratgy {
  constructor(private conditions: Condition[]) {}
  isTruthy(num) {
    for (let i = 0; i < this.conditions.length; i++) {
      if (!this.conditions[i].isTruthy(num)) return false;
    }
    return true;
  }
}

export class NearbyStratgy {
  parms = [
    { dx: -1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: 0 },
  ];
  constructor(private model: Kingdom) {}
  numNearbyLife(x, y) {
    let map = this.model.map;
    let countLife = 0;
    // debugger;
    for (let dx = -1; dx < 2; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        let row = (x + dx + map.length) % map.length;
        let col = (y + dy + map[row].length) % map[row].length;
        let isSalfe = row === x && col === y;
        if (map[row][col] && !isSalfe) ++countLife;
      }
    }
    return countLife;
    // return this.parms.reduce((num, p) => {
    //   let nx = x + p.dx;
    //   let ny = y + p.dy;
    //   if (ny >= 0 && ny <= map.length - 1) {
    //     if (nx >= 0 && nx <= map[ny].length - 1) {
    //       if (map[ny][nx]) ++num;
    //     }
    //   }
    //   return num;
    // }, 0);
  }
}
export class Rule {
  constructor(
    private model: Kingdom,
    private newLifeStrategy: AndStratgy,
    private deathStrategy: AndStratgy,
    private nearbyStratgy: NearbyStratgy
  ) {}
  nextCycleLife() {
    let oldMap = this.model.map;
    let newMap: boolean[][] = Array.from({ length: oldMap.length }, (v, k) =>
      Array.from({ length: oldMap[k].length })
    );

    for (let row = 0; row < oldMap.length; row++) {
      for (let col = 0; col < oldMap[row].length; col++) {
        let numNearby = this.nearbyStratgy.numNearbyLife(row, col);
        if (oldMap[row][col]) {
          newMap[row][col] = this.deathStrategy.isTruthy(numNearby); // true - next life;  false - dead
        } else {
          newMap[row][col] = this.newLifeStrategy.isTruthy(numNearby); // true - new life;  false - fail
        }
      }
    }
    this.model.map = newMap;
  }
}
