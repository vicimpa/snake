import { GameMap } from "./GameMap";
import { Range } from "./Range";
import { rand } from "./Random";

export enum SnakeObject {
  CLEAR = 0,
  HEAD = 1,
  BODY = 2,
  APPLE = 3
}

const ConstDirections = {
  UP: <TDirection>[0, -1],
  LEFT: <TDirection>[-1, 0],
  RIGHT: <TDirection>[1, 0],
  BOTTOM: <TDirection>[0, 1]
}

const DirectionsNames: TDirectionName[] = 
  <any>Object.keys(ConstDirections)

type TDirection = [number, number]
type TDirectionName = keyof typeof ConstDirections

export class SnakeGame extends GameMap {
  #ticks: number
  #score: number
  #direction: TDirectionName

  get ticks() { return this.#ticks }
  get score() { return this.#score }
  get gameMap() {
    return [...this].map(e => {
      if (!e)
        return SnakeObject.CLEAR

      if (e == this.maxScore)
        return SnakeObject.APPLE

      if (e == this.#score)
        return SnakeObject.HEAD

      return SnakeObject.BODY
    })
  }

  constructor(score = 3, width = 10, height = width) {
    super(width, height)

    this.#ticks = 0
    this.#score = score
    this.#direction = DirectionsNames[rand(0, 3)]

    this.pushSnake()
    this.pushApple()
  }
  private pushSnake() {
    const { width, height, score } = this

    const cX = width / 2 | 0
    const cY = height / 2 | 0
    const dir = this.getDirection(this.#direction)

    Range.go(score, 0).map((val, i) => {
      let delta = dir.map(e => e * -1 * i)
      this[this.getIndex(cX, cY, ...delta)] = val
    })
  }

  pushApple() {
    const clearIndexes = [...this].map((e, i) => i).filter(e => !this[e])
    const index = clearIndexes[rand(0, clearIndexes.length - 1)]
    this[index] = this.maxScore
  }

  getDirection(dir: TDirectionName = this.#direction) {
    return [...ConstDirections[dir]]
  }

  setDirection(dir: TDirectionName) {
    const { score } = this
    const direction = this.getDirection(dir)
    const [x, y] = this.posValue(score)

    const newValue = this.getValue(x,y,...direction)

    if(!newValue || newValue !== this.maxScore)
      return this.#direction = dir

    return this.#direction
  }

  loop(score = this.score, newPosition?: [number, number]) {
    if (!score)
      return this[this.getIndex(...newPosition)] = score

    if(score == this.score)
      this.#ticks++

    const [x, y] = this.posValue(score)
    const dir = this.getDirection(this.#direction)

    if (x < 0 || y < 0)
      return 0

    if (!newPosition)
      newPosition = this.posIndex(
        this.getIndex(x, y, ...dir))

    if (this.getValue(...newPosition) == this.maxScore) {
      this.pushApple()
      return this[this.getIndex(...newPosition)] = ++this.#score
    }

    if (this.getValue(...newPosition))
      return

    this[this.getIndex(...newPosition)] = score

    this.loop(score - 1, [x, y])
  }
}