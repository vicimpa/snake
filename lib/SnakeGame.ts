import { GameMap } from "./GameMap";
import { Range } from "./Range";
import { rand } from "./Random";

export enum SnakeObject {
  CLEAR,
  HEAD,
  BODY,
  TAIL,
  APPLE
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

export class SnakeGame {
  #ticks: number
  #score: number
  #direction: TDirectionName
  #hasMove = false
  #map: GameMap

  get map() { return [...this.#map] }
  get width() { return this.#map.width }
  get height() { return this.#map.height }
  get maxScore() { return this.#map.maxScore }
  get ticks() { return this.#ticks }
  get score() { return this.#score }
  get appleLength() {
    return this.map.filter(
      e => e == this.maxScore).length
  }
  get renderMap() {
    const { map, width, height } = this

    return Range.go(0, height).map(y => {
      return Range.go(0, width).map(x => {
        let e = map[y * width + x]
        if (!e)
          return SnakeObject.CLEAR
  
        if (e == this.maxScore)
          return SnakeObject.APPLE
  
        if (e == this.#score)
          return SnakeObject.HEAD
  
        if (e == 1)
          return SnakeObject.TAIL
  
        return SnakeObject.BODY
      })
    })
  }

  constructor(score = 3, width = 10, height = width) {
    this.#map = new GameMap(width, height)
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
      this.#map[this.#map.getIndex(cX, cY, ...delta)] = val
    })
  }

  posIndex(index: number): [number, number] {
    return this.#map.posIndex(index)
  }

  posValue(value: number): [number, number] {
    return this.#map.posValue(value)
  }

  getIndex(x = 0, y = x, aX = 0, aY = 0) {
    return this.#map.getIndex(x , y, aX, aY)
  }

  getValue(x = 0, y = x, aX = 0, aY = 0) {
    return this.#map.getValue(x , y, aX, aY)
  }

  pushApple() {
    const { map } = this
    const clearIndexes = map.map((e, i) => i).filter(e => !map[e])
    const index = clearIndexes[rand(0, clearIndexes.length - 1)]
    this.#map[index] = this.maxScore
  }

  getDirection(dir = this.#direction) {
    return [...ConstDirections[dir]]
  }

  setDirection(dir = this.#direction) {
    const [x, y] = this.getDirection()
    const [xD, yD] = this.getDirection(dir)

    if(this.#direction == dir)
      return this.#direction

    if (!this.#hasMove)
      return this.#direction

    if ((x && xD) && x == xD * -1) return this.#direction
    if ((y && yD) && y == yD * -1) return this.#direction

    // const newValue = this.getValue(x,y,...direction)

    // if(!newValue || newValue == this.maxScore)
    //   return this.#direction = dir

    this.#hasMove = false
    return this.#direction = dir
  }

  cutTail(score = 0) {
    Range.go(this.#score, 0).map(s => {
      let [x, y] = this.#map.posValue(s)
      let index = this.#map.getIndex(x, y)
      let val = s - score

      if (val == 0) val = this.maxScore
      if (val < 0) val = this.maxScore
      return [index, val]
    }).map(([index, val]) => {
      this.#map[index] = val
    })

    this.#score -= score

    return score
  }

  loop(score = this.score, newPosition?: [number, number]): number | boolean {
    if (score == this.score)
      this.#hasMove = true
  
    if (!score)
      return this.#map[this.#map.getIndex(...newPosition)] = score   // 0 0 4 3 2 1 0 0 0 0

    const [x, y] = this.#map.posValue(score)
    const dir = this.getDirection(this.#direction)

    if (x < 0 || y < 0)
      return 0

    if (!newPosition)
      newPosition = this.#map.posIndex(
        this.#map.getIndex(x, y, ...dir))

    const newValue = this.#map.getValue(...newPosition)
    const newIndex = this.#map.getIndex(...newPosition)

    if (newValue == this.maxScore) {
      this.#map[newIndex] = ++this.#score

      this.#ticks++

      if (!this.appleLength)
        this.pushApple()

      return this.#score
    }

    if (newValue) {
      this.cutTail(newValue)
      return this.loop()
    }

    if (score == this.score)
      this.#ticks++

    this.#map[this.#map.getIndex(x, y)] = 0
    this.#map[newIndex] = score

    return this.loop(score - 1, [x, y])
  }
}