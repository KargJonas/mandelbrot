const cnv = document.querySelector("canvas");
const ctx = cnv.getContext("2d");

function sigmoid(x) {
  return 1 / (1 + Math.pow(Math.e, -x));
}

const TWO_PI = Math.PI * 2;
const QUARTER_PI = Math.PI / 4;
const EIGHT_PI = Math.PI / 8;

function getColor(_x) {
  const x = _x * TWO_PI;

  return {
    r: 255 - Math.abs(Math.sin(x) * 255),
    g: 255 - Math.abs(Math.sin(x + EIGHT_PI) * 255),
    b: 255 - Math.abs(Math.sin(x + QUARTER_PI) * 255)
  };
}

function point(x, y, growthSpeed) {
  // let color = "blue";
  const _color = getColor(Math.log(growthSpeed) / 500);
  const color = `rgb(${ _color.r }, ${ _color.g }, ${ _color.b })`;

  // if (growthSpeed <= 0.05) {
  //   color = "black";
  // } else if (growthSpeed <= 0.1) {
  //   color = "red";
  // } else if (growthSpeed <= 0.5) {
  //   color = "orange";
  // } else if (growthSpeed <= 3) {
  //   color = "yellow";
  // } else if (growthSpeed <= Math.pow(10, 40)) {
  //   color = "darkblue";
  // }



  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// My implementation of a complex number
class Complex {
  constructor(r, i) {
    this.r = r; // Real component
    this.i = i; // Imaginary component
  }

  // Multiplication of two complex numbers
  mult(other) {
    return new Complex(
      this.r * other.r - this.i * other.i,
      this.r * other.i + other.r * this.i
    );
  }

  distance(other) {
    return Math.sqrt(
      Math.pow(this.r - other.r, 2) +
      Math.pow(this.i - other.i, 2)
    );
  }

  add(other) {
    return new Complex(
      this.r + other.r,
      this.i + other.i
    );
  }
}

function z(values, c, depth = 0) {
  depth--;
  if (depth <= 0) return values;

  const previous = values[values.length - 1];
  const newValue = previous.mult(previous).add(c);

  values.push(newValue);
  return z(values, c, depth);
}

function getGrowthSpeed(c) {
  const firstFew = z([new Complex(0, 0)], c, 10);

  // The distances between the first and all of
  // the other points
  const distances = [];

  // Compare first value to all others
  for (let n = 1; n < firstFew.length; n++) {
    distances.push(firstFew[0].distance(firstFew[n]));
  }

  const deltas = [];

  for (let n = 1; n < distances.length; n++) {
    deltas.push(distances[n] - distances[n - 1]);
  }

  const average = deltas.reduce((a, b) => (a + b)) / deltas.length;

  // console.log(average)

  return Math.abs(average);
}

const WIDTH = cnv.width;
const HEIGHT = cnv.height;

const SCALE_X = 3;
const SCALE_Y = 3;
const OFFSET_X = -0.2;
const OFFSET_Y = 0;
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (let y = 0; y < WIDTH; y++) {
    for (let x = 0; x < HEIGHT; x++) {
      point(
        x, y,
        getGrowthSpeed(new Complex(
          ((x / WIDTH + OFFSET_X) * SCALE_X) - SCALE_X / 2,
          ((y / HEIGHT + OFFSET_Y) * SCALE_Y) - SCALE_Y / 2
        ))
      );
    }
  }
}

window.requestAnimationFrame(draw);