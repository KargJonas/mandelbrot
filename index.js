const cnv = document.querySelector("canvas");
const gl = cnv.getContext("webgl") || cnv.getContext("experimental-webgl");
const shaderProgram = gl.createProgram();
const vertexShaderText = `
attribute vec2 position;
void main(void) {
  gl_Position = vec4(position, 0, 1);
}`;

let zoom = 0.3;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  sub(other) {
    return new Vector(
      this.x - other.x,
      this.y - other.y
    );
  }

  add(other) {
    return new Vector(
      this.x + other.x,
      this.y + other.y
    );
  }

  div(factor) {
    return new Vector(
      this.x / factor,
      this.y / factor
    );
  }

  clone() {
    return new Vector(
      this.x,
      this.y
    );
  }
}

/**
 * Not a conventional mouse!
 * Click-to drag. Position can
 * be outside of the document.
 */
class Mouse {
  constructor() {
    this.pos = new Vector(0, 0);
    this.last = new Vector(0, 0);
    this.isDown = false;

    addEventListener("mousedown", (e) => this.down(e));
    addEventListener("mouseup", () => this.up());
    addEventListener("mousemove", (e) => this.move(e));
  }

  down(e) {
    this.isDown = true;
    this.last = new Vector(
      1 - e.clientX / innerWidth,
      e.clientY / innerHeight
    );
  }

  up() {
    this.isDown = false;
  }

  move(e) {
    if (this.isDown) {
      change();

      const current = new Vector(
        1 - e.clientX / innerWidth,
        e.clientY / innerHeight
      );

      const delta = current.sub(this.last);
      this.pos = this.pos.add(delta.div(zoom));
      this.last = current.clone();
    }
  }
}

function change() {
  gl.uniform2f(gl.getUniformLocation(shaderProgram, "resolution"), window.innerWidth, window.innerHeight);
  gl.uniform2f(gl.getUniformLocation(shaderProgram, "mousePos"), mouse.pos.x, mouse.pos.y);
  gl.uniform1f(gl.getUniformLocation(shaderProgram, "zoom"), zoom);
}

const mouse = new Mouse();
window.addEventListener("mousewheel", (e) => {
  if (e.wheelDelta < 0) zoom /= 1.05;
  else zoom *= 1.05;
  change();
});

addEventListener("resize", () => {
  change();
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
});

function update() {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
  gl.drawArrays(5, 0, 4);
  requestAnimationFrame(update);
}

function generateShader(type, shaderText) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, shaderText);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  gl.attachShader(shaderProgram, shader);
}

async function run() {
  const fragmentShaderText = await fetch("shader.glsl")
    .then((response) => (response.text()));

  generateShader(gl.VERTEX_SHADER, vertexShaderText);
  generateShader(gl.FRAGMENT_SHADER, fragmentShaderText);

  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const vertices = [
    -1, -1,
    -1, +1,
    +1, -1,
    +1, +1
  ];

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  change();
  update();
}

run();