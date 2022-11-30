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
  new_property_array = await window.versions.puppeteer();
  getdiv.innerHTML = "";
  console.log(new_property_array);
  if (before_property_array !== undefined) {
    if (before_property_array !== null) {
      console.log("nullじゃない");
      console.log(before_property_array.length);
      console.log(new_property_array.length);
      console.log(new_property_array);
      console.log(before_property_array);
      for (i = 0; i < before_property_array.length; i++) {
        checkflag = true;
        for (j = 0; j < new_property_array.length; j++) {
          if (before_property_array[i].address == new_property_array[j].address)
            checkflag = false;
        }
        if (checkflag) {
          new_property_array.push(before_property_array[i]);
          console.log("============");
        }
      }
    }
  }
  console.log(new_property_array);
  for (i = 0; i < new_property_array.length; i++) {
    makeBuildingLi(new_property_array);
  }
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
      margin-bottom: 230px;
      width: 227px;">
        <p class="mainImageRect">
          <a href="/chuko/ikkodate/fukushima/aizuwakamatsushi/suumof_70599242/" target="_blank" data-pbcd-track-on-click="">
            <img alt=A src=${property_array[i].build_src} height="127" width="170">
          </a>
        </p>
      </div>
      <div>
        <dl style="width: 100%;
        line-height: 1.5;">
        <dt style="background: #f1f9c5;
        font-weight: normal;
        color: #224619;">価格</dt>
          <dd style="font-size: 1.25em;
          font-weight: bold;
          color: #ec5300;">${property_array[i].price}</dd>
        <dt style="background: #f1f9c5;
        font-weight: normal;
        color: #224619;">所在地</dt>
          <dd>${property_array[i].address}</dd>
        <dt style="background: #f1f9c5;
        font-weight: normal;
        color: #224619;">交通</dt>
          <dd>${property_array[i].traffic}</dd>
        <dt style="background: #f1f9c5;
        font-weight: normal;
        color: #224619;">土地面積</dt>
          <dd style="padding-left: 195;">${property_array[i].land_area}</dd>
        <dt style="background: #f1f9c5;
        font-weight: normal;
        color: #224619;
        ">建物面積</dt>
          <dd style="padding-left: 195;">${property_array[i].build_area}</dd>
        <dt  style="background: #f1f9c5;
        font-weight: normal;
        color: #224619;
        ">築年月</dt>
          <dd style="padding-left: 195;">${property_array[i].build_date}</dd>
        <dt  style="background: #f1f9c5;
        font-weight: normal;
        color: #224619;
        ">参照サイト</dt>
          <dd style="padding-left: 195;">${property_array[i].site}</dd>
        </dl>
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
