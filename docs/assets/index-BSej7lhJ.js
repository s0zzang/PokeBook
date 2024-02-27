(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(e){if(e.ep)return;e.ep=!0;const s=o(e);fetch(e.href,s)}})();async function d(n){const t=await fetch(`${n}`);if(!t.ok)throw new Error("개별 포켓몬 통신이 실패했습니다.");const o=await t.json(),a=await fetch(o.species.url);if(!a.ok)throw new Error("한국어용 포켓몬 통신이 실패했습니다.");const e=await a.json(),s=y(e);return{dataEn:o,dataKo:s}}function y(n){let t="";n.names.forEach(e=>{e.language.name==="ko"&&(t=e.name)});let o="";n.genera.forEach(e=>{e.language.name==="ko"&&(o=e.genus)});let a="";return n.flavor_text_entries.forEach(e=>{e.language.name==="ko"&&(a=e.flavor_text)}),{name:t,genera:o,flavor:a}}const i="https://pokeapi.co/api/v2/pokemon";let h="";const u=document.querySelector(".card-inner"),$=document.querySelector("#type"),l=document.querySelector(".more-btn"),c=document.querySelector(".popup"),f=async n=>{try{const t=await fetch(n);if(!t.ok)throw new Error(`${n} 통신이 실패했습니다.`);const o=await t.json();h=o.next;for(const a of o.results){const{dataEn:e,dataKo:s}=await d(a.url);m(e,s)}}catch(t){console.error("Error fetching data",t)}};function m(n,t){u.insertAdjacentHTML("beforeend",k(n,t))}function k({id:n,types:t,sprites:o},{name:a}){let e="";t.forEach(({type:r})=>{e+=`<span class="${r.name}">${r.name}</span>`});const s=o.other.showdown.front_default?o.other.showdown.front_default:o.other["official-artwork"].front_default;return`
    <article class="poket-card" data-index="${n}">
      <h2 class="poket-name">${a}</h2>
      <img class="poket-img" src="${s}" alt="${a}"/>
      <p class="poket-type">${e}</p>
    </article>
  `}const v=()=>f(h),b=async n=>{const t=n.target.value;if(u.textContent="",t==="0")l.style.display="block",f(i);else{l.style.display="none";const o=await fetch(`https://pokeapi.co/api/v2/type/${t}`);if(!o.ok)throw new Error(`${i} 통신이 실패했습니다.`);const a=await o.json();for(const e of a.pokemon){const{dataEn:s,dataKo:r}=await d(e.pokemon.url);m(s,r)}}},E=n=>{const t=n.target.closest(".poket-card");if(!t)return;const o=t.dataset.index;c.classList.add("is-active"),p(o)};async function p(n){const{dataEn:t,dataKo:o}=await d(`${i}/${n}`);c.textContent="",c.insertAdjacentHTML("beforeend",L(t,o))}function L({id:n,height:t,weight:o,sprites:a},{name:e,genera:s,flavor:r}){const g=a.other.showdown.front_default?a.other.showdown.front_default:a.other["official-artwork"].front_default,w=n<10?`000${n}`:n<100?`00${n}`:n<1e3?`0${n}`:n;return`
    <div class="popup-inner" data-id="${n}">
      <h3 class="name"><span>#${w}</span> ${e}</h3>
      <div class="info">
        ${s?`<p class="kind"><span>분류</span> ${s}</p>`:""}
        <p class="height"><span>키</span> ${Math.round(t*10)/100}m</p>
        <p class="weight"><span>무게</span> ${Math.round(o*10)/100}kg</p>
      </div>
      <p class="desc">${r}</p>
      <img src="${g}" alt="${e}"/>
      <button type="button" class="btn popup-close"><span>닫기</span></button>
      <div class="pagination">
        <button type="button" class="btn btn-prev"><span>이전으로</span></button>
        <button type="button" class="btn btn-next"><span>다음으로</span></button>
      </div>
    </div>
  `}const P=n=>{var a;const t=n.target,o=(a=t.closest(".popup-inner"))==null?void 0:a.dataset.id;(t.classList.contains("popup")||t.classList.contains("popup-close"))&&c.classList.remove("is-active"),t.classList.contains("btn")&&x(t,o)};function x(n,t){n.classList.contains("btn-prev")?p(+t-1):p(+t+1)}f(i);l.addEventListener("click",v);$.addEventListener("input",b);u.addEventListener("click",E);c.addEventListener("click",P);
