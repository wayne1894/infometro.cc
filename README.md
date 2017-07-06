# infometro.cc 資訊地鐵站
http://infometro.cc
## 開發環境建置
開發要在 develop 資料夾下開發，透過gulp的watch 將檔案重新建立在public資料夾 

<br>
  以下列出開發所需安裝的東西：
  <br>
  1、安裝node.js、npm
  <br>
  2、把infometro clone 到你有版控環境的電腦
  <br>
  3、開啟終端機，cd 到infometro 根目錄，輸入 npm install，進行package.json套件安裝(這裡會安裝gulp.js)
  <br>
  4、輸入 gulp，會自動跳出網頁(監聽1313 port)，日後你修改develop裡檔案的內容，網頁會自動重新整理
	
  <br>
	5、
	如果你想用你的firebase資料庫開發，您必需建立一個firebase的個人資料，然後更改firebase_init.js 裡firebase.initializeApp 的相關序號
	datebase 規則的部份，必需設定為以下，本程式才有權限讀取資料庫
```	
{
  "rules": {
    "users":{
      "$uid":{
        ".read": true,
        ".write": "!data.exists() || auth.uid === $uid"
      }
    },
    "users_data":{
      "$uid":{
        ".read": "auth.uid === $uid ",
        ".write": "!data.exists() || auth.uid === $uid "
      }
    },
    "info":{
      "$line": {
        "root" : {
          ".read" : true,
          ".write" : "!data.exists() || data.parent().child('root').val().contains(auth.uid)"
        },
        "metro" : {
          ".read": "data.parent().child('root').val().contains(auth.uid)",
          ".write": "data.parent().child('root').val().contains(auth.uid)"
        }
      }
    },
    "blueprint":{
			"$uid":{
        ".read": "auth.uid === $uid ",
        ".write": "auth.uid === $uid "
      }
    },
    "file" : {
      ".read": "false",
      ".write": "true"
    }
  }
}
```

6、