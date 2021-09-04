import { Curtains, Plane } from 'curtainsjs';

let curtains = null;

function installShader() {
  // if (document.getElementById('canvas').firstElementChild) {
  //   return null;
  // }
  const vertexShader = `precision mediump float;

// those are the mandatory attributes that the lib sets
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

// those are mandatory uniforms that the lib sets and that contain our model view and projection matrix
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// our texture matrix that will handle image cover
uniform mat4 uImageMatrix;

// if you want to pass your vertex and texture coords to the fragment shader
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

void main() {
    vec3 vertexPosition = aVertexPosition;

    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    // set the varyings
    // here we use our texture matrix to calculate te accurate texture coords
    vTextureCoord = (uImageMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vVertexPosition = vertexPosition;
}`;

  const fragmentShader = `precision mediump float;

// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

// the uniform we declared inside our javascript
uniform float uTime;

// our texture sampler (default name, to use a different name please refer to the documentation)
uniform sampler2D uImage;
uniform sampler2D uNoise;

void main() {
    vec2 textureCoord = vTextureCoord;
    float t = uTime * 6.28 / 60.0;

    float displaceAmount = sin(t/17.1) * sin(t/13.8) * 0.4 + 0.6;
    // float displaceAmount = step(0.8, fract(t/6.0));
    // displaceAmount = 1.0 - max(step(0.8, fract(t/6.1)), displaceAmount);
    vec4 displacementTexture = texture2D(uNoise, mod(textureCoord + t*0.001, 1.0));
    vec2 displacementCoords = textureCoord + displaceAmount * (sin(t/23.7)*displacementTexture.g) * vec2(displacementTexture.b * cos(displacementTexture.r*6.28+t*0.115), displacementTexture.b * sin(displacementTexture.r*6.28+t*0.035));

    gl_FragColor = abs(vec4(vec3(0.7-displaceAmount*0.7) - texture2D(uImage, displacementCoords).rgb, 1.0));
}`;

  // set up our WebGL context and append the canvas to our wrapper
  curtains = new Curtains({
    container: "canvas",
    pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
    alpha: false,
    antialias: false,
    depth: false,
    watchScroll: false,
    production: true
  });

  // get our plane element
  const planeElements = document.getElementsByClassName("plane");

  // set our initial parameters (basic uniforms)
  const params = {
    vertexShader,
    fragmentShader,
    uniforms: {
      time: {
        name: "uTime", // uniform name that will be passed to our shaders
        type: "1f", // this means our uniform is a float
        value: 0,
      },
    }
  };

  const plane = new Plane(curtains, planeElements[0], params);

  const displacement = new Image();
  displacement.src = "/assets/noise.jpg"; // image attribution: https://www.deviantart.com/aozametaneko
  // set its data-sampler attribute to use in fragment shader
  displacement.setAttribute("data-sampler", "uNoise");

  let phase = Math.random() * 2 * Math.PI;

  if (plane) {
    // load our displacement image
    plane.loader.loadImage(displacement);
    // set up our basic methods
    plane.onRender(() => { // fired at each requestAnimationFrame call
      phase += 0.001;
      if (phase > 2 * Math.PI) phase -= 2 * Math.PI;
      plane.uniforms.time.value = (Math.sin(phase) + 1) * 1000 + 200; // update our time uniform value
    });
  }
}

export { curtains, installShader };