let new_property_array;
let before_property_array;
let checkflag;
let getdiv = document.getElementById("div");
let div;
window.onbeforeunload = function () {
  localStorage.clear();
  localStorage.setItem("key", JSON.stringify(new_property_array));
};
window.onload = function () {
  before_property_array = JSON.parse(localStorage.getItem("key"));
  console.log(before_property_array);
  getdiv.innerHTML = "";
  new_property_array = before_property_array;
  for (i = 0; i < before_property_array.length; i++) {
    makeBuildingLi(before_property_array);
  }
};
const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // 'pong' と出力
};
function setFlag(i) {
  //元々falseでチェックでtrue
  Number(i);
  new_property_array[i].flag = true;
  let h2 = document.getElementById(i);
  if (h2.classList.contains("unchecked")) {
    h2.classList.remove("unchecked");
    h2.classList.add("checked");
  }
}
function unsetFlag(i) {
  Number(i);
  new_property_array[i].flag = false;
  let h2 = document.getElementById(`${i}`);
  if (h2.classList.contains("checked")) {
    h2.classList.remove("checked");
    h2.classList.add("unchecked");
  }
}
const watchfilterbtn = document.getElementById("watchfilter");
const allshowbtn = document.getElementById("allshow");
const btn3 = document.getElementById("btn3");
const sortbtn = document.getElementById("sort");
sortbtn.addEventListener("click", async () => {
  for (i = 0; i < new_property_array.length; i++) {
    for (j = new_property_array.length - 1; i < j; j--) {
      let price1 = new_property_array[j - 1].price;
      let price2 = new_property_array[j].price;
      price1 = price1.replace("万円", "");
      price2 = price2.replace("万円", "");
      Number(price1);
      Number(price2);
      console.log(price1);
      console.log(price2);
      if (price1 > price2) {
        let tmp = new_property_array[j - 1];
        new_property_array[j - 1] = new_property_array[j];
        new_property_array[j] = tmp;
      }
    }
  }
  getdiv.innerHTML = "";
  for (i = 0; i < new_property_array.length; i++) {
    makeBuildingLi(new_property_array);
  }
});
watchfilterbtn.addEventListener("click", async () => {
  getdiv.innerHTML = "";
  for (i = 0; i < new_property_array.length; i++) {
    if (new_property_array[i].flag) {
      makeBuildingLi(new_property_array);
    }
  }
});
allshowbtn.addEventListener("click", async () => {
  console.log("全表示ボタンがクリックされました");
  getdiv.innerHTML = "";
  for (i = 0; i < new_property_array.length; i++) {
    makeBuildingLi(new_property_array);
  }
});
btn3.addEventListener("click", async () => {
  console.log("更新ボタンが押されました");
  btn3.classList.add("pushbtn");
  new_property_array = await window.versions.puppeteer();
  getdiv.innerHTML = "";
  console.log(new_property_array);
  if (before_property_array !== undefined) {
    if (before_property_array !== null) {
      console.log("localstorageがあります。");
      for (i = 0; i < before_property_array.length; i++) {
        checkflag = true;
        for (j = 0; j < new_property_array.length; j++) {
          if (before_property_array[i].address == new_property_array[j].address)
            checkflag = false;
        }
        if (checkflag) {
          new_property_array.push(before_property_array[i]);
          console.log("新しい物件が追加されました");
        }
      }
    }
  }
  console.log(new_property_array);
  for (i = 0; i < new_property_array.length; i++) {
    makeBuildingLi(new_property_array);
  }
  btn3.classList.remove("pushbtn");
});
function makeBuildingLi(property_array) {
  let checkclass;
  if (property_array[i].flag) checkclass = "checked";
  else checkclass = "unchecked";

  let str = `<div style ="border: 1px solid #ddd; border-bottom: none; width: 700px">
  <h2 id = ${i} class = ${checkclass}>
    <p style="margin: 0;
    padding: 0;
    font-size: 1em;">
    <a href='${property_array[i].link}' target="_blank">
        ${property_array[i].address}</a>
    <button class ="watched" onclick="setFlag(${i})">チェック</button>
    <button class ="unwatched" onclick="unsetFlag(${i})">未チェック</button>
    </p>
  </h2>
  <div class="itemBody">
    <p class="itemDescription"></p>
    <div class="clearfix">
      <div style="float: left;
      margin-right: 9px;
        <p class="mainImageRect">
          <a href="/chuko/ikkodate/fukushima/aizuwakamatsushi/suumof_70599242/" target="_blank" data-pbcd-track-on-click="">
            <img alt=A src=${property_array[i].build_src} height="300" widtd="170">
          </a>
        </p>
      </div>
        <table border="1" class="row">
        <tr><th>価格</th><td>${property_array[i].price}</td></tr>
        <tr><th>所在地</th><td>${property_array[i].address}</td></tr>
        <tr><th>交通</th><td>${property_array[i].traffic}</td></tr>
        <tr><th>土地面積</th><td>${property_array[i].land_area}</td></tr>
        <tr><th>建物面積</th><td>${property_array[i].build_area}</td></tr>
        <tr><th>築年月</th><td>${property_array[i].build_date}</td></tr>
        <tr><th>参照サイト</th><td>${property_array[i].site}</td></tr>
        </table>
    </div>
  </div>
  </div>`;
  if (i % 2 == 0) {
    //iが偶数の時
    div = document.createElement("div");
    div.classList.add("flex");
  }
  let div2 = document.createElement("div");
  div2.innerHTML = str; //html要素に変換
  div.appendChild(div2);
  if (i % 2 == 0) {
    //iが偶数の時
    getdiv.appendChild(div); //getdivに追加
  }
}

func();
