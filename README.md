# infometro.cc 資訊地鐵站
http://infometro.cc (登入頁)<br>
http://infometro.cc/metro.html  (主頁)

## 開發環境建置
開發要在 develop資料夾下開發，透過node.js gulp程式 將檔案build到上層 <br>
多人開發，除了上版人，其他人只版控 develop 和 src/static 的內容(請設定git ignore)，
<br>
因為其他內容是由gulp即時build出來的，由上版人統一管理。
<br>
  以下列出開發所需安裝的東西：
  <br>
  1、安裝node.js、npm
  <br>
  2、把infometro clone到你有版控環境的電腦(版控可以使用sourcetree 圖形管理介面)
  <br>
  3、開啟終端機，cd 到infometro 根目錄，輸入 npm install，進行package.json套件安裝(這裡會安裝gulp.js)
  <br>
  4、cd到 develop ，輸入 gulp，會自動跳出網頁(監聽1313 port)，日後你修改develop裡檔案的內容，網頁會自動重整
  <br>
  
## 第一版本要開發的功能
  
