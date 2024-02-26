(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();async function d(e){const t=await fetch(`${e}`);if(!t.ok)throw new Error("개별 포켓몬 통신이 실패했습니다.");const s=await t.json(),a=await fetch(s.species.url);if(!a.ok)throw new Error("한국어용 포켓몬 통신이 실패했습니다.");const n=await a.json();return{dataEn:s,dataKo:n}}const u="https://pokeapi.co/api/v2/pokemon";let f="";const m=document.querySelector(".card-inner"),h=document.querySelector("#type"),y=document.querySelector(".more-btn"),c=document.querySelector(".popup"),l=async(e,t=null)=>{try{const s=await fetch(e);if(!s.ok)throw new Error(`${e} 통신이 실패했습니다.`);const a=await s.json();f=a.next;for(const n of a.results){const{dataEn:o,dataKo:r}=await d(n.url);$(o,r.names[2].name)}}catch(s){console.error("Error fetching data",s)}};function $(e,t){m.insertAdjacentHTML("beforeend",g(e,t))}function g({id:e,types:t,sprites:s},a){let n="";return t.forEach(({type:o})=>{n+=`<span class="${o.name}">${o.name}</span>`}),`
    <article class="poket-card" data-index="${e}">
      <h2 class="poket-name">${a}</h2>
      <img class="poket-img" src="${s.other.showdown.front_default}" alt="${a}"/>
      <p class="poket-type">${n}</p>
    </article>
  `}const v=()=>l(f),b=async e=>{const t=e.target.value;l("https://pokeapi.co/api/v2/pokemon?offset=0&limit=100",t)},w=e=>{const t=e.target.closest(".poket-card");if(!t)return;const s=t.dataset.index;c.classList.add("is-active"),p(s)};async function p(e){const{dataEn:t,dataKo:s}=await d(`${u}/${e}`);c.textContent="",c.insertAdjacentHTML("beforeend",L(t,s))}function L({id:e,height:t,weight:s,sprites:a},n){let o="";n.flavor_text_entries.forEach(i=>{i.language.name==="ko"&&i.version.name=="y"&&(o+=i.flavor_text)});const r=e<10?`000${e}`:e<100?`00${e}`:e<1e3?`0${e}`:e;return`
    <div class="popup-inner" data-id="${e}">
      <h3 class="name"><span>#${r}</span> ${n.names[2].name}</h3>
      <div class="info">
        <p class="kind"><span>분류</span> ${n.genera[1].genus}</p>
        <p class="height"><span>키</span> ${Math.round(t*10)/100}m</p>
        <p class="weight"><span>무게</span> ${Math.round(s*10)/100}kg</p>
      </div>
      <p class="desc">${o}</p>
      <img src="${a.other.showdown.front_default}" alt="${n.names[2].name}"/>
      <button type="button" class="btn popup-close"><span>닫기</span></button>
      <div class="pagination">
        <button type="button" class="btn btn-prev"><span>이전으로</span></button>
        <button type="button" class="btn btn-next"><span>다음으로</span></button>
      </div>
    </div>
  `}const k=e=>{var a;const t=e.target,s=(a=t.closest(".popup-inner"))==null?void 0:a.dataset.id;(t.classList.contains("popup")||t.classList.contains("popup-close"))&&c.classList.remove("is-active"),t.classList.contains("btn")&&E(t,s)};function E(e,t){e.classList.contains("btn-prev")?p(+t-1):p(+t+1)}l(u);y.addEventListener("click",v);h.addEventListener("input",b);m.addEventListener("click",w);c.addEventListener("click",k);
