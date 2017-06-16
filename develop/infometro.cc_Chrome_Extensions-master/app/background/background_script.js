var BookmarkTreeNode = (function () {
    function BookmarkTreeNode() {
    }
    return BookmarkTreeNode;
}());
var RemoveInfo = (function () {
    function RemoveInfo() {
    }
    return RemoveInfo;
}());
var ChangeInfo = (function () {
    function ChangeInfo() {
    }
    return ChangeInfo;
}());
var MoveInfo = (function () {
    function MoveInfo() {
    }
    return MoveInfo;
}());
var chrome;
var GoogleBookmark = (function () {
    function GoogleBookmark() {
    }
    GoogleBookmark.prototype.main = function () {
        console.log("main start ...");
        chrome.bookmarks.onCreated.addListener(this.onCreated);
        chrome.bookmarks.onRemoved.addListener(this.onRemoved);
        chrome.bookmarks.onChanged.addListener(this.onChanged);
        chrome.bookmarks.onMoved.addListener(this.onMoved);
    };
    GoogleBookmark.prototype.onCreated = function (id, node) {
        console.log("Create Title : " + node.title);
        console.log(node);
    };
    GoogleBookmark.prototype.onRemoved = function (id, removeInfo) {
        console.log("Remove Title:" + removeInfo.node.title);
        console.log(removeInfo);
    };
    GoogleBookmark.prototype.onChanged = function (id, changeInfo) {
        console.log(changeInfo);
    };
    GoogleBookmark.prototype.onMoved = function (id, moveInfo) {
        console.log(moveInfo);
    };
    GoogleBookmark.prototype.getChildren = function (id) {
        var children;
        chrome.bookmark.getChildren(id, function (node) {
            console.log(node);
        });
    };
    GoogleBookmark.prototype.dumpBookmarks = function (query) {
        var self = this;
        var bookmarkTreeNodes = chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
            console.log(bookmarkTreeNodes.length);
            self.dumpTreeNodes(bookmarkTreeNodes, query);
        });
    };
    GoogleBookmark.prototype.dumpTreeNodes = function (bookmarkNodes, query) {
        console.log("dumpTreeNodes");
        for (var i = 0; i < bookmarkNodes.length; i++) {
            var node = bookmarkNodes[i];
            this.dumpNode(node, query);
        }
    };
    GoogleBookmark.prototype.dumpNode = function (bookmarkNode, query) {
        if (bookmarkNode.title) {
            if (query && !bookmarkNode.children) {
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
    };
    return GoogleBookmark;
}());
var firebase;
var UserInfo = (function () {
    function UserInfo() {
    }
    return UserInfo;
}());
var FirebaseConfig = (function () {
    function FirebaseConfig() {
    }
    return FirebaseConfig;
}());
var Firebase = (function () {
    function Firebase() {
        var config = new FirebaseConfig();
        config.apiKey = "AIzaSyA-eyOoV5ZTrV5PTdIuXzYupLO--q_LlrM";
        config.authDomain = "infometrotest.firebaseapp.com";
        config.databaseURL = "https://infometrotest.firebaseio.com";
        config.projectId = "infometrotest";
        config.storageBucket = "infometrotest.appspot.com";
        config.messagingSenderId = "877952539415";
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged(this.onAuthStateChangedHandle);
        this.database = firebase.database();
    }
    Firebase.prototype.onAuthStateChangedHandle = function (user) {
        if (user) {
            this.userLogin = user;
            console.log("User is logined", user);
        }
        else {
            this.userLogin = null;
            console.log("User is not logined yet.");
        }
    };
    Firebase.prototype.login = function (email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (result) {
            console.log("login :", result);
        })["catch"](function (error) {
            var errorCode = error.code;
            var errorMsg = error.message;
            console.log(errorMsg);
        });
    };
    Firebase.prototype.regedit = function (email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (result) {
            console.log("regedit :", result);
        })["catch"](function (error) {
            var errorCode = error.code;
            var errorMsg = error.message;
            console.log(errorMsg);
        });
    };
    Firebase.prototype.logout = function () {
        firebase.auth().signOut()
            .then(function (result) {
            console.log("logout :", result);
        }, function (error) {
            console.log("錯誤：", error);
        });
    };
    Firebase.prototype.currentUser = function () {
        var user = firebase.auth().currentUser;
        return user;
    };
    return Firebase;
}());
$(function () {
    console.log("Background load ...");
    var googleBookmark = new GoogleBookmark();
    googleBookmark.main();
    var db = new Firebase();
});
//# sourceMappingURL=background_script.js.map