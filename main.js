import '/src/styles/style.css';

const END_POINT = `https://pokeapi.co/api/v2/pokemon`;
const $cardInner = document.querySelector('.card-inner');

const renderPoketList = async () => {
  const response = await fetch(`${END_POINT}`);
  if (response.ok) {
    const data = await response.json();

    const loadedPoket = data.results.map(async (poket) => {
      const response = await fetch(poket.url);
      if (response.ok) {
        const info = await response.json();

        const poketNameKo = async () => {
          const response = await fetch(info.species.url);
          const nameKo = await response.json();
          renderPoketCard(nameKo.names[2].name, info);
          console.log(info);
        };
        poketNameKo();
      }
    });
  }
};

function renderPoketCard(name, data) {
  $cardInner.insertAdjacentHTML('beforeend', createPoketCard(name, data));
}

function createPoketCard(name, { id, types, sprites }) {
  const typeNames = types
    .map((types) => types.type.name)
    .map((typeName) => `<span>${typeName}</span>`);
  return `
    <article class="poket-card" data-index="${id}">
      <h2 class="poket-name">${name}</h2>
      <p class="poket-type">${typeNames}</p>
      <img class="poket-img" src="${sprites.other.showdown['front_default']}" alt="${name}"/>
    </article>
  `;
}

renderPoketList();
