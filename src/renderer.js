const isDebugMode = false;
let listProperties = [];
let propertyMap = {}

window.onbeforeunload = function () {};

window.onload = function () {
  propertyMap = JSON.parse(localStorage.getItem("propertyMap")) || {};
  listProperties = JSON.parse(localStorage.getItem("listProperties")) || Object.values(propertyMap);
  renderProperties(listProperties);
};
function watchfy(key) {
  propertyMap[key].isUnwatching = false;
  let h2 = document.getElementById(key);
  if (h2.classList.contains("unwatching")) {
    h2.classList.remove("unwatching");
    h2.classList.add("watching");
  }
}
function unwatchfy(key) {
  console.log(key, propertyMap[key], propertyMap);
  propertyMap[key].isUnwatching = true;
  let h2 = document.getElementById(key);
  console.log(propertyMap[key], h2)
  if (h2.classList.contains("watching")) {
    h2.classList.remove("watching");
    h2.classList.add("unwatching");
  }
}

document.getElementById('ImportFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = JSON.parse(e.target.result);
            // ここで読み込んだ内容をローカルストレージに保存
            localStorage.clear();
            localStorage.setItem("propertyMap", JSON.stringify(fileContent));
            console.log('File content saved to localStorage');
        };
        reader.onerror = function(e) {
            console.error('Error reading file:', e);
        };
        reader.readAsText(file); // テキストファイルとして読み込む
    } else {
        console.log('No file selected');
    }
});

const fetchBtn = document.getElementById("fetchBtn");
const filterWatchingBtn = document.getElementById("filterWatchingBtn");
const filterUnwatchingBtn = document.getElementById("filterUnwatchingBtn");
const filter500 = document.getElementById("filter500");
const filterPriceChanged = document.getElementById("filterPriceChanged");
const showAllBtn = document.getElementById("showAllBtn");
const showSellingBtn = document.getElementById("showSellingBtn");
const showSoldOutBtn = document.getElementById("showSoldOutBtn");
const sortPriceAscBtn = document.getElementById("sortPriceAscBtn");
const sortPriceDescBtn = document.getElementById("sortPriceDescBtn");
const sortDateAscBtn = document.getElementById("sortDateAscBtn");
const sortDateDescBtn = document.getElementById("sortDateDescBtn");
// TOFIX: 全表示時、現在掲載されていないものも表示されている問題修正

fetchBtn.addEventListener("click", async () => {
  console.log("更新ボタンが押されました");
  fetchBtn.classList.add("pushbtn");
  const latestProperties = await window.org.fetchProperties();

  Object.keys(propertyMap).forEach(k => {
    propertyMap[k].isListing = false;
  });

  let tempListProperties = [];
  console.log(propertyMap);
  latestProperties.forEach((p)=> {
    const key = getKeyFromProperty(p);
    const date = moment().format("YYYY/MM/DD");

    if(isDebugMode) 

    if(!propertyMap[key]) {
      propertyMap[key] = p;
      propertyMap[key].firstFetchAt = date;
      propertyMap[key].lastFetchAt = date;
      propertyMap[key].priceHistories = [{price: p.price, date: date}];
    } else {
      propertyMap[key].siteMap = {...propertyMap[key].siteMap, ...p.siteMap} 
      propertyMap[key].lastFetchAt = date;
      propertyMap[key].priceHistories = [...new Set(propertyMap[key].priceHistories.concat({price: p.price, date: date}))]
    }

    tempListProperties.push(propertyMap[key]);
  })

  console.log(tempListProperties);
  listProperties = sortbyFetchDate([...new Set(tempListProperties)], "desc").filter(p => {
    if(!p) return false;
    const key = getKeyFromProperty(p);
    return !propertyMap[key].isUnwatching
  });

  renderProperties(listProperties);

  console.log(propertyMap);
  localStorage.setItem("propertyMap", JSON.stringify(propertyMap));
  localStorage.setItem("listProperties", JSON.stringify(listProperties));
  fetchBtn.classList.remove("pushbtn");
  const dateP= document.getElementById("last_updated_at");
  dateP.innerHTML = moment().format(); //html要素に変換
});

