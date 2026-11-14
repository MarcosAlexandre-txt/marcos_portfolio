type FrameLoopOptions = {
  continuous?: () => boolean;
  requestFrame?: (callback: FrameRequestCallback) => number;
  cancelFrame?: (id: number) => void;
};

/** A cancellable, idempotent RAF loop. Static mode draws once per explicit start.
 * Resuming starts with a fresh clock, so returning to a tab never jumps the scene. */
export function createFrameLoop(render: (delta: number, now: number) => void, options: FrameLoopOptions = {}) {
  const request=options.requestFrame??(callback=>requestAnimationFrame(callback));
  const cancel=options.cancelFrame??(id=>cancelAnimationFrame(id));
  const continuous=options.continuous??(()=>true);
  let pending:number|null=null,previous:number|null=null,paused=true,disposed=false;
  function tick(now:number) {
    pending=null;
    if(paused||disposed) return;
    const delta=previous===null?1/60:Math.max(0,Math.min((now-previous)/1000,.05));
    previous=now;render(delta,now);
    if(!paused&&!disposed&&pending===null&&continuous()) pending=request(tick);
  }
  function start() {
    if(disposed||pending!==null) return;
    paused=false;previous=null;pending=request(tick);
  }
  function stop() {
    paused=true;
    if(pending!==null) cancel(pending);
    pending=null;previous=null;
  }
  return {start,stop,dispose(){stop();disposed=true;}};
}
