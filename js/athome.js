const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const siteName = 'athome';
exports.getProperties = async function getProperties(browser) {
  const page = await browser.newPage();

  await page.screenshot({ path: "screenshot2_1.png", fullPage: true });
  await page.goto(
    "https://www.athome.co.jp/kodate/chuko/fukushima/aizuwakamatsu-city/list/page1/?RND_TIME_PRM=24254&RND_MODE=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  //////////////////認証エラー
  await page.screenshot({ path: "screenshot2_2.png", fullPage: true });
  await sleep(10000);
  await page.select('select[name="PRICETO"]', "kp102");
  const buildingLies = await page.$$("#item-list > .object");

  console.log(siteName, buildingLies.length);
  return await Promise.all(buildingLies.map(async (bl, i) => {
    return {
      build_src: await getBuildSrc(bl),
      siteMap: {
        athome: {
          link: await getLink(bl),
          name: "athome",
          company_name: await getCompanyName(bl, i),
        }
      },
      address: await getTableItem(bl, 2),
      traffic: await getTableItem(bl, 3),
      price: await getTableItem(bl, 1),
      land_area: await getTableItem(bl, 6),
      build_area: await getTableItem(bl, 5),
      build_date: await getTableItem(bl, 7),
    };
  }));
};

async function getBuildSrc(buildingLi) {
  return await (await (await buildingLi.$(".horizontal img")).getProperty('src')).jsonValue();
}
async function getLink(buildingLi) {
  return await (await (await buildingLi.$(".horizontal >li > a")).getProperty('href')).jsonValue();
}
async function getTableItem(buildingLi, keynum) {
  const element_base = await buildingLi.$(
    "div.object-data_sg > table > tbody"
  );
  const element = await element_base.$(`tr:nth-child(${keynum}) > td`);
  let element_text = await (
    await element.getProperty("textContent")
  ).jsonValue();
  element_text = element_text.replace(/\s+/g, "");
  return element_text;
}
async function getCompanyName(buildingLi, i) {
  const company = await buildingLi.$(".desc .boxHoverLinkStop");
  
  return await (await company?.getProperty("textContent"))?.jsonValue();
}