import * as THREE from 'three';
import { createFrameLoop } from './frame-loop';

type DeckAction = 'select' | 'flip';
export async function startArcanas() {
  const menu=document.querySelector<HTMLElement>('[data-arcana-menu]');
  const host=document.querySelector<HTMLElement>('[data-arcana-webgl]');
  const stage=document.querySelector<HTMLElement>('[data-arcana-stage]');
  if(!menu||!host||!stage) return;
  const buttons=[...menu.querySelectorAll<HTMLButtonElement>('[data-skill-card]')];
  const details=[...menu.querySelectorAll<HTMLElement>('[data-skill-detail]')];
  const filters=[...menu.querySelectorAll<HTMLButtonElement>('[data-skill-filter]')];
  const catalog=menu.querySelector<HTMLElement>('.arcana-catalog')!;
  const position=menu.querySelector<HTMLElement>('[data-arcana-position]')!;
  const flip=menu.querySelector<HTMLButtonElement>('[data-card-flip]')!;
  const flipLabel=menu.querySelector<HTMLElement>('[data-flip-label]')!;
  const fallback=stage.querySelector<HTMLImageElement>('.arcana-fallback img')!;
  const status=stage.querySelector<HTMLElement>('[data-card-status]')!;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const still=()=>reduced.matches||document.documentElement.classList.contains('still');
  let kind='hard', active=0, showingBack=false;
  let visible=buttons.map((_,i)=>i).filter(i=>buttons[i].dataset.kind===kind);
  let updateScene: (action:DeckAction)=>void=()=>{};
  function updateFace() {
    fallback.src=showingBack?menu!.dataset.cardArt!:buttons[active].dataset.cardFront!;
    stage!.dataset.face=showingBack?'back':'front';
    flip.setAttribute('aria-pressed',String(showingBack));
    flipLabel.textContent=showingBack?'Mostrar frente':'Virar carta';
    status.textContent=`${showingBack?'Verso':'Frente'} da carta: ${details[active].querySelector('h3')!.textContent}.`;
  }
  function select(index:number,animate=true) {
    active=index;showingBack=false;
    menu!.dataset.mode=kind;
    buttons.forEach((button,i)=>{button.hidden=button.dataset.kind!==kind;button.setAttribute('aria-pressed',String(i===active));});
    details.forEach((detail,i)=>{detail.hidden=i!==active;});
    filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.skillFilter===kind)));
    position.textContent=`${visible.indexOf(active)+1} de ${visible.length}`;
    position.setAttribute('aria-label',`Competência ${visible.indexOf(active)+1} de ${visible.length}`);
    if(animate&&!still()) {
      details[active].getAnimations().forEach(animation=>animation.cancel());
      details[active].animate([{translate:'-16px 0',opacity:.65},{translate:'0 0',opacity:1}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});
    }
    // Move only the horizontal catalog, not focus or the vertical page.
    const button=buttons[active];
    const left=button.offsetLeft-catalog.offsetLeft-(catalog.clientWidth-button.offsetWidth)/2;
    catalog.scrollTo({left:Math.max(0,left),behavior:still()?'instant':'smooth'});
    updateFace();updateScene('select');
  }
  function step(delta:number) {select(visible[(visible.indexOf(active)+delta+visible.length)%visible.length]);}
  function flipCard() {showingBack=!showingBack;updateFace();updateScene('flip');}
  flip.addEventListener('click',flipCard);
  fallback.parentElement!.addEventListener('click',flipCard);
  buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i)));
  filters.forEach(button=>button.addEventListener('click',()=>{
    kind=button.dataset.skillFilter!;
    visible=buttons.map((_,i)=>i).filter(i=>buttons[i].dataset.kind===kind);
    select(visible[0]);
  }));
  menu.querySelector('[data-arcana-prev]')!.addEventListener('click',()=>step(-1));
  menu.querySelector('[data-arcana-next]')!.addEventListener('click',()=>step(1));
  menu.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    if(event.key==='Home') select(visible[0]);
    else if(event.key==='End') select(visible[visible.length-1]);
    else step(event.key==='ArrowLeft'?-1:1);
  });
  menu.classList.add('enhanced-deck');select(0,false);

  // Do not allocate a hidden WebGL context or load its full-size back on the home menu.
  const activate=await new Promise<boolean>(resolve=>{
    // Direct Skills links can start immediately, without waiting an extra paint for IO.
    const box=stage.getBoundingClientRect();
    if(box.width>0&&box.height>0&&box.top<innerHeight+120&&box.bottom>-120){resolve(true);return;}
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting)) return;
      observer.disconnect();removeEventListener('pagehide',cancel);resolve(true);
    },{rootMargin:'120px'});
    function cancel(){observer.disconnect();resolve(false);}
    addEventListener('pagehide',cancel,{once:true});observer.observe(stage);
  });
  if(!activate) return;

  // The HTML front/back and all controls work even when a texture or WebGL fails.
  let renderer:THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});} catch {return;}
  let disposed=false;
  const textures=new Map<string,Promise<THREE.Texture>>();
  const resident=new Map<string,THREE.Texture>();
  let displayedTexture:THREE.Texture|undefined,transitionTexture:THREE.Texture|undefined;
  // Bound GPU residency even if the visitor explores all 27 full-resolution faces.
  function trimTextures() {
    for(const [url,texture] of resident) {
      if(resident.size<=6) break;
      if(url===menu!.dataset.cardArt||url===buttons[active].dataset.cardFront||texture===displayedTexture||texture===transitionTexture) continue;
      texture.dispose();resident.delete(url);textures.delete(url);
    }
  }
  const loader=new THREE.TextureLoader();
  function loadTexture(url:string) {
    const cached=resident.get(url);
    if(cached){resident.delete(url);resident.set(url,cached);}
    if(!textures.has(url)) textures.set(url,loader.loadAsync(url).then(texture=>{
      if(disposed){texture.dispose();throw new Error('Deck disposed');}
      texture.colorSpace=THREE.SRGBColorSpace;
      texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      resident.set(url,texture);trimTextures();
      return texture;
    }).catch(error=>{textures.delete(url);throw error;}));
    return textures.get(url)!;
  }
  let backTexture:THREE.Texture, firstFront:THREE.Texture;
  try { [backTexture,firstFront]=await Promise.all([loadTexture(menu.dataset.cardArt!),loadTexture(buttons[active].dataset.cardFront!)]); }
  catch {disposed=true;textures.forEach(p=>void p.then(t=>t.dispose()).catch(()=>{}));renderer.dispose();return;}
  displayedTexture=firstFront;
  host.append(renderer.domElement);
  const scene=new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#d6f5ff','#051239',2));
  const light=new THREE.DirectionalLight('#ffffff',3);light.position.set(-3,5,6);scene.add(light);
  const camera=new THREE.PerspectiveCamera(32,1,.1,30);
  const geometry=new THREE.BoxGeometry(2.45,3.65,.065);
  const edge=new THREE.MeshStandardMaterial({color:'#9cb8c7',metalness:.65,roughness:.32});
  const front=new THREE.MeshBasicMaterial({map:firstFront,transparent:true,alphaTest:.1});
  const back=new THREE.MeshBasicMaterial({map:backTexture,transparent:true,alphaTest:.1});
  const root=new THREE.Group();scene.add(root);
  // A single physical deck: aligned layers, real page edges, distinct front/back faces.
  const stack=Array.from({length:5},(_,i)=>{
    const mesh=new THREE.Mesh(geometry,[edge,edge,edge,edge,back,back]);
    mesh.position.set((i+1)*.045,-(i+1)*.045,-(i+1)*.085);
    mesh.rotation.z=-(i+1)*.012;root.add(mesh);return mesh;
  });
  const card=new THREE.Mesh(geometry,[edge,edge,edge,edge,front,back]);root.add(card);
  const aim=new THREE.Vector2();
  let visibleScene=false,time=0,request=0;
  const TAU=Math.PI*2;
  let tween: {from:number;to:number;elapsed:number;texture:THREE.Texture;swapped:boolean}|null=null;
  function draw(dt:number) {
    let lift=0;
    if(tween) {
      tween.elapsed=Math.min(1,tween.elapsed+dt/1.2);
      const p=tween.elapsed;
      const ease=(1-Math.cos(Math.PI*p))/2;
      card.rotation.y=THREE.MathUtils.lerp(tween.from,tween.to,ease);
      lift=Math.sin(p*Math.PI);
      // Swap the skill only while the shared back faces the visitor.
      if(!tween.swapped&&(Math.cos(card.rotation.y)<-.6||p===1)) {
        front.map=tween.texture;displayedTexture=tween.texture;front.needsUpdate=true;tween.swapped=true;
      }
      if(p===1) {card.rotation.y=showingBack?Math.PI:0;tween=null;stage!.dataset.turn='settled';transitionTexture=undefined;trimTextures();}
    }
    card.position.set(-lift*.23,lift*.13,lift*.7);
    root.rotation.z=-.26;
    root.rotation.y=THREE.MathUtils.damp(root.rotation.y,-.34+(still()?0:aim.x*.16),9,dt||1);
    root.rotation.x=THREE.MathUtils.damp(root.rotation.x,.06+(still()?0:aim.y*.09),7,dt||1);
    root.position.y=still()?0:Math.sin(time*.8)*.035;
    stack.forEach((mesh,i)=>{mesh.position.x=(i+1)*.045+lift*.015*i;});
    renderer.render(scene,camera);
  }
  function resize() {
    if(disposed) return;
    const box=host!.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setSize(Math.max(1,box.width),Math.max(1,box.height),false);
    camera.aspect=Math.max(1,box.width)/Math.max(1,box.height);
    camera.position.z=camera.aspect<.8?8.4/camera.aspect:8.4;
    camera.updateProjectionMatrix();draw(0);
  }
  const loop=createFrameLoop(dt=>{time+=dt;draw(dt);},{continuous:()=>!still()});
  function wake() {
    if(disposed||!visibleScene||document.hidden) loop.stop();
    else loop.start();
  }
  updateScene=(action)=>{
    const ticket=++request;
    stage!.setAttribute('aria-busy','true');
    void loadTexture(buttons[active].dataset.cardFront!).then(texture=>{
      if(disposed||ticket!==request) return;
      stage!.classList.add('webgl-ready');
      stage!.setAttribute('aria-busy','false');
      stage!.dataset.turn=still()?'settled':'moving';
      if(still()) {tween=null;transitionTexture=undefined;front.map=texture;displayedTexture=texture;front.needsUpdate=true;card.rotation.y=showingBack?Math.PI:0;trimTextures();}
      else {
        transitionTexture=texture;
        const from=((card.rotation.y%TAU)+TAU)%TAU;
        const to=action==='select'?TAU:showingBack?(from<Math.PI?Math.PI:Math.PI+TAU):TAU;
        tween={from,to,elapsed:0,texture,swapped:false};
      }
      draw(0);wake();
    }).catch(()=>{
      if(disposed||ticket!==request) return;
      stage!.classList.remove('webgl-ready');stage!.setAttribute('aria-busy','false');stage!.dataset.turn='settled';
    });
  };
  const observer=new ResizeObserver(resize);observer.observe(host);
  const visibility=new IntersectionObserver(entries=>{
    visibleScene=entries.some(entry=>entry.isIntersecting);
    if(visibleScene) resize();
    wake();
  });visibility.observe(host);
  function motionChanged() {
    if(still()) {tween=null;card.rotation.y=showingBack?Math.PI:0;updateScene('flip');}
    wake();
  }
  document.addEventListener('visibilitychange',wake);reduced.addEventListener('change',motionChanged);
  host.addEventListener('pointermove',event=>{
    const box=host.getBoundingClientRect();
    aim.set((event.clientX-box.left)/box.width*2-1,1-(event.clientY-box.top)/box.height*2);
  });
  host.addEventListener('pointerleave',()=>aim.set(0,0));
  let down:{x:number;y:number;id:number}|null=null;
  host.addEventListener('pointerdown',event=>{if(event.button===0)down={x:event.clientX,y:event.clientY,id:event.pointerId};});
  host.addEventListener('pointercancel',()=>{down=null;});
  host.addEventListener('pointerup',event=>{
    if(!down||down.id!==event.pointerId) return;
    const dx=event.clientX-down.x,dy=event.clientY-down.y;down=null;
    if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>15) return;
    if(Math.abs(dx)>40) step(dx>0?-1:1);else flipCard();
  });
  function dispose() {
    if(disposed)return;
    disposed=true;updateScene=()=>{};loop.dispose();
    observer.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',wake);reduced.removeEventListener('change',motionChanged);
    stage!.classList.remove('webgl-ready');stage!.setAttribute('aria-busy','false');
    textures.forEach(p=>void p.then(t=>t.dispose()).catch(()=>{}));textures.clear();resident.clear();
    geometry.dispose();edge.dispose();front.dispose();back.dispose();renderer.dispose();renderer.domElement.remove();
  }
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();dispose();});
  addEventListener('pagehide',dispose,{once:true});
  stage.classList.add('webgl-ready');resize();
  // Selection may have changed while initial assets were loading.
  updateScene('flip');
}
