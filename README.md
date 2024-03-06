# 포켓북 (Poket Book)

![home](https://github.com/s0zzang/PokeBook/assets/109408216/c7941a58-81f4-4ca1-b7e9-14ba79f0edc7)

## 💻 Poket Book 소개

### 1. 개요 / 동기

`Poket Book` 은 1세대 포켓몬의 추억이 담긴 **픽셀 GIF 기반의 포켓몬 도감**을 제공하는 서비스입니다. <br>
포켓몬을 보고 자란 2-30대에겐 추억을, 여전히 인기를 끌고있는 10대에겐 1세대의 레트로 감성을 선사합니다. <br>

**바닐라 자바스크립트**만을 활용한 데이터 통신, 렌더링을 구현해보고 싶어서 포켓북 프로젝트를 시작하게 되었습니다. <br>
본격적으로 리액트를 배우고 활용하기 전에 바닐라 자바스크립트 기초를 다지고자 하였습니다.

### 2. 개발 기간

2024.02.20(화) - 2024.02.29(목)<br>
매일 9시간 수업 및 스터디 진행과 병행하여, **실제 작업 기간은 3-4일** 정도 소요되었습니다.

<br>

## 💻 [배포 URL](https://poketbook.netlify.app/)

```
[배포] https://poketbook.netlify.app/
[기술 블로그] https://velog.io/@s0zzang/vanilla-JS-PoketBook-END
```

- 기술 블로그는 총 6개의 글이 작성되었으며, 프로젝트의 시작부터 중간 과정을 모두 기록하였습니다.

<br>

## 💻 기술 스택

| JavaScript | Vite | Prettier | Eslint |
| :--------: | :--: | :------: | :----: |

- `JavaScript` : 자바스크립트 라이브러리 의존도를 낮추고 자바스크립트만으로 Rest API 경험을 해보고자 바닐라 자바스크립트를 사용하였습니다.
- `Vite` : 트리 세이킹을 통해 로딩 성능을 최적화하기 위해 번들링의 도구로 선택하였습니다.
- `Prettier` : 협업을 대비하여 코드 스타일을 일관적으로 유지하기 위해 사용했습니다.
- `Eslint` : 코드 작성 과정에서 잠재적인 문법 상 오류까지도 식별하기 위해 사용했습니다.

<br>

## 💻 주요 구현 기능

### 1️⃣ &nbsp;loading spinner

![loading](https://github.com/s0zzang/PokeBook/assets/109408216/f6d61042-df79-48b9-aa4a-eceb24301e63)

<details>
<summary>✨ &nbsp;코드 자세히 보기</summary>

```js
const $container = document.querySelector('#container');
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
  $container.insertAdjacentHTML('beforeend', template);

  const tl = gsap.timeline();
  tl.to('.loading span', { display: 'inline-block', stagger: 0.3 })
    .to('.loading span', { display: 'none', stagger: 0.3 }, '-=0.1')
    .to('.loading span', { display: 'inline-block', stagger: 0.3 })
    .to('.loading span', { display: 'none', stagger: 0.3 }, '-=0.1');

  await delay(time);
  document.querySelector('.loading').remove();
}
```

</details>

귀여운 픽셀 기반의 GIF 이미지가 프로젝트의 핵심 컨셉이라고 생각하여 랜덤의 포켓몬 GIF가 노출되도록 설정했습니다. <br>
로딩 스피너가 아래의 3가지의 경우에 사용되기 때문에 `loading.js` **모듈로 분리하여 재사용**하였습니다. <br>
로딩 스피너가 노출되는 경우는 다음과 같습니다.

1. 처음 페이지가 로딩될 때
2. more 버튼을 클릭했을 때
3. 포켓몬 타입별 모아보기 버튼을 클릭했을 때

로딩 스피너 마크업을 초기에는 **HTML 코드로 작성**하여 이미지의 src만 교체되도록 기능을 구현했습니다. <br>
하지만 로딩되는 과정에서 이전 로딩 과정에서 렌더링 된 포켓몬 이미지가 잠깐 노출되는 오류가 발생했습니다. <br>
로딩 후 바로 사라져야하는 로딩 스피너의 특성에 맞게 **마크업을 JS로 변경**하여 템플릿을 렌더링시키도록 **리팩토링**을 진행하였습니다.

<br>

<hr>

### 2️⃣ &nbsp;타입별 모아보기

![type](https://github.com/s0zzang/PokeBook/assets/109408216/a70fcffd-16cc-4ece-8fea-e0811736e09a)

<details>
<summary>✨ &nbsp;코드 자세히 보기</summary>

```js
const handleSelect = async (e) => {
  const selected = e.target.value;
  if (selected === 'all') return selectedView(e.target, true);

  selectedView(e.target, false);
  const response = await fetch(`${VITE_END_POINT_TYPE}/${selected}`);
  if (!response.ok) throw new Error(`타입별 데이터 통신에 실패했습니다.`);
  const data = await response.json();
  const datas = await Promise.all(
    data.pokemon.map((pokemon) => fetchData(pokemon.pokemon.url))
  );
  for (const data of datas) {
    const { dataEn, dataKo } = data;
    renderPoketCard(dataEn, dataKo);
  }
};

function selectedView(target, isViewAll) {
  const $optionViewAll = target.children[0];
  $cardInner.textContent = '';
  showLoading(3000);

  $optionViewAll.textContent = isViewAll ? 'type' : '전체';
  $moreBtn.style.display = isViewAll ? 'block' : 'none';
  isViewAll && renderPoketList(VITE_END_POINT_POKEMON);
}
```

</details>

포켓몬은 특히 타입을 기준으로 분류하는 것이 중요하기 때문에 해당 기능을 구현하였습니다. <br>
`select element` 를 활용하여 사용자가 선택한 타입의 값을 받아 **타입별 포켓몬 데이터를 제공하는 URL로 통신**했습니다. <br>

타입 선택 후 해당 타입 포켓몬 목록에서 전체 포켓몬 목록을 돌아갈 수 있도록 `view all` 옵션을 만들었습니다. <br>
`selectedView` 함수를 통해 사용자가 전체 목록과 타입별 목록을 편리하게 구분할 수 있도록 하였습니다. <br>
타입 목록을 선택한 경우, **삼항식**을 활용하여 첫번째 `option`의 텍스트가 변경되고 `more` 버튼이 비활성화 되도록 하였습니다.

<br>

<hr>

### 3️⃣&nbsp; 상세 포켓몬 팝업

![popup](https://github.com/s0zzang/PokeBook/assets/109408216/3b719826-7c77-4f9d-b53f-a338a02b7730)

<details>
<summary>✨ &nbsp;코드 자세히 보기</summary>

```js
const handleCardClick = (e) => {
  const target = e.target.closest('.poket-card');
  if (!target) return;
  const idx = target.dataset.index;

  $popupWrap.classList.add('is-active');
  renderPoketDetail(idx);
};

async function renderPoketDetail(idx) {
  const { dataEn, dataKo } = await fetchData(
    `${VITE_END_POINT_POKEMON}/${idx}`
  );
  $popupWrap.textContent = '';
  $popupWrap.insertAdjacentHTML('beforeend', createPoketDetail(dataEn, dataKo));
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
    <div class="popup" data-id="${id}">
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
```

</details>

리스트에서 노출되지 않았던 포켓몬의 상세 정보를 팝업으로 구현하였습니다. <br>
**이벤트 위임**을 활용하여 리스트가 클릭되면 포켓몬의 상세 정보가 팝업에 노출되도록 하여 성능을 개선했습니다.<br>

`fetchData` 함수를 활용하여 클릭된 포켓몬의 아이디 값을 통해 영문 데이터와 국문 데이터를 수신하였습니다. <br>
해당 함수는 초기 리스트에 필요한 데이터, 타입별 포켓몬 데이터와 통신을 할 때도 **재사용**하였습니다.

**논리합 연산자**를 활용하여 API에서 픽셀 버전의 GIF가 제공되지 않는 이미지의 조건을 처리했습니다. <br>
**삼항식**을 활용하여 아이디 값이 천의 자리의 형식으로 노출되도록 하였습니다.

<br>

## 💻 코드 리뷰

현재 수강하고 있는 **멋쟁이 사자처럼 프론트엔드 스쿨 8기** 멘토님께 자발적으로 **코드 리뷰**를 받았습니다. <br>
대략 2시간의 시간동안 꼼꼼히 봐주신 덕분에 더 많은 것을 배울 수 있었습니다. <br>
피드백을 받은 큰 3가지의 기능은 아래와 같습니다. (피드백 반영 완료)

#### 1. 포켓몬 API 주소가 노출되지 않도록 **환경 변수** 설정

- `Refactoring` Vite의 `.env` 파일을 활용하여 환경 변수 세팅, `netlify` 홈페이지 추가 설정

#### 2. 로딩 스피너 컴포넌트화, 로딩 후 remove 처리

- `Refactoring` html로 작성되었던 코드에서 컴포넌트화 시킨 후 모듈로 분리, 로딩 후 클래스 제거가 아닌 삭제되도록 처리

#### 3. 타입 데이터 변경을 고려하여 타입 select option을 동기적인 데이터로 개선

- `Refactoring` 타입을 받아올 수 있는 추가적인 통신 후 국문 데이터만 노출되도록 변경, 타입별 포켓몬을 지원하지 않는 경우 제외
  <details>
  <summary>✨ &nbsp;코드 보기</summary>

  ```js
  const fetchPoketType = async () => {
    const response = await fetch(`${VITE_END_POINT_TYPE}`);
    if (!response.ok) throw new Error(`타입별 데이터 통신에 실패했습니다.`);
    const data = await response.json();
    const typePromises = data.results.map((type) =>
      fetch(type.url).then((response) => response.json())
    );
    const types = await Promise.all(typePromises);
    renderType(types);
  };

  function renderType(types) {
    const template = types.map(
      (item) =>
        `<option value="${item.id}">${item.names.find((arr) => arr.language.name === 'ko').name}</option>`
    );
    $typeSelect.insertAdjacentHTML('beforeend', template);

    deleteUnusedType();
  }

  function deleteUnusedType() {
    const options = $typeSelect.querySelectorAll('option');
    for (let option of options) {
      if (option.textContent === '???' || option.textContent === '다크')
        option.remove();
    }
  }
  ```

  </details>

<br>

## 💻 느낀점

퍼블리셔로 근무하며 **실제 데이터와 통신**을 해본 적이 없었습니다. `Rest API`를 활용하여 실제 데이터와 통신하는 과정이 상당히 재밌었고, 데이터를 가공하는데 보람을 느꼈습니다.
기본으로 통신해야 할 URL이 3개(기본, 영문, 국문)였는데, 이론으로 배웠을 때는 생각치도 못했던 경우였습니다. 어떻게 하면 여러 차례의 통신을 **효율적으로 할 수 있을지 고민**한 덕분에 `fetchData` 함수를 분리할 수 있었습니다.

데이터를 **포켓몬 아이디값 순서대로 렌더링**하는 것에 어려움을 겪었습니다. 호출한 데이터를 `map`, `for..of`, `map과 for..of`를 병합하여 사용하는 등, 여러 가지 방식을 사용하며 **배열 메서드의 차이점**을 직접 경험할 수 있었습니다.

**타입별 포켓몬 모아보기 기능**을 구현할 때, API에서 타입별 포켓몬 리스트를 제공하는지 모르고 많은 시행착오가 있었습니다. 구체적인 기능 정의와 API에 대한 투철한 분석이 필요한 것을 많이 체감했습니다.

혼자 진행한 프로젝트라 처음 시작할 때와 마무리 하여 배포할 때 디자인, 기능 등 달라진 것이 많았습니다. **협업으로 진행한다면** 해당 부분에 대한 충분한 논의와 구체적인 지표가 있어야 함을 한번 더 깨달았습니다.
