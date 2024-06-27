const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let property;
const siteName = 'housego'
exports.getProperties= async function getProperties(browser) {

  const page = await browser.newPage();
  await page.goto(
    "https://house.goo.ne.jp/buy/touhoku_uh/area_fukushima/07202.html?sk=2&pu=1000",
    {
      waitUntil: ["networkidle0"],
    }
  );

  await page.waitForSelector('select[name="ps"]');
  await page.select('select[name="ps"]', "80");

  await page.waitForSelector(".rent_tabel_box > table.property > tbody");
  const buildingLies = await page.$$(".rent_tabel_box > table.property > tbody");

  console.log(siteName, buildingLies.length);
  return await Promise.all(buildingLies.map(async bl => {
    return {
      build_src: await getBuildSrc(bl),
      siteMap: {
        housego: {
          link: await getLink(bl),
          name: siteName,
          company_name: await getCompanyName(bl),
        }
      },
      address: await getAdress(bl),
      traffic: await getTraffic(bl),
      price: await getTableItem(bl, 4),
      land_area: (await getTableItem(bl, 6)).replace("\n", ""),
      build_area: await getBuildArea(bl),
      build_date_item: (await getTableItem(bl, 7)).replace("\n", ""),
    };
  }));
};

async function getBuildSrc(buildingLi) {
  const build_src_base = await buildingLi.$(
    "tr:nth-child(1) > td:nth-child(2) > ul > li.img"
  );
  return (await (await build_src_base.$("img")).getProperty('src')).jsonValue();
}
async function getLink(buildingLi) {
  const detail_link_base = await buildingLi.$(
    "tr:nth-child(1) > td:nth-child(3) > a"
  );
  return (await detail_link_base.getProperty('href')).jsonValue();
}
async function getAdress(buildingLi) {
  const address = await buildingLi.$("tr:nth-child(1) > td:nth-child(3)");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  address_text = address_text.split(/\n\n/);
  return address_text[0].replace("\n", "");
}
async function getTraffic(buildingLi) {
  const address = await buildingLi.$("tr:nth-child(1) > td:nth-child(3)");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  return address_text.split(/\n\n/)[1];
}
async function getBuildArea(buildingLi) {
  const build_ara = await buildingLi.$("tr:nth-child(1) > td:nth-child(5)");
  let build_ara_text = await (
    await build_ara.getProperty("textContent")
  ).jsonValue();
  return build_ara_text.split(/\n/)[2];
}
async function getTableItem(buildingLi, keynum) {
  const element = await buildingLi.$(
    `tr:nth-child(1) > td:nth-child(${keynum})`
  );
  
  return await (await element.getProperty("textContent")).jsonValue();
}
async function getCompanyName(buildingLi) {
  const company = await buildingLi.$("tr:nth-child(3) > td");
  
  return await (await company.getProperty("textContent")).jsonValue();
}
