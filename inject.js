var altState = false;
window.addEventListener("keydown",
  function(e) {
    altState = e.altKey;
  },
false);
window.addEventListener("keyup",
  function(e){
    altState = e.altKey;
  },
false);

var __onMyTyping = IM.onMyTyping;
var __markRead = IM.markRead;
var __markPeer = IM.markPeer;

IM.onMyTyping = function() {
  // nothing at all
}

IM.markRead = function() {
  if (!altState && __markRead) {
    __markRead.apply(this, arguments);
  }
}

IM.markPeer = function() {
  if (!altState && __markPeer) {
    __markPeer.apply(this, arguments);
  }
}