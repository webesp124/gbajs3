import{r as p,q as os,u as Ye,j as e,v as N,w as ns,x as f,g as Ne,y as _,F as rs,z as kt,A as $t,I as Rt,B as as,C as is,D as ls,E as mt,H as ft,J as cs,K as ds,L as us,M as hs,N as Ge,O as G,Q as ps,S as xs,U as gs,V as Ft,W as ms,X as fs,Y as bs,Z as Ze,$ as ge,a0 as js,a1 as Ss,a2 as Je,a3 as vs,a4 as me,a5 as ys,a6 as Lt,a7 as Ee,a8 as It,a9 as ws,aa as Pt,ab as Cs,ac as ks,ad as $s,ae as Rs,af as Fs,ag as Ls,ah as Is,ai as Ps,aj as Ts,ak as Ms,al as Bs,am as _e,an as Ns,ao as Es,ap as Us,aq as zs,ar as Os,as as _s,at as As,au as qs,av as Ws,aw as Ds,ax as Hs,ay as Vs,az as Ks,aA as Gs,aB as Xs,aC as Qs,aD as Ys,aE as Zs,aF as Js,aG as eo,aH as to,aI as so}from"./vendor-D9ZbVt_x.js";import{m as oo}from"./vendor_mgba-wasm-BLfC_69t.js";import{S as Ae,c as no}from"./vendor_react-joyride-BeiANMH_.js";import{u as ne,S as ro,I as V,B as M,A as ao,a as io,b as lo,F as Tt,C as ve,T as oe,c as co,d as uo,e as qe,f as et,s as ho,g as po,t as We,h as xo,i as go,j as mo,k as tt,l as st,m as Mt,n as U,o as I,p as ot,q as Xe,M as Ie,D as xe,r as fo,v as bo,w as jo}from"./vendor_@mui-cBjKiS00.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();const Bt="currentEmulatorVolume",Nt="currentEmulatorKeyBindings",Et="currentGameName",Ut="currentFastForward",nt="currentCoreCallbacks",ye=({fetchFn:t,loadOnMount:o=!1,clearDataOnLoad:s=!1})=>{const[n,r]=p.useState(null),[a,d]=p.useState(null),[c,u]=p.useState(!1),i=()=>d(null),l=p.useCallback(async h=>{u(!0),d(null),s&&r(null);try{const g=await t(h);r(g),u(!1)}catch(g){d(g),u(!1)}},[s,t]);return p.useEffect(()=>{o&&l()},[]),{data:n,isLoading:c,error:a,clearError:i,execute:l}},So=({loadOnMount:t=!1}={})=>{const s=p.useCallback(async()=>(await fetch("undefined/api/tokens/refresh",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include"})).json(),[void 0]),{data:n,isLoading:r,error:a,clearError:d,execute:c}=ye({fetchFn:s,clearDataOnLoad:!0,loadOnMount:t});return{data:n,isLoading:r,error:a,clearError:d,execute:c}},zt=p.createContext(null);zt.displayName="AuthContext";const vo=({children:t})=>{const[n,r]=p.useState(null),[a,d]=p.useState(null),{data:c,isLoading:u,execute:i,error:l,clearError:h}=So({loadOnMount:!1}),g=!u&&!!c;p.useEffect(()=>{g&&(r(c),d("refresh"))},[g,c]);const b=p.useCallback(()=>{if(n){const{exp:x}=os(n);if(x&&Date.now()<=x*1e3)return!0}return!1},[n]),j=b()&&!c&&a!=="refresh";return p.useEffect(()=>{j&&h()},[j,h]),Ye(async()=>{await i()},b()&&!l?24e4:null),e.jsx(zt.Provider,{value:{accessToken:n,setAccessToken:r,setAccessTokenSource:d,isAuthenticated:b},children:t})},rt=p.createContext(null);rt.displayName="DragContext";const yo=({children:t})=>{const[o,s]=p.useState(!1);return e.jsx(rt.Provider,{value:{areItemsDraggable:o,setAreItemsDraggable:s},children:t})},K=0,wo=3,Co=t=>{const o=t.filePaths(),s=(c,u)=>{var l,h;let i=(l=c==null?void 0:c.split("/"))==null?void 0:l.pop();if(u){const g="."+((h=i==null?void 0:i.split("."))==null?void 0:h.pop());i=i==null?void 0:i.replace(g,u)}return i},n=()=>{const c={path:o.root,isDir:!0,children:[]},u=[".",".."],i=({path:l,children:h})=>{for(const g of t.FS.readdir(l)){if(u.includes(g))continue;const b=`${l}/${g}`,{mode:j}=t.FS.lookupPath(b,{}).node,x={path:b,isDir:t.FS.isDir(j),children:[]};h==null||h.push(x),x.isDir&&i(x)}};return i(c),c},r=c=>{var g;const u=c.split(`
`),i=["cheats = ",""];if(!((g=u==null?void 0:u[0])!=null&&g.match("^cheats = [0-9]+$")))return[];const l={},h={desc:"desc",code:"code",enable:"enable"};for(const b of u){if(i.includes(b))continue;const j=b.match(/^cheat([0-9]+)_([a-zA-Z]+)\s*=\s*"?([a-zA-Z0-9\s+:_]+)"?$/);if(j){const[,x,y,k]=j,R=h[y];l[x]=l[x]||{desc:"",code:"",enable:!1},R&&(l[x][R]=R===h.enable?k.toLowerCase()==="true":k)}}return Object.values(l)},a=c=>{const u=c.map((h,g)=>`cheat${g}_desc = "${h.desc}"
cheat${g}_enable = ${h.enable}
cheat${g}_code = "${h.code}"
`),i=`cheats = ${u==null?void 0:u.length}

`,l=s(t.gameName,".cheats");if(u!=null&&u.length&&l){const h=i+u.join(`
`),g=new Blob([h],{type:"text/plain"});return new File([g],l)}return null},d=({key:c,location:u})=>{let i=u===wo?`Keypad ${c}`:c;return i.toLowerCase().includes("enter")&&(i=i.replace(/enter/gi,"Return")),i.toLowerCase().includes("arrow")&&(i=i.replace(/arrow/gi,"")),i};return{addCoreCallbacks:t.addCoreCallbacks,autoLoadCheats:t.autoLoadCheats,createSaveState:t.saveState,defaultKeyBindings:()=>[{gbaInput:"A",key:"X",location:K},{gbaInput:"B",key:"Z",location:K},{gbaInput:"L",key:"A",location:K},{gbaInput:"R",key:"S",location:K},{gbaInput:"Start",key:"Enter",location:K},{gbaInput:"Select",key:"Backspace",location:K},{gbaInput:"Up",key:"ArrowUp",location:K},{gbaInput:"Down",key:"ArrowDown",location:K},{gbaInput:"Left",key:"ArrowLeft",location:K},{gbaInput:"Right",key:"ArrowRight",location:K}],loadSaveState:t.loadState,listSaveStates:()=>t.FS.readdir(o.saveStatePath),listRoms2:()=>t.FS.readdir(o.gamePath),listSaves:()=>t.FS.readdir(o.savePath),getStatSaves:c=>t.FS.stat("/data/saves/"+c),getStatRoms:c=>t.FS.stat("/data/games/"+c),listRoms:t.listRoms,setVolume:async c=>{(t.SDL2.audioContext.state==="suspended"||t.SDL2.audioContext.state==="interrupted")&&await t.SDL2.audioContext.resume(),t.setVolume(c)},getVolume:t.getVolume,enableKeyboardInput:()=>t.toggleInput(!0),disableKeyboardInput:()=>t.toggleInput(!1),simulateKeyDown:t.buttonPress,simulateKeyUp:t.buttonUnpress,setFastForwardMultiplier:t.setFastForwardMultiplier,isFastForwardEnabled:()=>t.getFastForwardMultiplier()>1,run:t.loadGame,getCurrentRom:()=>t.gameName?t.FS.readFile(t.gameName):null,getCurrentGameName:()=>s(t.gameName),setCurrentGameName:c=>{c&&!t.gameName&&(t.gameName=c)},getCurrentSave:()=>t.saveName?t.getSave():null,getCurrentSaveName:()=>s(t.saveName),getFile:c=>t.FS.readFile(c),uploadCheats:t.uploadCheats,uploadRom:t.uploadRom,uploadSaveOrSaveState:t.uploadSaveOrSaveState,deleteSaveState:c=>{const u=s(t.saveName,".ss"+c),i=`${o.saveStatePath}/${u}`;t.FS.unlink(i)},deleteFile:t.FS.unlink,pause:t.pauseGame,resume:t.resumeGame,quitGame:t.quitGame,quitEmulator:t.quitMgba,quickReload:t.quickReload,getCurrentCheatsFile:()=>{const c=s(t.gameName,".cheats"),u=`${o.cheatsPath}/${c}`;return t.FS.analyzePath(u).exists?t.FS.readFile(u):new Uint8Array},getCurrentCheatsFileName:()=>s(t.gameName,".cheats"),screenshot:t.screenshot,remapKeyBindings:c=>c.forEach(u=>t.bindKey(d(u),u.gbaInput)),filePaths:t.filePaths,fsSync:t.FSSync,listAllFiles:n,parseCheatsString:r,parsedCheatsToFile:a}},ko=t=>{const[o,s]=p.useState(null);return p.useEffect(()=>{(async()=>{if(t){const r=await oo({canvas:t}),a=r.version.projectName+" "+r.version.projectVersion;console.log(a),await r.FSInit();const d=Co(r);s(d)}})()},[t]),o},at=p.createContext(null);at.displayName="EmulatorContext";const $o=({children:t})=>{const[o,s]=p.useState(null),n=ko(o);return e.jsx(at.Provider,{value:{emulator:n,canvas:o,setCanvas:s},children:t})},it=p.createContext(null);it.displayName="ResizeContext";const Ro=({children:t})=>{const[o,s]=p.useState(!1);return e.jsx(it.Provider,{value:{areItemsResizable:o,setAreItemsResizable:s},children:t})},lt=p.createContext(null);lt.displayName="RunningContext";const Fo=({children:t})=>{const[o,s]=p.useState(!1);return e.jsx(lt.Provider,{value:{isRunning:o,setIsRunning:s},children:t})},Lo="componentLayouts",Io=()=>{const[t,o]=N(Lo,{}),s=p.useCallback(()=>o({}),[o]),n=p.useMemo(()=>!!Object.values(t).some(r=>!!(r!=null&&r.position)||!!(r!=null&&r.size)),[t]);return{layouts:t,setLayouts:o,hasSetLayout:n,clearLayouts:s}},ct=p.createContext(null);ct.displayName="LayoutContext";const Po=({children:t})=>{const{layouts:o,setLayouts:s,hasSetLayout:n,clearLayouts:r}=Io(),a=p.useCallback((d,c)=>s(u=>({...u,[d]:{...u==null?void 0:u[d],...c}})),[s]);return p.useEffect(()=>{n||r()},[]),e.jsx(ct.Provider,{value:{layouts:o,hasSetLayout:n,clearLayouts:r,setLayout:a,setLayouts:s},children:t})},dt=p.createContext(null);dt.displayName="ModalContext";const To=({children:t})=>{const[o,s]=p.useState(null),[n,r]=p.useState(!1);return e.jsx(dt.Provider,{value:{modalContent:o,setModalContent:s,isModalOpen:n,setIsModalOpen:r},children:t})},fe=t=>{const o=t.displayName,s=p.useContext(t);if(!s)throw new Error(`${o??"This context"} must be loaded under the matching ${o?`${o}.Provider`:"Provider"}`);return s},ue=()=>fe(ct),q=()=>fe(dt),E=()=>fe(at),Ue=()=>fe(rt),Ot=()=>fe(it),re=()=>fe(lt),Mo=({isPaused:t})=>{const o=ns(),{emulator:s}=E(),{isRunning:n}=re(),[r,a]=p.useState(!1),d=n&&!t;p.useEffect(()=>{d&&(!o&&!r?(s==null||s.pause(),a(!0)):o&&r&&(s==null||s.resume(),a(!1)))},[s,o,d,r])},Bo=t=>{const o=t.getContext("webgl");o==null||o.clearColor(0,0,0,1),o==null||o.clear(o==null?void 0:o.COLOR_BUFFER_BIT)},No=t=>{const o=t.getContext("2d"),s=40,n=50;let r=0;if(!o)return;const a=t.width,d=t.height,c=a/2,u=d/2,i=o.getImageData(0,0,a,d),l=setInterval(()=>{r++;for(let h=0;h<d;++h)for(let g=0;g<a;++g){const b=Math.abs(g-c),j=Math.abs(h-u)*.8,x=(c-r-b)/c,y=(u-r-(h&1)*10-j+Math.pow(b,1/2))/u;i.data[(g+h*a)*4+3]*=Math.pow(x,1/3)*Math.pow(y,1/2)}o.putImageData(i,0,0),r>s&&(clearInterval(l),t.remove())},n)},Eo=(t,o)=>{if(!t||!o)return;const s=document.createElement("canvas"),n=s.getContext("2d"),r=URL.createObjectURL(o);s.className=t.className,s.height=t.height,s.width=t.width,s.style.backgroundColor=t.style.backgroundColor,s.style.height=`${t.clientHeight}px`,s.style.imageRendering=t.style.imageRendering,s.style.margin=t.style.margin,s.style.objectFit=t.style.objectFit,s.style.width=`${t.clientWidth}px`,s.style.position="absolute",s.style.top="0",s.style.left="0",s.style.right="0";const a=new Image;a.onload=()=>{var d;n==null||n.drawImage(a,0,0),(d=t.parentElement)==null||d.appendChild(s),Bo(t),No(s)},a.src=r},Uo=t=>{if(!t)return null;const o="fade-copy.png",s=(t==null?void 0:t.filePaths().screenshotsPath)+"/"+o;if(!t.screenshot(o))return null;const r=t.getFile(s);return t==null||t.deleteFile(s),new Blob([r],{type:"image/png"})},zo=()=>{const{canvas:t,emulator:o}=E(),{isRunning:s,setIsRunning:n}=re();return p.useCallback(()=>{s&&(Eo(t,Uo(o)),o==null||o.quitGame()),n(!1)},[t,o,s,n])},ze="completedProductTour",Oo={locale:{skip:e.jsx("strong",{"aria-label":"Skip",children:"Skip"})},placement:"auto",placementBeacon:"right-end",spotlightPadding:10},be=({completedProductTourStepName:t,steps:o,allowScrolling:s=!0,isNotInModal:n=!1,millisecondDelay:r=500,renderWithoutDelay:a=!1,skipIfIntroSkipped:d=!0,skipRenderCondition:c=!1,zIndex:u=500})=>{const[i,l]=N(ze),{isModalOpen:h}=q(),[g,b]=p.useState(a);if(Ye(()=>{b(!0)},a?null:r),!g||i!=null&&i[t]||d&&(i==null?void 0:i.hasCompletedProductTourIntro)===Ae.SKIPPED||!(i!=null&&i.hasCompletedProductTourIntro)||!n&&!h||c)return null;const j=o.map(x=>({...Oo,...x}));return e.jsx(no,{continuous:!0,disableScrollParentFix:s,hideCloseButton:!0,showProgress:!0,showSkipButton:!0,steps:j,styles:{options:{zIndex:u}},callback:({status:x})=>{[Ae.FINISHED,Ae.SKIPPED].includes(x)&&l(y=>({...y,[t]:x}))}})},_o=f.button`
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  padding: inherit;
`,je=Ne.forwardRef(({children:t,...o},s)=>e.jsx(_o,{ref:s,...o,children:t})),pe=({variation:t})=>{const o=_(),s=function(){switch(t){case"topLeft":return"-45deg";case"topRight":return"45deg";case"bottomLeft":return"45deg";case"bottomRight":return"-45deg";default:return"0deg"}}();return e.jsx(rs,{"data-testid":"gripper-handle",color:o.gbaThemeBlue,style:{transform:`rotate(${s})`}})},Ao=f.ul`
  background-color: ${({theme:t})=>t.panelBlueGray};
  list-style: none;
  padding: 10px;
  margin: 0;
  max-width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px 10px;
  grid-template-areas:
    '. . . .'
    'volume volume fastForward fastForward';

  ${({$controlled:t,$isLargerThanPhone:o})=>(t||o)&&`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 10px;
  `}
`,qo=f.li`
  display: contents;
`,_t=kt`
  cursor: pointer;
  background-color: ${({theme:t})=>t.panelControlGray};
  border-radius: 0.25rem;
  min-width: 40px;
  min-height: 40px;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({theme:t})=>t.pureBlack};
  width: ${({$controlled:t})=>t?"auto":"100%"};

  ${({$controlled:t,theme:o})=>!t&&`
    @media ${o.isLargerThanPhone} {
      width: auto;
    }
  `}
`,Wo=f(je).attrs({className:"noDrag"})`
  ${_t}

  border: none;
  flex-grow: 1;
  margin: 0;
  padding: 0;

  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }

  &:active {
    color: ${({theme:t})=>t.gbaThemeBlue};
  }
`,Do=f.li`
  ${_t}
  grid-area: ${({$gridArea:t})=>t};
  max-height: 40px;
`,Ho=f(ro)`
  flex-grow: 1;

  > .MuiSlider-markActive {
    opacity: 1;
    background-color: currentColor;
  }
`,Re=({ariaLabel:t,children:o,controlled:s,id:n,onClick:r})=>e.jsx(qo,{children:e.jsx(Wo,{"aria-label":t,id:n,onClick:r,$controlled:s,children:o})}),Fe=({icon:t,...o})=>{const s=_();return e.jsx(V,{size:"small",sx:{padding:0,color:s.pureBlack,"&:active":{color:s.gbaThemeBlue}},...o,children:t})},bt=({controlled:t,gridArea:o,id:s,maxIcon:n,minIcon:r,...a})=>e.jsxs(Do,{id:s,$gridArea:o,$controlled:t,children:[r,e.jsx(Ho,{marks:!0,sx:{width:"85px",margin:"0 10px",maxHeight:"40px"},valueLabelDisplay:"auto",...a}),n]}),Vo=()=>{var ie,he,Ce,ke;const{emulator:t}=E(),{isRunning:o}=re(),{areItemsDraggable:s,setAreItemsDraggable:n}=Ue(),{areItemsResizable:r,setAreItemsResizable:a}=Ot(),{layouts:d,setLayout:c}=ue(),u=_(),i=ne(u.isLargerThanPhone),[l,h]=p.useState(!1),[g,b]=p.useState(!1),j=p.useId(),x=zo(),[y,k]=N(Bt,1),[R,$]=N(Ut,1);Mo({isPaused:l});const S=p.useCallback(B=>{var H,F;!((H=d==null?void 0:d.controlPanel)!=null&&H.initialBounds)&&B&&c("controlPanel",{initialBounds:(F=B.resizableElement.current)==null?void 0:F.getBoundingClientRect()})},[c,d]),w=(ie=d==null?void 0:d.screen)==null?void 0:ie.initialBounds;if(!w)return null;const m=i?5:0,v=!!((he=d==null?void 0:d.controlPanel)!=null&&he.size)||g,C=()=>{o&&(l?t==null||t.resume():t==null||t.pause(),h(B=>!B))},L=B=>{t==null||t.setVolume(B),k(B)},P=B=>{var F;const H=Number((F=B.target)==null?void 0:F.value);L(H)},T=B=>{t==null||t.setFastForwardMultiplier(B),$(B)},Y=B=>{var F;const H=Number((F=B.target)==null?void 0:F.value);t==null||t.setFastForwardMultiplier(H),$(H)},Z=[{content:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Use the control panel to quickly perform in game actions and reposition controls."}),e.jsx("p",{children:"Click next to take a tour of the controls!"})]}),placementBeacon:"bottom",target:`#${CSS.escape(j)}`},{content:e.jsx("p",{children:"Use the this button to pause and resume your game if it is running."}),placementBeacon:"bottom",target:`#${CSS.escape(`${j}--play`)}`},{content:e.jsx("p",{children:"Use this button to quit your current game."}),placementBeacon:"bottom",target:`#${CSS.escape(`${j}--quit-game`)}`},{content:e.jsx("p",{children:"Use this button to enable dragging and repositioning of the screen, controls, and control panel."}),placement:i?"auto":"right",placementBeacon:"bottom",target:`#${CSS.escape(`${j}--drag`)}`},{content:e.jsx("p",{children:"Use this button to resize the screen and control panel."}),placement:i?"auto":"right",placementBeacon:"bottom",target:`#${CSS.escape(`${j}--resize`)}`},{content:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Use this slider to increase and decrease the emulator volume."}),e.jsx("p",{children:"Your volume setting will be saved between refreshes!"})]}),placementBeacon:"bottom",target:`#${CSS.escape(`${j}--volume-slider`)}`},{content:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Use this slider to increase and decrease the fast forward speed."}),e.jsx("p",{children:"Your fast forward setting will be saved between refreshes!"})]}),placement:i?"auto":"right",placementBeacon:"bottom",target:`#${CSS.escape(`${j}--fast-forward`)}`}],J={x:Math.floor(w.left),y:Math.floor(w.bottom+m)},ee={width:i?"auto":"100dvw",height:"auto"},ae=((Ce=d==null?void 0:d.controlPanel)==null?void 0:Ce.position)??J,te=((ke=d==null?void 0:d.controlPanel)==null?void 0:ke.size)??ee,D={onFocus:t==null?void 0:t.disableKeyboardInput,onBlur:t==null?void 0:t.enableKeyboardInput,onClick:t==null?void 0:t.enableKeyboardInput};return e.jsxs(e.Fragment,{children:[e.jsx($t,{"data-testid":"control-panel-wrapper",id:j,disableDragging:!s,enableResizing:r,resizeHandleComponent:{bottomRight:e.jsx(pe,{variation:"bottomRight"}),bottomLeft:e.jsx(pe,{variation:"bottomLeft"})},resizeHandleStyles:{bottomRight:{marginBottom:"15px",marginRight:"15px"},bottomLeft:{marginBottom:"15px",marginLeft:"15px"}},ref:S,cancel:".noDrag",position:ae,size:te,onDragStop:(B,H)=>{c("controlPanel",{position:{x:H.x,y:H.y}})},onResizeStart:()=>b(!0),onResizeStop:(B,H,F,z,O)=>{c("controlPanel",{size:{width:F.clientWidth,height:F.clientHeight},position:{...O}}),b(!1)},default:{...J,...ee},children:e.jsx(Ao,{$controlled:v,$isLargerThanPhone:i,children:e.jsxs(Rt.Provider,{value:{size:"2em"},children:[e.jsx(Re,{id:`${j}--play`,ariaLabel:l||!o?"Play":"Pause",onClick:C,controlled:v,children:l||!o?e.jsx(as,{}):e.jsx(is,{})}),e.jsx(Re,{id:`${j}--quit-game`,ariaLabel:"Quit Game",onClick:()=>{x(),h(!1)},controlled:v,children:e.jsx(ls,{})}),e.jsx(Re,{id:`${j}--drag`,ariaLabel:s?"Anchor Items":"Drag Items",onClick:()=>{n(B=>!B)},controlled:v,children:s?e.jsx(mt,{color:u.gbaThemeBlue}):e.jsx(mt,{})}),e.jsx(Re,{id:`${j}--resize`,ariaLabel:r?"Stop Resizing Items":"Resize Items",onClick:()=>{a(B=>!B)},controlled:v,children:r?e.jsx(ft,{color:u.gbaThemeBlue}):e.jsx(ft,{})}),e.jsx(bt,{id:`${j}--volume-slider`,"aria-label":"Volume Slider",gridArea:"volume",controlled:v,value:y,step:.1,min:0,max:1,minIcon:e.jsx(Fe,{"aria-label":"Mute Volume",icon:e.jsx(cs,{style:{maxHeight:"100%"}}),onClick:()=>L(0)}),maxIcon:e.jsx(Fe,{"aria-label":"Max Volume",icon:e.jsx(ds,{style:{maxHeight:"100%"}}),onClick:()=>L(1)}),valueLabelFormat:`${y*100}`,onChange:P,...D}),e.jsx(bt,{id:`${j}--fast-forward`,"aria-label":"Fast Forward Slider",gridArea:"fastForward",controlled:v,value:R,step:1,min:1,max:5,minIcon:e.jsx(Fe,{"aria-label":"Regular Speed",icon:e.jsx(us,{style:{maxHeight:"100%"}}),onClick:()=>T(1)}),maxIcon:e.jsx(Fe,{"aria-label":"Max Fast Forward",icon:e.jsx(hs,{style:{maxHeight:"100%"}}),onClick:()=>T(5)}),valueLabelFormat:`x${R}`,onChange:Y,...D})]})})}),e.jsx(be,{steps:Z,completedProductTourStepName:"hasCompletedControlPanelTour",zIndex:i?160:0,renderWithoutDelay:!0,isNotInModal:!0})]})},At="currentSaveStateSlot",qt="areVirtualControlsEnabled",Ko="virtualControlProfiles",Go=f.section`
  position: absolute;
  background-color: red;
  border-radius: 50%;
  width: 12rem;
  height: 12rem;
  background: ${({theme:t})=>t.pureBlack};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-color: ${({$areItemsDraggable:t=!1,theme:o})=>t?o.gbaThemeBlue:"rgba(255, 255, 255, 0.9)"};
  border-style: ${({$areItemsDraggable:t=!1})=>t?"dashed":"solid"};
  border-width: 2px;
  z-index: 12;

  ${({$initialPosition:t={top:"0",left:"0"}})=>`
    top: ${t.top};
    left: ${t.left};
    `};
`,Xo=f.div`
  position: absolute;
  height: 4rem;
  width: 4rem;
  border: 2px solid ${({theme:t})=>t.gbaThemeBlue};
  border-radius: 50%;
  background-color: ${({theme:t})=>t.pureBlack};
  transition: ${({$isControlled:t=!1})=>t?"transform 0.3s ease-in-out":"none"};

  &:before {
    position: absolute;
    content: '';
    top: -0.8rem;
    left: -0.8rem;
    right: -0.8rem;
    bottom: -0.8rem;
    border: 0.8rem solid ${({theme:t})=>t.gbaThemeBlue}50;
    border-radius: 50%;
  }
`,Oe=f.div`
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
`,Qo=f(Oe)`
  border-width: 0 15px 25px 15px;
  border-color: transparent transparent ${({theme:t})=>t.pureWhite}
    transparent;
  top: 10px;
`,Yo=f(Oe)`
  border-width: 25px 15px 0 15px;
  border-color: ${({theme:t})=>t.pureWhite} transparent transparent
    transparent;
  bottom: 10px;
`,Zo=f(Oe)`
  border-width: 15px 25px 15px 0;
  border-color: transparent ${({theme:t})=>t.pureWhite} transparent
    transparent;
  left: 10px;
`,Jo=f(Oe)`
  border-width: 15px 0 15px 25px;
  border-color: transparent transparent transparent
    ${({theme:t})=>t.pureWhite};
  right: 10px;
`,en=({initialPosition:t})=>{var S;const{emulator:o}=E(),{areItemsDraggable:s}=Ue(),{layouts:n,setLayout:r}=ue(),[a,d]=p.useState({x:0,y:0}),[c,u]=p.useState(!0),i=p.useRef(null),l=p.useRef(null),[h,g]=p.useState({});p.useEffect(()=>{Object.keys(h).forEach(w=>{h[w]?o==null||o.simulateKeyDown(w):o==null||o.simulateKeyUp(w)})},[h,o]);const b=p.useCallback((w,m)=>g(v=>({...v,[w]:m})),[]),j=p.useCallback(w=>g(m=>Object.fromEntries(Object.entries(m).map(([v,C])=>[v,C===w?void 0:C]))),[]),x=({x:w,y:m})=>{const v=w*Math.cos(Math.PI/4)-m*Math.sin(Math.PI/4),C=w*Math.sin(Math.PI/4)+m*Math.cos(Math.PI/4);return v>=0&&C>=0?"RIGHT":v<0&&C>=0?"DOWN":v<0&&C<0?"LEFT":v>=0&&C<0?"UP":null},y=p.useCallback(w=>{if(!i.current||!l.current)return;const m=i.current.getBoundingClientRect(),v=l.current.getBoundingClientRect(),C=Math.max(-m.width/2+v.width/2,Math.min(w.clientX-m.left-m.width/2,m.width/2-v.width/2)),L=Math.max(-m.height/2+v.height/2,Math.min(w.clientY-m.top-m.height/2,m.height/2-v.height/2));s||d({x:C,y:L});const P=x({x:C,y:L});P&&!h[P]&&(j(w.pointerId),b(P,w.pointerId))},[s,h,b,j]),k=p.useCallback(w=>{if(u(!1),!i.current)return;const m=i.current.getBoundingClientRect(),v=w.clientX-m.left-m.width/2,C=w.clientY-m.top-m.width/2;s||d({x:v,y:C});const L=x({x:v,y:C});L&&b(L,w.pointerId)},[s,b]),R=w=>{u(!0),d({x:0,y:0}),j(w.pointerId)},$=((S=n==null?void 0:n.oPad)==null?void 0:S.position)??{x:0,y:0};return e.jsx(Ge,{nodeRef:i,disabled:!s,position:$,onStop:(w,m)=>r("oPad",{position:{x:m.x,y:m.y}}),children:e.jsxs(Go,{"aria-label":"O-Pad",ref:i,$initialPosition:t,$areItemsDraggable:s,onPointerDown:k,onPointerMove:y,onPointerUp:R,onPointerCancel:R,onPointerOut:R,onPointerLeave:R,children:[e.jsx(Ge,{disabled:!0,nodeRef:l,position:a,children:e.jsx(Xo,{ref:l,$isControlled:c})}),e.jsx(Zo,{}),e.jsx(Jo,{}),e.jsx(Qo,{}),e.jsx(Yo,{})]})})},Wt=f(je)`
  background-color: ${({theme:t})=>t.darkGray};
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  cursor: pointer;
  box-sizing: content-box;
  border-width: 2px;
`,tn=f(Wt)`
  width: ${({$diameter:t=60})=>t}px;
  height: ${({$diameter:t=60})=>t}px;
  border-radius: 100px;
  border-color: ${({$areItemsDraggable:t=!1,theme:o})=>t?o.gbaThemeBlue:"rgba(255, 255, 255, 0.9)"};
  border-style: ${({$areItemsDraggable:t=!1})=>t?"dashed":"solid"};

  ${({$initialPosition:t={top:"0",left:"0"}})=>`
    top: ${t.top};
    left: ${t.left};
    `}
`,sn=f(Wt)`
  border-radius: 16px;
  width: fit-content;
  min-width: 85px;
  border-color: ${({$areItemsDraggable:t=!1,theme:o})=>t?o.gbaThemeBlue:"rgba(255, 255, 255, 0.9)"};
  border-style: ${({$areItemsDraggable:t=!1})=>t?"dashed":"solid"};

  ${({$initialPosition:t={top:"0",left:"0"}})=>`
    top: ${t.top};
    left: ${t.left};
    `}
`,on=({isRectangular:t=!1,width:o=60,children:s,keyId:n,inputName:r,onClick:a,initialPosition:d,initialOffset:c,enabled:u=!1,ariaLabel:i})=>{var $;const{emulator:l}=E(),{areItemsDraggable:h}=Ue(),{layouts:g,setLayout:b}=ue(),j=p.useRef(null);if(!u)return null;const x=a?{onClick:a}:{},y=n?{onPointerDown:()=>{l==null||l.simulateKeyDown(n)},onPointerUp:()=>{l==null||l.simulateKeyUp(n)},onPointerLeave:()=>{l==null||l.simulateKeyUp(n)},onPointerOut:()=>{l==null||l.simulateKeyUp(n)},onPointerCancel:()=>{l==null||l.simulateKeyUp(n)}}:{},k=n?{onKeyDown:S=>{(S.code=="Space"||S.key==" ")&&(l==null||l.simulateKeyDown(n))},onKeyUp:S=>{(S.code=="Space"||S.key==" ")&&(l==null||l.simulateKeyUp(n))}}:{},R=(($=g==null?void 0:g[r])==null?void 0:$.position)??{x:0,y:0};return e.jsx(Ge,{nodeRef:j,positionOffset:c,position:R,disabled:!h,onStop:(S,w)=>b(r,{position:{x:w.x,y:w.y}}),children:t?e.jsx(sn,{ref:j,$initialPosition:d,$areItemsDraggable:h,"aria-label":i,...y,...x,...k,children:s}):e.jsx(tn,{ref:j,$initialPosition:d,$diameter:o,$areItemsDraggable:h,"aria-label":i,...y,...x,...k,children:s})})},se="https://raw.githubusercontent.com/webesp124/gb_data/refs/heads/main",Dt=["FLASH1M_V102","FLASH1M_V103","FLASH_V124","FLASH_V126","FLASH_ECLA","EEPROM_V122","EEPROM_V124","SRAM_V112","SRAM_V113","REPRO_FLASH1M","NONE"],ut=t=>(console.log("Save Type: "+t),t[0]=="N"?0:t[0]=="E"?1:t[0]=="S"?3:t[0]=="F"&&t[5]=="1"?5:t[0]=="F"?4:t[0]=="R"&&t[11]=="1"?55:(console.log("Invalid Save Type"),-1)),nn=(t,o)=>{let s=Number(o.cartSize/1024/1024),n="";return s==1?n=t.checksum_1MB:s==2?n=t.checksum_2MB:s==4?n=t.checksum_4MB:s==8?n=t.checksum_8MB:s==16&&(n=t.checksum_16MB),n.toUpperCase()},rn=t=>new Promise(o=>setTimeout(o,t)),an=async t=>{let o,s;s=null;let n=!1,r="";try{if(o=await(await fetch(`${t}/get_game_info`,{method:"GET",headers:{"Access-Control-Request-Private-Network":"true"}})).json(),o.romName=="")throw new Error("Error Reading Cartridge, ROM name empty");if(n=!0,o.is_gba){if(s=await(await fetch(se+`/information_rom_gba/${o.cartID}.json`)).json(),console.log(s),r=nn(o,s),r!=s.checksum1000){console.log("Checksums do not match. Trying to get a different one...");try{const c=await fetch(se+`/information_rom_gba/${r}-${o.cartID}.json`);if(!c.ok||c.status!=200)throw new Error(`HTTP error! Status: ${c.status}`);let u=await c.json();u&&Object.keys(u).length>0?(console.log("Additional Data exists"),s=u):console.log("Additional Data does not exist or is empty")}catch(c){console.error("An error occurred while fetching additional data: ",c)}}}else s=await(await fetch(se+`/information_rom_gb/${o.romName}.json`)).json(),console.log(s),o.checksumStr!=s.global_checksum&&console.log("Checksums do not match. Trying to get a different one...");return[o,s,r,n]}catch(a){console.error("Error fetching game information:",a)}finally{return[o,s,r,n]}},ln=(t,o)=>{let s=o.coverImage;return s?s.startsWith("/")?t.is_gba?se+s.replace("/covers/","/covers_gba/"):se+s.replace("/covers/","/covers_gb/"):s.startsWith(".")?t.is_gba?se+s.substring(1).replace("/covers/","/covers_gba/"):se+s.substring(1).replace("/covers/","/covers_gb/"):s:""},ht=(t,o,s)=>{const n=o==null?void 0:o.getCurrentSave(),r=o==null?void 0:o.getCurrentSaveName();if(n&&r){const d=new XMLHttpRequest;if(!t){console.log("No save type information.");return}var a=ut(t.saveType);if(a==-1){console.log("Invalid Save Type");return}console.log(a);const c=new Promise((u,i)=>{d.open("POST",`${s}/upload_save_file?saveType=${a}`,!0),d.onload=()=>{if(d.status>=200&&d.status<300){const l=new XMLHttpRequest;l.open("POST",`${s}/verify_save_file?saveType=${a}`,!0),l.onload=()=>{l.status>=200&&l.status<300?u("Uploaded  and verified save on cartridge"):i("Save on cartridge has errors")},l.onerror=()=>i("Failed to upload save for verification"),l.send(n)}else i("Failed to upload save to cartridge")},d.onerror=()=>i("Failed to upload save to cartridge"),d.send(n)});G.promise(c,{loading:"Uploading save to cartridge...",success:u=>`${u}`,error:u=>`${u}`})}else G.error("Current save not available")},cn=(t,o)=>t?o:null,Ht=()=>{const{isRunning:t}=re(),{emulator:o}=E(),[,s]=N(nt),n=p.useCallback(a=>o==null?void 0:o.addCoreCallbacks({saveDataUpdatedCallback:cn(a.saveFileSystemOnInGameSave,()=>{window.additionalData&&window.esp32IP&&ht(window.additionalData,o,window.esp32IP)})}),[o]),r=p.useCallback(a=>{s(d=>({...d,...a})),t&&n(a)},[n,t,s]);return{addCallbacks:n,addCallbacksAndSaveSettings:r}},pt=()=>{const{emulator:t}=E(),{setIsRunning:o}=re(),[,s]=N(Et),[n]=N(Nt),[r]=N(Bt,1),[a]=N(Ut,1),[d]=N(nt,{saveFileSystemOnInGameSave:!1,notificationsEnabled:!0}),{addCallbacks:c}=Ht();return p.useCallback(i=>{const l=t==null?void 0:t.run(i);return o(!!l),s(i),t==null||t.setVolume(r),l&&(n&&(t==null||t.remapKeyBindings(n)),a>1&&!(t!=null&&t.isFastForwardEnabled())&&(t==null||t.setFastForwardMultiplier(a)),c(d)),!!l},[c,d,r,n,t,a,o,s])},Vt=()=>{const t=pt(),{isRunning:o,setIsRunning:s}=re(),{emulator:n}=E(),[r]=N(Et);return p.useCallback(()=>{if(o)n==null||n.quickReload();else if(n!=null&&n.getCurrentGameName()){const d=t(n.filePaths().gamePath+"/"+n.getCurrentGameName());s(!!d)}else if(r){const d=t(r);s(!!d)}},[n,o,s,t,r])},jt=f.p`
  text-align: center;
  vertical-align: middle;
  line-height: 54px;
  color: ${({theme:t})=>t.pureWhite};
  margin: 0;
  font-size: 1.5em;
`,Le=f.p`
  color: ${({theme:t})=>t.pureWhite};
  margin: 4px 5px;
`,dn=t=>t.replace("-"," ").replace(/\w\S*/g,o=>o.charAt(0).toUpperCase()+o.substring(1).toLowerCase()),un=({additionalData:t,esp32IP:o})=>{var w;const s=_(),n=ne(s.isLargerThanPhone),r=ne(s.isMobileWithUrlBar),{emulator:a}=E(),{layouts:d}=ue(),c=p.useId(),u=Vt(),[i]=N(At,0),[l]=N(qt),h=(w=d==null?void 0:d.controlPanel)==null?void 0:w.initialBounds;if(!h)return null;const g=m=>m===void 0&&!n||!!m,b=g(l==null?void 0:l.OpadAndButtons),j=(l==null?void 0:l.NotificationsEnabled)??!0,x=h.bottom,y=h.left,k={"a-button":{defaultMobile:{top:`calc(${x}px + 12%)`,left:"calc(100dvw - 25px)"},mobileWithUrlBar:{top:`calc(${x}px + 10%)`},largerThanPhone:{top:`calc(${x}px + 35px - 3%)`,left:`calc(${y}px + 450px)`}},"b-button":{defaultMobile:{top:`calc(${x}px + 15%)`,left:"calc(100dvw - 100px)"},mobileWithUrlBar:{top:`calc(${x}px + 13%)`},largerThanPhone:{top:`calc(${x}px + 35px)`,left:`calc(${y}px + 375px)`}},"start-button":{defaultMobile:{top:"88dvh",left:"25dvw"},mobileWithUrlBar:{top:"92dvh",left:"50dvw"},largerThanPhone:{top:`calc(${x}px + 60px)`,left:`${y}px`}},"select-button":{defaultMobile:{top:"88dvh",left:"55dvw"},mobileWithUrlBar:{top:"92dvh",left:"75dvw"},largerThanPhone:{top:`calc(${x}px + 60px)`,left:`calc(${y}px + 103px)`}},"l-button":{defaultMobile:{top:`${x+15}px`,left:"15px"},largerThanPhone:{top:`calc(${x}px + 15px)`,left:`${y}px`}},"r-button":{defaultMobile:{top:`${x+15}px`,left:"calc(100dvw - 15px)"},largerThanPhone:{top:`calc(${x}px + 15px)`,left:`calc(${y}px + 190px)`}},"quickreload-button":{defaultMobile:{top:`${x+10}px`,left:"135px"},largerThanPhone:{top:`calc(${x}px + 10px)`,left:`calc(${y}px + 205px)`}},"uploadsave-button":{defaultMobile:{top:`${x+10}px`,left:"calc(100dvw - 135px)"},largerThanPhone:{top:`calc(${x}px + 10px)`,left:`calc(${y}px + 300px)`}},"loadstate-button":{defaultMobile:{top:`calc(${x}px + 25%)`,left:"calc(100dvw - 40px)"},mobileWithUrlBar:{top:`calc(${x}px + 23%)`},largerThanPhone:{top:`calc(${x}px + 60px)`,left:`calc(${y}px + 248px)`}},"savestate-button":{defaultMobile:{top:`calc(${x}px + 27%)`,left:"calc(100dvw - 100px)"},mobileWithUrlBar:{top:`calc(${x}px + 25%)`},largerThanPhone:{top:`calc(${x}px + 60px)`,left:`calc(${y}px + 300px)`}},"o-pad":{defaultMobile:{top:`calc(${x}px + 11%)`,left:"10px"},largerThanPhone:{top:`calc(${x}px + 10px)`,left:`calc(${y}px + 450px)`}}},R=m=>{var C,L,P,T;let v;return r&&((C=k[m])!=null&&C.mobileWithUrlBar)?v=(L=k[m])==null?void 0:L.mobileWithUrlBar:n&&((P=k[m])!=null&&P.largerThanPhone)&&(v=(T=k[m])==null?void 0:T.largerThanPhone),{...k[m].defaultMobile,...v}},$=(m,v,C)=>{j&&G[m?"success":"error"](m?v:C,{id:c})},S=[{keyId:"A",children:e.jsx(jt,{children:"A"}),initialPosition:R("a-button"),initialOffset:{x:"-100%",y:"0px"},keyName:"a-button",enabled:b},{keyId:"B",children:e.jsx(jt,{children:"B"}),initialPosition:R("b-button"),initialOffset:{x:"-100%",y:"0px"},keyName:"b-button",enabled:b},{keyId:"START",isRectangular:!0,children:e.jsx(Le,{children:"Start"}),initialPosition:R("start-button"),keyName:"start-button",enabled:b},{keyId:"SELECT",isRectangular:!0,children:e.jsx(Le,{children:"Select"}),initialPosition:R("select-button"),keyName:"select-button",enabled:b},{keyId:"L",isRectangular:!0,children:e.jsx(Le,{children:"L"}),initialPosition:R("l-button"),keyName:"l-button",enabled:b},{keyId:"R",isRectangular:!0,children:e.jsx(Le,{children:"R"}),initialPosition:R("r-button"),initialOffset:{x:"-100%",y:"0px"},keyName:"r-button",enabled:b},{children:e.jsx(ps,{}),onClick:()=>{u(),!(a!=null&&a.getCurrentGameName())&&j&&G.error("Load a game to quick reload",{id:c})},width:40,initialPosition:R("quickreload-button"),keyName:"quickreload-button",enabled:g(l==null?void 0:l.QuickReload)},{children:e.jsx(xs,{}),onClick:()=>{ht(t,a,o)},width:40,initialPosition:R("uploadsave-button"),initialOffset:{x:"-100%",y:"0px"},keyName:"uploadsave-button",enabled:g(l==null?void 0:l.SendSaveToServer)},{children:e.jsx(gs,{}),onClick:()=>{const m=a==null?void 0:a.loadSaveState(i);$(!!m,`Loaded slot: ${i}`,`Failed to load slot: ${i}`)},width:40,initialPosition:R("loadstate-button"),initialOffset:{x:"-100%",y:"0px"},keyName:"loadstate-button",enabled:g(l==null?void 0:l.LoadState)},{children:e.jsx(Ft,{}),onClick:()=>{const m=a==null?void 0:a.createSaveState(i);$(!!m,`Saved slot: ${i}`,`Failed to save slot: ${i}`)},width:40,initialPosition:R("savestate-button"),initialOffset:{x:"-100%",y:"0px"},keyName:"savestate-button",enabled:g(l==null?void 0:l.SaveState)}];return e.jsxs(Rt.Provider,{value:{color:s.pureWhite,size:"2em"},children:[b&&e.jsx(en,{initialPosition:R("o-pad")}),S.map(m=>e.jsx(on,{ariaLabel:dn(m.keyName),inputName:m.keyName,...m},m.keyName))]})},hn={overlay:{backgroundColor:"rgba(0, 0, 0, 0.5)",zIndex:400},content:{width:"calc(100dvw - 20px)",height:"fit-content",margin:"25px auto auto auto",backgroundColor:"#fff",inset:"10px",maxWidth:"500px",padding:"0",maxHeight:"90dvh",display:"flex",touchAction:"none",flexDirection:"column",userSelect:"text",WebkitUserSelect:"text"}},pn=()=>{const{modalContent:t,isModalOpen:o,setIsModalOpen:s}=q(),{emulator:n}=E();return e.jsx(ms,{appElement:document.getElementById("root")||void 0,closeTimeoutMS:400,isOpen:o,style:hn,onRequestClose:()=>s(!1),onAfterOpen:n==null?void 0:n.disableKeyboardInput,onAfterClose:n==null?void 0:n.enableKeyboardInput,aria:{labelledby:"modalHeader"},children:t})},de=250,xn=f.li`
  color: ${({theme:t})=>t.pureWhite};
  padding: 0 2px;

  ${({$disabled:t=!1,theme:o})=>t&&`color: ${o.disabledGray};
     pointer-events: none;
     cursor: default;
    `}
`,gn=f(je)`
  background-color: unset;
  border: none;
  color: inherit;
  cursor: pointer;
  height: 100%;
  padding: 0.5rem 1rem;
  text-align: inherit;
  width: 100%;

  &:hover {
    color: ${({theme:t})=>t.menuHover};
    background-color: ${({theme:t})=>t.menuHighlight};
  }
`,mn=f.span`
  margin-left: 0.5rem;
`,fn=f.ul`
  padding-left: 2rem;
`,De=({title:t,icon:o,children:s,$isExpanded:n=!1,$disabled:r=!1})=>{const[a,d]=p.useState(n?"auto":0);return p.useEffect(()=>{d(n?"auto":0)},[n]),e.jsxs(xn,{$disabled:r,children:[e.jsxs(gn,{disabled:r,onClick:()=>{d(a===0?"auto":0)},children:[o,e.jsx(mn,{children:t})]}),e.jsx(fs,{duration:350,easing:"ease-in-out",height:a,children:e.jsx(fn,{children:s})})]})},bn=f.li`
  cursor: pointer;
  color: ${({theme:t})=>t.pureWhite};
  list-style-type: none;
  padding: 0 2px;

  ${({$disabled:t=!1,theme:o})=>t&&`color: ${o.disabledGray};
     pointer-events: none;
     cursor: default;
    `}

  &:hover {
    color: ${({theme:t})=>t.menuHover};
    background-color: ${({theme:t})=>t.menuHighlight};
  }
`,jn=f(je)`
  background-color: unset;
  border: none;
  color: inherit;
  height: 100%;
  margin: 0;

  padding: 0.5rem
    ${({$withPadding:t=!1})=>t?"1rem":"0.5rem"};

  text-align: inherit;
  width: 100%;
  cursor: pointer;
`,Sn=f.span`
  margin-left: 0.5rem;
`,vn=f.a`
  display: block;
  text-decoration: none;
  color: unset;
  outline-offset: 0;

  padding: 0.5rem
    ${({$withPadding:t=!1})=>t?"1rem":"0.5rem"};
`,A=({title:t,icon:o,onClick:s=void 0,$link:n=void 0,$disabled:r=!1,$withPadding:a=!1})=>{const d=e.jsxs(e.Fragment,{children:[o,e.jsx(Sn,{children:t})]});return e.jsx(bn,{$disabled:r,children:n?e.jsx(vn,{href:n,$withPadding:a,target:"_blank",children:d}):e.jsx(jn,{disabled:r,onClick:s,$withPadding:a,children:d})})},yn=f.div`
  text-align: center;
`,xt=f.p`
  text-align: center;
  margin: 0;
`,Kt=f.h3`
  margin: 0;
`,Gt=f.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${({theme:t})=>t.pattensBlue};
  padding: 1rem 1rem;
`,Xt=f.div`
  padding: 1rem;
  overflow-y: auto;
`,Qt=f.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid ${({theme:t})=>t.pattensBlue};
  padding: 1rem 1rem;
`,gt=f(bs)`
  width: 25px;
  height: 25px;
`,X=({children:t,className:o})=>e.jsx(Xt,{className:o,children:t}),Q=({children:t})=>e.jsx(Qt,{"data-testid":"modal-footer:wrapper",children:t}),wn=f.button`
  width: 1em;
  height: 1em;
  padding: 1rem;
  margin: 0 0 0 auto;
  cursor: pointer;
  color: ${({theme:t})=>t.pureBlack};
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;

  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    opacity: 1;
  }

  &:hover {
    opacity: 0.75;
  }

  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
