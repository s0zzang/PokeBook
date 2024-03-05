import '/src/styles/style.css';
import { fetchData, showLoading } from '/src/lib';

let next_point = ``;
const END_POINT = `https://pokeapi.co/api/v2/pokemon`;
const $cardInner = document.querySelector('.card-inner');
const $top = document.querySelector('#totop');
const $type = document.querySelector('#type');
const $moreBtn = document.querySelector('.more-btn');
const $popup = document.querySelector('.popup');

const renderPoketList = async (END_POINT) => {
  try {
    const response = await fetch(END_POINT);
    if (!response.ok) throw new Error(`${END_POINT} 통신이 실패했습니다.`);
    const data = await response.json();
    next_point = data.next;

    showLoading(2000);
    const datas = await Promise.all(
      data.results.map((item) => fetchData(item.url))
    );
    for (const data of datas) {
      const { dataEn, dataKo } = data;
      renderPoketCard(dataEn, dataKo);
    }
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

function renderPoketCard(en, ko) {
  $cardInner.insertAdjacentHTML('beforeend', createPoketCard(en, ko));
}

function createPoketCard({ id, types, sprites }, { name }) {
  let typeSpans = '';
  types.forEach(
    ({ type }) =>
      (typeSpans += `<span class="${type.name}">${type.name}</span>`)
  );
  const img =
    sprites.other.showdown['front_default'] ||
    sprites.other['official-artwork']['front_default'];
  return `
    <article class="poket-card" data-index="${id}">
      <h2 class="poket-name">${name}</h2>
      <img class="poket-img" src="${img}" alt="${name}"/>
      <p class="poket-type">${typeSpans}</p>
    </article>
  `;
}

const handleTop = () => window.scroll({ top: 0, behavior: 'smooth' });

const handleMore = () => renderPoketList(next_point);

const handleSelect = async (e) => {
  const selected = e.target.value;
  $cardInner.textContent = '';
  showLoading(2000);

  if (selected === '0') {
    $moreBtn.style.display = 'block';
    renderPoketList(END_POINT);
    return;
  }

  $moreBtn.style.display = 'none';
  const response = await fetch(`https://pokeapi.co/api/v2/type/${selected}`);
  if (!response.ok) throw new Error(`${END_POINT} 통신이 실패했습니다.`);
  const data = await response.json();
  const datas = await Promise.all(
    data.pokemon.map((pokemon) => fetchData(pokemon.pokemon.url))
  );
  for (const data of datas) {
    const { dataEn, dataKo } = data;
    renderPoketCard(dataEn, dataKo);
  }
};

const handleCardClick = (e) => {
  const target = e.target.closest('.poket-card');
  if (!target) return;
  const idx = target.dataset.index;

  $popup.classList.add('is-active');
  renderPoketDetail(idx);
};

async function renderPoketDetail(idx) {
  const { dataEn, dataKo } = await fetchData(`${END_POINT}/${idx}`);
  $popup.textContent = '';
  $popup.insertAdjacentHTML('beforeend', createPoketDetail(dataEn, dataKo));
}

function createPoketDetail(
  { id, height, weight, sprites },
  { name, genera, flavor }
) {
  const img =
    sprites.other.showdown['front_default'] ||
    sprites.other['official-artwork']['front_default'];
  const modifyIdDigit =
    id < 10 ? `000${id}` : id < 100 ? `00${id}` : id < 1000 ? `0${id}` : id;
  return `
    <div class="popup-inner" data-id="${id}">
      <h3 class="name"><span>#${modifyIdDigit}</span> ${name}</h3>
      <div class="info">
        ${genera ? `<p class="kind"><span>분류</span> ${genera}</p>` : ''}
        <p class="height"><span>키</span> ${Math.round(height * 10) / 100}m</p>
        <p class="weight"><span>무게</span> ${Math.round(weight * 10) / 100}kg</p>
      </div>
      <p class="desc">${flavor}</p>
      <img src="${img}" alt="${name}"/>
      <button type="button" class="btn popup-close"><span>닫기</span></button>
      <div class="pagination">
        <button type="button" class="btn btn-prev"><span>이전으로</span></button>
        <button type="button" class="btn btn-next"><span>다음으로</span></button>
      </div>
    </div>
  `;
}

const handlePopupClick = (e) => {
  const target = e.target;
  const id = target.closest('.popup-inner')?.dataset.id;

  if (
    target.classList.contains('popup') ||
    target.classList.contains('popup-close')
  )
    $popup.classList.remove('is-active');

  if (target.classList.contains('btn')) handlePopupNavi(target, id);
};

function handlePopupNavi(node, idx) {
  node.classList.contains('btn-prev')
    ? renderPoketDetail(+idx - 1)
    : renderPoketDetail(+idx + 1);
}

renderPoketList(END_POINT);
$moreBtn.addEventListener('click', handleMore);
$top.addEventListener('click', handleTop);
$type.addEventListener('input', handleSelect);
$cardInner.addEventListener('click', handleCardClick);
$popup.addEventListener('click', handlePopupClick);
