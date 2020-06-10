import { SnakeGame } from "./lib/SnakeGame";
import { ConsoleRenderer } from "./lib/ConsoleRenderer";
import { KeyboardController, Keys } from "./lib/Keyboard";

const snakeGame = new SnakeGame(4, 20, 20)
const renderer = new ConsoleRenderer(snakeGame)
const keyboard = new KeyboardController()

if(process.argv.indexOf('-c') !== -1)
  renderer.colorize = false

if(process.argv.indexOf('-i') !== -1)
  renderer.extended = false


setInterval(() => {
  snakeGame.loop()
  renderer.render()
}, 200)

renderer.render()

keyboard.on('keypress', ({enum: e}) => {
  switch(e) {
    case Keys.UP: snakeGame.setDirection('UP'); break
    case Keys.LEFT: snakeGame.setDirection('LEFT'); break
    case Keys.RIGHT: snakeGame.setDirection('RIGHT'); break
    case Keys.BOTTOM: snakeGame.setDirection('BOTTOM'); break
  }
})