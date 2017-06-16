//region {variables and functions}
var consoleGreeting = "Hello World! - from event_script.js";
var details = {"path":"icon-2.png"};
//end-region
//region {calls}
console.log(consoleGreeting);
chrome.commands.onCommand.addListener(function(command) {
chrome.browserAction.setIcon(
details,
function() {/**/}
);
});
//end- regio