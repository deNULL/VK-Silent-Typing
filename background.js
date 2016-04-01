chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    code: "var e = document.createElement('script');e.src = chrome.extension.getURL('inject.js');e.onload=function(){\
      window.addEventListener('message', function(e) {\
        if (e.data.message == 'updateStateInject') {\
          chrome.runtime.sendMessage({ message: 'updateAltState', altState: e.data.altState, fixed: e.data.fixed });\
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
    "*://new.vk.com/js/al/imn.js*"
  ],
  types: ["script"]
});
var altState = false;
var fixed = false;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.message == "updateAltState") {
    altState = message.altState;
    fixed = message.fixed;
    toggleRequestBlocking(altState || fixed);
  } else
  if (message.message == "queryAltState") {
    sendResponse(altState);
  } else
  if (message.message == "openExtensions") {
    chrome.tabs.create({'url': 'chrome://extensions/?id=' + chrome.runtime.id } );
  }
});

var requestBlocked = false;
function toggleRequestBlocking(block) {
  if (block == requestBlocked) {
    return;
  }

  function listener(details) {
    if (!details || !details.requestBody) {
      return { cancel: false };
    }

    if (details.requestBody.formData) {
      // Already parsed FormData
      var fd = details.requestBody.formData;
      return { cancel: (fd.act == 'a_mark_read') };
    }

    if (details.requestBody.raw) {
      // Raw data, split into fields
      if (!details.requestBody.raw[0] || !details.requestBody.raw[0].bytes) {
        return { cancel: false };
      }

      var kv = String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)).split('&');
      for (var i = 0; i < kv.length; i++) {
        var pair = kv[i].split('=');
        if (pair[0] == 'act' && pair[1] == 'a_mark_read') {
          return { cancel: true };
        }
      }
    }

    return { cancel: false };
  }

  if (block) {
    chrome.webRequest.onBeforeRequest.addListener(listener, { urls: ['*://*.vk.com/al_im.php'] }, ['blocking', 'requestBody']);
  } else {
    chrome.webRequest.onBeforeRequest.removeListener(listener);
  }
  requestBlocked = block;
}