/* Reproducible original trading-card faces. Run: bun scripts/generate-skill-fronts.ts.
 * Requires ImageMagick. Brand marks: locally vendored Devicon v2.17.0 (MIT).
 * No network at build/runtime; labels use the same self-hosted fonts as the site. */
import { mkdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { skillArcanas } from '../src/data/portfolio';

const themes = [
  ['#3776ab','#ffd343','python','Linguagem · automação'],
  ['#e76f31','#62c9f5','java','Linguagem · aplicações'],
  ['#3178c6','#8bd9ff','typescript','Tipos · desenvolvimento web'],
  ['#f7df1e','#fff49a','javascript','Linguagem · desenvolvimento web'],
  ['#ef652a','#36b8ee','html5','Estrutura · estilo'],
  ['#64d9b7','#d9fff1','flask','Framework · aplicações web'],
  ['#a179dc','#ddc7ff','csharp','Linguagem · aplicações'],
  ['#659ad2','#b7dfff','c','Linguagem · fundamentos'],
  ['#45bfe2','#b1efff','database','Consultas · dados relacionais'],
  ['#00758f','#f29111','mysql','Banco de dados relacional'],
  ['#699eca','#badbff','postgresql','Banco de dados relacional'],
  ['#edc431','#fff1a4','bars','Análise · visualização de dados'],
  ['#f05032','#ffb39b','git','Versionamento · colaboração'],
  ['#e9c649','#fff6c2','linux','Sistema operacional · terminal'],
  ['#27cfc7','#a5fff0','network','Conexões · infraestrutura'],
  ['#ab9aff','#e5dfff','pipeline','Integração · entrega contínua'],
  ['#2496ed','#98dcff','docker','Contêineres · infraestrutura'],
  ['#5bcbc0','#c4fff0','shield','Governança · riscos · conformidade'],
  ['#ef9b55','#ffe1bb','risk','Identificação · gestão de riscos'],
  ['#a299ed','#e0d9ff','key','Identidades · controle de acesso'],
  ['#4bc5e0','#b7f2ff','lock','Proteção · prevenção de perda de dados'],
  ['#e97d8d','#ffd7df','incident','Segurança · resposta a incidentes'],
  ['#5fc8a4','#c4ffea','cycle','Métodos ágeis · colaboração'],
  ['#c1a5ff','#f7cf8c','solution',''],
  ['#58d9d0','#a7e7ff','together',''],
  ['#f2bd68','#ffe7bb','learning',''],
  ['#f290b7','#dcc4ff','dialogue',''],
];
const paths:Record<string,string> = {
  database:'<ellipse cx="64" cy="29" rx="39" ry="15"/><path d="M25 29v66c0 20 78 20 78 0V29M25 51c0 20 78 20 78 0M25 73c0 20 78 20 78 0"/>',
  bars:'<path d="M25 106V69h20v37zm30 0V43h20v63zm30 0V19h20v87z"/>',
  network:'<circle cx="64" cy="64" r="17"/><circle cx="24" cy="24" r="10"/><circle cx="104" cy="24" r="10"/><circle cx="24" cy="104" r="10"/><circle cx="104" cy="104" r="10"/><path d="m31 31 21 21m24 0 21-21M31 97l21-21m24 0 21 21"/>',
  pipeline:'<path d="M30 64h68M64 30v68"/><circle cx="22" cy="64" r="13"/><circle cx="106" cy="64" r="13"/><circle cx="64" cy="22" r="13"/><circle cx="64" cy="106" r="13"/><path d="m55 64 6 6 12-14"/>',
  shield:'<path d="m64 12 43 17v32c0 27-22 44-43 55-21-11-43-28-43-55V29zM43 62l15 15 29-32"/>',
  risk:'<path d="m64 14 51 96H13zM64 49v27"/><circle cx="64" cy="92" r="2"/>',
  key:'<circle cx="44" cy="45" r="26"/><path d="m62 63 46 46 10-10-10-10 8-8-12-12-8 8-16-16"/><circle cx="38" cy="39" r="4"/>',
  lock:'<rect x="27" y="55" width="74" height="57" rx="6"/><path d="M42 55V37a22 22 0 0 1 44 0v18M64 79v13"/>',
  incident:'<path d="M15 64h25l12-34 21 69 12-35h28"/><circle cx="64" cy="64" r="53"/>',
  cycle:'<path d="M101 43a43 43 0 0 0-76-9L15 48m0-25v25h25M27 85a43 43 0 0 0 76 9l10-14m0 25V80H88"/>',
};
// Abstract geometric compositions: converging paths, woven links, expanding loops, dialogue.
function abstractArt(type:string,a:string,b:string) {
  const style=`fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  if(type==='solution') return `<g ${style}><path d="M190 310C380 310 300 490 475 490M190 670C380 670 300 490 475 490" stroke="${a}" stroke-width="30"/><path d="M190 490H650m-42-42 42 42-42 42" stroke="${b}" stroke-width="27"/><g fill="#12162b" stroke="${a}" stroke-width="9"><circle cx="190" cy="310" r="25"/><circle cx="190" cy="670" r="25"/></g><circle cx="465" cy="490" r="90" fill="#12162b" stroke="${b}" stroke-width="9"/><path d="m423 490 29 29 55-59" stroke="${b}" stroke-width="15"/></g>`;
  if(type==='together') return `<g ${style} transform="rotate(-35 424 490)"><rect x="160" y="330" width="330" height="270" rx="135" stroke="${a}" stroke-width="45"/><rect x="365" y="420" width="330" height="270" rx="135" stroke="${b}" stroke-width="45"/><path d="M487 465c0 64-42 117-99 133" stroke="${a}" stroke-width="45"/></g>`;
  if(type==='learning') return `<g ${style}><path d="M435 520c-82 41-117-66-52-99 122-66 213 112 95 191-180 118-348-162-159-291 218-150 440 175 245 349" stroke="${a}" stroke-width="32"/><path d="m532 672 33-2 4-34" stroke="${b}" stroke-width="20"/><circle cx="424" cy="492" r="22" fill="${b}" stroke="none"/></g>`;
  return `<g ${style}><path d="M175 350h280c54 0 85 36 85 85v80c0 49-31 85-85 85H300l-95 65 20-65c-32-8-50-37-50-85z" stroke="${a}" stroke-width="27"/><path d="M392 460h199c47 0 79 36 79 80v96c0 43-32 76-79 76l37 62-100-62H392c-44 0-72-33-72-76v-96c0-44 28-80 72-80z" stroke="${b}" stroke-width="27"/><path d="M380 580h222m-222 59h139" stroke="${b}" stroke-width="14"/></g>`;
}
function iconSVG(key:string,b:string) {
  if(paths[key]) return `<svg x="234" y="300" width="380" height="380" viewBox="0 0 128 128"><g fill="none" stroke="${b}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${paths[key]}</g></svg>`;
  let icon=readFileSync(`assets/skill-icons/${key}.svg`,'utf8').replace(/<\?xml[^>]*>/g,'').replace(/<svg\b/,'<svg x="224" y="290" width="400" height="400"');
  // Keep the actual mark readable on the dark illustration field.
  if(key==='flask') icon=icon.replace(/#010101|#000000|#000\b|\bblack\b/g,'#eefaff').replace('<svg x=', '<svg fill="#eefaff" x=');
  if(key==='mysql') icon='<circle cx="424" cy="490" r="224" fill="#e2edf0"/>'+icon;
  if(key==='html5') icon+=readFileSync('assets/skill-icons/css3.svg','utf8').replace(/<svg\b/,'<svg x="505" y="600" width="145" height="145"');
  return icon;
}
function wrap(text:string,max:number) {
  const lines:string[]=[];
  for(const word of text.split(' ')){if(!lines.length||lines.at(-1)!.length+word.length+1>max)lines.push(word);else lines[lines.length-1]+=' '+word;}
  return lines.join('\n');
}
const tmp=mkdtempSync(join(tmpdir(),'skill-faces-'));
const font='node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2';
const body='node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2';
mkdirSync('design/source/skill-fronts',{recursive:true});mkdirSync('assets/skill-fronts',{recursive:true});
try {
  for(const [i,item] of skillArcanas.entries()) {
    const [a,b,key,caption]=themes[i];
    const ornament=Array.from({length:9},(_,n)=>`<path d="M${85+n*82} 62l14 14-14 14-14-14zM${85+n*82} 1174l14 14-14 14-14-14z"/>`).join('');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="848" height="1264" viewBox="0 0 848 1264"><defs><linearGradient id="field" x2=".8" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="#101a32"/></linearGradient><linearGradient id="metal" x2="1" y2="1"><stop stop-color="${b}"/><stop offset=".45" stop-color="#eefaff"/><stop offset="1" stop-color="${a}"/></linearGradient></defs><rect x="8" y="8" width="832" height="1248" rx="20" fill="#071122"/><rect x="25" y="25" width="798" height="1214" rx="9" fill="url(#metal)"/><rect x="37" y="37" width="774" height="1190" rx="4" fill="#101a32"/><g fill="none" stroke="${a}" stroke-width="2">${ornament}</g><path d="M67 117H781V844H67z" fill="url(#field)"/><path d="M87 137H761V824H87z" fill="#0b1522" fill-opacity=".48" stroke="${b}" stroke-opacity=".5" stroke-width="2"/><g fill="none" stroke="${b}" stroke-opacity=".26"><circle cx="424" cy="490" r="280" stroke-width="2"/><circle cx="424" cy="490" r="263"/><path d="m424 170 300 320-300 320-300-320z" stroke-width="2"/><path d="M87 210q120 0 120-73M761 210q-120 0-120-73M87 750q120 0 120 74M761 750q-120 0-120 74" stroke-width="3"/></g>${item.kind==='soft'?abstractArt(key,a,b):iconSVG(key,b)}<path d="M67 872H781V1150H67z" fill="#f1f3ec"/><path d="M67 872H781" stroke="${a}" stroke-width="12"/><path d="M111 1024H737" stroke="#bcc7cb" stroke-width="2"/><g fill="${a}"><path d="m67 117 24 0-24 24zm714 0-24 0 24 24zM67 844h24l-24-24zm714 0h-24l24-24z"/></g></svg>`;
    const id=String(i).padStart(2,'0');const source=join(tmp,'face.svg');writeFileSync(source,svg);writeFileSync(`design/source/skill-fronts/${id}.svg`,svg);
    const title=wrap(item.name.toUpperCase(),item.name.length>26?25:26);
    const titleSize=title.includes('\n')?51:Math.min(68,Math.floor(1080/Math.max(1,title.length)));
    const text=wrap(item.kind==='soft'?item.detail:caption,44);
    const output=`assets/skill-fronts/${id}.webp`;
    const args=['magick','-background','none',source,'(','-background','none','-fill','#101a32','-font',font,'-pointsize',String(titleSize),'-gravity','center',`label:${title}`,')','-gravity','north','-geometry',`+0+${title.includes('\n')?895:916}`,'-composite','(','-background','none','-fill','#273c4b','-font',body,'-pointsize','27','-interline-spacing','8','-gravity','center',`label:${text}`,')','-gravity','north','-geometry','+0+1053','-composite','-quality','96',output];
    const result=spawnSync(args[0],args.slice(1),{encoding:'utf8'});if(result.error||result.status!==0)throw new Error(result.error?.message||result.stderr);
    writeFileSync(`${output}.json`,JSON.stringify({origin:'Original vector card layout and abstract geometry authored for this portfolio',generator:'scripts/generate-skill-fronts.ts',skill:item.name,width:848,height:1264,brandMark:paths[key]||item.kind==='soft'?'Original symbolic geometry (not an official brand mark)':`Devicon v2.17.0: ${key}-original.svg, MIT; trademark rights remain with owners`,proficiency:false},null,2)+'\n');
    console.log(output,item.name);
  }
} finally {rmSync(tmp,{recursive:true,force:true});}
