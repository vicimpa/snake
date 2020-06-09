
export class Range {
  constructor(private from: number, private to: number, private include = false) {
    this.from = from | 0
    this.to = to | 0

    this[`${from}`] = `${to}`

    Object.defineProperty(this, 'from', {enumerable: false})
    Object.defineProperty(this, 'to', {enumerable: false})
  }

  map<T>(callback: (e: number, i: number, range: Range) => T): T[] {
    const output: T[] = []
    let i = 0

    for(let e of this)
      output.push(callback(e, i++, this))

    return output
  }

  [Symbol.iterator]() {
    const { from, to: t, include } = this
    let current = from, delta = 0

    if(from < t) delta = 1
    if(t < from) delta = -1

    const to = include ? t + delta : t

    return {
      next() {
        if(current == to) 
          return {done: true}

        let value = current
        current+=delta
        return { value, done: false}
      }
    }
  }

  static go(from: number, to: number, include = false) {
    return new Range(from, to, include)
  }
}