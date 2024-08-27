import "./Game.sass";

import { GameInfoComponent } from "../GameInfo/GameInfo";
import { GameMapComponent } from "../GameMap/GameMap";
import { ReactRenderer } from "lib/ReactRenderer";

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