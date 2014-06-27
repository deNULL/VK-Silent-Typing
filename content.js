window.addEventListener("keydown",
  function(e) {
    chrome.runtime.sendMessage({ message: "updateAltState", altState: e.altKey });
  },
false);
window.addEventListener("keyup",
  function(e){
    chrome.runtime.sendMessage({ message: "updateAltState", altState: e.altKey });
  },
false);