`,W=({title:t,showExitIndicator:o=!0,onClose:s})=>{const{setIsModalOpen:n}=q();return e.jsxs(Gt,{children:[e.jsx(Kt,{id:"modalHeader",children:t}),o&&e.jsx(wn,{"aria-label":"Close",onClick:()=>{n(!1),s==null||s()}})]})},Cn=()=>{const t=p.useCallback(async a=>{var g,b,j;const d={method:"GET"};if(!a)return;const c=await fetch(a.url,d),u=(j=(b=(g=c.headers.get("Content-Disposition"))==null?void 0:g.split(";").pop())==null?void 0:b.split("=").pop())==null?void 0:j.replace(/"/g,""),i=decodeURIComponent(a.url.pathname.split("/").pop()??"unknown_external.gba");if(!c.ok)throw new Error(`Received unexpected status code: ${c.status}`);const l=await c.blob();return new File([l],u??i)},[]),{data:o,isLoading:s,error:n,execute:r}=ye({fetchFn:t,clearDataOnLoad:!0});return{data:o,isLoading:s,error:n,execute:r}},kn=f.div`
  display: flex;
  align-items: center;
  gap: 5px;
`,$n=f.p`
  margin: 0;
  color: ${({theme:t})=>t.errorRed};
`,Se=({icon:t,text:o,className:s})=>e.jsxs(kn,{"data-testid":"error-with-icon",className:s,children:[t,e.jsx($n,{children:o})]}),Rn=f.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
  margin-bottom: 15px;
`,Fn=f.p`
  word-wrap: break-word;
  max-width: 100%;
`,Ln=t=>{const o=_();return e.jsx(Ze,{color:o.gbaThemeBlue,cssOverride:{margin:"0 auto"},...t})},In=({children:t,currentName:o,indicator:s,isLoading:n,loadingCopy:r})=>n?e.jsxs(Rn,{children:[e.jsxs(Fn,{children:[r,e.jsx("br",{}),o]}),s]}):t,Pn=f.a`
  word-break: break-all;
`,Tn=f.p`
  margin: 0;
`,Mn=({url:t})=>e.jsxs(ao,{children:[e.jsx(io,{expandIcon:e.jsx(js,{}),children:e.jsx(Tn,{children:"View Full URL"})}),e.jsx(lo,{children:e.jsx(Pn,{href:t.href,target:"_blank",rel:"noopener",children:t.href})})]}),Bn=({url:t,onLoadOrDismiss:o})=>{const s=_(),{setIsModalOpen:n}=q(),{emulator:r}=E(),[a,d]=p.useState(!1),[c,u]=p.useState(null),i=p.useId(),l=pt(),{data:h,isLoading:g,error:b,execute:j}=Cn();return p.useEffect(()=>{if(!g&&h&&c){const x=()=>{l((r==null?void 0:r.filePaths().gamePath)+"/"+h.name)&&(o("loaded"),n(!1))};r==null||r.uploadRom(h,x),u(null),d(!0)}},[o,l,c,r,h,g,n]),e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Upload Public Rom",onClose:()=>o("temporarily-dismissed")}),e.jsx(X,{children:e.jsxs(In,{isLoading:g,currentName:c,indicator:e.jsx(Ln,{}),loadingCopy:"Loading rom from url:",children:[!a&&e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"A public rom URL has been shared with you."}),e.jsx("p",{children:"You can load it using the upload button!"}),e.jsx("p",{children:"Make sure you trust the provider before uploading:"})]}),e.jsx(Mn,{url:t}),!!b&&e.jsx(Se,{icon:e.jsx(ge,{style:{color:s.errorRed}}),text:"Loading rom from URL has failed"}),a&&e.jsx(yn,{children:e.jsx("p",{children:"Upload complete!"})})]})}),e.jsxs(Q,{children:[e.jsx(M,{id:i,onClick:()=>{u(t.href),j({url:t})},type:"submit",variant:"contained",children:"Upload"}),e.jsx(M,{variant:"outlined",onClick:()=>{o(b?"skipped-error":"skipped"),n(!1)},children:"Don't ask again"})]})]})},Nn="romURL",En="hasLoadedPublicExternalRoms",Yt=()=>{var c;const[t,o]=N(En),[s]=N(ze),n=Ss(),a=new URLSearchParams((c=window==null?void 0:window.location)==null?void 0:c.search).get(Nn),d=!!a&&(t==null?void 0:t[a])!="loaded"&&(t==null?void 0:t[a])!="skipped"&&(t==null?void 0:t[a])!="temporarily-dismissed"&&!!(s!=null&&s.hasCompletedProductTourIntro);return n&&o(u=>Object.fromEntries(Object.entries(u??{}).map(([i,l])=>[i,l==="temporarily-dismissed"?"pending":l]))),{shouldShowPublicRomModal:d,setHasLoadedPublicRoms:o,romURL:a}},Un=()=>{const{setModalContent:t,isModalOpen:o,setIsModalOpen:s}=q(),{shouldShowPublicRomModal:n,setHasLoadedPublicRoms:r,romURL:a}=Yt();p.useEffect(()=>{if(n&&a&&!o)try{const d=new URL(a),c=u=>{r(i=>({...i,[a]:u}))};t(e.jsx(Bn,{url:d,onLoadOrDismiss:c})),s(!0)}catch{G.error("Invalid external rom URL"),r(d=>({...d,[a]:"error"}))}},[a,n,s,t,r,o])},zn=()=>{const{setIsModalOpen:t}=q(),[,o]=N(ze);return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"About"}),e.jsxs(X,{children:[e.jsx("p",{children:"Gbajs3 is a full featured Game Boy Advance emulator meant to operate online and offline in the browser."}),e.jsx("p",{children:"We currently support the mGBA core through the use of webassembly."}),e.jsx("p",{children:"Getting Started:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Using the ",e.jsx("i",{children:"Pre Game Actions"})," menu, upload a sav file if you have one available"]}),e.jsxs("li",{children:["Then, load a rom of your choice through the ",e.jsx("i",{children:"Upload Rom"})," or"," ",e.jsx("i",{children:"Load Local Rom"})," menu items"]}),e.jsx("li",{children:"Enjoy, your game will boot!"})]}),e.jsxs("p",{children:["See the"," ",e.jsx("a",{href:"https://github.com/thenick775/gbajs3/wiki",target:"_blank",children:"WIKI"})," ","and tour items for further information!"]})]}),e.jsxs(Q,{children:[e.jsx(M,{variant:"contained",onClick:()=>{o({}),t(!1)},children:"Take a tour"}),e.jsx(M,{variant:"outlined",onClick:()=>t(!1),children:"Close"})]})]})},Zt=Je`
  100% {
    stroke-dashoffset: 0;
  }
`,On=Je`
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
`,_n=Je`
  100% {
    box-shadow: inset 0 0 0 100vh var(--checkmark-fill-color);
  }
`,An=f.svg`
  position: absolute;
  width: 24px;
  height: 24px;

  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
  stroke: ${({theme:t})=>t.pureWhite};
  stroke-width: 5;
  stroke-miterlimit: 10;
  animation: ${_n} 0.2s ease-in-out 0.2s forwards,
    ${On} 0.12s ease-in-out 0.45s both;
`,qn=f.circle`
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 5;
  stroke-miterlimit: 10;
  stroke: ${({theme:t})=>t.checkMarkGreen};
  fill: none;
  animation: ${Zt} 0.3s cubic-bezier(0.65, 0, 0.45, 1) forwards;
`,Wn=f.path`
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: ${Zt} 0.15s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
`,Dn=f.span`
  ${({$isSuccessCheckVisible:t=!1})=>t&&"visibility: hidden;"}
`,we=({copy:t,msDuration:o=1100,onClick:s,showSuccess:n=!0,...r})=>{const a=p.useId(),[d,c]=p.useState(!1),u=!!n&&d;return Ye(()=>c(!1),u?o:null),e.jsxs(M,{onClick:i=>{c(!0),s==null||s(i)},variant:"contained",...r,children:[u&&e.jsxs(An,{role:"graphics-symbol","aria-labelledby":a,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 52 52",children:[e.jsx("title",{id:a,children:"Circle Check"}),e.jsx(qn,{cx:"26",cy:"26",r:"25",fill:"none"}),e.jsx(Wn,{fill:"none",d:"M14.1 27.2l7.1 7.2 16.7-16.8"})]}),e.jsx(Dn,{$isSuccessCheckVisible:u,children:t})]})},ce=Ne.forwardRef(({id:t,label:o,watcher:s,...n},r)=>e.jsx(Tt,{"data-testid":"managed-checkbox:label",id:t,control:e.jsx(ve,{ref:r,checked:!!s,...n}),label:o,style:{margin:0}})),Hn=f.ul`
  list-style: none;
  display: ${({$shouldHide:t=!1})=>t?"none":"flex"};
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  margin: 0;
  max-width: 100%;
`,Vn=f.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid ${({theme:t})=>t.pattensBlue};
  padding-bottom: 10px;
  width: 100%;
`,Kn=f(vs)`
  min-height: 40px;
  min-width: 40px;
`,St=f.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: ${({$fullWidth:t=!1})=>t?"100%":"auto"};

  @media ${({theme:t})=>t.isLargerThanPhone} {
    flex-direction: row;
  }
`,Gn=f.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: space-between;
`,Xn=f.p`
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  margin-top: ${({$withMargin:t=!1})=>t?"5px":"0"};
`,Qn=()=>{var m;const t=_(),o=ne(t.isLargerThanPhone),{setIsModalOpen:s}=q(),{emulator:n}=E(),[r,a]=p.useState(!1),d=p.useId(),c={desc:"",code:"",enable:!1},[u,i]=p.useMemo(()=>{const v=n==null?void 0:n.getCurrentCheatsFile(),C=new TextDecoder().decode(v);return[C,n==null?void 0:n.parseCheatsString(C)]},[n]),{register:l,control:h,handleSubmit:g,watch:b,setValue:j,formState:{errors:x,isSubmitSuccessful:y}}=me({defaultValues:{rawCheats:u,cheats:i!=null&&i.length?i:[c]}}),{fields:k,append:R,remove:$}=ys({control:h,name:"cheats"}),S=p.useCallback(()=>{const v=n==null?void 0:n.getCurrentCheatsFile(),C=new TextDecoder().decode(v),L=(n==null?void 0:n.parseCheatsString(C))??[];r?j("cheats",L):j("rawCheats",C)},[n,j,r]),w=[{content:e.jsx("p",{children:"Use this form to enter, add, and delete cheats."}),target:`#${CSS.escape(`${d}--cheats-form`)}`},{content:e.jsx("p",{children:"This form field is for the name of the cheat."}),target:`#${CSS.escape(`${d}--name`)}`},{content:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Put your cheat code into this field."}),e.jsx("p",{children:"Remember to separate multi-line cheats with the '+' character!"})]}),target:`#${CSS.escape(`${d}--cheat-code`)}`},{content:e.jsx("p",{children:"Use the checkbox to enable/disable a cheat."}),placement:"right",target:`#${CSS.escape(`${d}--enabled`)}`},{content:e.jsx("p",{children:"Use the trash button to remove a cheat entirely."}),placement:"right",target:`#${CSS.escape(`${d}--remove`)}`},{content:e.jsxs("p",{children:["Use the ",e.jsx("i",{children:"plus"})," button to add a new cheat."]}),target:`#${CSS.escape(`${d}--add-cheat`)}`},{content:e.jsxs("p",{children:["Use the ",e.jsx("i",{children:"Submit"})," button to save your cheats, and convert them to libretro format."]}),target:`#${CSS.escape(`${d}--submit-button`)}`},{content:e.jsx("p",{children:"Use this button to toggle between viewing parsed cheats or raw cheats in libretro file format."}),placement:"right",target:`#${CSS.escape(`${d}--toggle-raw-cheats`)}`}];return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Manage Cheats"}),e.jsx(X,{children:e.jsxs("form",{"aria-label":"Cheats Form",id:`${d}--cheats-form`,onSubmit:g(v=>{const C=r?new File([new Blob([v.rawCheats],{type:"text/plain"})],(n==null?void 0:n.getCurrentCheatsFileName())??"unknown.cheats"):n==null?void 0:n.parsedCheatsToFile(v.cheats);C&&(n==null||n.uploadCheats(C,()=>{n.autoLoadCheats(),S()}))}),children:[e.jsx(oe,{error:!!(x!=null&&x.rawCheats),label:"Raw Libretro Cheats",InputLabelProps:{shrink:!0},multiline:!0,fullWidth:!0,minRows:6,variant:"outlined",InputProps:{sx:{textarea:{whiteSpace:"pre",overflowX:"auto !important"}}},helperText:(m=x==null?void 0:x.rawCheats)==null?void 0:m.message,style:{display:r?"block":"none"},...l("rawCheats")}),e.jsx(Hn,{$shouldHide:r,children:k.map((v,C)=>{var P,T,Y,Z,J,ee,ae,te,D,ie;const L=he=>C===0?he:void 0;return e.jsxs(Vn,{children:[e.jsxs(St,{$fullWidth:!0,children:[e.jsx(oe,{id:L(`${d}--name`),label:"Name",error:!!((T=(P=x==null?void 0:x.cheats)==null?void 0:P[C])!=null&&T.desc),size:"small",autoComplete:"Name",style:o?{maxWidth:100}:void 0,helperText:(J=(Z=(Y=x==null?void 0:x.cheats)==null?void 0:Y[C])==null?void 0:Z.desc)==null?void 0:J.message,...l(`cheats.${C}.desc`,{required:{value:!0,message:"required"}})}),e.jsx(oe,{id:L(`${d}--cheat-code`),label:"Cheat Code",error:!!((ae=(ee=x==null?void 0:x.cheats)==null?void 0:ee[C])!=null&&ae.code),size:"small",autoComplete:"Code",helperText:(ie=(D=(te=x==null?void 0:x.cheats)==null?void 0:te[C])==null?void 0:D.code)==null?void 0:ie.message,...l(`cheats.${C}.code`,{required:{value:!0,message:"required"}})})]}),e.jsxs(St,{children:[e.jsx(ce,{id:L(`${d}--enabled`),label:"Enabled",watcher:b(`cheats.${C}.enable`),...l(`cheats.${C}.enable`)}),e.jsx(V,{"aria-label":"Delete",id:L(`${d}--remove`),sx:{padding:0,marginRight:"auto","&:hover":{borderRadius:"10px"},"&:focus":{borderRadius:"10px"},"& .MuiTouchRipple-root .MuiTouchRipple-child":{borderRadius:"10px"}},onClick:()=>$(C),children:e.jsx(Kn,{})})]})]},v.id)})}),e.jsxs(Gn,{children:[e.jsx(V,{"aria-label":"Create new cheat",id:`${d}--add-cheat`,sx:{padding:0,display:r?"none":"flex"},onClick:()=>R(c),children:e.jsx(gt,{})}),e.jsx(Xn,{$withMargin:r,children:"Join multi-line codes with '+'"})]})]})}),e.jsxs(Q,{children:[e.jsx(we,{copy:"Submit",form:`${d}--cheats-form`,id:`${d}--submit-button`,showSuccess:y,type:"submit"}),e.jsx(M,{id:`${d}--toggle-raw-cheats`,color:"info",variant:"contained",onClick:()=>a(v=>!v),children:r?"Parsed":"Raw"}),e.jsx(M,{variant:"outlined",onClick:()=>s(!1),children:"Close"})]}),e.jsx(be,{steps:w,completedProductTourStepName:"hasCompletedCheatsTour"})]})},Yn=f.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`,Zn=({id:t,onAfterSubmit:o})=>{const{emulator:s}=E(),{isRunning:n}=re(),{handleSubmit:r,setValue:a,control:d,formState:{errors:c}}=me(),u=s==null?void 0:s.defaultKeyBindings(),[i,l]=N(Nt),h=b=>{const j=Object.entries(b).filter(([,x])=>!!x).map(([,x])=>x);n&&(s==null||s.remapKeyBindings(j)),l(j),o()},g=i??u;return e.jsx(Yn,{"aria-label":"Key Bindings Form",id:t,onSubmit:r(h),children:g==null?void 0:g.map(b=>e.jsx(Lt,{control:d,name:b.gbaInput,defaultValue:b,rules:{validate:{noSpace:j=>j.key!==" "||"Space is reserved for accessibility requirements",noTab:j=>{var x;return((x=j.key)==null?void 0:x.toLowerCase())!=="tab"||"Tab is reserved for accessibility requirements"}}},render:({field:{value:j}})=>{var x;return e.jsx(oe,{variant:"outlined",label:j.gbaInput,value:j.key,onKeyDown:y=>{y.key.toLowerCase()!=="tab"&&(a(j.gbaInput,{gbaInput:j.gbaInput,key:y.key,location:y.location}),y.preventDefault())},error:!!c[b.gbaInput],helperText:(x=c==null?void 0:c[b.gbaInput])==null?void 0:x.message})}},`gba_input_${b.gbaInput.toLowerCase()}`))})},Jt=Ne.forwardRef(({id:t,label:o,watcher:s,...n},r)=>e.jsx(Tt,{"data-testid":"managed-switch:label",id:t,control:e.jsx(co,{ref:r,checked:!!s,...n}),label:o,style:{margin:0}})),Jn=f.form`
  display: flex;
  flex-direction: column;
