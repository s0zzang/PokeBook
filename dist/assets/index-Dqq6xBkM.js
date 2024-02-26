(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const d="https://pokeapi.co/api/v2/pokemon";let f="";const m=document.querySelector(".card-inner"),h=document.querySelector("#type"),y=document.querySelector(".more-btn"),r=document.querySelector(".popup"),l=async(e,t=null)=>{const o=await fetch(e);if(o.ok){const a=await o.json();f=a.next;for(const n of a.results){const c=await(await fetch(n.url)).json();(async()=>{const u=await(await fetch(c.species.url)).json();g(c,u.names[2].name),console.log(c,u)})()}}};function g(e,t){m.insertAdjacentHTML("beforeend",v(e,t))}function v({id:e,types:t,sprites:o},a){let n="";return t.forEach(({type:s})=>{n+=`<span class="${s.name}">${s.name}</span>`}),`
    <article class="poket-card" data-index="${e}">
      <h2 class="poket-name">${a}</h2>
      <img class="poket-img" src="${o.other.showdown.front_default}" alt="${a}"/>
      <p class="poket-type">${n}</p>
    </article>
  `}const $=()=>l(f),b=async e=>{const t=e.target.value;l("https://pokeapi.co/api/v2/pokemon?offset=0&limit=100",t)},L=e=>{const t=e.target.closest(".poket-card");if(!t)return;const o=t.dataset.index;r.classList.add("is-active"),p(o)};async function p(e){const t=await fetch(`${d}/${e}`);if(t.ok){const o=await t.json(),n=await(await fetch(o.species.url)).json();r.textContent="",r.insertAdjacentHTML("beforeend",k(o,n))}}function k({id:e,height:t,weight:o,sprites:a},n){let s="";n.flavor_text_entries.forEach(i=>{i.language.name==="ko"&&i.version.name=="y"&&(s+=i.flavor_text)});const c=e<10?`000${e}`:e<100?`00${e}`:e<1e3?`0${e}`:e;return`
    <div class="popup-inner" data-id="${e}">
      <h3 class="name"><span>#${c}</span> ${n.names[2].name}</h3>
      <div class="info">
        <p class="kind"><span>분류</span> ${n.genera[1].genus}</p>
        <p class="height"><span>키</span> ${Math.round(t*10)/100}m</p>
        <p class="weight"><span>무게</span> ${Math.round(o*10)/100}kg</p>
      </div>
      <p class="desc">${s}</p>
      <img src="${a.other.showdown.front_default}" alt="${n.names[2].name}"/>
      <button type="button" class="btn popup-close"><span>닫기</span></button>
      <div class="pagination">
        <button type="button" class="btn btn-prev"><span>이전으로</span></button>
        <button type="button" class="btn btn-next"><span>다음으로</span></button>
      </div>
    </div>
  `}const w=e=>{var a;const t=e.target,o=(a=t.closest(".popup-inner"))==null?void 0:a.dataset.id;(t.classList.contains("popup")||t.classList.contains("popup-close"))&&E(r),t.classList.contains("btn")&&P(t,o)};function E(e){e.classList.remove("is-active")}function P(e,t){e.classList.contains("btn-prev")?p(+t-1):p(+t+1)}l(d);y.addEventListener("click",$);h.addEventListener("input",b);m.addEventListener("click",L);r.addEventListener("click",w);
