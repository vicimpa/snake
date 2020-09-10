import { SnakeObject } from "./SnakeGame";
import { Range } from "./Range";
import { Red, Green, Reset, Cyan } from "./Colors";
import { BaseRenderer } from "./BaseRenderer";

export enum DirectionBlock {
	VERTICAL,
	HORIZONTAL,
	TOP,
	BOTTOM,
	LEFT,
	RIGHT,
	TOP_LEFT,
	TOP_RIGHT,
	BOTTOM_LEFT,
	BOTTOM_RIGHT,
}

export class ConsoleRenderer extends BaseRenderer {
	previewLast: [number, number];

	colorize = true;
	extended = true;

	render() {
		let output = "";

		const { width, height, score, ticks, renderMap, maxScore } = this.game;
		const horisontal = Range.go(0, width);
		const horisontalRow = horisontal.map(e => "─").join("─");

		const gameData = {
			Score: score,
			Ticks: ticks,
		};

		const directions: DirectionBlock[] = [];

		if (this.extended) {
			Range.go(score, 0).map(e => {
				const [x, y] = this.game.posValue(e);
				const neighbors: [number, number][] = [];
				const dir = this.game.getDirection();
				const { previewLast } = this;

				if (e == score) neighbors.push(this.game.posIndex(this.game.getIndex(x, y, ...dir)));
				if (e == 1 && previewLast) neighbors.push(previewLast);

				if (e == 1) this.previewLast = [x, y];

				if (e + 1 <= score) neighbors.push(this.game.posValue(e + 1));
				if (e - 1 > 0) neighbors.push(this.game.posValue(e - 1));

				const positions = new Uint8Array(4);

				for (let [nX, nY] of neighbors) {
					let [dX, dY] = [x - nX, y - nY];

					if (dY == -1) positions[0] = 1;
					if (dY == 1) positions[1] = 1;
					if (dX == -1) positions[2] = 1;
					if (dX == 1) positions[3] = 1;

					if (dY == height - 1) positions[0] = 1;
					if (dY == -(height - 1)) positions[1] = 1;
					if (dX == width - 1) positions[2] = 1;
					if (dX == -(width - 1)) positions[3] = 1;
				}

				const position = parseInt([...positions].join(""), 2);

				switch (position) {
					case 0b0010:
						directions[e] = DirectionBlock.LEFT;
						break;
					case 0b0001:
						directions[e] = DirectionBlock.RIGHT;
						break;
					case 0b0011:
						directions[e] = DirectionBlock.HORIZONTAL;
						break;
					case 0b1000:
						directions[e] = DirectionBlock.TOP;
						break;
					case 0b0100:
						directions[e] = DirectionBlock.BOTTOM;
						break;
					case 0b1100:
						directions[e] = DirectionBlock.VERTICAL;
						break;
					case 0b1001:
						directions[e] = DirectionBlock.TOP_LEFT;
						break;
					case 0b1010:
						directions[e] = DirectionBlock.TOP_RIGHT;
						break;
					case 0b0101:
						directions[e] = DirectionBlock.BOTTOM_LEFT;
						break;
					case 0b0110:
						directions[e] = DirectionBlock.BOTTOM_RIGHT;
						break;
				}
			});
		}

		output +=
			Object.keys(gameData)
				.map(e => `${e}: ${gameData[e]}`)
				.join(" ") + "\n";

		output += `┌${horisontalRow}┐\n`;

		renderMap.map((row, y) => {
			let rowString = row
				.map((v, x) => {
					let val = this.game.getValue(x, y);

					let symbol = "*";

					if (this.extended) {
						switch (directions[val]) {
							case DirectionBlock.TOP:
								symbol = "║";
								break;
							case DirectionBlock.BOTTOM:
								symbol = "║";
								break;
							case DirectionBlock.LEFT:
								symbol = "═";
								break;
							case DirectionBlock.RIGHT:
								symbol = "═";
								break;
							case DirectionBlock.VERTICAL:
								symbol = "║";
								break;
							case DirectionBlock.HORIZONTAL:
								symbol = "═";
								break;
							case DirectionBlock.TOP_LEFT:
								symbol = "╗";
								break;
							case DirectionBlock.TOP_RIGHT:
								symbol = "╔";
								break;
							case DirectionBlock.BOTTOM_LEFT:
								symbol = "╝";
								break;
							case DirectionBlock.BOTTOM_RIGHT:
								symbol = "╚";
								break;
						}
					}

					switch (v) {
						case SnakeObject.CLEAR:
							return " ";
						case SnakeObject.APPLE: {
							let c = Green,
								r = Reset;

							if (!this.colorize) {
								c = "";
								r = "";
							}

							return c + "&" + r;
						}

						case SnakeObject.HEAD: {
							let c = Red,
								r = Reset;

							if (!this.colorize) {
								c = "";
								r = "";
							}

							if (!this.extended) {
								symbol = "#";
							}

							return c + symbol + r;
						}

						case SnakeObject.TAIL: {
							let c = Cyan,
								r = Reset;

							if (!this.colorize) {
								c = "";
								r = "";
							}

							return c + symbol + r;
						}

						case SnakeObject.BODY:
							return symbol;
					}
				})
				.map((e, i, d) => {
					if (i == row.length - 1) return e;

					if (!this.extended) {
						return e + " ";
					}

					if (i - 0 < 0 || i + 1 > row.length - 1) return e + " ";

					let val = this.game.getValue(i, y);
					let valNex = this.game.getValue(i + 1, y);

					if (!val || !valNex) return `${e} `;

					if (val == maxScore || valNex == maxScore) return `${e} `;

					if (val - valNex != 1 && valNex - val !== 1) return `${e} `;

					return `${e}═`;
				})
				.join("");

			output += `│${rowString}│\n`;
		});

		output += `└${horisontalRow}┘\n`;
		console.log(output);
	}
}
