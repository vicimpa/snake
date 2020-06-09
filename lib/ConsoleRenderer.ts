import { SnakeGame, SnakeObject } from "./SnakeGame";
import { Range } from "./Range";
import { Red, Green, Reset, Cyan } from "./Colors";

export class ConsoleRenderer {
  constructor(public game: SnakeGame) { }

  render() {
    let output = ''

    const { width, height, score, ticks, gameMap } = this.game
    const horisontal = Range.go(0, width)
    const vertical = Range.go(0, height)

    const horisontalRow = horisontal.map(e => '─').join('─')

    const gameData = {
      'Score': score,
      'Ticks': ticks
    }

    output += Object.keys(gameData)
      .map(e => `${e}: ${gameData[e]}`).join(' ') + '\n'

    output += `┌${horisontalRow}┐\n`

    vertical.map((y) => {
      const row = horisontal.map((x) => {
        let index = this.game.getIndex(x, y)

        switch (gameMap[index]) {
          case SnakeObject.CLEAR: return ' '
          case SnakeObject.HEAD: return Red + '᪣' + Reset
          case SnakeObject.BODY: return '᪣'
          case SnakeObject.TAIL: return Cyan + '᪣' + Reset
          case SnakeObject.APPLE: return Green + '᪥' + Reset
        }

      }).join(' ')

      output += `│${row}│\n`
    })


    output += `└${horisontalRow}┘\n`

    console.clear()
    console.log(output)
  }
}