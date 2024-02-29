# 포켓북 (Poket Book)

![home](https://github.com/s0zzang/PokeBook/assets/109408216/c7941a58-81f4-4ca1-b7e9-14ba79f0edc7)

<br>

## 💻 Poket Book 소개

### 1. 개요 / 동기

`Poket Book`은 1세대 포켓몬의 추억이 담긴 **픽셀 GIF 기반의 포켓몬 도감**을 제공하는 서비스입니다. <br>
포켓몬을 보고 자란 2-30대에겐 추억을, 여전히 인기를 끌고있는 10대에겐 1세대의 레트로 감성을 선사합니다. <br>

**바닐라 자바스크립트**만을 활용한 데이터 통신, 렌더링을 구현해보고 싶어서 시작하게 되었습니다. <br>
본격적으로 리액트를 배우고 활용하기 전에 바닐라 자바스크립트 기초를 다지고자 하였습니다.

### 2. 개발 기간

2024.02.20(화) - 2024.02.29(목)<br>
매일 9시간 수업 및 스터디 진행과 병행하여, **실제 작업 기간은 3-4일** 정도 소요되었습니다.

## 💻 [배포 URL](https://poketbook.netlify.app/)

```
[배포] https://poketbook.netlify.app/
[기술 블로그] https://velog.io/@s0zzang/vanilla-JS-PoketBook-END
```

- 기술 블로그는 총 6개의 글이 작성되었으며, 프로젝트의 시작부터 중간 과정을 기록하였습니다.

## 💻 기술 스택

| JavaScript | Vite | Prettier | Eslint |
| :--------: | :--: | :------: | :----: |

- `JavaScript` : 자바스크립트 라이브러리 의존도를 낮추고 자바스크립트만으로 Rest API 경험을 해보고자 바닐라 자바스크립트를 사용하였습니다.
- `Vite` : 트리 세이킹을 통해 로딩 성능을 최적화하기 위해 번들링의 도구로 선택하였습니다.
- `Prettier` : 협업을 대비하여 일관적인 코드 스타일을 유지하도록 하기 위해 사용했습니다.
- `Eslint` : 코드 작성 과정에서 잠재적인 문법 상 오류까지도 식별하기 위해 사용했습니다.

## 💻 주요 구현 기능

### 1. loading spinner

![loading](https://github.com/s0zzang/PokeBook/assets/109408216/f6d61042-df79-48b9-aa4a-eceb24301e63)

```js
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
```

귀여운 픽셀 기반의 GIF 이미지가 프로젝트의 핵심 컨셉이라고 생각하여 랜덤의 포켓몬 GIF가 노출되도록 설정했습니다. <br>
로딩 스피너가 노출되는 경우는 다음과 같습니다.

1. 처음 페이지가 로딩될 때
2. more 버튼을 클릭했을 때
3. 포켓몬 타입별 모아보기 버튼을 클릭했을 때

<hr>

### 2. 타입별 모아보기

![type](https://github.com/s0zzang/PokeBook/assets/109408216/a70fcffd-16cc-4ece-8fea-e0811736e09a)

```js
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
```

포켓몬은 특히 타입을 기준으로 확인하는 것이 중요하기 때문에 해당 기능을 구현하였습니다. <br>
`select element` 를 활용하여 사용자가 선택한 타입의 값을 받아 **타입별 포켓몬 데이터를 제공하는 URL로 통신**했습니다. <br>

이때 포켓몬의 타입을 선택한 경우, 데이터가 한번에 노출되기 때문에 more 버튼을 숨김 처리하였습니다. <br>
타입과 관계없이 포켓몬을 보기 희망한다면 다시 END_POINT와 통신하여 데이터가 노출되도록 하였고 more 버튼 역시 노출했습니다.

<hr>

### 3. 상세 포켓몬 팝업

![popup](https://github.com/s0zzang/PokeBook/assets/109408216/3b719826-7c77-4f9d-b53f-a338a02b7730)

```js
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
  const modifiedIdx =
    id < 10 ? `000${id}` : id < 100 ? `00${id}` : id < 1000 ? `0${id}` : id;
  return `
    <div class="popup-inner" data-id="${id}">
      <h3 class="name"><span>#${modifiedIdx}</span> ${name}</h3>
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
```

리스트에서 노출하기 어려웠던 상세 정보를 팝업으로 구현하였습니다. <br>
**이벤트 위임**을 활용하여 리스트가 클릭되면 클릭된 포켓몬의 정보가 팝업에 노출되도록 하였습니다. <br>

클릭된 포켓몬의 아이디값을 URL과 함께 통신하여 받은 결과를 통해 영문 데이터와 국문 데이터를 받을 수 있는 `fetchData` 함수를 활용하였습니다.
팝업 외에 초기 리스트에 필요한 데이터, 타입별 포켓몬 데이터와 통신을 할 때도 `fetchData` **함수를 재사용**하였습니다.

API에서 픽셀 버전의 GIF가 제공되지 않는 이미지가 있었기 때문에 **논리합 연산자를 활용**하여 조건 처리하였습니다. <br>
포켓몬 이름 앞에 노출되는 아이디값이 천의 자리의 형식을 가질 수 있도록 **삼항식을 활용**하였습니다.

## 💻 느낀점

- 퍼블리셔로 근무하였기 때문에 **실제 데이터와 통신**을 해본 적이 없었는데, `Rest API`를 활용하여 실제 데이터를 `fetch` 해보니 너무 재밌어서 시간 가는 줄 모르고 작업을 했습니다. 기본으로 통신해야 할 URL이 3개(기본, 영문 데이터, 국문 데이터)여서 어떻게 하면 **효율적으로 통신할 수 있을지 고민**했습니다.
- 데이터를 **포켓몬 아이디값 순서대로 렌더링**하는 것에 어려움을 겪었습니다. 호출한 데이터를 `map`, `for..of`, `map과 for..of`를 병합하여 사용하는 등, 여러 가지 방식을 사용하며 메서드의 차이점을 직접 경험할 수 있었습니다.
- **타입별 포켓몬 모아보기 기능**을 구현할 때, API에서 타입별 포켓몬 리스트를 제공하는지 모르고 많은 시행착오가 있었습니다. <br> 구체적인 기능 정의와 API에 대한 투철한 분석이 필요한 것을 많이 체감했습니다.
- 혼자 진행한 프로젝트라 처음 시작할 때와 마무리 하여 배포할 때 디자인, 기능 등 달라진 것이 많았습니다. <br>**협업으로 진행한다면** 해당 부분에 대한 충분한 논의와 구체적인 지표가 있어야 함을 한번 더 깨달았습니다.
