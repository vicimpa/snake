import React, { useEffect } from "react";
import { SnakeGame } from "lib/SnakeGame";
import { ReactRenderer } from "lib/ReactRenderer";

import "./Main.sass";
import { GameComponent } from "../Game/Game";

interface IMainProps {
  width?: number
  height?: number
  score?: number
}

export const MainComponent = (props: IMainProps) => {
  const {
    width = 20, 
    height = 20, 
    score = 4
  } = props

  const game = new SnakeGame(score, width, height)
  const renderer = new ReactRenderer(game)
  
  renderer.render()

  const style = {
    width: width*16,
    height: height*16
  }

  useEffect(() => {
    const onKeyDown = ({key}: KeyboardEvent) => {
      switch(key) {
        case 'w': 
        case 'ArrowUp': 
          game.setDirection('UP'); break

        case 's': 
        case 'ArrowDown': 
          game.setDirection('BOTTOM'); break

        case 'a': 
        case 'ArrowLeft': 
          game.setDirection('LEFT'); break

        case 'd': 
        case 'ArrowRight': 
          game.setDirection('RIGHT'); break
        
        default: console.log(key)
      }
    }

    let interval = setInterval(() => {
      game.loop()
      renderer.render()
    }, 200)
    

    setTimeout(() => {
    }, 10)

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onkeydown)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="main-component" style={style}>
      <GameComponent renderer={renderer} />
    </div>
  )
}