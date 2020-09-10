import React from "react";
import { ReactRenderer } from "lib/ReactRenderer";

import "./Game.sass";
import { GameMapComponent } from "../GameMap/GameMap";
import { GameInfoComponent } from "../GameInfo/GameInfo";

interface IGameProps {
  renderer: ReactRenderer
}

export const GameComponent = ({renderer}: IGameProps) => {

  return (
    <div className="game-component">
      <GameInfoComponent renderer={renderer} />
      <GameMapComponent renderer={renderer} /> 
    </div>
  )
}