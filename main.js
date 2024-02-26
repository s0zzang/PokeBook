import '/src/styles/style.css';
import { fetchData } from '/src/lib';

const END_POINT = `https://pokeapi.co/api/v2/pokemon`;
let next_point = ``;
const $cardInner = document.querySelector('.card-inner');
const $type = document.querySelector('#type');
const $moreBtn = document.querySelector('.more-btn');
const $popup = document.querySelector('.popup');

const renderPoketList = async (END_POINT, type = null) => {
  try {
    const response = await fetch(END_POINT);
    if (!response.ok) throw new Error(`${END_POINT} 통신이 실패했습니다.`);
    const data = await response.json();
    next_point = data.next;

    for (const result of data.results) {
      const { dataEn, dataKo } = await fetchData(result.url);
      renderPoketCard(dataEn, dataKo.names[2].name);
    }
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

function renderPoketCard(en, ko) {
  $cardInner.insertAdjacentHTML('beforeend', createPoketCard(en, ko));
}

function createPoketCard({ id, types, sprites }, name) {
  let typeSpans = '';
  types.forEach(({ type }) => {
    typeSpans += `<span class="${type.name}">${type.name}</span>`;
  });
  return `
    <article class="poket-card" data-index="${id}">
      <h2 class="poket-name">${name}</h2>
      <img class="poket-img" src="${sprites.other.showdown['front_default']}" alt="${name}"/>
      <p class="poket-type">${typeSpans}</p>
    </article>
  `;
}

const handleMore = () => renderPoketList(next_point);

const handleSelect = async (e) => {
  const selected = e.target.value;
  renderPoketList(
    `https://pokeapi.co/api/v2/pokemon?offset=0&limit=100`,
    selected
  );
  // .then(
  //   () => {
  //     const types = document.querySelectorAll('.poket-type');
  //     types.forEach((type) => {
  //       if (type.innerHTML.indexOf(selected) < 0) {
  //         type.closest('.poket-card').style.display = 'none';
  //       } else {
  //         type.closest('.poket-card').style.display = 'flex';
  //       }
  //     });
  //     $moreBtn.style.display = 'none';
  //   }
  // );
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

function createPoketDetail({ id, height, weight, sprites }, ko) {
  let flavorTemplate = '';
  ko['flavor_text_entries'].forEach((text) => {
    if (text.language.name === 'ko' && text.version.name == 'y') {
      flavorTemplate += text['flavor_text'];
    }
  });
  const modifiedIdx =
    id < 10 ? `000${id}` : id < 100 ? `00${id}` : id < 1000 ? `0${id}` : id;
  return `
    <div class="popup-inner" data-id="${id}">
      <h3 class="name"><span>#${modifiedIdx}</span> ${ko.names[2].name}</h3>
      <div class="info">
        <p class="kind"><span>분류</span> ${ko.genera[1].genus}</p>
        <p class="height"><span>키</span> ${Math.round(height * 10) / 100}m</p>
        <p class="weight"><span>무게</span> ${Math.round(weight * 10) / 100}kg</p>
      </div>
      <p class="desc">${flavorTemplate}</p>
      <img src="${sprites.other.showdown['front_default']}" alt="${ko.names[2].name}"/>
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
$type.addEventListener('input', handleSelect);
$cardInner.addEventListener('click', handleCardClick);
$popup.addEventListener('click', handlePopupClick);
