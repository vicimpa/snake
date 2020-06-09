import { Reset, BgBlack, BgRed, BgGreen, BgYellow, Red, Black, Green, Yellow } from "./lib/Colors";
import { Range } from "./lib/Range";


const matrix = [
  0, 0, 0, 0, 0, 0,
  0, 1, 0, 0, 1, 0,
  0, 0, 1, 0, 0, 0,
  0, 0, 0, 1, 0, 0,
  0, 1, 0, 0, 1, 0,
  0, 0, 0, 0, 0, 0
]

const width = 6
const height = 6

const map = Range.go(0, height).map(y => {
  return Range.go(0, width).map(x => {
    return matrix[y*width+x]
  })
})


const rows: [number, number][][] = []

for(let i = 0; i < height / 2; i++) {
  let row = ''

  for(let x = 0; x < width; x++) {
    let top = ''
    let bottom = ''
    switch(map[i*2][x]) {
      case 0: top=Black; break
      case 1: top=Red; break
      case 2: top=Green; break
      case 3: top=Yellow; break
    }

    switch(map[i*2+1][x]) {
      case 0: bottom=Black; break
      case 1: bottom=Red; break
      case 2: bottom=Green; break
      case 3: bottom=Yellow; break

    }
    row += '' + Reset
  }
  console.log(row)
}

