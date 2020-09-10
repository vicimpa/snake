import React from "react";

import { ReactRenderer, IPointState, DirectionBlock } from "lib/ReactRenderer";
import { SnakeObject } from "lib/SnakeGame";
import { Range } from "lib/Range";

import "./GameMap.sass"

interface IGameMapProps {
  renderer: ReactRenderer,
  size?: number
}

function getSymbol(e: IPointState) {
  
  switch(e.value) {
    case SnakeObject.HEAD:
    case SnakeObject.TAIL:
    case SnakeObject.BODY: {
      switch (e.direction) {
        case DirectionBlock.TOP: return ''
        case DirectionBlock.BOTTOM: return ''
        case DirectionBlock.LEFT: return ''
        case DirectionBlock.RIGHT: return ''
        case DirectionBlock.VERTICAL: return ''
        case DirectionBlock.HORIZONTAL: return ''
        case DirectionBlock.TOP_LEFT: return ''
        case DirectionBlock.TOP_RIGHT: return ''
        case DirectionBlock.BOTTOM_LEFT: return ''
        case DirectionBlock.BOTTOM_RIGHT: return ''
      }
    }

    case SnakeObject.APPLE: return ''
    case SnakeObject.CLEAR: return ''
  }
}

function getColor(e: IPointState) {
  switch(e.value) {
    case SnakeObject.CLEAR: return ''
    case SnakeObject.APPLE: return 'green'
    case SnakeObject.HEAD: return 'red'
    case SnakeObject.TAIL: return 'cyan'
    case SnakeObject.BODY: return ''
  }
}

export const GameMapComponent = ({renderer, size = 16}: IGameMapProps) => {
  const [data] = renderer.useData()
  const {width, height} = renderer

  const spletedData = Range.go(0, height).map(e => {
    return Range.go(0, width).map(i => {
      return data[e*width+i]
    })
  })

  return (
    <div className="gamemap-component">
      {spletedData.map((row, i) => {
        return (
          <p key={`row-${i}`}>
            {row.map((val, ii) => {
              const style = {
                width: size,
                height: size,
                fontSize: size-2
              }
              return (
                <span style={style} key={`symbol-${i}-${ii}`} className={getColor(val)}>
                  {getSymbol(val)}
                </span>
              )
            })}
          </p>
        )
      })}
    </div>
  )
}