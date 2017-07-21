# infometro.cc 資訊地鐵站
### [https://infometro.cc](https://infometro.cc)
## 概念介紹
#### infometro 是一款利用地鐵圖來整理資訊的網站，用來保存創意和想法。
[![Screen Shot](https://infometro.cc/src/static/images/s3/LHXNGI0XjP.gif)](https://infometro.cc)

## 開發環境建置
### 本機環境

```sh
 1、安裝node.js、npm
 2、clone [https://github.com/wayne1894/infometro.cc.git](https://github.com/wayne1894/infometro.cc.git)
 3、cd 到infometro 目錄，輸入`npm install`，進行package.json套件安裝 (這裡會一併安裝gulp.js)
 4、輸入 `gulp`，會自動跳出網頁(監聽1313 port)，日後修改 `develop` 裡的檔案，網頁會重新整理，並將檔案build 到 public
```

### 資料庫環境
* 到 [google firebase](https://firebase.google.com/) 建立一個空專案
* 進入控制台後，找到 `將Firebase 加入您的網路應用程式` 裡的代碼，並更新 infometro `firebase_init.js` firebase.initializeApp 的部份
* Authentication 登入方式，請把 登入供應商 `google 帳號`和 `匿名` 打開，infometro目前採用這兩個
* 設定資料庫 rules規則 ，請將下面 Realtime Database 和 Storage 的部份，覆蓋掉firebase 的rules
* 這樣你的本機就可以讀取你的個人資料庫，若要提供給人使用，就必需透過 firebase 的 hosting (請參考下面 將程式發佈到fireabse上去)

### 資料庫 rules 設定

Realtime Database

```bash
{"rules":{"log":{".read":true,".write":"auth.uid != null"},"users":{"$uid":{".read":true,".write":"!data.exists() || auth.uid === $uid || auth.uid === 'test_uid'"}},"users_data":{"$uid":{".read":"auth.uid === $uid || auth.uid === 'lVAHfyuy4gN4UmiJ7WMYtIwKDts2'",".write":"!data.exists() || auth.uid === $uid || auth.uid === 'test_uid'"}},"info":{"$line":{"root":{".read":true,".write":"!data.exists() || data.parent().child('root').val().contains(auth.uid) || auth.uid === 'test_uid'"},"metro":{".read":"data.parent().child('root').val().contains(auth.uid) || auth.uid === 'test_uid'",".write":"data.parent().child('root').val().contains(auth.uid) || auth.uid === 'test_uid'"}}},"blueprint":{"$uid":{".read":"auth.uid === $uid || auth.uid === 'test_uid'",".write":"auth.uid === $uid || auth.uid === 'test_uid'"}},"file":{".read":"false",".write":"auth.uid != null"}}}

```

Storage

```bash
service firebase.storage{match /b/{bucket}/o{match /{allPaths=**}{allow read,write:if request.auth!= null;// Only allow uploads of any image file that's less than 500MB allow write:if request.resource.size < 5 * 1024 * 1024 * 1024 * 1024}}}

```

### 網站擷取程式

目前放在aws上的一隻後端擷取程式，可以在輸入網址時爬出網頁資訊，這隻程式是架設在aws上，目前暫時提供，但不保證是免費提供的。

### firebase functions

index.js 提供infometro 站內備份資料功能的寄信程式，請將 `your_email@gmail.com` 改成你自己使用的email，`pass` 為密碼。

### 將程式發佈到 firebase 上去
firebase node 版本必需大於6.X的樣子 ，不然無法操作以下指令 <br>
請先參考 [fireabse deploy](https://firebase.google.com/docs/hosting/deploying) 教學。

```sh
$ cd infometro
$ firebase init
$ firebase use infometro-cc
$ firebase deploy --only hosting
```

以下為上functions的語法
```sh
$ firebase deploy --only functions
```

## 目前版本說明

參考：https://www.facebook.com/infometro.cc

## 正在進行中的功能

待補



## Licence

原始碼可在[github](https://github.com/georgeOsdDev/markdown-edit)上找到, 使用 [MPL-2.0](https://opensource.org/licenses/MPL-2.0)授權。

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

Developed by [wayne1894](http://github.com/wayne1894)

    
