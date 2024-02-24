import '/src/styles/style.css';

const END_POINT = `https://pokeapi.co/api/v2/pokemon`;
let next_point = ``;
const $cardInner = document.querySelector('.card-inner');
const $type = document.querySelector('#type');
const $moreBtn = document.querySelector('.more-btn');
const $popup = document.querySelector('.popup');

const renderPoketList = async (END_POINT, type = null) => {
  const response = await fetch(END_POINT);
  if (response.ok) {
    const data = await response.json();
    next_point = data.next;

    await Promise.all(
      data.results.map(async (poket) => {
        const responseEn = await fetch(poket.url);
        if (responseEn.ok) {
          const resultEn = await responseEn.json();

          const responseKo = (async () => {
            const response = await fetch(resultEn.species.url);
            const resultKo = await response.json();
            renderPoketCard(resultKo.names[2].name, resultEn);
          })();
        }
      })
    );
  }
};

function renderPoketCard(name, data) {
  $cardInner.insertAdjacentHTML('beforeend', createPoketCard(name, data));
}

function createPoketCard(name, { id, types, sprites }) {
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

// responseKo : genera[1] | ['flavor_text_entries'][23], [31]
// info : id | height |

const handleCardClick = (e) => {
  const target = e.target.closest('.poket-card');
  if (!target) return;
  const idx = target.dataset.index;
  const name = target.querySelector('.poket-name').textContent;
  const img = target.querySelector('.poket-img').src;
  const data = { idx, name, img };

  renderPoketDetail(data);
  $popup.classList.add('is-active');
};

async function renderPoketDetail(data) {
  const responseEn = await fetch(`${END_POINT}/${data.idx}`);
  if (responseEn.ok) {
    const resultEn = await responseEn.json();
    const responseKo = await fetch(resultEn.species.url);
    const resultKo = await responseKo.json();
    console.log(resultEn, resultKo);

    $popup.textContent = '';
    $popup.insertAdjacentHTML(
      'beforeend',
      createPoketDetail(data, resultEn, resultKo)
    );
  }
}

function createPoketDetail({ idx, name, img }, en, ko) {
  let flavorTemplate = '';
  ko['flavor_text_entries'].forEach((text) => {
    if (text.language.name === 'ko' && text.version.name == 'y') {
      flavorTemplate += text['flavor_text'];
    }
    // if (text.language.name === 'ko') {
    //   flavorTemplate += `
    //     <li><span>${text.version.name}</span>${text['flavor_text']}</li>
    //   `;
    // }
  });
  const modifiedIdx =
    idx < 10
      ? `000${idx}`
      : idx < 100
        ? `00${idx}`
        : idx < 1000
          ? `0${idx}`
          : idx;
  return `
    <div class="popup-inner">
      <h3 class="name"><span>#${modifiedIdx}</span> ${name}</h3>
      <div class="info">
        <p class="height"><span>키</span> ${Math.round(en.height * 10) / 100}m</p>
        <p class="weight"><span>무게</span> ${Math.round(en.weight * 10) / 100}kg</p>
        <p class="kind"><span>분류</span> ${ko.genera[1].genus}</p>
      </div>
      <p class="desc">${flavorTemplate}</p>
      <img src="${img}" alt="${name}"/>
      <button type="button" class="popup-close"><span>닫기</span></button>
    </div>
  `;
}

const handlePopupClick = (e) => {
  const target = e.target;
  if (
    target.classList.contains('popup') ||
    target.classList.contains('popup-close')
  )
    $popup.classList.remove('is-active');
};

renderPoketList(END_POINT);
$moreBtn.addEventListener('click', handleMore);
$type.addEventListener('input', handleSelect);
$cardInner.addEventListener('click', handleCardClick);
$popup.addEventListener('click', handlePopupClick);
