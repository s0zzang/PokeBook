import { delay } from './index';
import { gsap } from 'gsap';

const $app = document.querySelector('#app');
export async function showLoading(time) {
  const randomImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${Math.floor(Math.random() * 251 + 1)}.gif`;
  const template = `<div class="loading">
      <img src="${randomImgSrc}" alt="랜덤 포켓몬" />
      <p>
        로딩중
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </p>
    </div>
  `;
  $app.insertAdjacentHTML('beforeend', template);

  const tl = gsap.timeline();
  tl.to('.loading span', { display: 'inline-block', stagger: 0.3 })
    .to('.loading span', { display: 'none', stagger: 0.3 }, '-=0.2')
    .to('.loading span', { display: 'inline-block', stagger: 0.3 })
    .to('.loading span', { display: 'none', stagger: 0.3 }, '-=0.2');

  await delay(time);
  document.querySelector('.loading').remove();
}
