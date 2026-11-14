import * as THREE from 'three';
import { createFrameLoop } from './frame-loop';

/* Brings an illustration to life in place. The mask image tells the shader what each pixel is:
   R = what is seen through the windows, G = sea (train) or moon (classroom), B = lit floor (classroom). */
const modes: Record<string, number> = { train: 0, classroom: 1 };

const vertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const fragment = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap, uMask;
uniform vec2 uPointer, uCover;
uniform float uTime, uMode, uReveal;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0., a = .5; for(int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.02 + 7.3; a *= .5; } return v; }

void main(){
  float t = uTime;
  vec2 fitted = (vUv - .5) * uCover + .5;
  vec2 top = vec2(fitted.x, 1. - fitted.y);           /* origin top left */
  vec2 base = (fitted - .5) / 1.025 + .5;                 /* a little room to move in */
  vec2 lean = uPointer * vec2(.011, .007);
  vec3 col;

  if(uMode < .5){
    /* TRAIN: the carriage rocks, the sea glitters, poles flick past the windows */
    float rock = sin(t * 4.3) * .0008 + sin(t * 9.7) * .0004 * step(.6, fract(t * .37));
    vec2 inside = base + vec2(sin(t * .8) * .001, rock) + lean * .7;
    vec3 m = texture2D(uMask, inside).rgb;
    vec2 outside = inside - lean * 1.5;
    outside.x += sin(top.y * 240. + t * 2.2) * .0012 * m.g;       /* small waves */
    outside.x += sin(top.y * 26. + t * .35) * .0014 * (m.r - m.g); /* clouds breathe */
    float seen = m.r * texture2D(uMask, outside).r;
    col = mix(texture2D(uMap, inside).rgb, texture2D(uMap, outside).rgb, seen);

    float glint = pow(noise(vec2(top.x * 260. - t * 2.4, top.y * 520.)), 7.) * (.6 + .4 * sin(t * 6. + top.x * 90.));
    col += vec3(.75, .95, 1.) * glint * m.g * 1.5;

    /* a pole passing close to the glass: a fast dark bar over the view, a shadow over the seats */
    float beat = fract(t * .31), beat2 = fract(t * .31 + .43 + .12 * sin(t * .05));
    float x1 = mix(1.3, -.3, clamp(beat / .11, 0., 1.)), x2 = mix(1.3, -.3, clamp(beat2 / .09, 0., 1.));
    float lane = top.x + (top.y - .3) * .1;
    float pole = smoothstep(.07, 0., abs(lane - x1)) + smoothstep(.05, 0., abs(lane - x2));
    col *= 1. - pole * mix(.2, .62, m.r);

    /* sunlight sliding along the carriage */
    float sun = smoothstep(.55, 1., sin((top.x * 1.3 + top.y * .9) * 5. - t * .9));
    float lum = dot(col, vec3(.3, .6, .1));
    col += vec3(.1, .3, .55) * sun * (1. - m.r) * smoothstep(.08, .45, lum) * .22;
  } else {
    /* CLASSROOM: the moon breathes, clouds cross it, dust hangs in the light */
    vec2 inside = base + lean * .7;
    vec3 m = texture2D(uMask, inside).rgb;
    vec2 outside = inside - lean * 1.3;
    float seen = m.r * texture2D(uMask, outside).r;
    col = mix(texture2D(uMap, inside).rgb, texture2D(uMap, outside).rgb, seen);

    float cloud = fbm(vec2(top.x * 2.6 + t * .035, top.y * 3.4));
    col *= 1. - smoothstep(.5, .78, cloud) * m.r * mix(.3, .42, m.g);
    float breath = .5 + .5 * sin(t * .7);
    col += vec3(.3, .55, 1.) * m.g * (.05 + .09 * breath);
    float halo = exp(-length((top - vec2(.83, .12)) * vec2(1., 1.343)) * 4.2);
    col += vec3(.16, .42, .95) * halo * (.16 + .1 * breath);

    /* moonlight on the floor */
    col += vec3(.2, .5, .9) * m.b * (.05 + .05 * sin(t * .9 + top.x * 9.));

    /* dust in the beam that falls from the moon to the floor */
    float beam = smoothstep(.34, 0., abs((top.x - .83) + (top.y - .12) * .62)) * smoothstep(.1, .5, top.y);
    vec2 drift = vec2(top.x * 70. + t * .22, top.y * 95. - t * .3);
    float mote = smoothstep(.972, 1., noise(drift)) * (.5 + .5 * sin(t * 2. + hash(floor(drift)) * 40.));
    col += vec3(.7, .9, 1.) * mote * beam * .55;
  }

  /* grade: deeper darks, a little more colour, soft corners */
  float l = dot(col, vec3(.3, .59, .11));
  col = mix(vec3(l), col, 1.12);
  col = mix(col, col * col * (3. - 2. * col), .35);
  vec2 v = vUv - .5;
  col *= 1. - dot(v, v) * .5;

  /* arrival: a diagonal wipe with a white leading edge */
  float edge = top.x + top.y * .32;
  float front = uReveal * 1.7 - .2;
  col = mix(col, vec3(1.), smoothstep(.12, 0., front - edge) * step(edge, front) * (1. - uReveal));
  gl_FragColor = vec4(col, step(edge, front));
}`;

export function startScenes() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const still = document.documentElement.classList.contains('still');
  for (const figure of document.querySelectorAll<HTMLElement>('[data-scene]')) {
    const image = figure.querySelector('img');
    const maskSrc = figure.dataset.mask;
    if (!image || !maskSrc) continue;
    let stop: (() => void) | null = null;
    /* a scene only costs anything while its section is on screen */
    new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      if (visible && !stop) stop = run(figure, image, maskSrc, still);
      else if (!visible && stop) { stop(); stop = null; }
    }, { rootMargin: '120px' }).observe(figure);
  }
}

function run(figure: HTMLElement, image: HTMLImageElement, maskSrc: string, still: boolean) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: still }); } catch { return () => {}; }
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  figure.append(canvas);

  const uniforms = {
    uMap: { value: new THREE.Texture() }, uMask: { value: new THREE.Texture() }, uPointer: { value: new THREE.Vector2() },
    uCover: { value: new THREE.Vector2(1,1) },
    uTime: { value: still ? 3.3 : 0 }, uMode: { value: modes[figure.dataset.scene!] ?? 0 }, uReveal: { value: still ? 1 : 0 },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true, depthTest: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  const scene = new THREE.Scene().add(mesh);
  const camera = new THREE.Camera();

  let alive = true, loaded = 0;
  const loader = new THREE.TextureLoader();
  const load = (src: string, slot: { value: THREE.Texture }) => loader.load(src, texture => {
    if (!alive) { texture.dispose(); return; }
    texture.minFilter = THREE.LinearFilter; texture.generateMipmaps = false;
    slot.value = texture;
    if (++loaded === 2) { resize(); renderer.render(scene, camera); figure.classList.add('live'); wake(); }
  }, undefined, () => end());
  load(image.currentSrc || image.src, uniforms.uMap);
  load(maskSrc, uniforms.uMask);

  function resize() {
    const box = figure.getBoundingClientRect();
    const sourceAspect = image.naturalWidth / image.naturalHeight || 1;
    const targetAspect = box.width / Math.max(box.height,1);
    uniforms.uCover.value.set(Math.min(1,targetAspect/sourceAspect), Math.min(1,sourceAspect/targetAspect));
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(Math.max(box.width, 1), Math.max(box.height, 1), false);
    if (loaded === 2) renderer.render(scene, camera);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(figure);

  const aim = new THREE.Vector2();
  function point(event: PointerEvent) {
    const box = figure.getBoundingClientRect();
    aim.set(THREE.MathUtils.clamp((event.clientX - box.left) / box.width * 2 - 1, -1.4, 1.4), THREE.MathUtils.clamp(1 - (event.clientY - box.top) / box.height * 2, -1.4, 1.4));
  }
  addEventListener('pointermove', point, { passive: true });

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const loop=createFrameLoop(dt=>{
    if(!still) {
      uniforms.uTime.value += dt;
      uniforms.uReveal.value = Math.min(1, uniforms.uReveal.value + dt / .9);
      uniforms.uPointer.value.x = THREE.MathUtils.damp(uniforms.uPointer.value.x, aim.x, 3, dt);
      uniforms.uPointer.value.y = THREE.MathUtils.damp(uniforms.uPointer.value.y, aim.y, 3, dt);
    }
    renderer.render(scene,camera);
  },{continuous:()=>!still});
  function wake() {
    if(!alive||document.hidden||loaded<2) loop.stop();
    else loop.start();
  }
  function motionChanged(){if(reduced.matches) end();}
  document.addEventListener('visibilitychange',wake);
  reduced.addEventListener('change',motionChanged);
  addEventListener('pagehide',end,{once:true});
  function end() {
    if (!alive) return;
    alive = false; loop.dispose(); observer.disconnect(); removeEventListener('pointermove', point);
    document.removeEventListener('visibilitychange',wake);reduced.removeEventListener('change',motionChanged);removeEventListener('pagehide',end);
    figure.classList.remove('live');
    mesh.geometry.dispose(); material.dispose(); uniforms.uMap.value.dispose(); uniforms.uMask.value.dispose();
    renderer.dispose(); canvas.remove();
  }
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); end(); });
  return end;
}
