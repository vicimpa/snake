import "./GameInfo.sass";

import { ReactRenderer } from "lib/ReactRenderer";

interface IGameInfoProps {
  renderer: ReactRenderer
}

export const GameInfoComponent = ({renderer}: IGameInfoProps) => {
  const [{ticks, score}] = renderer.useInfo()

  return (
    <div className="gameinfo-component">
      <p>Score: <b>{score}</b>, Ticks: {ticks}</p>
    </div>
  )
}