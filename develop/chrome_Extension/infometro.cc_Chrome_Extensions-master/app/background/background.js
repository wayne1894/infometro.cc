// commands 監聽事件
chrome.commands.onCommand.addListener(function(command)
{
  console.debug('command is : ' + command);

  // 重新載入 外掛
  if(commnad == 'reload_extension')chrome.runtime.reload();


});

// 
chrome.bookmarks.onRemoved(function(id, removeInfo){

});



$(function(){
  console.log("Background load ...");
  // 取得所有書籤
  dumpBookmarks();

});

// query 查詢書籤關鍵字
function dumpBookmarks(query){
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function (bookmarkTreeNodes){
      dumpTreeNodes(bookmarkTreeNodes, query);
      //console.log();
    }
  );

}

// bookmarkNodes : 書籤的子資料夾
// query : 查詢書籤關鍵字
function dumpTreeNodes(bookmarkNodes, query){
  for(var i = 0; i< bookmarkNodes.length; i++){
    dumpNode(bookmarkNodes[i],query);
  }
}

// 處理書籤項目
function dumpNode(bookmarkNodes, query){

  // 檢查是否有標題名稱
  if(bookmarkNodes.title){
    // 是否有 查詢字串 及 子項目為 0
    if(query && !bookmarkNodes.children){
      // 查詢 標題 是否有該關鍵字
      if(String(bookmarkNodes.title).indexOf(query) == -1 )
      {
        return "not title ...";
      }
    }
  }

  //console.log(bookmarkNodes.title + " : " + bookmarkNodes.url);
  console.log(bookmarkNodes.id);
  console.log(bookmarkNodes.parentId);
  console.log(bookmarkNodes.index);
  console.log(bookmarkNodes.url);
  console.log(bookmarkNodes.title);
  console.log(bookmarkNodes.dateAdded);
  console.log(bookmarkNodes.dateGroupModified);
  console.log(bookmarkNodes.unmodifiable);
  console.log(bookmarkNodes.children);


  console.log("-----------------------------");

  if(bookmarkNodes.children && bookmarkNodes.children.length > 0){
    dumpTreeNodes(bookmarkNodes.children, query);
  }

}

