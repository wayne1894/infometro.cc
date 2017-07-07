# infometro.cc 資訊地鐵站
http://infometro.cc


### Tech

Dillinger uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Ace Editor] - awesome web-based text editor
* [markdown-it] - Markdown parser done right. Fast and easy to extend.
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [Breakdance](http://breakdance.io) - HTML to Markdown converter
* [jQuery] - duh

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md] [PlDb] |
| Github | [plugins/github/README.md] [PlGh] |
| Google Drive | [plugins/googledrive/README.md] [PlGd] |
| OneDrive | [plugins/onedrive/README.md] [PlOd] |
| Medium | [plugins/medium/README.md] [PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md] [PlGa] |

## 開發環境建置

建議需要 [Node.js](https://nodejs.org/) v6+ to run.

```sh
$ cd infometro
$ npm install
$ node app
```

This will create the dillinger image and pull in the necessary dependencies. Be sure to swap out `${package.json.version}` with the actual version of Dillinger.

```sh
docker run -d -p 8000:8080 --restart="always" <youruser>/dillinger:${package.json.version}
```

See [KUBERNETES.md](https://github.com/joemccann/dillinger/blob/master/KUBERNETES.md)


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
