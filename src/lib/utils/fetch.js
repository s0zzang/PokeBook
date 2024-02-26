async function fetchData(END_POINT) {
  const responseEn = await fetch(`${END_POINT}`);
  if (!responseEn.ok) throw new Error(`개별 포켓몬 통신이 실패했습니다.`);
  const dataEn = await responseEn.json();

  const responseKo = await fetch(dataEn.species.url);
  if (!responseKo.ok) throw new Error(`한국어용 포켓몬 통신이 실패했습니다.`);
  const dataKo = await responseKo.json();

  return { dataEn, dataKo };
}

export default fetchData;
