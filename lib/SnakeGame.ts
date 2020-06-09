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

export class SnakeGame extends GameMap {
  #ticks: number
  #score: number
  #direction: TDirectionName
  #hasMove = false

  get ticks() { return this.#ticks }
  get score() { return this.#score }
  get appleLength() {
    return [...this].filter(
      e => e==this.maxScore).length
  }
  get gameMap() {
    return [...this].map(e => {
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
    const [x, y] = this.getDirection()
    const [xD, yD] = this.getDirection(dir)

    if(!this.#hasMove)
      return this.#direction 

    if((x && xD) && x == xD*-1) return this.#direction 
    if((y && yD) && y == yD*-1) return this.#direction 

    // const newValue = this.getValue(x,y,...direction)

    // if(!newValue || newValue == this.maxScore)
    //   return this.#direction = dir

    this.#hasMove = false
    return this.#direction = dir
  }

  cutTail(score = 0) {
    Range.go(this.#score, 0).map(s => {
      let [x, y] = this.posValue(s)
      let index = this.getIndex(x, y)
      let val = s - score

      if(val == 0) val = this.maxScore
      if(val < 0) val = this.maxScore
      return [index, val]
    }).map(([index, val]) => {
      this[index] = val
    })

    this.#score -= score

    return score
  }

  loop(score = this.score, newPosition?: [number, number]): number | boolean {
    if (!score)
      return this[this.getIndex(...newPosition)] = score

    const [x, y] = this.posValue(score)
    const dir = this.getDirection(this.#direction)

    if (x < 0 || y < 0)
      return 0

    if (!newPosition)
      newPosition = this.posIndex(
        this.getIndex(x, y, ...dir))

    if (this.getValue(...newPosition) == this.maxScore) {
      this[this.getIndex(...newPosition)] = ++this.#score
      
      if(!this.appleLength)
        this.pushApple()

      return this.#score
    }
    
    let val = this.getValue(...newPosition)

    if (val) {
      this.cutTail(val)
      return this.loop()
    }

    if(score == this.score) {
      this.#hasMove = true
      this.#ticks++
    }

    this[this.getIndex(x, y)] = 0
    this[this.getIndex(...newPosition)] = score

    return this.loop(score - 1, [x, y])
  }
}