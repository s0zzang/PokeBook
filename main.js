import '/src/styles/style.css';

const END_POINT = `https://pokeapi.co/api/v2/pokemon`;
let next_point = ``;
const $cardInner = document.querySelector('.card-inner');
const $type = document.querySelector('#type');
const $moreBtn = document.querySelector('.more-btn');

const renderPoketList = async (END_POINT, type = null) => {
  const response = await fetch(END_POINT);
  if (response.ok) {
    const data = await response.json();
    next_point = data.next;

    await Promise.all(
      data.results.map(async (poket) => {
        const response = await fetch(poket.url);
        if (response.ok) {
          const info = await response.json();

          let urls = info.species.url;

          if (type) {
            // info.types.map((item) => item.type.name)
            urls = info.types
              .filter((item) => item.type.name.indexOf(type) > -1)
              .filter((item) => item.length != 0);
            console.log(urls);
          }

          const poketNameKo = (async () => {
            const response = await fetch(urls);
            const nameKo = await response.json();
            renderPoketCard(nameKo.names[2].name, info);
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

// const handleCardClick = (e) => {
//   const target = e.target.closest('span');
//   if (!target) return;
//   const type = target.textContent;
//   console.log(type);
// };

renderPoketList(END_POINT);
$moreBtn.addEventListener('click', handleMore);
$type.addEventListener('input', handleSelect);
