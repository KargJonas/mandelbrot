let p = document.querySelector("input");
let c = document.querySelector("canvas");
let g = c.getContext("webgl")||c.getContext("experimental-webgl");
let s = g.createProgram();

let z = 0.3;

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

let e = addEventListener;

class Mouse {
  constructor() {
    this.pos = new Vector(0, 0);
    this.last = new Vector(0, 0);
    this.isDown = false;

    e("mousedown", (e) => this.down(e));
    e("mouseup", () => this.up());
    e("mousemove", (e) => this.move(e));
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
      b();

      const current = new Vector(
        1 - e.clientX / innerWidth,
        e.clientY / innerHeight
      );

      let delta = current.sub(this.last);
      this.pos = this.pos.add(delta.div(z));
      this.last = current.clone();
    }
  }
}

function b() {
  c.width = innerWidth;
  c.height = innerHeight;
  g.uniform1f(g.getUniformLocation(s,"h"),innerHeight);
  g.uniform2f(g.getUniformLocation(s,"m"),m.pos.x,m.pos.y);
  g.uniform1f(g.getUniformLocation(s,"o"),z);
  g.uniform1i(g.getUniformLocation(s,"s"),p.value*p.value);
  g.viewport(0, 0, innerWidth, innerHeight);
}

let m=new Mouse();
e("mousewheel",v=>{z*=v.wheelDelta<0?.95:1.05;b()});
e("resize",b);p.addEventListener("change",b);

function u() {
  g.drawArrays(5, 0, 4);
  requestAnimationFrame(u);
}

function generateShader(type, shaderText) {
  const S = g.createShader(type);

  g.shaderSource(S, shaderText);
  g.compileShader(S);

  if (!g.getShaderParameter(S, g.COMPILE_STATUS)) {
    console.error(g.getShaderInfoLog(S));
  }
  g.attachShader(s, S);
}
generateShader(35633,`attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`);generateShader(35632,`precision mediump float;uniform float h;uniform vec2 m;uniform float o;uniform int s;vec2 z(vec2 c){vec2 n=vec2(0.,0.);for(int i=0;i<3600;i++){if(i>s)break;n=vec2(n.x*n.x-n.y*n.y,2.*(n.x*n.y))+c;}return n;}vec3 g(vec2 p){float x=log(length(z(p)));return vec3(abs(sin(x)),abs(sin(x+.39)),abs(sin(x+.78)));}void main(){vec2 p=gl_FragCoord.xy/h;p-=.5;float x=log(length(z(p/o+m)));vec3 c=vec3(abs(sin(x)),abs(sin(x+.39)),abs(sin(x+.78)));gl_FragColor=vec4(c,1.);}`);g.linkProgram(s);g.useProgram(s);g.bindBuffer(34962,g.createBuffer());g.bufferData(34962,new Float32Array([-1,-1,-1,1,1,-1,1,1]),35044);g.vertexAttribPointer(0,2,5126,false,0,0);g.enableVertexAttribArray(0);g.viewport(0,0,innerWidth,innerHeight);b();u();