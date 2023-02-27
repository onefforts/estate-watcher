const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const siteName = 'ニフティ';
exports.getProperties = async function getProperties(browser) {
  const page = await browser.newPage();

  await page.goto(
    "https://myhome.nifty.com/chuko/ikkodate/hokkaido-tohoku/fukushima/aizuwakamatsushi/?subtype=buh&isFromSearch=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await page.select('select[name="b2"]', "10000000");
  await sleep(5000);
  const buildingLies = await page.$$(".nayose");

  console.log(siteName, buildingLies.length);

  return await Promise.all(buildingLies.map(async bl => {
    return {
      build_src: await getBuildSrc(bl),
      siteMap: {
        nifty: {
          link: await getLink(bl),
          name: "ニフティ",
          company_name: await getCompany(bl),
        }
      },
      address: await getTableItem(bl, 1),
      traffic: await getTableItem(bl, 2),
      price: await getTableItem(bl, 0),
      land_area: await getTableItem(bl, 4),
      build_area: await getTableItem(bl, 5),
      build_date: await getTableItem(bl, 6),
    };
  }));
};

async function getBuildSrc(buildingLi) {
  const build_src_base = await buildingLi.$(".mainImageRect > a img");
  return await (await build_src_base.getProperty('src')).jsonValue();
}
async function getLink(buildingLi) {
  const detail_link_base = await buildingLi.$(".mainImageRect > a");
  return await (await detail_link_base.getProperty('href')).jsonValue();
}
async function getCompany(buildingLi) {
  const company_base = await buildingLi.$(".maker > div > p:nth-child(3)");
  return await ( await company_base.getProperty("textContent")).jsonValue();
}
async function getTableItem(buildingLi, keynum) {
  const element = await buildingLi.$$(
    "div.itemContentWrapper.clearfix > dl.itemContent.clearfix > dd"
  );
  return await (await element[keynum].getProperty("textContent")).jsonValue();
}
