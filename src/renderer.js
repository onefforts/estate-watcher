let listProperties = [];
let propertyMap = {}

window.onbeforeunload = function () {};

window.onload = function () {
  listProperties = JSON.parse(localStorage.getItem("listProperties")) || [];
  propertyMap = JSON.parse(localStorage.getItem("propertyMap")) || {};

  renderProperties(listProperties);

};
function setFlag(i) {
  listProperties[i].isUnwatching = true;
  let h2 = document.getElementById(i);
  if (h2.classList.contains("unwatching")) {
    h2.classList.remove("unwatching");
    h2.classList.add("watching");
  }
}
function unsetFlag(i) {
  listProperties[i].isUnwatching = false;
  let h2 = document.getElementById(`${i}`);
  if (h2.classList.contains("watching")) {
    h2.classList.remove("watching");
    h2.classList.add("unwatching");
  }
}
const watchfilterbtn = document.getElementById("watchfilter");
const unwatchfilterbtn = document.getElementById("unwatchfilter");
const allshowbtn = document.getElementById("allshow");
const fetchBtn = document.getElementById("fetchBtn");
const sortAskBtn = document.getElementById("sortAskBtn");
const sortDescBtn = document.getElementById("sortDescBtn");
const filter500 = document.getElementById("filter500");
const filter1000 = document.getElementById("filter1000");
const filter_build = document.getElementById("filter_build");

filter_build.addEventListener("click", async () => {
  console.log(listProperties);

  renderProperties(listProperties);
});
filter500.addEventListener("click", async () => {
  for (i = 0; i < listProperties.length; i++) {
    let price = listProperties[i].price;
    price = price.replace("万円", "");
    price = price.replace("万円", "");
    if (price <= 500) 1;
  }
  renderProperties(listProperties);

});

sortAskBtn.addEventListener("click", async () => {
  listProperties.sort((l1, l2) => {
    const price1 = parseInt(l1.price.replace("万円", "").replace(",", ""));
    const price2 = parseInt(l2.price.replace("万円", "").replace(",", ""));

    return price1 - price2;
  });

  renderProperties(listProperties);
});

sortDescBtn.addEventListener("click", async () => {
  listProperties.sort((l1, l2) => {
    const price1 = parseInt(l1.price.replace("万円", "").replace(",", ""));
    const price2 = parseInt(l2.price.replace("万円", "").replace(",", ""));

    return price2 - price1;
  });

  renderProperties(listProperties);
});

unwatchfilterbtn.addEventListener("click", async () => {
  console.log(listProperties);
  for (i = 0; i < listProperties.length; i++) {
    if (!listProperties[i].isUnwatching) {
    }
  }
  renderProperties(listProperties);
});
watchfilterbtn.addEventListener("click", async () => {
  console.log(listProperties);
  for (i = 0; i < listProperties.length; i++) {
    if (listProperties[i].isUnwatching) {
    }
  }
  renderProperties(listProperties);
});
allshowbtn.addEventListener("click", async () => {
  console.log("全表示ボタンがクリックされました");
  renderProperties(listProperties);
});
fetchBtn.addEventListener("click", async () => {
  console.log("更新ボタンが押されました");
  fetchBtn.classList.add("pushbtn");
  const latestProperties = await window.org.fetchProperties();

  Object.keys(propertyMap).forEach(k => {
    propertyMap[k].isListing = false;
  });

  let tempListProperties = [];
  latestProperties.forEach((p)=> {
    const key = getKeyFromProperty(p);
    if(!propertyMap[key]) propertyMap[key] = p;
    else propertyMap[key].siteMap = {...propertyMap[key].siteMap, ...p.siteMap} 

    propertyMap[key].isListing;
    tempListProperties.push(propertyMap[key]);
  })

  const listProperties = [...new Set(tempListProperties)];
  renderProperties(listProperties);

  localStorage.setItem("propertyMap", JSON.stringify(propertyMap));
  localStorage.setItem("listProperties", JSON.stringify(listProperties));
  fetchBtn.classList.remove("pushbtn");
});

function genPropertyListTag(property, i) {
  let pageLinkHtml = '';
  Object.keys(property.siteMap).forEach(key => {
    const siteMap = property.siteMap[key];
    pageLinkHtml += `<button type="button" class=copy-btn onClick='navigator.clipboard.writeText("${siteMap.link}")'>Copy</button>
      <a href='${siteMap.link}' onclick="window.open('${siteMap.link}','','width=1920,height=1080'); return false;"> ${siteMap.name}(${siteMap.company_name?.trim()})</a>,`;
  });

  return `<div style ="border: 1px solid #ddd; border-bottom: none; width: 700px">
  <h2 id = ${i} class = ${property.isUnwatching ? "unwatching" : ""}>
    <p style="margin: 0;
    padding: 0;
    font-size: 1em;">
    <p>${property.address}
    <button class ="watched" onclick="setFlag(${i})">非表示化</button>
    <button class ="unwatched" onclick="unsetFlag(${i})">表示化</button>
    </p>
    </p>
  </h2>
  <div class="itemBody">
    <p class="itemDescription"></p>
    <div class="clearfix">
      <div style="float: left;
      margin-right: 9px;
        <p class="mainImageRect">
          <img alt=A src=${property.build_src} height="300" widtd="170">
        </p>
        <p>${getKeyFromProperty(property)}</p>
        <p>${i}</p>
      </div>
        <table border="1" class="row">
          <tr><th>価格</th><td>${property.price}</td></tr>
          <tr><th>所在地</th><td>${property.address}</td></tr>
          <tr><th>交通</th><td>${property.traffic}</td></tr>
          <tr><th>土地面積</th><td>${property.land_area}</td></tr>
          <tr><th>建物面積</th><td>${property.build_area}</td></tr>
          <tr><th>築年月</th><td>${property.build_date}</td></tr>
          <tr><th>参照サイト(情報提供会社)</th><td>${pageLinkHtml}</td></tr>
        </table>
      </div>
    </div>
  </div>`;
}
function renderProperties(properties){
  console.log(properties.length);
  const ListTags = properties.map((p, i) => {
    return genPropertyListTag(p, i)
  })
  const propertiesDiv = document.getElementById("properties");
  propertiesDiv.innerHTML = ListTags.join(); //html要素に変換
}

function getKeyFromProperty(property) {
  return property.land_area.substr(0, 5) + property.address.substr(0, 10)
}
