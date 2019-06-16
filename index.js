let precisionInput = document.querySelector("input"),
  cnv = document.querySelector("canvas"),
  gl = cnv.getContext("webgl") || cnv.getContext("experimental-webgl"),
  shaderProgram = gl.createProgram(),
  vertexShaderText = `attribute vec2 position;void main(void){gl_Position=vec4(position,0,1);}`,
  fragmentShaderText = `precision mediump float;uniform float h;uniform vec2 m;uniform float o;uniform int s;vec2 z(vec2 c){vec2 n=vec2(0.,0.);for(int i=0;i<3600;i++){if(i>s)break;n=vec2(n.x*n.x-n.y*n.y,2.*(n.x*n.y))+c;}return n;}vec3 g(vec2 p){float x=log(length(z(p)));return vec3(abs(sin(x)),abs(sin(x+.39)),abs(sin(x+.78)));}void main(){vec2 p=gl_FragCoord.xy/h;p-=.5;float x=log(length(z(p/o+m)));vec3 c=vec3(abs(sin(x)),abs(sin(x+.39)),abs(sin(x+.78)));gl_FragColor=vec4(c,1.);}`;

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