filter500.addEventListener("click", async () => {
  activateBtn(filter500);
  inactivateBtn(showAllBtn);
  listProperties = listProperties.filter(p => {
    const price = p.price.replace("万円", "");
    
    return price <= 500;
  });

  renderProperties(listProperties);
});

filterPriceChanged.addEventListener("click", async () => {
  activateBtn(filterPriceChanged);
  inactivateBtn(showAllBtn);
  listProperties = listProperties.filter(p => {
    return p.priceHistories && (p.priceHistories.length > 1);
  });

  renderProperties(listProperties);
});

sortPriceAscBtn.addEventListener("click", async () => {
  activateBtn(sortPriceAscBtn);
  inactivateBtn(sortPriceDescBtn);
  listProperties.sort((l1, l2) => {
    const price1 = l1.priceHistories ? parseInt(genPriceInfoStrs(l1.priceHistories).slice(-1)[0].replace("万円", "").replace(",", "")) : l1.price;
    const price2 = l2.priceHistories ? parseInt(genPriceInfoStrs(l2.priceHistories).slice(-1)[0].replace("万円", "").replace(",", "")) : l2.price;

    return price1 - price2;
  });

  renderProperties(listProperties);
});

sortPriceDescBtn.addEventListener("click", async () => {
  activateBtn(sortPriceDescBtn);
  inactivateBtn(sortPriceAscBtn);
  listProperties.sort((l1, l2) => {
    const price1 = l1.priceHistories ? parseInt(genPriceInfoStrs(l1.priceHistories).slice(-1)[0].replace("万円", "").replace(",", "")) : l1.price;
    const price2 = l2.priceHistories ? parseInt(genPriceInfoStrs(l2.priceHistories).slice(-1)[0].replace("万円", "").replace(",", "")) : l2.price;

    return price2 - price1;
  });

  renderProperties(listProperties);
});

sortDateAscBtn.addEventListener("click", async () => {
  activateBtn(sortDateAscBtn);
  inactivateBtn(sortDateDescBtn);
  listProperties.sort((l1, l2) => {
    return Date.parse(l1.firstFetchAt) - Date.parse(l2.firstFetchAt);
  });

  renderProperties(listProperties);
});

sortDateDescBtn.addEventListener("click", async () => {
  activateBtn(sortDateDescBtn);
  inactivateBtn(sortDateAscBtn);
  listProperties.sort((l1, l2) => {
    return Date.parse(l2.firstFetchAt) - Date.parse(l1.firstFetchAt);
  });

  renderProperties(listProperties);
});

filterUnwatchingBtn.addEventListener("click", async () => {
  activateBtn(filterUnwatchingBtn);
  inactivateBtn(showAllBtn);
  listProperties = listProperties.filter(p => {
    const key = getKeyFromProperty(p);
    return propertyMap[key].isUnwatching
  });
  console.log(listProperties)

  localStorage.setItem("propertyMap", JSON.stringify(propertyMap));
  renderProperties(listProperties);
});
filterWatchingBtn.addEventListener("click", async () => {
  activateBtn(filterWatchingBtn);
  inactivateBtn(showAllBtn);
  listProperties = listProperties.filter(p => {
    const key = getKeyFromProperty(p);
    return !propertyMap[key].isUnwatching
  });

  localStorage.setItem("propertyMap", JSON.stringify(propertyMap));
  renderProperties(listProperties);
});
showSellingBtn.addEventListener("click", async () => {
  activateBtn(showSellingBtn);
  inactivateBtn(showAllBtn);

  listProperties = listProperties.filter(p => {
    return new Date(p.lastFetchAt) >= new Date(moment().add(-1, 'day').startOf('day'));
  });

  renderProperties(listProperties);
});
showSoldOutBtn.addEventListener("click", async () => {
  activateBtn(showSoldOutBtn);
  inactivateBtn(showAllBtn);

  listProperties = listProperties.filter(p => {
    console.log(new Date(p.lastFetchAt), new Date(moment().startOf('day')))
    return new Date(p.lastFetchAt) < new Date(moment().startOf('day'));
  });

  renderProperties(listProperties);
});
showAllBtn.addEventListener("click", async () => {
  console.log("全表示ボタンがクリックされました");
  activateBtn(showAllBtn);
  inactivateBtn(filterWatchingBtn);
  inactivateBtn(filterUnwatchingBtn);
  inactivateBtn(filter500);
  inactivateBtn(filterPriceChanged);
  inactivateBtn(showSellingBtn);
  inactivateBtn(showSoldOutBtn);

  listProperties = Object.values(propertyMap);
  renderProperties(listProperties);
});