`,er=({id:t,onAfterSubmit:o})=>{const[s,n]=N(qt),r=_(),a=ne(r.isLargerThanPhone),d=h=>h===void 0&&!a||!!h,{register:c,handleSubmit:u,watch:i}=me({values:s??{OpadAndButtons:d(void 0),SaveState:d(void 0),LoadState:d(void 0),QuickReload:d(void 0),SendSaveToServer:d(void 0),NotificationsEnabled:!0},resetOptions:{keepDirtyValues:!0}}),l=async h=>{n(g=>({...g,...h})),o()};return e.jsxs(Jn,{"aria-label":"Virtual Controls Form",id:t,onSubmit:u(l),children:[e.jsx(ce,{label:"Virtual D-pad/Buttons",watcher:i("OpadAndButtons"),...c("OpadAndButtons")}),e.jsx(ce,{label:"Display 'Save State' button",watcher:i("SaveState"),...c("SaveState")}),e.jsx(ce,{label:"Display 'Load State' button",watcher:i("LoadState"),...c("LoadState")}),e.jsx(ce,{label:"Display 'Quick Reload' button",watcher:i("QuickReload"),...c("QuickReload")}),e.jsx(ce,{label:"Display 'Save to Cartridge' button",watcher:i("SendSaveToServer"),...c("SendSaveToServer")}),e.jsx(Jt,{label:"Enable Notifications",watcher:i("NotificationsEnabled"),...c("NotificationsEnabled")})]})},Pe=f.li`
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 32px;
  gap: 10px;

  color: ${({theme:t})=>t.blueCharcoal};
  background-color: ${({theme:t})=>t.pureWhite};
  border: 1px solid rgba(0, 0, 0, 0.125);
