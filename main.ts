
import { SnakeGame } from "./lib/SnakeGame";
import { ConsoleRenderer } from "./lib/ConsoleRenderer";
import { KeyboardController, Keys } from "./lib/Keyboard";

const snakeGame = new SnakeGame(6, 24, 10)
const renderer = new ConsoleRenderer(snakeGame)
const keyboard = new KeyboardController()

keyboard.on(Keys.SPACE, () => {
  snakeGame.loop()
  renderer.render()
})

renderer.render()

// keyboard.on(Keys.SPACE, () => { snakeGame.loop() })