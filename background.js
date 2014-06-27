chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    code: "var e = document.createElement('script');e.src = chrome.extension.getURL('inject.js');document.body.appendChild(e);"
  });
},
{
  urls: [
    "*://*.vk.me/js/al/im.js*",
    "*://vk.com/js/al/im.js*",
  ],
  types: ["script"]
});
var altState = false;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.message == "updateAltState") {
    altState = message.altState;
  } else
  if (message.message == "queryAltState") {
    sendResponse(altState);
  }
});