chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    code: "var e = document.createElement('script');e.src = chrome.extension.getURL('inject.js');e.onload=function(){\
      window.addEventListener('message', function(e) {\
        if (e.data.message == 'updateStateInject') {\
          chrome.runtime.sendMessage({ message: 'updateAltState', altState: e.data.altKey, fixed: e.data.fixed });\
        } else\
        if (e.data.message == 'openExtensions') {\
          chrome.runtime.sendMessage({ message: 'openExtensions' });\
        }\
      }, false);\
      window.postMessage({message:'updateState',altState:" + altState + ",fixed:" + fixed + "}, '*');};document.body.appendChild(e);"
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
var fixed = false;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.message == "updateAltState") {
    altState = message.altState;
    fixed = message.fixed;
  } else
  if (message.message == "queryAltState") {
    sendResponse(altState);
  } else
  if (message.message == "openExtensions") {
    chrome.tabs.create({'url': 'chrome://chrome/extensions/' } );
  }
});