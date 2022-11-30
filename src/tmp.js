function makeBuildingLi(property_array) {
  let str = `<div style ="border: 1px solid #ddd; border-bottom: none;">`;
  let uncheckstr = `<h2 style="border-bottom: 1px solid #ddd;
  padding: 9px 10px 7px;
  background: #F6F5E7;
  text-decoration: none;
  color: #333;
  font-size: 16px;">
    <p style="margin: 0;
    padding: 0;
    font-size: 1em;">
    <a href='${property_array[i].link}' target="_blank">
        ${property_array[i].address}</a>
    <button class ="watched" onclick="setFlag(${i})">チェック</button>
    <button class ="unwatched" onclick="unsetFlag(${i})">未チェック</button>
    </p>
  </h2>`;
  let checkstr = `<h2 style="border-bottom: 1px solid #ddd;
  padding: 9px 10px 7px;
  background: #ffa500;
  text-decoration: none;
  color: #333;
  font-size: 16px;">
    <p style="margin: 0;
    padding: 0;
    font-size: 1em;">
    <a href='${property_array[i].link}' target="_blank">
        ${property_array[i].address}</a>
    <button class ="watched" onclick="setFlag(${i})">チェック</button>
    <button class ="unwatched" onclick="unsetFlag(${i})">未チェック</button>
    </p>
  </h2>`;
  let str2 = `<div class="itemBody">
      <p class="itemDescription"></p>
      <div class="clearfix">
        <div style="float: left;
        margin-right: 9px;
        margin-bottom: 160px;
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
}
