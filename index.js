let precisionInput = document.querySelector("input"),
  cnv = document.querySelector("canvas"),
  gl = cnv.getContext("webgl") || cnv.getContext("experimental-webgl"),
  shaderProgram = gl.createProgram(),
  vertexShaderText = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`,
  fragmentShaderText = `
    precision highp float;
    uniform vec2 r;
    uniform vec2 m;
    uniform float o;
    uniform int s;

    // Square a complex number
    vec2 cSquare(vec2 a) {
      return vec2(
        a.x * a.x - a.y * a.y,
        2.0 * (a.x * a.y)
      );
    }

    vec2 z(vec2 c) {
      vec2 current = vec2(0., 0.);

      for (int i = 0; i < 3600; i++) {
        if (i > s) break;
        current = cSquare(current) + c;
      }

      return current;
    }

    vec3 getColor(vec2 p) {
      float x = log(length(z(p)));

      return vec3(
        1. - abs(sin(x)),
        1. - abs(sin(x + .39)),
        1. - abs(sin(x + .78))
      );
    }

    void main() {
      vec2 pos = gl_FragCoord.xy / r.y;
      pos.x -= (r.x / r.y) / 2.;
      pos.y -= .5;

      vec3 color = getColor(pos / o + m);
      gl_FragColor = vec4(color, 1.);
    }
  `;

let zoom = 0.3,
  width = innerWidth,
  height = innerHeight;

let x = y = lx = ly = down = 0;

const a = addEventListener;

a("pointerdown", (e) => {
  down = 1;
  lx = 1 - e.clientX / width;
  ly = e.clientY / height;
});

a("pointerup", () => down = 0);
a("pointermove", (e) => {
  if (down) {
    change();
    let cx = 1 - e.clientX / width;
    let cy = e.clientY / height;
    let dx = cx - lx;
    let dy = cy - ly;
    x += dx / zoom;
    y += dy / zoom;
    lx = cx;
    ly = cy;
  }
});

const g = (a, b) => gl.getUniformLocation(a, b);

function change() {
  width = innerWidth;
  height = innerHeight;
  cnv.width = width;
  cnv.height = height;
  gl.uniform2f(g(shaderProgram, "r"), width, height);
  gl.uniform2f(g(shaderProgram, "m"), x, y);
  gl.uniform1f(g(shaderProgram, "o"), zoom);
  gl.uniform1i(g(shaderProgram, "s"), Math.pow(precisionInput.value, 2));
}

a("wheel", (e) => {
  if (e.deltaY < 0) zoom /= 1.05;
  else zoom *= 1.05;
  change();
});

a("resize", () => {
  gl.uniform1f(g(shaderProgram, "h"), height);
  gl.viewport(0, 0, width, height);
});

precisionInput.addEventListener("change", change);

function update() {
  gl.drawArrays(5, 0, 4);
  requestAnimationFrame(update);
}

function generateShader(type, shaderText) {
  let shader = gl.createShader(type);

  gl.shaderSource(shader, shaderText);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  gl.attachShader(shaderProgram, shader);
}

generateShader(35633, vertexShaderText);
generateShader(35632, fragmentShaderText);

gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

let vertices = [
  -1, -1,
  -1, +1,
  +1, -1,
  +1, +1
];

gl.bindBuffer(34962, gl.createBuffer());
gl.bufferData(34962, new Float32Array(vertices), 35044);
gl.vertexAttribPointer(0, 2, 5126, 0, 0, 0);
gl.enableVertexAttribArray(0);
gl.viewport(0, 0, width, height);

change();
update();