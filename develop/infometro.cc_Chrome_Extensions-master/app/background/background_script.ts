

class BookmarkTreeNode {
    public id: string;
    public parentId: string;
    public index: number;
    public url: string;
    public title: string;
    public dateAdded: number;
    public dateGroupModified: number;
    public unmodifiable: any;
    public children: Array<BookmarkTreeNode>;

}

class RemoveInfo {
    public parentId: string;
    public index: number;
    public node: BookmarkTreeNode;
}

class ChangeInfo {
    public title: string;
    public url: string;
}

class MoveInfo {
    public parentId: string;
    public index: number;
    public oldParentId: string;
    public oldIndex: number;
}

var chrome: any;

class GoogleBookmark {

    public main(): void {
        console.log("main start ...");
        //this.dumpBookmarks();

        // 設定事件
        chrome.bookmarks.onCreated.addListener(this.onCreated);
        chrome.bookmarks.onRemoved.addListener(this.onRemoved);
        chrome.bookmarks.onChanged.addListener(this.onChanged);
        chrome.bookmarks.onMoved.addListener(this.onMoved);

    }

    // 新增事件處理
    public onCreated(id: string, node: BookmarkTreeNode): void {
        console.log("Create Title : " + node.title);
        console.log(node);
    }

    // 移除事件處理
    public onRemoved(id: string, removeInfo: RemoveInfo): void {
        console.log("Remove Title:" + removeInfo.node.title);
        console.log(removeInfo);
    }

    // 連結及標題變更事件處理
    public onChanged(id: string, changeInfo: ChangeInfo): void {
        console.log(changeInfo);
    }

    public onMoved(id: string, moveInfo: MoveInfo): void {
        console.log(moveInfo);
    }


    public getChildren(id: string): void {
        //var children:Array<BookmarkTreeNode> = new Array<BookmarkTreeNode>();
        var children: Array<BookmarkTreeNode>;
        chrome.bookmark.getChildren(id, function (node: BookmarkTreeNode) {
            console.log(node);
        });
    }

    // query 查詢書籤關鍵字
    public dumpBookmarks(query?: string): void {
        var self = this;
        var bookmarkTreeNodes = chrome.bookmarks.getTree(
            function (bookmarkTreeNodes: Array<BookmarkTreeNode>) {
                console.log(bookmarkTreeNodes.length);
                self.dumpTreeNodes(bookmarkTreeNodes, query);

            }
        );
    }

    // bookmarkNodes : 書籤的子資料夾
    // query : 查詢書籤關鍵字
    public dumpTreeNodes(bookmarkNodes: Array<BookmarkTreeNode>, query?: string): void {
        console.log("dumpTreeNodes");
        for (var i = 0; i < bookmarkNodes.length; i++) {
            var node = bookmarkNodes[i];
            this.dumpNode(node, query);
        }
    }

    public dumpNode(bookmarkNode: BookmarkTreeNode, query?: string): void {

        // 檢查是否有標題名稱
        if (bookmarkNode.title) {
            // 是否有 查詢字串 及 子項目為 0
            if (query && !bookmarkNode.children) {
                // 查詢 標題 是否有該關鍵字
                if (String(bookmarkNode.title).indexOf(query) == -1) {
                    console.log("not nodes ... ");
                    return;
                }
            }
        }

        console.log(bookmarkNode.id);
        console.log(bookmarkNode.parentId);
        console.log(bookmarkNode.index);
        console.log(bookmarkNode.url);
        console.log(bookmarkNode.title);
        console.log(bookmarkNode.dateAdded);
        console.log(bookmarkNode.dateGroupModified);
        console.log(bookmarkNode.unmodifiable);
        console.log(bookmarkNode.children);


        console.log("-----------------------------");

        if (bookmarkNode.children && bookmarkNode.children.length > 0) {
            this.dumpTreeNodes(bookmarkNode.children, query);
        }

    }
}



var firebase: any;

class UserInfo{
    public displayName:string;
    public email:string;
    public photoURL:string;
    public emailVerified:boolean;
    public uid:string;
}

class FirebaseConfig {
    public projectId: string;
    public apiKey: string;
    public authDomain: string;
    public databaseURL: string;
    public storageBucket: string;
    public messagingSenderId: string;
}

class Firebase {
    private database: any;
    public userLogin: UserInfo;

    constructor() {
        var config = new FirebaseConfig();
        config.apiKey = "AIzaSyA-eyOoV5ZTrV5PTdIuXzYupLO--q_LlrM";
        config.authDomain = "infometrotest.firebaseapp.com";
        config.databaseURL = "https://infometrotest.firebaseio.com";
        config.projectId = "infometrotest";
        config.storageBucket = "infometrotest.appspot.com";
        config.messagingSenderId = "877952539415";

        // 初始化
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged(this.onAuthStateChangedHandle);

        // 取得資料庫
        this.database = firebase.database();

        

    }

    // 處理登入狀態改變
    public onAuthStateChangedHandle(user: UserInfo): void {

        if (user) {
            this.userLogin = user;
            console.log("User is logined", user);
        } else {
            this.userLogin = null;
            console.log("User is not logined yet.");
        }

    }

    // 登入
    public login(email: string, password: string): void {

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (result: UserInfo) {
                console.log("login :", result);
            }).catch(function (error: any) {
                var errorCode = error.code;
                var errorMsg = error.message;
                console.log(errorMsg);
            });

    }

    // 註冊
    public regedit(email: string, password: string): void {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (result: UserInfo) {
                console.log("regedit :", result);
            }).catch(function (error: any) {
                var errorCode = error.code;
                var errorMsg = error.message;
                console.log(errorMsg);
            })
    }

    // 登出
    public logout() {
        firebase.auth().signOut()
            .then(function (result: UserInfo) {
                console.log("logout :", result);
            }, function (error: any) {
                console.log("錯誤：", error);
            });
    }

    // 取得當前的使用者資料
    public currentUser(): UserInfo {
        var user = firebase.auth().currentUser;
        return user;
    }

}

$(function () {
    console.log("Background load ...");
    var googleBookmark = new GoogleBookmark();
    googleBookmark.main();
    var db = new Firebase();
});
