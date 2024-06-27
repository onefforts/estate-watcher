const { contextBridge, ipcRenderer, ipcMain } = require("electron");

//隔離ワールド
contextBridge.exposeInMainWorld("org", {
  //レンダラーでロードしたページはここでJS実行
  node: () => process.org.node,
  chrome: () => process.org.chrome,
  electron: () => process.org.electron,
  fetchProperties: () => ipcRenderer.invoke("fetchProperties"),
  search: (text) => ipcRenderer.send("search", text),
  stopsearch: () => ipcMain.invoke("stopsearch"),
  readJson: (filename) => ipcMain.invoke("readJson", filename),
  writeJson: (filename, json) => ipcMain.invoke("writeJson", filename, json),
});
// 関数だけでなく、変数も公開できます

//下記の二つアクセスできないのを解決
//レンダラ---API
//メインプロセス---DOM

//Web->mainプロセス ipcMain.handle,ipcRender.invokeで公開

//nodejsの入れ方
//1.invoke,2.handle,3.html構築で行う,4.行うjs作成
//1,2,3環境構築,4,html反映,関数を使う