if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let c={};const l=e=>n(e,o),d={module:{uri:o},exports:c,require:l};i[o]=Promise.all(s.map((e=>d[e]||l(e)))).then((e=>(r(...e),c)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-ChFIqjjy.js",revision:null},{url:"assets/index-CJwMkRbO.css",revision:null},{url:"assets/mgba-xM1paPxV.wasm",revision:null},{url:"assets/vendor_@mui-DHTLE3Ge.js",revision:null},{url:"assets/vendor_react-joyride-Bdy49H5G.js",revision:null},{url:"assets/vendor-C46dVg2t.js",revision:null},{url:"index.html",revision:"b4c8cbc8863a4e2674fb1ae54d380999"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"img/favicon.ico",revision:"98a43945afc7c943daa2ed84f997718f"},{url:"img/icon-192x192.png",revision:"58c5fbb94b7e7feaabc7a8bfed9f00c5"},{url:"img/icon-256x256.png",revision:"2b81aa14c5e117b7cd9b7d38b60e25f7"},{url:"img/icon-384x384.png",revision:"9976f30e2b3bc9168a7dd4024ee1dc15"},{url:"img/icon-512x512.png",revision:"39adf26d66341a852448b01c61647dfb"},{url:"img/maskable-icon-192x192.png",revision:"875058165b6b2d0c013f4c53e5a82928"},{url:"img/maskable-icon-256x256.png",revision:"602975c0da2909830b2ce4ddd59ce5c9"},{url:"img/maskable-icon-384x384.png",revision:"2d086b17ed3f333b0d0b88973718da27"},{url:"img/maskable-icon-512x512.png",revision:"213947a1e0863e2236fd4c631cff5859"},{url:"manifest.webmanifest",revision:"0183b1bc558d66946c5a40f67785249b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