`,tr=f.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;

  & > ${Pe}:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  & > ${Pe}:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  & > ${Pe}:not(:first-child) {
    border-top-width: 0;
  }
`,sr=f(Ee)`
  height: 100%;
  width: 20px;
`,or=f(It)`
  height: 100%;
  width: 20px;
`,nr=f(Ft)`
  height: 100%;
  width: 20px;
`,rr=f.button`
  padding: 0.5rem 0.5rem;
  width: 100%;
  color: ${({theme:t})=>t.blueCharcoal};
  background-color: ${({theme:t})=>t.pureWhite};
  border: none;
  text-align: left;
  font-size: 16px;
  height: 32px;

  &:hover {
    color: ${({theme:t})=>t.darkGrayBlue};
    background-color: ${({theme:t})=>t.aliceBlue1};
  }
`,ar=f.div`
  display: flex;
  gap: 10px;
`,ir=({condition:t,truthyIcon:o,falsyIcon:s,...n})=>e.jsx(V,{sx:{padding:0},...n,children:t?o:s}),lr=({name:t,loadProfile:o,onSubmit:s})=>{const[n,r]=p.useState(!1),[a,d]=p.useState(t),c=u=>{n&&u&&s(u),r(i=>!i)};return e.jsxs(ar,{children:[n?e.jsx(oe,{variant:"standard",sx:{width:"100%","& .MuiInputBase-input":{paddingLeft:"8px"}},error:!a,value:a,onChange:u=>d(u.target.value)}):e.jsx(rr,{onClick:o,children:t}),e.jsx(ir,{condition:n,truthyIcon:e.jsx(nr,{}),falsyIcon:e.jsx(or,{}),"aria-label":`${n?"Save":"Edit"} ${t}'s name`,type:"submit",onClick:()=>c(a)})]})},cr=({id:t})=>{var u;const[o,s]=N(Ko),{layouts:n,setLayouts:r}=ue(),a=()=>{s(i=>[...i??[],{id:ws(),name:`Profile-${((i==null?void 0:i.length)??0)+1}`,layouts:n,active:!0}])},d=(i,l)=>{s(h=>h==null?void 0:h.map(g=>g.id==i?{...g,name:l}:g))},c=i=>{s(l=>l==null?void 0:l.filter(h=>h.id!==i))};return e.jsxs(e.Fragment,{children:[e.jsxs(tr,{id:t,"aria-label":"Profiles List",children:[(u=o==null?void 0:o.map)==null?void 0:u.call(o,(i,l)=>e.jsxs(Pe,{children:[e.jsx(lr,{name:i.name,loadProfile:()=>r(i.layouts),onSubmit:h=>d(i.id,h)}),e.jsx(V,{"aria-label":`Delete ${i.name}`,sx:{padding:0},onClick:()=>c(i.id),children:e.jsx(sr,{})})]},`${i.name}_${l}_action_list_item`)),!(o!=null&&o.length)&&e.jsx("li",{children:e.jsx(xt,{children:"No control profiles"})})]}),e.jsx(V,{"aria-label":"Create New Profile",sx:{padding:0},onClick:()=>a(),children:e.jsx(gt,{})})]})},dr=f(uo)`
  border-bottom: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);

  & .MuiTabs-scrollButtons {
    width: fit-content;
  }
`,ur=f.div`
  padding: 24px;
`,Te=t=>({id:`control-tab-${t}`,"aria-controls":`tabpanel-${t}`}),He=({children:t,index:o,value:s})=>e.jsx("div",{role:"tabpanel",hidden:s!==o,id:`tabpanel-${o}`,"aria-labelledby":`tab-${o}`,children:s===o&&e.jsx(ur,{children:t})}),hr=({setFormId:t,virtualControlsFormId:o,controlProfilesFormId:s,keyBindingsFormId:n,resetPositionsButtonId:r,setIsSuccessfulSubmit:a})=>{const{clearLayouts:d}=ue(),[c,u]=p.useState(0),i=g=>{switch(g){case 0:return o;case 1:return s;case 2:return n;default:return o}},l=(g,b)=>{u(b),t(i(b)),a(!1)},h=()=>a(!0);return e.jsxs(e.Fragment,{children:[e.jsxs(dr,{variant:"scrollable",value:c,onChange:l,"aria-label":"Control tabs",allowScrollButtonsMobile:!0,children:[e.jsx(qe,{label:"Virtual Controls",...Te(0)}),e.jsx(qe,{label:"Profiles",...Te(1)}),e.jsx(qe,{label:"Key Bindings",...Te(2)})]}),e.jsxs(He,{value:c,index:0,children:[e.jsx(er,{id:o,onAfterSubmit:h}),e.jsx(M,{id:r,sx:{marginTop:"10px"},onClick:d,children:"Reset All Positions"})]}),e.jsx(He,{value:c,index:1,children:e.jsx(cr,{id:s})}),e.jsx(He,{value:c,index:2,children:e.jsx(Zn,{id:n,onAfterSubmit:h})})]})},pr=()=>{const{setIsModalOpen:t}=q(),o=p.useId(),[s,n]=p.useState(`${o}--virtual-controls-form`),[r,a]=p.useState(!1),d=[{content:e.jsx("p",{children:"Select which virtual controls you wish to enable in this form tab."}),target:`#${CSS.escape(`${o}--virtual-controls-form`)}`},{content:e.jsx("p",{children:"Use this button to reset the positions of the screen, control panel, and all virtual controls."}),target:`#${CSS.escape(`${o}--reset-positions-button`)}`},{content:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Use the tab panel to change which form you are seeing."}),e.jsxs("p",{children:["Select the ",e.jsx("i",{children:"KEY BINDINGS"})," tab above, then click next!"]})]}),placement:"right",target:`#${CSS.escape(Te(1).id)}`,disableBeacon:!0,disableOverlayClose:!0,hideCloseButton:!1,spotlightClicks:!0},{content:e.jsx("p",{children:"Remap keybindings by selecting a form field and typing your desired input."}),placement:"top-end",target:`#${CSS.escape(`${o}--key-bindings-form`)}`},{content:e.jsxs("p",{children:["Use the ",e.jsx("i",{children:"Save Changes"})," button to persist changes from the current form tab."]}),target:`#${CSS.escape(`${o}--save-changes-button`)}`}];return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Controls"}),e.jsx(X,{children:e.jsx(hr,{setFormId:n,virtualControlsFormId:`${o}--virtual-controls-form`,controlProfilesFormId:`${o}--control-profiles`,keyBindingsFormId:`${o}--key-bindings-form`,resetPositionsButtonId:`${o}--reset-positions-button`,setIsSuccessfulSubmit:a})}),e.jsxs(Q,{children:[s!==`${o}--control-profiles`&&e.jsx(we,{copy:"Save Changes",form:s,id:`${o}--save-changes-button`,type:"submit",showSuccess:r}),e.jsx(M,{variant:"outlined",onClick:()=>t(!1),children:"Close"})]}),e.jsx(be,{steps:d,completedProductTourStepName:"hasCompletedControlsTour"})]})},xr=()=>{const t=_(),{setIsModalOpen:o}=q(),{emulator:s}=E(),n=p.useId(),[r,a]=p.useState(!1),d=[{content:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Use this button to download your current save file."}),e.jsx("p",{children:"Remember to save in game before downloading!"})]}),placement:"right",target:`#${CSS.escape(n)}`}];return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Download Save"}),e.jsx(X,{children:r?e.jsx(Se,{icon:e.jsx(ge,{style:{color:t.errorRed}}),text:"Load a rom to download its save file"}):e.jsx(xt,{children:"Remember to save in game before downloading your save file!"})}),e.jsxs(Q,{children:[e.jsx(M,{id:n,variant:"contained",onClick:()=>{const c=s==null?void 0:s.getCurrentSave(),u=s==null?void 0:s.getCurrentSaveName();if(c&&u){const i=new Blob([c],{type:"data:application/octet-stream"}),l=document.createElement("a");l.download=u,l.href=URL.createObjectURL(i),l.click(),l.remove()}else a(!0)},children:"Download"}),e.jsx(M,{variant:"outlined",onClick:()=>o(!1),children:"Close"})]}),e.jsx(be,{steps:d,completedProductTourStepName:"hasCompletedDownloadSaveTour"})]})},es=t=>e.jsx(et,{"data-testid":"action-box:minus",className:"minus",fontSize:"inherit",style:{width:14,height:14},...t,children:e.jsx("path",{d:"M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z"})}),ts=t=>e.jsx(et,{"data-testid":"action-box:plus",className:"plus",fontSize:"inherit",style:{width:14,height:14},...t,children:e.jsx("path",{d:"M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z"})}),gr=t=>e.jsx(et,{"data-testid":"action-box:close",className:"close",fontSize:"inherit",style:{width:14,height:14},...t,children:e.jsx("path",{d:"M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z"})}),mr=f.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  > p {
    margin: 0;
    word-wrap: break-word;
    max-width: 100%;
  }
