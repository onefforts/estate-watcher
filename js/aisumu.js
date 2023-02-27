const siteName = 'あいすむ';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

exports.getProperties = async function getProperties(browser) {
  const page = await browser.newPage();

  await page.goto(
    "https://ai-sumu.com/buy/house/area/fukushimaken/search/list?shozaichi%5B%5D=07202&shozaichi%5B%5D=07208&shozaichi%5B%5D=07421&price_from=&price_to=10000000&last_upd_datetime=&walk_time=&taten_menseki_from=&taten_menseki_to=&tochi_menseki_from=&tochi_menseki_to=&chiku_year=&freeword=",
    { waitUntil: ["networkidle2"], }
  );
  await sleep(1000);
  const buildingLi = await page.$$(".property-list-one > li");
  console.log(siteName, buildingLi.length);
  return await Promise.all(buildingLi.map(async bl => {
    return {
      build_src: await getBuildSrc(bl),
      siteMap: {
        aisumu: {
          link: await getLink(bl),
          name: siteName,
          company_name: siteName
        }
      },
      address: await getAdress(bl),
      traffic: await getTraffic(bl),
      price: await getPrice(bl),
      land_area: await getLand(bl),
      build_area: "",
      build_date: "",
    };
  }));
};

async function getBuildSrc(buildingLi) {
  const build_src_base = await buildingLi.$(
    ".building-info > .thumbnail-image > a"
  );
  return await (await (await build_src_base.$('img')).getProperty('src')).jsonValue();
}
async function getLink(buildingLi) {
  const detailLink_base = await buildingLi.$(
    ".building-info > .thumbnail-image > a"
  );
  return await (await detailLink_base.getProperty('href')).jsonValue();
}
async function getAdress(buildingLi) {
  const address_base = await buildingLi.$(
    ".building-info > dl > dd.detail-info > ul:nth-child(1)"
  );
  const address = await address_base.$('[aria-label="住所"]');
  return await (await address.getProperty("textContent")).jsonValue();
}
async function getTraffic(buildingLi) {
  const traffic_base = await buildingLi.$(
    ".building-info > dl > dd.detail-info > ul:nth-child(1)"
  );
  const traffic = await traffic_base.$('[aria-label="交通"]');
  let traffic_text = await ( await traffic.getProperty("textContent")).jsonValue();
  return traffic_text.replace(/\s+/g, "");
}
async function getLand(buildingLi) {
  const land_base = await buildingLi.$("table.room-list");
  const land = await land_base.$('[data-column="menseki"]');
  return await (await land.getProperty("textContent")).jsonValue();
}
async function getPrice(buildingLi) {
  const price = await buildingLi.$(
    "table > tbody > tr:nth-child(2) > td > span.price-strong"
  );
  return await (await price.getProperty("textContent")).jsonValue();
}