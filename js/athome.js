const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let hatoarray;
let building_li;
let array = [];
exports.athome = async function athome(page) {
  await page.goto(
    "https://www.athome.co.jp/kodate/chuko/fukushima/aizuwakamatsu-city/list/page2/?RND_TIME_PRM=24254&RND_MODE=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  //////////////////認証エラー
  await sleep(3000);
  await page.select('select[name="PRICETO"]', "kp101");
  await sleep(5000);
  building_li = await page.$$("#item-list > .object");

  console.log(building_li.length);
  for (i = 0; i < building_li.length; i++) {
    hatoarray = {
      build_src: "",
      link: "",
      address: "",
      traffic: "",
      price: "",
      land_area: "",
      site: "",
      build_area: "",
      build_date: "",
      flag: "false",
    };
    hatoarray.build_src = await getBuildSrc();
    hatoarray.link = await getLink(page);
    hatoarray.address = await getTableItem(2);
    hatoarray.traffic = await getTableItem(3);
    hatoarray.price = await getTableItem(1);
    hatoarray.land_area = await getTableItem(6);
    hatoarray.site = "athome";
    hatoarray.build_area = await getTableItem(5);
    hatoarray.build_date = await getTableItem(7);
    array.push(hatoarray);
  }

  //console.log(hatoarray);
  return array;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(".horizontal");
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await building_li[i].$(".horizontal >li > a");
  const link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getTableItem(keynum) {
  const element_base = await building_li[i].$(
    "div.object-data_sg > table > tbody"
  );
  const element = await element_base.$(`tr:nth-child(${keynum}) > td`);
  let element_text = await (
    await element.getProperty("textContent")
  ).jsonValue();
  element_text = element_text.replace(/\s+/g, "");
  return element_text;
}
