let hatoarray;
let array = [];
let building_li;
exports.aisumu = async function aisumu(page) {
  await page.goto(
    "https://ai-sumu.com/buy/land/rail/train/station?ensen_eki%5B%5D=0e34&ensen_eki%5B%5D=0e35&ensen_eki%5B%5D=0e36&price_from=&price_to=5000000&last_upd_datetime=&walk_time=&tochi_menseki_from=&tochi_menseki_to=&freeword=",
    {
      waitUntil: ["networkidle0"],
    }
  );
  building_li = await page.$$(".property-list-one > li");
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
    hatoarray.address = await getAdress();
    hatoarray.traffic = await getTraffic();
    hatoarray.price = await getPrice();
    hatoarray.land_area = await getLand();
    hatoarray.site = "あいすむ";
    hatoarray.build_area = "";
    hatoarray.build_date = "";
    array.push(hatoarray);
  }
  console.log(array);
  return array;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(
    ".building-info > .thumbnail-image > a"
  );
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await building_li[i].$(
    ".building-info > .thumbnail-image > a"
  );
  const link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getAdress() {
  const address_base = await building_li[i].$(
    ".building-info > dl > dd.detail-info > ul:nth-child(1)"
  );
  const address = await address_base.$('[aria-label="住所"]');
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  return address_text;
}
async function getTraffic() {
  const traffic_base = await building_li[i].$(
    ".building-info > dl > dd.detail-info > ul:nth-child(1)"
  );
  const traffic = await traffic_base.$('[aria-label="交通"]');
  let traffic_text = await (
    await traffic.getProperty("textContent")
  ).jsonValue();
  traffic_text = traffic_text.replace(/\s+/g, "");
  return traffic_text;
}
async function getLand() {
  const land_base = await building_li[i].$(
    "div.building-info > dl > dd.detail-info > ul.one-info.width-list"
  );
  const land = await land_base.$('[aria-label="土地面積"]');
  let land_text = await (await land.getProperty("textContent")).jsonValue();
  return land_text;
}
async function getPrice() {
  const price = await building_li[i].$(
    "table > tbody > tr:nth-child(2) > td.price-strong"
  );
  let element_text = await (await price.getProperty("textContent")).jsonValue();
  return element_text;
}
