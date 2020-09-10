const MaxBit = new Uint16Array([-1]);

export class GameMap extends Uint16Array {
	#width: number;
	#height: number;

	get width() {
		return this.#width;
	}
	get height() {
		return this.#height;
	}
	get maxScore() {
		return MaxBit[0];
	}

	constructor(width = 10, height = width) {
		super((width | 0) * (height | 0));

		this.#width = width | 0;
		this.#height = height | 0;
	}

	posIndex(index: number): [number, number] {
		const { width } = this;

		const x = index % width;
		const y = (index - x) / width;

		return [x, y];
	}

	posValue(value: number): [number, number] {
		const index = this.indexOf(value | 0);

		if (index == -1) return [-1, -1];

		return this.posIndex(index);
	}

	getIndex(x = 0, y = x, aX = 0, aY = 0) {
		const { width, height } = this;

		x += aX;
		y += aY;

		while (x < 0) x += width;
		while (x > width - 1) x -= width;
		while (y < 0) y += height;
		while (y > height - 1) y -= height;

		return y * width + x;
	}

	getValue(x = 0, y = x, aX = 0, aY = 0) {
		return this[this.getIndex(x, y, aX, aY)];
	}
}
