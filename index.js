let precisionInput = document.querySelector("input"),
  cnv = document.querySelector("canvas"),
  gl = cnv.getContext("webgl") || cnv.getContext("experimental-webgl"),
  shaderProgram = gl.createProgram(),
  vertexShaderText = `attribute vec2 position;void main(void){gl_Position=vec4(position,0,1);}`,
  fragmentShaderText = `
precision highp float;
uniform float h;
uniform vec2 m;
uniform float o;
uniform int s;

#define TWO_PI      6.2831853
#define QUARTER_PI  0.7853981
#define EIGHT_PI    0.3926990

#define MAX_STEPS   1000

// Square a complex number
vec2 cSquare(vec2 a) {
  return vec2(
    a.x * a.x - a.y * a.y,
    2.0 * (a.x * a.y)
  );
}

vec2 z(vec2 c) {
  vec2 current = vec2(0.0, 0.0);

  for (int i = 0; i < MAX_STEPS; i++) {
    if (i > steps) break;
    current = cSquare(current) + c;
  }

  return current;
}

vec3 getColor(vec2 p) {
  float x = log(length(z(p)));

  return vec3(
    1.0 - abs(sin(x)),
    1.0 - abs(sin(x + EIGHT_PI)),
    1.0 - abs(sin(x + QUARTER_PI))
  );
}

void main() {
  vec2 pos = gl_FragCoord.xy / resolution.y;
  pos.x -= (resolution.x / resolution.y) / 2.0;
  pos.y -= 0.5;

  vec3 color = getColor(pos / zoom + mousePos);

  gl_FragColor = vec4(color, 1.0);
 }`;

let zoom = 0.3,
  width = innerWidth,
  height = innerHeight;

let x = y = lx = ly = down = 0;

addEventListener("pointerdown", (e) => {
  down = 1;
  lx = 1 - e.clientX / width;
  ly = e.clientY / height;
});

addEventListener("pointerup", () => down = 0);
addEventListener("pointermove", (e) => {
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
  gl.uniform1f(g(shaderProgram, "h"), height);
  gl.uniform2f(g(shaderProgram, "m"), x, y);
  gl.uniform1f(g(shaderProgram, "o"), zoom);
  gl.uniform1i(g(shaderProgram, "s"), Math.pow(precisionInput.value, 2));
}

addEventListener("wheel", (e) => {
  if (e.deltaY < 0) zoom /= 1.05;
  else zoom *= 1.05;
  change();
});

addEventListener("resize", () => {
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