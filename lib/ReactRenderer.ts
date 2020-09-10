import { BaseRenderer } from "./BaseRenderer";
import { createShareStore } from "./ShareStore";
import { Range } from "./Range";
import { SnakeObject } from "./SnakeGame";

export enum DirectionBlock {
  VERTICAL,
  HORIZONTAL,
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT
}

export interface IPointState {
  value: SnakeObject,
  direction: DirectionBlock
}

export class ReactRenderer extends BaseRenderer {
  previewLast: [number, number]

  #info = createShareStore({ score: 0, ticks: 0 })
  #data = createShareStore<IPointState[]>([])

  get data() {
    return this.#data.get()
  }

  get width() {
    return this.game.width
  }

  get height() {
    return this.game.height
  }

  useInfo() {
    return this.#info.useState()
  }
  useData() {
    return this.#data.useState()
  }

  render() {
    const { width, height, score, ticks, renderMap } = this.game
    const state = [...this.#data.get()] || []

    const directions: DirectionBlock[] = []

    Range.go(score, 0).map(e => {
      const [x, y] = this.game.posValue(e)
      const i = this.game.getIndex(x, y)
      const neighbors: [number, number][] = []
      const dir = this.game.getDirection()
      const { previewLast } = this

      if (e == score) neighbors.push(this.game.posIndex(this.game.getIndex(x, y, ...dir)))
      if (e == 1 && previewLast) neighbors.push(previewLast)

      if (e == 1) this.previewLast = [x, y]

      if (e + 1 <= score) neighbors.push(this.game.posValue(e + 1))
      if (e - 1 > 0) neighbors.push(this.game.posValue(e - 1))

      const positions = new Uint8Array(4)

      for (let [nX, nY] of neighbors) {
        let [dX, dY] = [x - nX, y - nY]

        if (dY == -1) positions[0] = 1
        if (dY == 1) positions[1] = 1
        if (dX == -1) positions[2] = 1
        if (dX == 1) positions[3] = 1

        if (dY == (height - 1)) positions[0] = 1
        if (dY == -(height - 1)) positions[1] = 1
        if (dX == (width - 1)) positions[2] = 1
        if (dX == -(width - 1)) positions[3] = 1
      }

      const position = parseInt([...positions].join(''), 2)

      switch (position) {
        case 0b0010: directions[i] = DirectionBlock.LEFT; break
        case 0b0001: directions[i] = DirectionBlock.RIGHT; break
        case 0b0011: directions[i] = DirectionBlock.HORIZONTAL; break
        case 0b1000: directions[i] = DirectionBlock.TOP; break
        case 0b0100: directions[i] = DirectionBlock.BOTTOM; break
        case 0b1100: directions[i] = DirectionBlock.VERTICAL; break
        case 0b1001: directions[i] = DirectionBlock.TOP_LEFT; break
        case 0b1010: directions[i] = DirectionBlock.TOP_RIGHT; break
        case 0b0101: directions[i] = DirectionBlock.BOTTOM_LEFT; break
        case 0b0110: directions[i] = DirectionBlock.BOTTOM_RIGHT; break
      }
    })

    for (let i = 0; i < width * height; i++) {
      let [x, y] = this.game.posIndex(i)

      state[i] = {
        value: renderMap[y][x],
        direction: directions[i]
      } 
    }

    this.#info.set({ score, ticks })
    this.#data.set(state)
  }
}