`,fr=f.div`
  display: flex;
  gap: 15px;
`,br=ho(t=>e.jsx(po,{...t}))(({theme:t})=>({marginTop:5,[`& .${We.iconContainer}`]:{"& .close":{opacity:.3}},[`& .${We.groupTransition}`]:{marginLeft:15,paddingLeft:10,borderLeft:`1px dashed ${xo(t.palette.text.primary,.4)}`},[`& .${We.content}`]:{width:"auto",alignItems:"baseline"}})),jr=({id:t,allFiles:o,deleteFile:s,downloadFile:n})=>{if(!o)return null;const r=a=>{const d=a.path.split("/").pop(),c=e.jsxs(mr,{children:[e.jsx("p",{children:d}),e.jsxs(fr,{children:[e.jsx(V,{"aria-label":`Download ${d}`,sx:{padding:0,margin:0},onClick:()=>n(a.path),children:e.jsx(Pt,{})}),e.jsx(V,{"aria-label":`Delete ${d}`,sx:{padding:0},onClick:()=>s(a.path),children:e.jsx(Ee,{})})]})]});return e.jsx(br,{itemId:a.path,label:a.isDir?d:c,children:a.isDir&&a.children?a.children.map(u=>r(u)):null},a.path)};return e.jsx(go,{id:t,"aria-label":"File System",defaultExpandedItems:[o.path],slots:{collapseIcon:es,endIcon:gr,expandIcon:ts},sx:{height:"fit-content"},children:r(o)})},ss=kt`
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
`,Sr=f.form`
  display: flex;
  flex-direction: column;

  /* copying styles from the treeitem to match file system display */
  & p {
    ${ss}
  }
`,vr=f.p`
  margin: 0;
  ${ss}
