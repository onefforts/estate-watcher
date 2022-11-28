const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let hatoarray;
let array = [];
let building_li;
exports.nifty = async function nifty(page) {
  await page.goto(
    "https://myhome.nifty.com/chuko/ikkodate/hokkaido-tohoku/fukushima/aizuwakamatsushi/?subtype=buh&isFromSearch=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await page.select('select[name="b2"]', "10000000");
  await sleep(5000);
  building_li = await page.$$(".nayose");

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
      flag: "true",
    };
    hatoarray.build_src = await getBuildSrc();
    hatoarray.link = await getLink(page);
    hatoarray.address = await getTableItem(1);
    hatoarray.traffic = await getTableItem(2);
    hatoarray.price = await getTableItem(0);
    hatoarray.land_area = await getTableItem(4);
    hatoarray.site = "ニフティ";
    hatoarray.build_area = await getTableItem(5);
    hatoarray.build_date = await getTableItem(6);
    array.push(hatoarray);
  }
  //console.log(array);
  return array;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(".mainImageRect > a");
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await building_li[i].$(".mainImageRect > a");
  const link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getTableItem(keynum) {
  const element = await building_li[i].$$(
    "div.itemContentWrapper.clearfix > dl.itemContent.clearfix > dd"
  );
  let element_text = await (
    await element[keynum].getProperty("textContent")
  ).jsonValue();
  return element_text;
}
