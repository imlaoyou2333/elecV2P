const CACHE_NAME="ELECV2P_V2",CACHE_LIST_PRE=["/","/logs/","/efss/"],CACHE_URL=new Map([]),CACHE_HOST=new Map([["a.ogod.ml",0],["unpkg.com",0],["cdnjs.cloudflare.com",0],["images.unsplash.com",0],["cdn.pixabay.com",0],["sponsors.elecv2.workers.dev",1],["raw.githubusercontent.com",2]]),CACHE_SEARCH=new Map([["?type=sponsors&param=lists",1]]),CACHE_PATH=new Map([["/",1],["/logs/",2],["/efss/",2],["/manifest.json",1],["/elecV2/elecV2P/master/logs/update.log",1],["/efss/logo/elecV2P.png",2],["/jsfile",2],["/store",2],["/data",2],["/eapp",2],["/sefss",2],["/task",2],["/webhook",-1],["/config",-1]]),CACHE_MODE=new Map([["navigate",2]]),CACHE_DESTINATION=new Map([["image",0],["script",0],["style",0],["font",0],["manifest",1],["document",-1],["video",-1],["audio",-1]]),PATH_FALLBACK=new Map([["/efss/logo/elecV2P.png","https://raw.ev2.workers.dev/elecV2/elecV2P/master/efss/logo/elecV2P.png"]]),HOST_FALLBACK=new Map([["raw.githubusercontent.com","raw.ev2.workers.dev"]]),STRATEGY_DEFAULT=-1,putInCache=async(e,t)=>{console.debug("cache",e.url,"type:",e.destination||"unknow");const a=await caches.open(CACHE_NAME);await a.put(e,t)},eCache=async e=>{const t=await caches.match(e.request);if(t)return console.debug("serve",e.request.url,"from cache"),t},ePreload=async(e,t=!0)=>{const a=await e.preloadResponse;if(a)return console.debug("serve",e.request.url,"from preload, cache:",t),t&&putInCache(e.request,a.clone()),a},eFetch=async(e,t=!1)=>{try{const t=await ePreload(e);if(t)return t;const a=await fetch(e.request.url).then((e=>{if(e.status>400)throw new Error(`HTTP error! Status: ${e.status}`);return e}));return putInCache(e.request,a.clone()),a}catch(a){if(t){console.error(a),console.debug("retry",e.request.url,"from cache");const t=await eCache(e);if(t)return t}const s=new URL(e.request.url),{pathname:r,host:n}=s;if(PATH_FALLBACK.has(r)){const t=PATH_FALLBACK.get(r);/^http/.test(t)?s.href=t:s.pathname=t,console.debug("serve",e.request.url,"from",s.href,"PATH_FALLBACK");const a=await fetch(s.href,e.request);return putInCache(e.request,a.clone()),a}if(HOST_FALLBACK.has(n)){const t=HOST_FALLBACK.get(n);/^http/.test(t)?s.href=t:s.host=t,console.debug("serve",e.request.url,"from",s.href,"HOST_FALLBACK");const a=await fetch(s.href,e.request);return putInCache(e.request,a.clone()),a}return console.error(a,e.request.url),new Response(`{ "rescode": -1, "message": "Network Error 网络连接错误: ${a.message}"}`,{header:{"Content-Type":"application/json;charset=utf-8"}})}},STRATEGIES=[async e=>await eCache(e)||await eFetch(e),async e=>{const t=await eCache(e),a=eFetch(e);return t||await a},async e=>await eFetch(e,!0)],getStrategy=e=>{let t=-1,{url:a,mode:s,method:r,destination:n}=e;if("GET"!==r)return console.debug("fetch",a,s,r),t;let c=new URL(a),o=c.host,i=c.pathname,l=c.search,C="";switch(!0){case CACHE_URL.has(a):t=CACHE_URL.get(a),C="URL";break;case CACHE_HOST.has(o):t=CACHE_HOST.get(o),C="HOST";break;case CACHE_SEARCH.has(l):t=CACHE_SEARCH.get(l),C="SEARCH";break;case CACHE_PATH.has(i):t=CACHE_PATH.get(i),C="PATH";break;case i.startsWith("/efss/index."):t=0,C="/EFSS/INDEX";break;case i.startsWith("/efss/"):C="/EFSS";break;case i.startsWith("/script/"):C="/SCRIPT";break;case CACHE_DESTINATION.has(n):t=CACHE_DESTINATION.get(n),C="DESTINATION";break;case CACHE_MODE.has(s):t=CACHE_MODE.get(s),C="MODE"}return-1===t||STRATEGIES[t]||(console.error("strategy",t,"not exist"),t=-1),console.debug("fetch",a,s,r,n||"unknow type","strategy:",C,t),t},deleteCache=async e=>{console.debug("delete cache",e),await caches.delete(e)},deleteCacheSingle=async(e,t=CACHE_NAME)=>{const a=await caches.open(t);return await a.delete(e)},deleteOldCaches=async()=>{const e=[CACHE_NAME],t=(await caches.keys()).filter((t=>!e.includes(t)));await Promise.all(t.map(deleteCache))};async function cachePre(e=CACHE_LIST_PRE){if(0===e.length)return;const t=await caches.open(CACHE_NAME);await t.addAll(e)}self.addEventListener("install",(e=>{self.skipWaiting(),e.waitUntil(cachePre())})),self.addEventListener("activate",(e=>{e.waitUntil((async()=>{"navigationPreload"in self.registration&&await self.registration.navigationPreload.enable(),await deleteOldCaches()})()),self.clients.claim()})),self.addEventListener("fetch",(e=>{const t=getStrategy(e.request);if(-1===t)return e.waitUntil(ePreload(e,!1));e.respondWith(STRATEGIES[t](e))}));