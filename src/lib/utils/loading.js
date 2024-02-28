import { delay } from './index';
import { gsap } from 'gsap';

const $loading = document.querySelector('.loading');

async function renderLoading() {
  $loading.querySelector('img').src =
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${Math.floor(Math.random() * 100 + 1)}.gif`;
  $loading.classList.add('is-active');

  const tl = gsap.timeline();
  tl.to('.loading span', { display: 'inline-block', stagger: 0.3 }).to(
    '.loading span',
    { display: 'none', stagger: 0.3 },
    '-=0.2'
  );
}

export async function showLoading(time) {
  renderLoading();
  await delay(time);
  $loading.classList.remove('is-active');
}
