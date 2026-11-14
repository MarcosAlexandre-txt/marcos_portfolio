import * as THREE from 'three';
import { createFrameLoop } from './frame-loop';

/* The whole site sits in one body of water. The main menu is the surface; each section is a dive. */
const depths: Record<string, number> = { inicio: 0, sobre: .34, projetos: .5, formacao: .62, skills: .74, contato: .86 };
const statueViews = new Set(['inicio', 'contato']);
const rippleCount = 6;

const vertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const fragment = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uWater, uStatue;
uniform vec2 uRes;
uniform vec4 uStatueRect;
uniform vec3 uRipples[${rippleCount}];
uniform float uTime, uWaterAspect, uDepth, uStatueOn, uScroll, uSurge;

const vec3 ABYSS = vec3(.008, .039, .322);
const vec3 DEEP = vec3(.016, .106, .647);
const vec3 SKY = vec3(.208, .824, 1.);
const float TAU = 6.2831853;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0., a = .5; for(int i = 0; i < 3; i++){ v += a * noise(p); p = p * 2.03 + 11.7; a *= .5; } return v; }

/* light focused by the moving surface */
float caustic(vec2 p, float t){
  p = mod(p * TAU, TAU) - 250.;
  vec2 i = p; float c = 1.;
  for(int n = 0; n < 4; n++){
    float tt = t * (1. - 3.5 / float(n + 1));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1. / length(vec2(p.x / (sin(i.x + tt) / .005), p.y / (cos(i.y + tt) / .005)));
  }
  c = 1.17 - pow(c / 4., 1.4);
  return pow(abs(c), 8.);
}

