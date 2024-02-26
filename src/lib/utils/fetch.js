async function fetchData(END_POINT) {
  const responseEn = await fetch(`${END_POINT}`);
  if (!responseEn.ok) throw new Error(`개별 포켓몬 통신이 실패했습니다.`);
  const dataEn = await responseEn.json();

  const responseKo = await fetch(dataEn.species.url);
  if (!responseKo.ok) throw new Error(`한국어용 포켓몬 통신이 실패했습니다.`);
  const dataLanguage = await responseKo.json();
  const dataKo = dataKoFn(dataLanguage);

  return { dataEn, dataKo };
}

function dataKoFn(data) {
  let name = '';
  data.names.forEach((item) => {
    if (item.language.name === 'ko') name = item.name;
  });
  let genera = '';
  data.genera.forEach((item) => {
    if (item.language.name === 'ko') genera = item.genus;
  });
  let flavor = '';
  data['flavor_text_entries'].forEach((item) => {
    if (item.language.name === 'ko') flavor = item['flavor_text'];
  });

  return { name, genera, flavor };
}

export default fetchData;
