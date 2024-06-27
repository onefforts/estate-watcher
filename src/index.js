const { app, BrowserWindow, ipcMain, dialog, session } = require("electron");
const electronReload = require('electron-reload')

const fs = require('fs')
const path = require("path");
const { default: puppeteer } = require("puppeteer");
const athome = require("../js/athome.js");
const hatomark = require("../js/hatomark.js");
const housego = require("../js/housego.js");
const nifty = require("../js/nifty.js");
const aisumu = require("../js/aisumu.js");
const iestation = require("../js/iestation.js");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let webcontents;
let previous_text = "";
let active;
if (require("electron-squirrel-startup")) {
  app.quit();
}
const isDev = true; //process.env.NODE_ENV === 'development';

// macとwinでElectron実行のPATHが違う
const execPath =
  process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/.bin/electron';

if (isDev) {
  electronReload(__dirname, {
    electron: path.resolve(__dirname, execPath)
  });

  const fs = require('fs');
  fs.watch(path.resolve(__dirname, '../js'), () => { // 監視対象が変更されたら
    mainWindow.reload(); // mainWindow(rendererプロセス)をreloadする
  });
}

async function fetchProperties() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox --profile-directory="profile_estate-watcher"'],
    userDataDir: "./profile_estate-watcher"
  });

  const properties = (await Promise.all([
      aisumu.getProperties(browser),
      athome.getProperties(browser),
      hatomark.getProperties(browser),
      housego.getProperties(browser),
      iestation.getProperties(browser),
      nifty.getProperties(browser)
    ])).flat(1);

  browser.close();
  return properties;
}
function Search(_event, text) {
  console.log(text);
  if (previous_text === text) {
    webcontents.findInPage(text, { findNext: true });
    // 前回の検索時とテキストが変わっていないので次のマッチを検索
  } else {
    // 検索開始
    previous_text = text;
    webcontents.findInPage(text); //api使用
  }
}
function StopSearch() {
  webcontents.stopFindInPage("clearSelection");
}
const createWindow = () => {
  // Create the browser window.webContents
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), //(実行中のスクリプトパス,レンダリング前にバージョン公開)非同期でスクリプトをロード
      contextIsolation: true,
    },
  });
  //(preloadのkey"set-title"からtitle文字列取得,handleSetTitleにipcMainEvent構造体とtitleを送る)
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  //////////////////////////////////////////////////////////////

  webcontents = mainWindow.webContents;
  webcontents.on("found-in-page", (event, result) => {
    console.log(event);
    //api作成,インスタンス化
    if (result.activeMatchOrdinal) {
      console.log(result);
      active = result.activeMatchOrdinal;
    } //アクティブなマッチの位置を覚えておく
    if (result.finalUpdate) {
      result_string = `${active}/${result.matches}`;
    } // M個のマッチ中 N 番目がアクティブな時，N/M という文字列をつくる

  });

  ////////////////////////////////////////////////////////////////
  //mainWindowにindex.html読み込み
  mainWindow.webcontents.setwindowOpenHandler(); //Developerツールを開いてサイトを開く
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.handle("fetchProperties", fetchProperties);
  ipcMain.on("search", Search);
  ipcMain.handle("stopsearch", StopSearch);
  ipcMain.handle('readJson', async filename => {
    return fs.readFileSync(`./data/${filename}`, { encoding: 'utf8' });
  });
  ipcMain.handle('writeJson', async (filename, json) => {
    fs.writeFileSync(`./data/${filename}`, json);
  });

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
