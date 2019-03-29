const cnv = document.querySelector("canvas");
const ctx = cnv.getContext("2d");

function point(x, y, n) {
  let color = "blue";

  if (n <= 3) {
    color = "black";
  } else if (n === 4) {
    color = "red";
  } else if (n === 5) {
    color = "orange";
  } else if (n === 6) {
    color = "orange";
  } else {
    color = "blue";
  }

  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// My implementation of a complex number
class Complex {
  constructor(r, i) {
    this.r = r; // Real part
    this.i = i; // Imaginary part
  }

  // Multiplication of two complex numbers
  mult(other) {
    return new Complex(
      this.r * other.r - this.i * other.i,
      this.r * other.i + other.r * this.i
    );
  }

  add(other) {
    return new Complex(
      this.r + other.r,
      this.i + other.i
    );
  }

  equals(other) {
    return this.r === other.r
      && this.i === other.i;
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

function getN(c) {
  const first10 = z([new Complex(0, 0)], c, 10);

  // Compare first value to all others
  // for (let n = 1; n < 10; n++) {
    // if (first10[0].equals(first10[n])) {
      // return n;
    // }
  // }

  // Compare every value to every other
  for (let n = 0; n < 10; n++) {
    for (let k = 0; k < 10; k++) {
      if (n === k) continue;

      if (first10[n].equals(first10[k])) {
        return Math.abs(n - k);
      }
    }
  }

  return 10;
}

const WIDTH = 10;
const HEIGHT = 10;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;

console.log(getN(new Complex(
  -1, 0
)));

// Problem:
// Gives 10 for almost all the points in the c-plane.
// Probably wrong scaling...

// function draw() {
//   for (let x = 0; x < WIDTH; x++) {
//     for (let y = 0; y < HEIGHT; y++) {
//       console.log(getN(new Complex(
//         x / 100000 - .5,
//         y / 100000 - .5
//       )));

//       // point(
//         // x,
//         // y,
//         // getN(new Complex(x / WIDTH * 5, y / HEIGHT * 5))
//       // );
//     }
//   }
// }

// window.requestAnimationFrame(draw);