const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { default: puppeteer } = require("puppeteer");
const athome = require("../js/athome.js");
const hatomark = require("../js/hatomark.js");
const housego = require("../js/housego.js");
const nifty = require("../js/nifty.js");
const aisumu = require("../js/aisumu.js");
if (require("electron-squirrel-startup")) {
  app.quit();
}
async function AutomationPuppeteer() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "defaultViewport: null"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  const property_array = [];
  //配列にhatoarrayが入ったものが帰ってくる
  const hatomark_array = await hatomark.hatomark(page);
  //const athome_array = await athome.athome(page);
  const housego_array = await housego.housego(page);
  const nifty_array = await nifty.nifty(page);
  const aisumu_array = await aisumu.aisumu(page);
  for (i = 0; i < hatomark_array.length; i++) {
    property_array.push(hatomark_array[i]);
  }
  // for (i = 0; i < athome_array.length; i++) {
  //   property_array.push(athome_array[i]);
  // }
  for (i = 0; i < housego_array.length; i++) {
    property_array.push(housego_array[i]);
  }
  for (i = 0; i < nifty_array.length; i++) {
    property_array.push(nifty_array[i]);
  }
  for (i = 0; i < aisumu_array.length; i++) {
    property_array.push(aisumu_array[i]);
  }
  //console.log(property_array);
  console.log(property_array.length);
  browser.close();
  return property_array;
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 108,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), //(実行中のスクリプトパス,レンダリング前にバージョン公開)非同期でスクリプトをロード
    },
  });

  //(preloadのkey"set-title"からtitle文字列取得,handleSetTitleにipcMainEvent構造体とtitleを送る)
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  //mainWindowにindex.html読み込み
  mainWindow.webContents.openDevTools(); //Developerツールを開いてサイトを開く
};

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong"); //setup送信,preloadのinvoke("ping")
  ipcMain.handle("automation", AutomationPuppeteer);
  createWindow();
  app.on("activate", () => {
    //activateをリッスン(mac用)
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  //全てのウィンドウが閉じられると終了(終了するまでアクティブ)
  if (process.platform !== "darwin") {
    //darwin=macOS
    app.quit();
  }
});