void main(){
  vec2 uv = vec2(vUv.x, 1. - vUv.y);            /* origin top left, like the page */
  float aspect = uRes.x / uRes.y;
  vec2 q = vec2(uv.x * aspect, uv.y);
  float t = uTime;
  float shallow = 1. - uDepth;

  /* slow currents bend everything seen through the water */
  vec2 warp = vec2(fbm(q * 1.7 + vec2(t * .035, t * .05)), fbm(q * 2.6 - vec2(t * .045, -t * .03))) - .5;
  warp *= .03 * (1. - uv.y * .55);

  /* rings spreading from where the pointer touched */
  for(int i = 0; i < ${rippleCount}; i++){
    vec3 r = uRipples[i];
    float age = t - r.z;
    if(age > 0. && age < 2.4){
      vec2 d = q - r.xy; float dist = length(d);
      float ring = sin(dist * 46. - age * 10.) * exp(-dist * 7.) * (1. - age / 2.4) * smoothstep(0., .12, age);
      warp += normalize(d + 1e-5) * ring * .008;
    }
  }

  /* the photograph, cover-fitted; diving pushes in and down */
  vec2 wuv = uv + warp;
  float zoom = 1. + uDepth * .3;
  wuv = (wuv - vec2(.5, .2)) / zoom + vec2(.5, .2);
  wuv.y += uDepth * .16 + uScroll * .04;
  float fit = aspect / uWaterAspect;
  if(fit > 1.) wuv.y = (wuv.y - .5) / fit + .5; else wuv.x = (wuv.x - .5) * fit + .5;
  wuv = clamp(wuv, .001, .999);
  vec3 col = texture2D(uWater, vec2(wuv.x, 1. - wuv.y)).rgb;

  /* colour grade: pale at the surface, abyss at the bottom and behind the name plate */
  col = mix(col, SKY, .16 * (1. - smoothstep(0., .34, uv.y)) * shallow);
  col = mix(col, DEEP, smoothstep(.34, .72, uv.y) * .5);
  col = mix(col, ABYSS, smoothstep(.68, 1., uv.y) * .86);
  col = mix(col, ABYSS, (1. - smoothstep(0., .46, uv.x)) * .5 * shallow);

  /* caustics, cut into flat patches like the game's cel water */
  float c1 = caustic(q * .55 + warp * 2. + vec2(0., t * .012), t * .42);
  float c2 = caustic(q * .9 - warp * 3. + vec2(t * .01, 0.), t * .33 + 4.);
  float light = smoothstep(.12, .5, c1) * .6 + smoothstep(.2, .62, c2) * .35;
  float reach = mix(1., .25, smoothstep(0., .95, uv.y));
  col += vec3(.16, .62, .9) * light * reach * (.14 + .26 * shallow) * (1. + uSurge);

  /* shafts of light from the surface, upper right */
  vec2 dir = q - vec2(aspect * .8, -.22);
  float ang = atan(dir.x, dir.y);
  float shaft = smoothstep(.5, .95, noise(vec2(ang * 15., t * .09))) * smoothstep(.35, .7, noise(vec2(ang * 5.3 + 9., t * .05)));
  col += vec3(.2, .68, .9) * shaft * smoothstep(1.35, .15, length(dir)) * .3 * shallow * shallow;

  /* the sunken statues: refracted, lit by the same caustics, fading into the dark */
  vec2 sp = (uv * uRes - uStatueRect.xy) / uStatueRect.zw + warp * .55;
  if(uStatueOn > .001 && sp.x > 0. && sp.x < 1. && sp.y > 0. && sp.y < 1.){
    vec4 s = texture2D(uStatue, vec2(sp.x, 1. - sp.y));
    float lum = dot(s.rgb, vec3(.3, .6, .1));
    s.rgb += vec3(.3, .8, 1.) * light * .4 * smoothstep(.12, .6, lum);
    s.rgb = mix(s.rgb, ABYSS, uDepth * .5);
    float mask = smoothstep(0., .03, sp.x) * smoothstep(0., .03, sp.y) * (1. - smoothstep(.97, 1., sp.y));
    col = mix(col, s.rgb, s.a * mask * uStatueOn);
  }

  /* deeper water */
  col = mix(col, ABYSS * 1.15, uDepth * .78);
  col += vec3(.02, .1, .3) * fbm(q * 3. + t * .02) * uDepth * .5;

  /* the plunge: a bright rush when the camera dives or surfaces */
  col = mix(col, vec3(.75, .96, 1.), uSurge * .28 * (1. - uv.y * .6));
  gl_FragColor = vec4(col, 1.);
}`;

const bubbleVertex = `
attribute vec4 seed;
uniform float uPhase, uTime, uScale;
varying float vTone;
void main(){
  float y = fract(seed.y + uPhase * (.25 + seed.z));
  float x = seed.x + sin(uTime * (.35 + seed.w) + seed.y * 40.) * .012;
  gl_Position = vec4(x * 2. - 1., y * 2.3 - 1.15, 0., 1.);
  gl_PointSize = (7. + seed.w * 20.) * uScale;
  vTone = seed.z;
}`;

const bubbleFragment = `
precision mediump float;
varying float vTone;
void main(){
  vec2 p = (gl_PointCoord - .5) * vec2(2.5, 2.);
  float d = length(p);
  if(d > 1.) discard;
  float rim = smoothstep(.62, .9, d);
  float glint = 1. - smoothstep(.0, .22, length(p - vec2(-.32, -.36)));
  vec3 col = mix(vec3(.56, .9, 1.), vec3(1.), glint);
  gl_FragColor = vec4(col, (.14 + rim * .34 + glint * .45) * (.5 + vTone * .5));
}`;

export function startSea() {
  const host = document.querySelector<HTMLElement>('.sea');
  const waterImage = document.querySelector<HTMLImageElement>('.sea-water');
  const statueImage = document.querySelector<HTMLImageElement>('.sea-statues');
  if (!host || !waterImage || !statueImage) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  /* ?still holds one settled frame so the page can be captured */
  const still = document.documentElement.classList.contains('still');
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: still }); } catch { return; }
  const canvas = renderer.domElement;
  canvas.className = 'sea-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);

  const root = document.documentElement;
  const uniforms = {
    uWater: { value: new THREE.Texture() }, uStatue: { value: new THREE.Texture() },
    uRes: { value: new THREE.Vector2(1, 1) }, uStatueRect: { value: new THREE.Vector4(0, 0, 1, 1) },
    uRipples: { value: Array.from({ length: rippleCount }, () => new THREE.Vector3(0, 0, -10)) },
    uTime: { value: still ? 14 : 0 }, uWaterAspect: { value: 16 / 9 }, uDepth: { value: depths[root.dataset.view ?? 'inicio'] ?? 0 },
    uStatueOn: { value: 0 }, uScroll: { value: 0 }, uSurge: { value: 0 },
  };
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const water = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, depthTest: false }));
  water.frustumCulled = false;
  scene.add(water);

  const count = 38;
  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 47.3) * 43758.5453; return x - Math.floor(x); };
    seeds.set([r(1), r(2), r(3), r(4) * r(4)], i * 4);
  }
  const bubbleGeometry = new THREE.BufferGeometry();
  bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  bubbleGeometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 4));
  const bubbleUniforms = { uPhase: { value: 0 }, uTime: uniforms.uTime, uScale: { value: 1 } };
  const bubbles = new THREE.Points(bubbleGeometry, new THREE.ShaderMaterial({ uniforms: bubbleUniforms, vertexShader: bubbleVertex, fragmentShader: bubbleFragment, transparent: true, depthTest: false }));
  bubbles.frustumCulled = false;
  bubbles.renderOrder = 1;
  scene.add(bubbles);

  let alive = true, loaded = 0;
  const loader = new THREE.TextureLoader();
  const load = (image: HTMLImageElement, slot: { value: THREE.Texture }, after?: (texture: THREE.Texture) => void) =>
    loader.load(image.currentSrc || image.src, texture => {
      if (!alive) { texture.dispose(); return; }
      texture.minFilter = THREE.LinearFilter; texture.generateMipmaps = false;
      slot.value = texture; after?.(texture);
      /* draw before the fallback images are hidden, so the swap never shows an empty frame */
      if (++loaded === 2) { settle(); measure(); renderer.render(scene, camera); host.classList.add('webgl-ready'); wake(); }
    }, undefined, () => dispose());
  load(waterImage, uniforms.uWater, texture => {
    const image = texture.image as HTMLImageElement;
    uniforms.uWaterAspect.value = image.naturalWidth / image.naturalHeight;
  });
  load(statueImage, uniforms.uStatue);

  function settle() {
    const view = root.dataset.view ?? 'inicio';
    uniforms.uDepth.value = depths[view] ?? 0;
    uniforms.uStatueOn.value = statueViews.has(view) ? 1 : 0;
  }
  function measure() {
    const width = innerWidth, height = innerHeight;
    /* cap the fill at about 2.4 megapixels so wide monitors stay smooth */
    const ratio = Math.min(devicePixelRatio, 1.75, Math.sqrt(2.4e6 / (width * height)));
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    uniforms.uRes.value.set(width, height);
    bubbleUniforms.uScale.value = ratio * Math.min(1.25, Math.max(.6, height / 1080));
    const box = statueImage!.getBoundingClientRect();
    uniforms.uStatueRect.value.set(box.left, box.top, Math.max(box.width, 1), Math.max(box.height, 1));
    if(loaded===2) wake();
  }
  const observer = new ResizeObserver(measure);
  observer.observe(document.documentElement); observer.observe(statueImage);
  addEventListener('resize', measure);

  let ripple = 0, lastRipple = 0, lastX = -1, lastY = -1;
  function touch(event: PointerEvent) {
    if(still) return;
    const now = performance.now();
    if (now - lastRipple < 140 || Math.hypot(event.clientX - lastX, event.clientY - lastY) < 46) return;
    lastRipple = now; lastX = event.clientX; lastY = event.clientY;
    uniforms.uRipples.value[ripple++ % rippleCount].set(event.clientX / innerHeight, event.clientY / innerHeight, uniforms.uTime.value);
  }
  addEventListener('pointermove', touch, { passive: true });
  addEventListener('pointerdown', touch, { passive: true });

  let surge = still ? 0 : 1;
  const loop=createFrameLoop(dt=>{
    if(still) {
      settle();uniforms.uScroll.value=scrollY/Math.max(innerHeight,1);
      renderer.render(scene,camera);return;
    }
    const view = root.dataset.view ?? 'inicio';
    const target = depths[view] ?? 0;
    const depth = uniforms.uDepth.value;
    const travel = target - depth;
    uniforms.uDepth.value = THREE.MathUtils.damp(depth, target, 3.4, dt);
    /* moving between depths makes the bubbles streak and the light surge */
    surge = Math.max(THREE.MathUtils.damp(surge, 0, 2.6, dt), Math.min(Math.abs(travel) * 2.4, 1));
    uniforms.uSurge.value = surge;
    uniforms.uStatueOn.value = THREE.MathUtils.damp(uniforms.uStatueOn.value, statueViews.has(view) ? 1 : 0, 4, dt);
    uniforms.uScroll.value = scrollY / Math.max(innerHeight, 1);
    uniforms.uTime.value += dt;
    bubbleUniforms.uPhase.value += dt * (.06 + travel * 3.2 + surge * .22);
    renderer.render(scene, camera);
  },{continuous:()=>!still});
  function wake() {
    if(!alive||document.hidden||loaded<2) loop.stop();
    else loop.start();
  }
  const routes=new MutationObserver(wake);
  routes.observe(root,{attributes:true,attributeFilter:['data-view']});
  document.addEventListener('visibilitychange',wake);
  if(still) addEventListener('scroll',wake,{passive:true});
  function motionChanged(){if(reduced.matches) dispose();}

  function dispose() {
    if (!alive) return;
    alive = false; loop.dispose(); observer.disconnect();routes.disconnect();
    document.removeEventListener('visibilitychange',wake);removeEventListener('scroll',wake);
    reduced.removeEventListener('change',motionChanged);
    removeEventListener('resize', measure); removeEventListener('pointermove', touch); removeEventListener('pointerdown', touch);
    host!.classList.remove('webgl-ready');
    water.geometry.dispose(); (water.material as THREE.Material).dispose(); bubbleGeometry.dispose(); (bubbles.material as THREE.Material).dispose();
    uniforms.uWater.value.dispose(); uniforms.uStatue.value.dispose(); renderer.dispose(); canvas.remove();
  }
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); dispose(); });
  reduced.addEventListener('change',motionChanged);
  addEventListener('pagehide', dispose, { once: true });
  measure();
}
