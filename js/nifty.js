const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const siteName = 'nifty';
exports.getProperties = async function getProperties(browser) {
  const page = await browser.newPage();

  await page.goto(
    "https://myhome.nifty.com/chuko-ikkodate/fukushima/aizuwakamatsushi_ct/?subtype=buh&pnum=40&sort=regDate-desc",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await page.select('select[name="b2"]', "10000000");
  await page.waitForSelector('ul[data-contents-id="result-bukken-list"]');
  const buildingLies = await page.$$('ul[data-contents-id="result-bukken-list"] > li');

  console.log(siteName, buildingLies.length);

  return await Promise.all(buildingLies.map(async bl => {
    const result = {
      build_src: await getBuildSrc(bl),
      siteMap: {
        nifty: {
          link: await getLink(bl),
          name: siteName,
          company_name: "外部サイトから取得",
        }
      },
      address: await getTableItem(bl, 0),
      traffic: await getTableItem(bl, 1),
      price: await getPrice(bl),
      land_area: await getTableItem(bl, 4),
      build_area: await getTableItem(bl, 3),
      build_date: await getTableItem(bl, 5),
    };
    return result;
  }));
};

async function getBuildSrc(buildingLi) {
  const build_src_base = await buildingLi.$("a img.thumbnail");
  return await (await build_src_base.getProperty('src')).jsonValue();
}
async function getLink(buildingLi) {
  const detail_link_base = await buildingLi.$("a");
  return await (await detail_link_base.getProperty('href')).jsonValue();
}
async function getPrice(buildingLi) {
  const detail_link_base = await buildingLi.$(".is-space-xs .is-strong");
  return await (await detail_link_base.getProperty('textContent')).jsonValue();
}
async function getTableItem(buildingLi, keynum) {
  const element = await buildingLi.$$(
    ".is-gap-4px .is-sm"
  );
  return element[keynum] ? (await (await element[keynum].getProperty("textContent")).jsonValue()).replace(/\s+/g, "") : '';
}