`,yr=f(je)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: unset;
  border: none;
  color: inherit;
  margin: 0;
`,wr=({id:t})=>{const[o]=N(nt),{addCallbacksAndSaveSettings:s}=Ht(),[n,r]=p.useState(!1),{register:a,handleSubmit:d,watch:c}=me({values:o,resetOptions:{keepDirtyValues:!0}});return e.jsxs("div",{id:t,children:[e.jsxs(yr,{onClick:()=>r(u=>!u),children:[e.jsx(vr,{children:"Options"}),n?e.jsx(es,{}):e.jsx(ts,{})]}),e.jsx(mo,{in:n,children:e.jsxs(Sr,{"aria-label":"File System Options Form",onSubmit:d(s),children:[e.jsx(ce,{label:"Save to cartridge on in-game save",watcher:c("saveFileSystemOnInGameSave"),...a("saveFileSystemOnInGameSave")}),e.jsx(Jt,{label:"Enable Notifications",watcher:c("notificationsEnabled"),...a("notificationsEnabled")}),e.jsx(M,{sx:{width:"fit-content"},type:"submit",children:"Save Options"})]})})]})},Cr=f(X)`
  display: flex;
  flex-direction: column;
  gap: 1em;
`,kr=()=>{const{setIsModalOpen:t}=q(),{emulator:o}=E(),[s,n]=p.useState(),r=p.useId(),a=p.useCallback(i=>{o==null||o.deleteFile(i),n(o==null?void 0:o.listAllFiles())},[o]),d=i=>{const l=i.split("/").pop(),h=o==null?void 0:o.getFile(i);if(h&&l){const g=new Blob([h],{type:"data:application/octet-stream"}),b=document.createElement("a");b.download=l,b.href=URL.createObjectURL(g),b.click(),b.remove()}},c=s??(o==null?void 0:o.listAllFiles()),u=[{content:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Use this area to view your current file tree, download files, and delete files from the tree."}),e.jsxs("p",{children:["Use the ",e.jsx("i",{children:"plus"})," and ",e.jsx("i",{children:"minus"})," icons to open and close file tree branches!"]})]}),target:`#${CSS.escape(`${r}--emulator-file-system`)}`},{content:e.jsxs("p",{children:["Click the ",e.jsx("i",{children:"Options"})," label to adjust and save settings related to the file system."]}),target:`#${CSS.escape(`${r}--file-system-options`)}`},{content:e.jsxs("p",{children:["Use the ",e.jsx("i",{children:"SAVE FILE SYSTEM"})," button to persist all of your files to your device!"]}),target:`#${CSS.escape(`${r}--save-file-system-button`)}`}];return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"File System"}),e.jsxs(Cr,{children:[e.jsx(jr,{id:`${r}--emulator-file-system`,allFiles:c,deleteFile:a,downloadFile:d}),e.jsx(wr,{id:`${r}--file-system-options`})]}),e.jsxs(Q,{children:[e.jsx(we,{copy:"Save File System",id:`${r}--save-file-system-button`,onClick:o==null?void 0:o.fsSync}),e.jsx(M,{variant:"outlined",onClick:()=>t(!1),children:"Close"})]}),e.jsx(be,{steps:u,completedProductTourStepName:"hasCompletedFileSystemTour"})]})},$r=f.button`
  padding: 0.5rem 0.5rem;
  width: 100%;
  color: ${({theme:t})=>t.blueCharcoal};
  background-color: ${({theme:t})=>t.pureWhite};
  border: none;
  text-align: left;

  &:hover {
    color: ${({theme:t})=>t.darkGrayBlue};
    background-color: ${({theme:t})=>t.aliceBlue1};
  }
`,Me=f.li`
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 32px;
  gap: 10px;

  color: ${({theme:t})=>t.blueCharcoal};
  background-color: ${({theme:t})=>t.pureWhite};
  border: 1px solid rgba(0, 0, 0, 0.125);
`,Rr=f.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;

  & > ${Me}:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  & > ${Me}:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  & > ${Me}:not(:first-child) {
    border-top-width: 0;
  }
`,Fr=f(Ee)`
  height: 100%;
  width: 20px;
`,Lr=f.form`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${({theme:t})=>t.pattensBlue};
  margin-bottom: 16px;
  padding-bottom: 16px;
`,Ir=()=>{var $,S,w;const t=_(),{setIsModalOpen:o}=q(),{emulator:s}=E(),[n,r]=p.useState(),[a,d]=p.useState(null),[c,u]=N(At,0),i=p.useId(),{register:l,handleSubmit:h,setValue:g,formState:{errors:b,isSubmitSuccessful:j}}=me({defaultValues:{saveStateSlot:c}}),x=p.useCallback(()=>{var v;const m=(v=s==null?void 0:s.listSaveStates())==null?void 0:v.filter(C=>C!=="."&&C!=="..");r(m)},[s]);p.useEffect(()=>{g("saveStateSlot",c)},[c,g]);const y=async m=>{u(m.saveStateSlot)},k=n??(($=s==null?void 0:s.listSaveStates())==null?void 0:$.filter(m=>m!=="."&&m!=="..")),R=[{content:e.jsx("p",{children:"Use this input and button to manually update the current save state slot in use."}),placementBeacon:"bottom-end",target:`#${CSS.escape(`${i}--save-state-slot-form`)}`},{content:e.jsx("p",{children:"Tap a row to load a save state, or use the trash can icon to delete a save state."}),placementBeacon:"bottom-end",target:`#${CSS.escape(`${i}--save-state-list`)}`},{content:e.jsxs("p",{children:["Use the ",e.jsx("i",{children:"plus"})," button to add a new save state. This will automatically increase the current save state number!"]}),placementBeacon:"bottom-end",target:`#${CSS.escape(`${i}--add-state-button`)}`}];return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Manage Save States"}),e.jsxs(X,{children:[e.jsxs(Lr,{id:`${i}--save-state-slot-form`,onSubmit:h(y),children:[e.jsx(oe,{label:"Current Save State Slot",type:"number",InputLabelProps:{shrink:!0},size:"small",error:!!(b!=null&&b.saveStateSlot),helperText:(S=b==null?void 0:b.saveStateSlot)==null?void 0:S.message,...l("saveStateSlot",{required:{value:!0,message:"Slot is required"},min:{value:0,message:"Slot must be >= 0"},valueAsNumber:!0})}),e.jsx(we,{copy:"Update Slot",showSuccess:j,size:"small",type:"submit",sx:{maxHeight:"40px"}})]}),e.jsxs(Rr,{id:`${i}--save-state-list`,children:[(w=k==null?void 0:k.map)==null?void 0:w.call(k,(m,v)=>e.jsxs(Me,{children:[e.jsx($r,{onClick:()=>{const C=m.split(".").pop(),L=C==null?void 0:C.replace("ss","");if(L){const P=parseInt(L);(s==null?void 0:s.loadSaveState(P))?(u(P),d(null)):d("Failed to load save state")}},children:m}),e.jsx(V,{"aria-label":`Delete ${m}`,sx:{padding:0},onClick:()=>{const C=m.split(".").pop(),L=C==null?void 0:C.replace("ss","");if(L){const P=parseInt(L);s==null||s.deleteSaveState(P),x()}},children:e.jsx(Fr,{})})]},`${m}_${v}`)),!(k!=null&&k.length)&&e.jsx("li",{children:e.jsx(xt,{children:"No save states"})})]}),e.jsx(V,{id:`${i}--add-state-button`,"aria-label":"Create new save state",sx:{padding:0},onClick:()=>{(s==null?void 0:s.createSaveState(c+1))?(x(),u(v=>v+1),d(null)):d("Failed to create save state")},children:e.jsx(gt,{})}),a&&e.jsx(Se,{icon:e.jsx(ge,{style:{color:t.errorRed}}),text:a})]}),e.jsx(Q,{children:e.jsx(M,{variant:"outlined",onClick:()=>o(!1),children:"Close"})}),e.jsx(be,{steps:R,completedProductTourStepName:"hasCompletedSaveStatesTour"})]})},Pr=()=>{const[t,o]=p.useState(0),s=p.useCallback(c=>c?new Promise((u,i)=>{console.log("Reflashing Cartridge...");let l=c.romFile.size;const h=new FileReader;h.onload=g=>{if(g.target&&g.target.result){let b=g.target.result;typeof b=="string"&&(b=new TextEncoder().encode(b));let j=new Uint8Array(b);const x=new XMLHttpRequest;x.open("POST",`${c.esp32IP}/upload_rom_file?cartSize=${l}`,!0),x.upload.onprogress=function(y){if(y.lengthComputable){const k=y.loaded/y.total*67;o(k)}},x.onload=()=>{if(x.status>=200&&x.status<300){const y=new XMLHttpRequest;y.open("POST",`${c.esp32IP}/verify_rom_file?cartSize=${l}`,!0),y.upload.onprogress=function(k){if(k.lengthComputable){const R=67+k.loaded/k.total*33;o(R)}},y.onload=()=>{y.status>=200&&y.status<300?u(!0):i("Rom on cartridge has errors")},y.onerror=()=>i("Failed to upload rom for verification"),y.send(j)}else i("Failed to upload rom to cartridge")},x.onerror=()=>i("Failed to upload rom to cartridge"),x.send(j)}},h.readAsArrayBuffer(c.romFile)}):Promise.reject(new Error("fetchProps is required")),[]),{data:n,isLoading:r,error:a,execute:d}=ye({fetchFn:s,clearDataOnLoad:!0});return{data:n,isLoading:r,error:a,execute:d,progress:t}},Tr=f.div`
  cursor: pointer;
  border-color: ${({theme:t})=>t.blackRussian};
  background-color: ${({$isDragActive:t=!1,theme:o})=>t?o.arcticAirBlue:o.aliceBlue2};
  border-width: 1px;
  border-style: dashed;
  padding: 0.5rem;
  text-align: center;
`,Mr=f(Cs)`
  height: 60px;
  width: auto;
`,Br=f.div`
  padding-top: 3px;
`,Nr=f.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  max-width: 100%;
  padding: 10px 5px 5px 5px;

  > p {
    margin: 0;
  }
`,Er=f.li`
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;

  > p {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`,Ur=f.div`
  display: flex;
  gap: 15px;
`,zr=({fileNames:t,onDeleteFile:o})=>e.jsxs(Nr,{children:[e.jsxs("p",{children:["File",t.length>1&&"s"," to upload:"]}),t.map((s,n)=>e.jsxs(Er,{children:[e.jsx("p",{children:s}),e.jsx(Ur,{children:e.jsx(V,{"aria-label":`Delete ${s}`,sx:{padding:0},onClick:()=>o(s),children:e.jsx(Ee,{})})})]},`${s}_${n}`))]}),Or=(t,o)=>{const s=`.${t.name.split(".").pop()}`;return o.some(n=>typeof n=="string"?n===s:!!n.regex.exec(s))},Ve=t=>typeof t=="string"?t:t.displayText,_r=(t,o)=>{if(!t.length)return;const s=o?"At least one":"One";let n=`${s} `+t.slice(0,-1).map(Ve).join(", ")+`, or ${Ve(t.slice(-1)[0])} file is required`;return t.length==1&&(n=`${s} ${Ve(t[0])} file is required`),r=>!(r instanceof File)||r&&Or(r,t)?null:{message:n,code:$s.FileInvalidType}},Ar=({ariaLabel:t,children:o,error:s,hideAcceptedFiles:n,hideErrors:r,id:a,multiple:d=!1,name:c,onDrop:u,validFileExtensions:i})=>{const l=_(),[h,g]=p.useState([]),{getRootProps:b,getInputProps:j,isDragActive:x,fileRejections:y}=ks({multiple:d,onDrop:S=>{g(S),u(S)},validator:_r(i,d)}),k=s?[s]:y.length&&h.length?["Some files were rejected"]:[...new Set(y.flatMap(S=>S.errors).map(S=>S.message))],R=S=>{const w=h.filter(m=>m.name!==S);g(w),u(w)},$=h.map(S=>S.name);return e.jsxs(e.Fragment,{children:[e.jsxs(Tr,{...b({id:a,$isDragActive:x,"aria-label":t}),children:[e.jsx("input",{"data-testid":"hidden-file-input",...j({name:c})}),e.jsx(Mr,{}),o]}),!!$.length&&!n&&e.jsx(zr,{fileNames:$,onDeleteFile:R}),!!k.length&&!r&&e.jsx(Br,{children:k.map(S=>e.jsx(Se,{icon:e.jsx(ge,{style:{color:l.errorRed}}),text:S},S))})]})},qr=f.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
  margin-bottom: 15px;
`,Wr=f.p`
  word-wrap: break-word;
  max-width: 100%;
`,Dr=[".gba",".gbc",".gb",".zip",".7z"],Hr=f.div`
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  height: 24px;
  width: 100%;
  margin-top: 16px;
  overflow: hidden;

  &::after {
    content: '';
    background-color: ${t=>t.theme.gbaThemeBlue};
    height: 100%;
    width: ${t=>t.progress}%;
    position: absolute;
    left: 0;
    top: 0;
    transition: width 0.2s ease-in-out;
  }
`,Vr=({isLoading:t,children:o,indicator:s,progress:n})=>t?e.jsxs(qr,{children:[e.jsx(Wr,{children:n<4?"Erasing Sectors...":n>67?"Verifying ROM...":"Flashing new ROM to cartridge..."}),s,e.jsx(Hr,{progress:n,children:e.jsxs("span",{style:{position:"relative",width:"100%",textAlign:"center",zIndex:600},children:[Math.round(n),"%"]})})]}):o,Kr=({esp32IP:t})=>{const o=_(),{setIsModalOpen:s}=q(),{handleSubmit:n,setValue:r,reset:a,control:d}=me(),{data:c,isLoading:u,error:i,execute:l,progress:h}=Pr(),g=p.useId(),b=p.useCallback(x=>{a(),r("romFile",x[0],{shouldValidate:!0})},[a,r]),j=async({romFile:x})=>{if(console.log(c),x){await l({romFile:x,esp32IP:t});return}};return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Upload Rom"}),e.jsx(X,{children:e.jsxs(Vr,{isLoading:u,indicator:e.jsx(Ze,{color:o.gbaThemeBlue,cssOverride:{margin:"0 auto"}}),progress:h,children:[!!i&&e.jsx(Se,{icon:e.jsx(ge,{style:{color:o.errorRed}}),text:"Writing rom has failed"}),e.jsx("form",{id:g,"aria-label":"Upload Rom Form",onSubmit:n(j),children:e.jsx(Lt,{control:d,name:"romFile",rules:{validate:x=>!!x||"A rom file is required"},render:({field:{name:x},fieldState:{error:y}})=>e.jsx(Ar,{ariaLabel:"Upload Rom",id:`${g}--drag-and-drop`,onDrop:b,name:x,validFileExtensions:Dr,hideErrors:!!y,children:e.jsx("p",{children:"Drag and drop a rom or zipped rom file here, or click to upload a file"})})})})]})}),e.jsxs(Q,{children:[e.jsx(M,{form:g,type:"submit",variant:"contained",children:"Reflash Repro"}),e.jsx(M,{variant:"outlined",onClick:()=>s(!1),children:"Close"})]})]})},Gr=()=>{const[t,o]=p.useState(0),s=p.useCallback(c=>c?new Promise((u,i)=>{const l=new XMLHttpRequest;l.open("GET",c.url,!0),l.responseType="arraybuffer",l.overrideMimeType("text/plain; charset=x-user-defined"),l.onprogress=function(h){if(h.lengthComputable){const g=h.loaded/h.total*100;o(g)}},l.onload=()=>{var h,g;if(l.status>=200&&l.status<300){const b=l.getResponseHeader("Content-Disposition"),j=(g=(h=b==null?void 0:b.split(";").pop())==null?void 0:h.split("=").pop())==null?void 0:g.replace(/"/g,""),x=decodeURIComponent(c.url.pathname.split("/").pop()??"unknown_external.gba"),y=new File([l.response],c.fullName??j??x);if(c.patchFile!=null&&c.patchFile!=""){console.log("applying bps patch to file: "+c.patchFile),c.patchFile.startsWith(".")&&(c.patchFile=se+c.patchFile.substring(1));const k=new XMLHttpRequest;k.open("GET",c.patchFile,!0),k.responseType="arraybuffer",k.overrideMimeType("text/plain; charset=x-user-defined"),k.onload=()=>{const R=new Uint8Array(k.response),{instructions:$,checksum:S}=Rs(R);console.log(S);const w=new Uint8Array(l.response),m=Fs($,w),v=new File([m],c.fullName??j??x);u(v)},k.onerror=()=>{console.error("Request for patch file failed"),i(new Error("Network error occurred: Patch File"))},k.send(null)}else console.log("resolved file"),u(y)}else console.error("Request failed2"),i(new Error(`Received unexpected status code: ${l.status}`))},l.onerror=()=>{console.error("Request failed"),i(new Error("Network error occurred"))},l.send(null)}):Promise.reject(new Error("fetchProps is required")),[]),{data:n,isLoading:r,error:a,execute:d}=ye({fetchFn:s,clearDataOnLoad:!0});return{data:n,isLoading:r,error:a,execute:d,progress:t}},Xr=()=>{const[t,o]=p.useState(0),s=p.useCallback(c=>c?new Promise((u,i)=>{console.log(c.fullName);const l=new XMLHttpRequest;l.open("GET",c.url,!0),l.responseType="arraybuffer",l.overrideMimeType("text/plain; charset=x-user-defined"),l.onprogress=function(h){if(h.lengthComputable){const g=h.loaded/h.total*100;o(g)}},l.onload=()=>{var h,g;if(l.status>=200&&l.status<300){const b=l.getResponseHeader("Content-Disposition"),j=(g=(h=b==null?void 0:b.split(";").pop())==null?void 0:h.split("=").pop())==null?void 0:g.replace(/"/g,""),x=decodeURIComponent(c.url.pathname.split("/").pop()??"unknown_external.sav"),y=new File([l.response],c.fullName??j??x);u(y)}else i(new Error(`Received unexpected status code: ${l.status}`))},l.onerror=()=>{console.error("Request failed"),i(new Error("Network error occurred"))},l.send(null)}):Promise.reject(new Error("fetchProps is required")),[]),{data:n,isLoading:r,error:a,execute:d}=ye({fetchFn:s,clearDataOnLoad:!0});return{data:n,isLoading:r,error:a,execute:d,progress:t}},vt=({gameData:t,checksum1000String:o,selectedSave:s,setSelectedSave:n,saveName:r})=>{var u;const{emulator:a}=E(),d=i=>{n(i)},c=((u=a==null?void 0:a.listSaves)==null?void 0:u.call(a).filter(i=>i.includes(t.cartID+"_"+o)))||[];return p.useEffect(()=>{for(const i of c)r===i&&n(i)},[]),e.jsx(e.Fragment,{children:e.jsx(tt,{children:e.jsxs(st,{children:[e.jsx(Mt,{children:e.jsxs(U,{children:[e.jsx(I,{children:"Select"}),e.jsx(I,{children:"Save"}),e.jsx(I,{children:"Last Saved"})]})}),e.jsxs(ot,{children:[e.jsxs(U,{children:[e.jsx(I,{children:e.jsx(ve,{checked:s==="Cartridge Save",onChange:()=>d("Cartridge Save")})}),e.jsx(I,{children:"Cartridge Save"}),e.jsx(I,{children:"-"})]},"cartridge-save"),c.length>0?c.map((i,l)=>{var h;return e.jsxs(U,{sx:{borderBottom:l===c.length-1?"none":void 0},children:[e.jsx(I,{sx:{borderBottom:l===c.length-1?"none":void 0},children:e.jsx(ve,{checked:s===i,onChange:()=>d(i)})}),e.jsx(I,{sx:{borderBottom:l===c.length-1?"none":void 0},children:i}),e.jsx(I,{sx:{borderBottom:l===c.length-1?"none":void 0},children:(h=a==null?void 0:a.getStatSaves)==null?void 0:h.call(a,i).mtime.toLocaleString()})]},l)}):e.jsx(U,{children:e.jsx(I,{colSpan:3,children:"None"})})]})]})})})},Qe=({gameData:t,checksum1000String:o,selectedGame:s,setSelectedGame:n,romName:r})=>{var u,i;const{emulator:a}=E(),d=l=>{n(l)};let c;return t==null?c=((u=a==null?void 0:a.listRoms)==null?void 0:u.call(a).filter(l=>l!=="."&&l!==".."))||[]:c=((i=a==null?void 0:a.listRoms)==null?void 0:i.call(a).filter(l=>l.includes(t.cartID+"_"+o)))||[],p.useEffect(()=>{for(const l of c)r===l&&n(l)},[]),e.jsx(e.Fragment,{children:e.jsx(tt,{children:e.jsxs(st,{children:[e.jsx(Mt,{children:e.jsxs(U,{children:[e.jsx(I,{children:"Select"}),e.jsx(I,{children:"Rom File"}),e.jsx(I,{children:"Created"})]})}),e.jsxs(ot,{children:[e.jsxs(U,{children:[e.jsx(I,{children:e.jsx(ve,{checked:s==="Cartridge Rom",onChange:()=>d("Cartridge Rom")})}),e.jsx(I,{children:"Cartridge Rom"}),e.jsx(I,{children:"-"})]},"cartridge-game"),c.length>0?c.map((l,h)=>{var g;return e.jsxs(U,{sx:{borderBottom:h===c.length-1?"none":void 0},children:[e.jsx(I,{sx:{borderBottom:h===c.length-1?"none":void 0},children:e.jsx(ve,{checked:s===l,onChange:()=>d(l)})}),e.jsx(I,{sx:{borderBottom:h===c.length-1?"none":void 0},children:l}),e.jsx(I,{sx:{borderBottom:h===c.length-1?"none":void 0},children:(g=a==null?void 0:a.getStatRoms)==null?void 0:g.call(a,l).mtime.toLocaleString()})]},h)}):e.jsx(U,{children:e.jsx(I,{colSpan:3,children:"None"})})]})]})})})},Qr=f.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100dvw;
  max-width: fill-available;
  max-width: stretch;
  max-width: -webkit-fill-available;
  max-width: -moz-available;
`,Be=f.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
  margin-bottom: 15px;
`,Ke=f.img`
  max-width: 75%;
  height: auto;
  margin-bottom: 15px;
  border-radius: 12px;
  border: 1px solid black;
`,Yr=f.div`
display: flex;
gap: 10px;
width: 100%;
flex-direction: column;
`,yt=f.p`
  word-wrap: break-word;
  max-width: 100%;
`,Zr=f.div`
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  height: 24px;
  width: 100%;
  margin-top: 16px;
  overflow: hidden;

  &::after {
    content: '';
    background-color: ${t=>t.theme.gbaThemeBlue};
    height: 100%;
    width: ${t=>t.progress}%;
    position: absolute;
    left: 0;
    top: 0;
    transition: width 0.2s ease-in-out;
  }
`,Jr=({isLoading:t,isExternalRomLoading:o,children:s,indicator:n,progress:r})=>t?e.jsxs(Be,{children:[o&&e.jsx(yt,{children:"Dumping Rom from cartridge..."}),!o&&e.jsx(yt,{children:"Dumping Save from cartridge..."}),n,e.jsx(Zr,{progress:r,children:e.jsxs("span",{style:{position:"relative",width:"100%",textAlign:"center",zIndex:600},children:[Math.round(r),"%"]})})]}):s,wt=({additionalData:t,setAdditionalData:o,gameData:s,setGameData:n,esp32IP:r,setEsp32IP:a,setIsSideMenuExpanded:d})=>{const c=_(),{setIsModalOpen:u}=q(),{emulator:i}=E(),{data:l,isLoading:h,error:g,execute:b,progress:j}=Gr(),{data:x,execute:y}=Xr(),k=pt(),[R,$]=p.useState(!1),[S,w]=p.useState(!1),[m,v]=p.useState(!1),C=!h&&!!l,[L,P]=p.useState(null),[T,Y]=p.useState("Cartridge Save"),[Z,J]=p.useState("Cartridge Rom"),ee=ne(c.isLargerThanPhone),ae=F=>{const{name:z,value:O}=F.target;o(le=>({...le,[z]:O}))};p.useEffect(()=>{if(C){const F=()=>{k((i==null?void 0:i.filePaths().gamePath)+"/"+l.name)&&(u(!1),ee||d(!1))};i==null||i.uploadRom(l,F)}},[C,l,i,u,k]);const te=async()=>{try{v(!1),$(!0);const[F,z,O,le]=await an([r]);v(!le),n(F),o(z),P(O),$(!1)}catch(F){console.error("Error fetching game info:",F)}};p.useEffect(()=>{x!=null&&(i==null||i.uploadSaveOrSaveState(x))},[x,i]),p.useEffect(()=>{R||te()},[]),p.useEffect(()=>{if(m&&!R){const F=setInterval(()=>{m&&!R&&te()},5e3);return()=>clearInterval(F)}},[m]);const D=()=>s.is_gba?t?t.fullName+"_"+s.cartID+"_"+L:s.romName+"_"+s.cartID+"_"+L:t?t.fullName+"_"+s.romName+"_"+s.checksumStr:s.romName+"_"+s.checksumStr,ie=async()=>{w(!0),console.log("Using save: "+T),console.log("Using save: "+T);let F=D()+".sav";T=="Cartridge Save"&&(s.is_gba?await ke(t.saveType,F):s.sramSize&&await B(F)),await rn(300),console.log("save loaded"),await Ce(),w(!1)},he=async F=>{var O;let z=(O=i==null?void 0:i.listRoms)==null?void 0:O.call(i);return console.log(z),z&&z.includes(F)?(console.log("rom exists locally"),k((i==null?void 0:i.filePaths().gamePath)+"/"+F),u(!1),w(!1),ee||d(!1),!0):!1},Ce=async()=>{if(w(!0),Z!="Cartridge Rom")await he(Z)||console.log("Unable to load local rom");else if(s.is_gba){let F=D()+".gba",z=t.cartSize,O=`${r}/get_current_game.gba?cartSize=${z}&saveType=4`;await b({url:new URL(O),fullName:F,patchFile:t.patchFile})}else{let F=D()+".gb",z=`${r}/get_current_game.gb`;await b({url:new URL(z),fullName:F,patchFile:null})}w(!1)},ke=async(F,z)=>{try{console.log(F);var O=ut(F);if(O==-1){console.log("Invalid Save Type");return}console.log(O);var le=`${r}/get_current_save?saveType=${O}`;await y({url:new URL(le),fullName:z})}catch($e){console.error("Error fetching save:",$e)}finally{}},B=async F=>{try{var z=`${r}/get_current_save`;await y({url:new URL(z),fullName:F})}catch(O){console.error("Error fetching save:",O)}finally{}},H=({title:F})=>{const[z,O]=p.useState("");return p.useEffect(()=>{const le=setInterval(()=>{O($e=>$e==="..."?"":$e+".")},500);return()=>clearInterval(le)},[]),e.jsx(W,{title:`${F}${z}`})};return e.jsxs(e.Fragment,{children:[m?e.jsx(W,{title:"Connection to cartridge reader failed!"}):e.jsx(e.Fragment,{children:s&&t?e.jsx(W,{title:t.fullName}):s&&!t?e.jsx(W,{title:s.romName==""||s.romName=="Error"?"Error Reading Cartridge":s.romName}):!s&&t?e.jsx(W,{title:t.fullName}):e.jsx(H,{title:"Connecting to cartridge reader"})}),e.jsx(X,{children:e.jsxs(Jr,{isLoading:S,isExternalRomLoading:h,indicator:e.jsx(Ze,{color:c.gbaThemeBlue,cssOverride:{margin:"0 auto"}}),progress:j,children:[!!g&&e.jsx(Se,{icon:e.jsx(ge,{style:{color:c.errorRed}}),text:"Loading rom from URL has failed"}),e.jsxs(e.Fragment,{children:[s&&t&&e.jsxs(e.Fragment,{children:[e.jsx(Be,{children:e.jsx(Ke,{id:"cover-image",src:ln(s,t),alt:`${t.fullName} Cover`})}),e.jsx(tt,{id:"game-info",children:e.jsx(st,{children:e.jsxs(ot,{children:[e.jsxs(U,{children:[e.jsx(I,{children:"Full Name:"}),e.jsx(I,{children:t.fullName})]}),e.jsxs(U,{children:[e.jsx(I,{children:"ROM Name:"}),e.jsx(I,{children:s.romName})]}),e.jsxs(U,{children:[e.jsx(I,{children:"Cart Size:"}),e.jsx(I,{children:e.jsxs(Xe,{name:"cartSize",value:t.cartSize,onChange:ae,children:[e.jsxs(Ie,{value:t.cartSize,children:[(t.cartSize/1024/1024).toFixed(2),"MB"]},(t.cartSize/1024/1024).toFixed(2)),[1,2,4,8,16,32,64].map(F=>e.jsxs(Ie,{value:F*1024*1024,children:[F,"MB"]},F))]})})]}),s&&s.is_gba&&e.jsxs(U,{children:[e.jsx(I,{children:"Save Type:"}),e.jsx(I,{children:e.jsx(Xe,{name:"saveType",value:t.saveType,onChange:ae,children:Dt.map(F=>e.jsx(Ie,{value:F,children:F},F))})})]}),t.patchFile!=null&&t.patchFile.length>0&&e.jsxs(U,{children:[e.jsx(I,{children:"BPS Patch File:"}),e.jsx(I,{children:t.patchFile})]}),s&&s.is_gba&&e.jsxs(U,{children:[e.jsx(I,{children:"Cart ID:"}),e.jsx(I,{children:s.cartID})]}),e.jsxs(U,{children:[e.jsx(I,{children:"ROM Version:"}),e.jsx(I,{children:s.romVersion})]}),s&&s.is_gba&&e.jsxs(U,{children:[e.jsx(I,{children:"Checksum:"}),e.jsxs(I,{children:["0x",L]})]}),s&&!s.is_gba&&e.jsxs(U,{children:[e.jsx(I,{children:"Checksum:"}),e.jsxs(I,{children:["0x",s.checksum_gb]})]}),s&&!s.is_gba&&e.jsxs(U,{children:[e.jsx(I,{children:"Global Checksum:"}),e.jsxs(I,{children:["0x",s.checksumStr]})]}),e.jsxs(U,{children:[e.jsx(I,{children:"Publisher:"}),e.jsx(I,{children:t.publisher})]}),e.jsxs(U,{children:[e.jsx(I,{style:{border:"none"},children:"Release Date:"}),e.jsx(I,{style:{border:"none"},children:t.releaseDate})]})]})})}),i&&e.jsxs(e.Fragment,{children:[e.jsx(xe,{sx:{padding:"10px 0",color:"darkgrey"},children:"Local Saves"}),s&&s.is_gba&&e.jsx(vt,{gameData:s,checksum1000String:L,selectedSave:T,setSelectedSave:Y,saveName:D()+".sav"}),s&&!s.is_gba&&e.jsx(vt,{gameData:s,checksum1000String:s.checksum_gb,selectedSave:T,setSelectedSave:Y,saveName:D()+".sav"}),e.jsx(xe,{sx:{padding:"10px 0",color:"darkgrey"},children:"Local Roms"}),s&&s.is_gba&&e.jsx(Qe,{gameData:s,checksum1000String:L,selectedGame:Z,setSelectedGame:J,romName:D()+".gba"}),s&&!s.is_gba&&e.jsx(Qe,{gameData:s,checksum1000String:s.checksum_gb,selectedGame:Z,setSelectedGame:J,romName:D()+".gb"})]}),e.jsx(xe,{sx:{padding:"10px 0",color:"darkgrey"},children:"Cart Reader"})]}),!s&&!t&&e.jsx(Be,{children:e.jsx(Ke,{src:"./img/connect.jpeg",alt:"waiting for cartridge reader response illustration"})}),s&&!t&&(s.romName==""||s.romName=="Error")&&e.jsx(Be,{children:e.jsx(Ke,{src:"./img/error_cart.jpeg",alt:"can not correctly read cartridge illustration"})})]}),e.jsxs(Qr,{"aria-label":"Login Form",children:[e.jsx(oe,{label:"ESP32 IP Address",autoComplete:"esp32IPInputField",variant:"filled",style:{padding:"3px 8px 3px 8px",fontSize:"14px",marginLeft:"5px"},defaultValue:r,onChange:F=>{a(F.target.value)}}),e.jsxs(M,{variant:"outlined",style:{padding:"3px 8px 3px 8px",fontSize:"14px",marginLeft:"8px"},onClick:()=>{te()},children:[e.jsx(Ls,{style:{fontSize:"18px"}})," ","Refresh"]})]})]})}),e.jsx(Q,{children:!S&&e.jsxs(Yr,{children:[s&&t&&e.jsxs(M,{variant:"contained",color:"primary",style:{padding:"10px 20px 10px 10px",fontSize:"16px",display:"flex",alignItems:"center",gap:"5px"},onClick:()=>ie(),children:[e.jsx(Is,{style:{fontSize:"30px",marginRight:"10px"}})," ","Start Game"]}),e.jsx(M,{variant:"outlined",style:{padding:"10px 20px 10px 20px",fontSize:"16px",display:"flex",alignItems:"center",gap:"5px"},onClick:()=>u(!1),children:"Close"})]})})]})},ea=()=>{const{setIsModalOpen:t}=q(),{emulator:o}=E(),s=[{label:"Full Name",value:"fullName",setter:"setFullName"},{label:"Cover Image",value:"coverImage",setter:"setCoverImage"},{label:"Publisher",value:"publisher",setter:"setPublisher"},{label:"Release Date",value:"releaseDate",setter:"setReleaseDate"},{label:"CRC",value:"crc",setter:"setCrc"},{label:"Cart Size (Bytes)",value:"cartSize",setter:"setCartSize"},{label:"Save Type",value:"saveType",setter:"setSaveType"},{label:"Checksum 1000",value:"checksum1000",setter:"setChecksum1000"},{label:"Cart ID",value:"cartId",setter:"setCartId"},{label:"Patch File",value:"patchFile",setter:"setPatchFile"},{label:"Console",value:"console",setter:"setConsole"}],[n,r]=p.useState({fullName:"",coverImage:"",publisher:"",releaseDate:"",crc:"",cartSize:"",saveType:"",checksum1000:"",cartId:"",patchFile:"",console:".gba"}),[a,d]=p.useState(""),[c,u]=p.useState(""),[i,l]=p.useState(new Uint8Array);p.useEffect(()=>{a&&k(a)},[a]);const h=$=>{const S=$.target.files[0];if(S){u(S.name);let w=j(S.name).fileName;r(v=>({...v,fullName:w})),r(v=>({...v,patchFile:w+".bps"}));const m=new FileReader;m.onload=v=>{if(v.target&&v.target.result){let C=v.target.result;typeof C=="string"&&(C=new TextEncoder().encode(C)),l(new Uint8Array(C))}},m.readAsArrayBuffer(S)}},g=($,S)=>{r(w=>({...w,[S]:$.target.value}))},b=p.useId();function j($){const S=$.match(/\.(gb|gbc|gba)$/i);return S?{fileName:$.replace(/\.(gb|gbc|gba)$/i,""),removedExtension:S[0]}:{fileName:$,removedExtension:"gba"}}const x=async $=>{let w=await(await fetch(`./information_rom/${$}.json`)).json();r(m=>({...m,coverImage:w.coverImage})),r(m=>({...m,publisher:w.publisher})),r(m=>({...m,releaseDate:w.releaseDate})),r(m=>({...m,saveType:w.saveType}))},y=()=>{const $={fullName:n.fullName,coverImage:n.coverImage,publisher:n.publisher,releaseDate:n.releaseDate,crc:n.crc,cartSize:n.cartSize,saveType:n.saveType,checksum1000:n.checksum1000,patchFile:"./patches/"+n.patchFile,console:n.console},S=JSON.stringify($,null,2),w=new Blob([S],{type:"application/json"}),m=document.createElement("a");m.href=URL.createObjectURL(w),m.download=n.checksum1000+"-"+n.cartId+".json",document.body.appendChild(m),m.click(),URL.revokeObjectURL(m.href),document.body.removeChild(m)},k=$=>{const S=$.split("/").pop();if(S){r(P=>({...P,console:j(S).removedExtension})),r(P=>{var T;return{...P,cartSize:(T=o==null?void 0:o.getStatRoms)==null?void 0:T.call(o,$).size}});const w=/_([A-Z0-9]{1,4})_([A-Z0-9]{1,8})\./,m=S.match(w);if(!m){console.log("No match found");return}const v=m[1],C=m[2];console.log("CartID:",v),console.log("Checksum1000:",C),r(P=>({...P,checksum1000:C})),r(P=>({...P,cartId:v}));const L=o==null?void 0:o.getFile("/data/games/"+$);if(L){let P=(Ps.buf(L)>>>0).toString(16).toUpperCase();r(T=>({...T,crc:P}))}x(v)}},R=()=>{const $=o==null?void 0:o.getFile("/data/games/"+a),S=i;if($&&S){const w=Ts($,S),{buffer:m,checksum:v}=Ms(w);console.log("Patch Checksum: "+v);const C=new Blob([m],{type:"application/octet-stream"}),L=document.createElement("a");L.href=URL.createObjectURL(C),L.download=n.patchFile,document.body.appendChild(L),L.click(),URL.revokeObjectURL(L.href),document.body.removeChild(L),y()}};return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"File System"}),e.jsxs(X,{children:[e.jsx(xe,{sx:{padding:"10px 0",color:"darkgrey"},children:"Base Rom"}),e.jsx(Qe,{gameData:null,checksum1000String:null,selectedGame:a,setSelectedGame:d,romName:".gba"}),e.jsx(xe,{sx:{padding:"10px 0",color:"darkgrey"},children:"Patched Rom"}),e.jsx("input",{type:"file",onChange:h,accept:".gba"}),c&&e.jsxs("p",{children:["Selected File: ",c]}),e.jsx(xe,{sx:{padding:"10px 0",color:"darkgrey"},children:"Information"}),s.map($=>$.value!="saveType"?e.jsx(oe,{label:$.label,variant:"filled",style:{padding:"3px 8px 3px 8px",fontSize:"14px",marginLeft:"5px",width:"98%"},value:n[$.value],onChange:S=>g(S,$.value)},$.value):null),e.jsx(fo,{sx:{minWidth:120},children:e.jsxs(bo,{fullWidth:!0,style:{padding:"3px 8px 3px 8px",marginLeft:"5px",width:"98%",marginTop:"5px"},children:[e.jsx(jo,{id:"demo-simple-select-label",children:"Save Type"}),e.jsx(Xe,{name:"saveType",value:n.saveType,onChange:$=>g($,"saveType"),label:"Save Type",style:{fontSize:"14px"},children:Dt.map($=>e.jsx(Ie,{value:$,children:$},$))})]})})]}),e.jsxs(Q,{children:[e.jsx(we,{copy:"Create Patch File",id:`${b}--create-patch-button-button`,onClick:()=>R()}),e.jsx(M,{variant:"outlined",onClick:()=>t(!1),children:"Close"})]})]})},ta=f.div`
  display: flex;
  flex-direction: column;
  width: ${de}px;
  height: 100dvh;
  position: fixed;
  background-color: ${({theme:t})=>t.mediumBlack};
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
  z-index: 150;
  text-align: left;
  left: 0;
  top: 0;
  touch-action: none;
  border-right: 1px solid ${({theme:t})=>t.borderBlue};

  ${({$isExpanded:t=!1})=>!t&&`left: -${de+5}px;
  `};
`,sa=f.h2`
  color: ${({theme:t})=>t.pureWhite};
  padding: 0.5rem 1rem;
  font-size: calc(1.3rem + 0.6vw);
  font-weight: 500;
  line-height: 1.2;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid ${({theme:t})=>t.borderBlue};

  &:hover {
    background-color: ${({theme:t})=>t.menuHighlight};
  }
`,oa=f.ul`
  margin-bottom: 0;
  margin-top: 0;
  list-style: none;
  padding: 0;
  overflow-y: auto;
  overscroll-behavior: none;
  touch-action: pan-y;

  &::-webkit-scrollbar {
    display: none;
  }
`,na=f(je)`
  background-color: ${({theme:t})=>t.mediumBlack};
  color: ${({theme:t})=>t.pureWhite};
  z-index: 200;
  position: fixed;
  left: ${de-50}px;
  top: 12px;
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
  cursor: pointer;
  padding: 0.05rem 0.3rem;
  border-radius: 0.35rem;
  border: none;
  min-height: 36px;
  min-width: 36px;

  ${({$isExpanded:t=!1})=>!t&&`left: 5px;
    `}

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`,ra=f.button`
  position: absolute;
  width: calc(100dvw - ${de}px);
  left: ${de}px;
  height: 99%;
  background: 0 0;
  z-index: 140;
  border: none;
`,aa=({additionalData:t,setAdditionalData:o,gameData:s,setGameData:n,esp32IP:r,setEsp32IP:a})=>{const[d,c]=p.useState(!0),{setModalContent:u,setIsModalOpen:i}=q(),{canvas:l,emulator:h}=E(),{isRunning:g}=re(),b=_(),j=ne(b.isLargerThanPhone),x=p.useId(),y=Vt(),[k,R]=p.useState(null);p.useEffect(()=>{const S=w=>{console.log(67547),w.preventDefault(),R(w),console.log(w)};return window.addEventListener("beforeinstallprompt",S),()=>{window.removeEventListener("beforeinstallprompt",S)}},[]);const $=()=>{k&&(k.prompt(),k.userChoice.then(S=>{S.outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),R(null)}))};return p.useEffect(()=>{const w=new URLSearchParams(window.location.search).get("esp32_ip");w&&a("https://"+w);const m=setTimeout(()=>{u(e.jsx(wt,{additionalData:t,setAdditionalData:o,gameData:s,setGameData:n,esp32IP:r,setEsp32IP:a,setIsSideMenuExpanded:c})),i(!0)},500);return window.additionalData=t,window.gameData=s,window.esp32IP=r,()=>clearTimeout(m)},[t,s,r]),Un(),e.jsxs(e.Fragment,{children:[e.jsx(na,{id:"menu-btn",$isExpanded:d,onClick:()=>c(S=>!S),"aria-label":"Menu Toggle",children:e.jsx(Bs,{style:{height:"1.8em",width:"1.8em",verticalAlign:"middle"}})}),e.jsxs(ta,{"data-testid":"menu-wrapper",id:"menu-wrapper",$isExpanded:d,children:[e.jsx(sa,{id:x,children:"WifiBOY"}),e.jsxs(oa,{"aria-labelledby":x,children:[e.jsx(A,{title:"My Cartridge",icon:e.jsx(_e,{}),$withPadding:!0,onClick:()=>{u(e.jsx(wt,{additionalData:t,setAdditionalData:o,gameData:s,setGameData:n,esp32IP:r,setEsp32IP:a,setIsSideMenuExpanded:c})),i(!0)}}),e.jsxs(De,{title:"Cartridge Actions",$isExpanded:!0,icon:e.jsx(Ns,{}),children:[e.jsx(A,{title:"Save to Cartridge",$disabled:!g,icon:e.jsx(Es,{}),onClick:()=>{ht(t,h,r)}}),e.jsx(A,{title:"Verify Cartridge Save",$disabled:!g,icon:e.jsx(Us,{}),onClick:()=>{let S=h==null?void 0:h.getCurrentSave();const w=h==null?void 0:h.getCurrentSaveName();if(S&&w){S.length>131072&&(S=S.slice(0,131072));const v=new XMLHttpRequest;if(!t){console.log("No save type information.");return}var m=ut(t.saveType);if(m==-1){console.log("Invalid Save Type");return}const C=new Promise((L,P)=>{v.open("POST",`${r}/verify_save_file?saveType=${m}`,!0),v.upload.onprogress=function(T){if(T.lengthComputable){const Y=67+T.loaded/T.total*33;console.log(Y+"( "+T.loaded+" )")}else console.log("event.lengthComputable is false")},v.onload=()=>{v.status>=200&&v.status<300?L("Verified save on cartridge"):P("Save on cartridge is not the same.")},v.onerror=()=>P("Failed to upload save"),v.send(S)});G.promise(C,{loading:"Verifying save on cartridge...",success:L=>`${L}`,error:L=>`${L}`})}else G.error("Current save not available")}}),e.jsx(A,{title:"Reflash Cartridge Rom",icon:e.jsx(zs,{}),onClick:()=>{u(e.jsx(Kr,{esp32IP:r})),i(!0)}})]}),e.jsxs(De,{title:"In Game Actions",$disabled:!g,$isExpanded:g,icon:e.jsx(Os,{}),children:[e.jsx(A,{title:"Screenshot",$disabled:!g,icon:e.jsx(_s,{}),onClick:()=>{h!=null&&h.screenshot()?G.success("Screenshot saved successfully"):G.error("Screenshot has failed")}}),e.jsx(A,{title:"Full Screen",$disabled:!g,icon:e.jsx(As,{}),onClick:()=>{l==null||l.requestFullscreen().catch(()=>{G.error("Full screen request has failed")})}}),e.jsx(A,{title:"Download Save",$disabled:!g,icon:e.jsx(Pt,{}),onClick:()=>{u(e.jsx(xr,{})),i(!0)}}),e.jsx(A,{title:"Quick Reload",$disabled:!g,icon:e.jsx(qs,{}),onClick:y}),e.jsx(A,{title:"Manage Save States",$disabled:!g,icon:e.jsx(Ws,{}),onClick:()=>{u(e.jsx(Ir,{})),i(!0)}}),e.jsx(A,{title:"Manage Cheats",$disabled:!g,icon:e.jsx(It,{}),onClick:()=>{u(e.jsx(Qn,{})),i(!0)}})]}),e.jsx(A,{title:"Controls",icon:e.jsx(_e,{}),$withPadding:!0,onClick:()=>{u(e.jsx(pr,{})),i(!0)}}),e.jsx(A,{title:"File System",icon:e.jsx(Ds,{}),$withPadding:!0,onClick:()=>{u(e.jsx(kr,{})),i(!0)}}),e.jsxs(De,{title:"Other",icon:e.jsx(Hs,{}),children:[e.jsx(A,{title:"Create Patch File",icon:e.jsx(_e,{}),$withPadding:!0,onClick:()=>{u(e.jsx(ea,{})),i(!0)}}),e.jsx(A,{title:"About",icon:e.jsx(Vs,{}),$withPadding:!0,onClick:()=>{u(e.jsx(zn,{})),i(!0)}})]}),k&&e.jsx(A,{title:"Install App",icon:e.jsx(Ks,{}),$withPadding:!0,onClick:$})]}),e.jsx(Gs,{style:{color:"white",bottom:"15px",position:"absolute",fontSize:"24px",right:"15px"}}),e.jsx(Xs,{style:{color:"white",bottom:"15px",position:"absolute",fontSize:"24px",right:"45px"}}),e.jsx(Qs,{style:{color:"white",bottom:"15px",position:"absolute",fontSize:"24px",right:"75px"}}),e.jsx(Ys,{style:{color:"white",bottom:"15px",position:"absolute",fontSize:"24px",right:"105px"}})]}),d&&!j&&e.jsx(ra,{"aria-label":"Menu Dismiss",onClick:()=>{c(!1)}})]})};f.ul`
  text-align: left;
`;const ia=()=>!0,la=()=>{const[t]=N(ze),{shouldShowPublicRomModal:o}=Yt();return!(t!=null&&t.hasCompletedProductTourIntro)||o?null:e.jsx(Zs,{})},ca=240,da=160,ua=f.canvas`
  background-color: ${({theme:t})=>t.pureBlack};
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  width: 100%;
  height: 100%;
  display: block;
  margin: 0 auto;
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  image-rendering: pixelated;
`,ha=f($t)`
  background-color: ${({theme:t})=>t.pureBlack};
  border: solid 1px ${({theme:t})=>t.pureBlack};
  overflow: visible;
  width: 100dvw;
  height: calc(100dvw * 2 / 3);

  @media ${({theme:t})=>t.isLargerThanPhone} {
    width: min(
      calc(100dvw - ${de+35}px),
      calc(85dvh * 3 / 2)
    );
    height: 85dvh;
  }
`,pa={width:"",height:""},xa=()=>{var j,x;const t=_(),o=ne(t.isLargerThanPhone),{setCanvas:s}=E(),{areItemsDraggable:n}=Ue(),{areItemsResizable:r}=Ot(),{layouts:a,setLayout:d,hasSetLayout:c}=ue(),u=o?de+10:0,i=o?15:0,l=p.useCallback(y=>{var k,R,$,S,w,m,v,C;c||(($=(R=(k=y==null?void 0:y.resizableElement)==null?void 0:k.current)==null?void 0:R.style)==null||$.removeProperty("width"),(m=(w=(S=y==null?void 0:y.resizableElement)==null?void 0:S.current)==null?void 0:w.style)==null||m.removeProperty("height")),!((v=a==null?void 0:a.screen)!=null&&v.initialBounds)&&y&&d("screen",{initialBounds:(C=y.resizableElement.current)==null?void 0:C.getBoundingClientRect()})},[c,a,d]),h=p.useCallback(y=>s(y),[s]),g=((j=a==null?void 0:a.screen)==null?void 0:j.position)??{x:u,y:i},b=((x=a==null?void 0:a.screen)==null?void 0:x.size)??pa;return e.jsx(ha,{"data-testid":"screen-wrapper",disableDragging:!n,ref:l,enableResizing:r,resizeHandleComponent:{topRight:e.jsx(pe,{variation:"topRight"}),bottomRight:e.jsx(pe,{variation:"bottomRight"}),bottomLeft:e.jsx(pe,{variation:"bottomLeft"}),topLeft:e.jsx(pe,{variation:"topLeft"})},resizeHandleStyles:{topRight:{marginTop:"15px",marginRight:"15px"},bottomRight:{marginBottom:"15px",marginRight:"15px"},bottomLeft:{marginBottom:"15px",marginLeft:"15px"},topLeft:{marginTop:"15px",marginLeft:"15px"}},position:g,size:b,onDragStop:(y,k)=>{d("screen",{position:{x:k.x,y:k.y}})},onResizeStop:(y,k,R,$,S)=>{d("screen",{size:{width:R.clientWidth,height:R.clientHeight},position:{...S}})},children:e.jsx(ua,{"data-testid":"screen-wrapper:render-canvas",ref:h,width:ca,height:da})})},ga=f.div`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  inset: 10px;
  margin: 25px auto auto;
  padding-top: 25px;
  max-height: 80%;
  max-width: calc(100dvw - 20px);
  padding: 0;
  touch-action: none;
  user-select: text;
  width: fit-content;

  @media ${({theme:t})=>t.isLargerThanPhone} {
    max-width: 600px;
  }
`,ma=f.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100dvw;
  height: 100dvh;
  position: absolute;
`,fa=f(Gt)`
  justify-content: center;
`,ba=f(Xt)`
  padding: 1em 1em 0 1em;
`,ja=f.img`
  object-fit: contain;
  max-width: 100%;
`,Sa=f(Qt)`
  justify-content: center;
  flex-wrap: wrap;
`,va=f.div`
  position: relative;
`,ya=f.a`
  font-size: 5px;
  position: absolute;
  right: 15%;
  bottom: 6%;
`,Ct=()=>e.jsx("span",{children:"→"}),wa=({error:t,resetErrorBoundary:o})=>e.jsx(ma,{children:e.jsxs(ga,{role:"alert",children:[e.jsx(fa,{children:e.jsx(Kt,{children:"An irrecoverable error occurred"})}),e.jsxs(ba,{children:[e.jsxs(va,{children:[e.jsx(ja,{src:"/img/error-512x512.png",alt:"GameBoy Advance with error icon"}),e.jsx(ya,{target:"_blank",href:"https://www.freepik.com/free-vector/editable-text-effect-error-3d-hack-virus-font-style_21408324.htm",children:"Font by NACreative"})]}),e.jsx("p",{style:{color:"red"},children:t.message}),e.jsx("p",{children:"Please use the buttons below to copy the stack trace and create an issue, this helps a lot with error reporting!"})]}),e.jsxs(Sa,{children:[e.jsx(M,{color:"info",variant:"contained",onClick:()=>{navigator.clipboard.writeText(t.stack??"No stack available")},children:"Copy trace"}),e.jsx(Ct,{}),e.jsx(M,{color:"success",variant:"contained",href:"https://github.com/thenick775/gbajs3/issues",target:"_blank",children:"Create issue"}),e.jsx(Ct,{}),e.jsx(M,{color:"secondary",variant:"contained",onClick:o,children:"Dismiss and reset"})]})]})}),Ca=({children:t})=>e.jsx(Js,{fallbackRender:wa,children:t}),ka=()=>{const t=_();return e.jsx(eo,{toastOptions:{success:{duration:1e3},error:{duration:1500},style:{background:t.darkCharcoal,color:t.pureWhite}}})},$a=({children:t})=>e.jsx($o,{children:e.jsx(Fo,{children:e.jsx(yo,{children:e.jsx(Ro,{children:t})})})}),Ra={isLargerThanPhone:"only screen and (min-width: 600px)",isMobileLandscape:"only screen and (max-height: 1000px) and (max-width: 1000px) and (orientation: landscape)",isMobilePortrait:"only screen and (max-width: 1000px) and (orientation: portrait)",isMobileWithUrlBar:"only screen and (max-height: 700px) and (orientation: portrait)",aliceBlue1:"#f8f9fa",aliceBlue2:"#edf2f7",arcticAirBlue:"#cad8e5",blackRussian:"#1a202c",blueCharcoal:"rgb(15 23 42)",checkMarkGreen:"#7ac142",darkCharcoal:"#333",darkGrayBlue:"#495057",disabledGray:"#6c757d",errorRed:"#d32f2f",gbaThemeBlue:"#0d6efd",mediumBlack:"rgb(2 6 23)",menuHighlight:"#ffffff26",menuHover:"#0a58ca",pattensBlue:"#dee2e6",pureBlack:"#000",pureWhite:"#fff",darkGray:"#111",panelControlGray:"#a9a9a9",panelBlueGray:"rgb(30 41 59)",borderBlue:"rgb(15 23 42)"},Fa=()=>{const[t,o]=p.useState(null),[s,n]=p.useState(null),r="https://192.168.1.3",[a,d]=p.useState(r);return e.jsx(to,{theme:Ra,children:e.jsxs(Ca,{children:[e.jsx(ia,{}),e.jsx(ka,{}),e.jsx(vo,{children:e.jsx($a,{children:e.jsx(Po,{children:e.jsxs(To,{children:[e.jsx(la,{}),e.jsx(aa,{additionalData:t,setAdditionalData:o,gameData:s,setGameData:n,esp32IP:a,setEsp32IP:d}),e.jsx(xa,{}),e.jsx(Vo,{}),e.jsx(un,{additionalData:t,esp32IP:a}),e.jsx(pn,{})]})})})})]})})};so.createRoot(document.getElementById("root")).render(e.jsx(Ne.StrictMode,{children:e.jsx(Fa,{})}));
