const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const siteName = 'ハトマーク';
exports.getProperties = async function getProperties(browser) {
  const page = await browser.newPage();

  await page.goto(
    "https://www.hatomarksite.com/search/zentaku/buy/house/area/07/list?m_adr%5B%5d=07202&m_adr%5B%5d=07203&m_adr%5B%5d=07208&m_adr%5B%5d=07408&m_adr%5B%5d=07421&page=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await page.select('select[name="price_b_to"]', "10000000");
  const search_button = await getElements(
    'button[type="submit"',
    /^検索$/,
    page
  );
  search_button.click();
  await sleep(3000);
  await page.select('select[name="limit"]', "100");
  await sleep(5000); // リスト描画待機

  const buildingLies = await page.$$(".list-table > .col-12"); //偶数でカード
  console.log(siteName, buildingLies.length);
  return await Promise.all(buildingLies.map(async bl => {
    return {
      build_src: await getBuildSrc(bl),
      siteMap: {
        hatomark: {
          link: await getLink(bl),
          name: "ハトマーク",
          company_name: await getCompanyName(bl),
        }
      },
      address: await getAdress(bl),
      traffic: await getTraffic(bl),
      price: await getTableItem(bl, /価格/),
      land_area: (await getTableItem(bl, /土地面積/)).split("公簿").join("").split(",").join(""),
      build_area: await getTableItem(bl, /建物面積/),
      build_date: await getTableItem(bl, /築年月/),
    }
  }));
};

async function getBuildSrc(buildingLi) {
  return await (await (await buildingLi.$('.img-wrap img')).getProperty('src')).jsonValue();
}
async function getLink(buildingLi) {
  const detailLinkBase = await getElements("a", /詳細を見る/, buildingLi);
  return await (await detailLinkBase.getProperty('href')).jsonValue();
}
async function getAdress(buildingLi) {
  const address = await buildingLi.$(".address");
  const address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  return address_text.replace("MAP", "");
}
async function getTraffic(buildingLi) {
  const traffic = await buildingLi.$(".traffic");
  const traffic_text = await (await traffic.getProperty("textContent")).jsonValue();
  return traffic_text.replace("駅までmap", "");
}
async function getTableItem(buildingLi, keyword) {
  const element_base = await getElements(".col", keyword, buildingLi);
  const element = await element_base.$(".room-detail-value");
  let element_text = await (
    await element.getProperty("textContent")
  ).jsonValue();
  return element_text;
}
async function getCompanyName(buildingLi) {
  const company = await buildingLi.$(".text-end");
  return await (await company.getProperty("textContent")).jsonValue();
}

async function getElements(Elementname, textContent, A) {
  let resultSelectors = await A.$$(Elementname);
  let resultsArray = [];
  let keyFlag = "";
  for (let i = 0; i < resultSelectors.length; i++) {
    resultsArray.push(
      await (await resultSelectors[i].getProperty("textContent")).jsonValue()
    );
    //console.log(resultsArray[i]);
    if (resultsArray[i].match(textContent)) {
      keyFlag = i;
      break;
    }
  }
  return resultSelectors[keyFlag];
}
