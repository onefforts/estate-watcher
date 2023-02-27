const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const siteName = "イエステーション"

exports.getProperties = async function getProperties(browser) {
  const page = await browser.newPage();

  await page.goto(
    "http://www.address-kaitai.com/buy/ikkodate/area/sc_07202/?kt=10000000",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await sleep(5000);
  const buildingLies = await page.$$(".krList");

  console.log(siteName, buildingLies.length);
  return await Promise.all(buildingLies.map(async bl => {
    return {
      build_src: await getBuildSrc(bl),
      address: await getAddress(bl),
      traffic: await getTraffic(bl),
      price: await getPrice(bl),
      land_area: await getLandarea(bl),
      build_area: await getBuildarea(bl),
      build_date: await getDate(bl),
      siteMap: {
        iestation: {
          link: await getLink(bl),
          name: siteName,
          company_name: siteName
        }
      },
    };
  }));
};

async function getBuildSrc(buildingLi) {
  return await (await (await buildingLi.$(".picBox img")).getProperty('src')).jsonValue();
}
async function getLink(buildingLi) {
  return await (await (await buildingLi.$(".link-to-detail")).getProperty('href')).jsonValue();
}
async function getPrice(buildingLi) {
  return await (await (await buildingLi.$(".spec .kakaku")).getProperty("textContent")).jsonValue();
}
async function getAddress(buildingLi) {
  const address_base = await buildingLi.$$(".spec > .dotLn");
  const address = await address_base[1].$("dl:nth-child(1) > dd");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  return address_text;
}
async function getTraffic(buildingLi) {
  const traffic_base = await buildingLi.$$(".spec > .dotLn");
  const traffic = await traffic_base[1].$("dl:nth-child(2) > dd");
  let traffic_text = await (
    await traffic.getProperty("textContent")
  ).jsonValue();
  return traffic_text;
}
async function getLandarea(buildingLi) {
  const land_area = await buildingLi.$(
    ".spec > div:nth-child(3) > table > tbody > tr > td:nth-child(1) > dl > dd"
  );
  let land_area_text = await (
    await land_area.getProperty("textContent")
  ).jsonValue();
  land_area_text = land_area_text.replace(/\s+/g, "");
  return land_area_text;
}
async function getBuildarea(buildingLi) {
  const build_area = await buildingLi.$(
    ".spec > div:nth-child(4) > table > tbody > tr > td:nth-child(1) > dl > dd"
  );
  let build_area_text = await (
    await build_area.getProperty("textContent")
  ).jsonValue();
  build_area_text = build_area_text.replace(/\s+/g, "");
  return build_area_text;
}
async function getDate(buildingLi) {
  const date = await buildingLi.$(
    ".spec > div:nth-child(4) > table > tbody > tr > td:nth-child(2) > dl > dd"
  );
  let date_text = await (await date.getProperty("textContent")).jsonValue();
  date_text = date_text.replace(/\s+/g, "");
  return date_text;
}
