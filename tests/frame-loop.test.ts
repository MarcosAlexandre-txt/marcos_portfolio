import { describe, expect, test } from 'bun:test';
import { createFrameLoop } from '../src/scripts/frame-loop';

function harness(continuous=()=>true) {
  let id=0;
  const queue=new Map<number,FrameRequestCallback>();
  const deltas:number[]=[];
  const loop=createFrameLoop(dt=>deltas.push(dt),{
    continuous,
    requestFrame(callback){queue.set(++id,callback);return id;},
    cancelFrame(handle){queue.delete(handle);},
  });
  function frame(now:number){const callbacks=[...queue.values()];queue.clear();callbacks.forEach(callback=>callback(now));}
  return {loop,queue,deltas,frame};
}
describe('Animação sob demanda e pausa de GPU',()=>{
  test('inicia somente sob demanda e não duplica loops',()=>{
    const h=harness();expect(h.queue.size).toBe(0);
    h.loop.start();h.loop.start();expect(h.queue.size).toBe(1);
    h.frame(100);expect(h.deltas).toHaveLength(1);expect(h.queue.size).toBe(1);
    h.loop.stop();expect(h.queue.size).toBe(0);
    h.frame(116);expect(h.deltas).toHaveLength(1);
  });
  test('pausa cancela o próximo frame e retoma sem salto no relógio',()=>{
    const h=harness();h.loop.start();h.frame(100);h.frame(116);
    expect(h.deltas[1]).toBeCloseTo(.016);
    h.loop.stop();h.loop.start();h.frame(100000);
    expect(h.deltas[2]).toBeCloseTo(1/60);expect(h.queue.size).toBe(1);
    h.loop.dispose();expect(h.queue.size).toBe(0);
    h.loop.start();expect(h.queue.size).toBe(0);
  });
  test('limita o delta em frames lentos e nunca permite tempo negativo',()=>{
    const h=harness();h.loop.start();h.frame(100);h.frame(1000);h.frame(900);
    expect(h.deltas[1]).toBe(.05);expect(h.deltas[2]).toBe(0);h.loop.dispose();
  });
  test('modo estático desenha um frame e só repinta quando solicitado',()=>{
    const h=harness(()=>false);h.loop.start();h.frame(100);
    expect(h.deltas).toHaveLength(1);expect(h.queue.size).toBe(0);
    h.loop.start();h.frame(300);expect(h.deltas).toHaveLength(2);expect(h.queue.size).toBe(0);
    h.loop.dispose();
  });
  test('uma pausa durante o próprio render não deixa frames pendentes',()=>{
    const queue=new Map<number,FrameRequestCallback>();let id=0;
    const loop=createFrameLoop(()=>loop.stop(),{requestFrame(cb){queue.set(++id,cb);return id;},cancelFrame(id){queue.delete(id);}});
    loop.start();const callback=[...queue.values()][0];queue.clear();callback(100);
    expect(queue.size).toBe(0);loop.dispose();
  });
});