function genPropertyListTag(property, i) {
  let pageLinkHtml = '';
  const key = getKeyFromProperty(property);
  Object.keys(property.siteMap).forEach(key => {
    const siteMap = property.siteMap[key];
    pageLinkHtml += `<button type="button" class="btn btn-sm btn-primary" onClick='navigator.clipboard.writeText("${siteMap.link}")'>Copy</button>
      <a href='${siteMap.link}' onclick="window.open('${siteMap.link}','','width=1920,height=1080'); return false;"> ${siteMap.name}(${siteMap.company_name?.trim()})</a>,`;
  });

  const priceHistories = genPriceInfoStrs(property.priceHistories);
  return `<div id="${key}" class="card mb-3 ${property.isUnwatching ? "unwatching" : "watching"}">
    <div class="itemBody">
      <div>
        <p class="mainImageRect">
          <img src=${property.build_src} height="300" widtd="170">
        </p>
        ${isDebugMode ? `<p>${i} ${key}</p>` : '' }
      </div>
      <div class="card-body">
        <h3 class="card-title">
          <p style="margin: 0; padding: 0; font-size: 1em;">
            <p>${property.address}
            <button class ="btn btn-outline-primary watching" onclick="watchfy('${key}')">表示化</button>
            <button class ="btn btn-outline-primary unwatching" onclick="unwatchfy('${key}')">非表示化</button>
            </p>
          </p>
        </h3>
        <table class="table table-bordered">
          <tr><th>最新取得日</th><td>${property.lastFetchAt}</td><th>初取得日</th><td>${property.firstFetchAt}</td></tr>
          <tr><th>価格</th><td>${property.priceHistories ? priceHistories.slice(-1)[0] : property.price}</td><th>履歴</th><td>${priceHistories?.join(' -> ')}</td></tr>
          <tr><th>所在地</th><td colspan="3">${property.address}</td></tr>
          <tr><th>交通</th><td colspan="3">${property.traffic}</td></tr>
          <tr><th>土地面積</th><td colspan="3">${property.land_area}</td></tr>
          <tr><th>建物面積</th><td colspan="3">${property.build_area}</td></tr>
          <tr><th>築年月</th><td colspan="3">${property.build_date}</td></tr>
          <tr><th>参照サイト(情報提供会社)</th><td colspan="3">${pageLinkHtml}</td></tr>
        </table>
      </div>
    </div>
  </div>`;
}
function renderProperties(properties){
  const ListTags = properties.map((p, i) => {
    return genPropertyListTag(p, i)
  })
  const propertiesDiv = document.getElementById("properties");
  propertiesDiv.innerHTML = ListTags.join(""); //html要素に変換
}

function getKeyFromProperty(property) {
  return parseFloat(property.land_area.replace(',', '').substr(0, 5))
    + property.address.replace('福島県', '').substr(0, 10)
}
function sortbyFetchDate(properties, orderby="asc"){
  return properties.sort((l1, l2) => {
    if(orderby=="asc") return new Date(l1.firstFetchAt) - new Date(l2.firstFetchAt);
    else return new Date(l2.firstFetchAt) - new Date(l1.firstFetchAt);
  });
}
function genPriceInfoStrs(priceHistories) {
  return priceHistories ? priceHistories.map((ph, i) => {
    return ph.price ? `${ph.price}(${ph.date})` : ph;
  }) : [];
}
function activateBtn(btn) {
  btn.classList.remove('btn-outline-primary');
  btn.classList.add('btn-primary');
}
function inactivateBtn(btn) {
  btn.classList.remove('btn-primary');
  btn.classList.add('btn-outline-primary');
}