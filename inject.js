if (!vkst_inject) {
  var vkst_inject = true;
  (function() {
    var altState = false;
    var fixed = false;

    window.addEventListener("message", function(e) {
      if (e.data.message == 'updateState') {
        //altState = e.data.altState;
        fixed = e.data.fixed;
        hintPanel(altState || fixed);
      }
    }, false);
    document.addEventListener("keydown",
      function(e) {
        altState = e.altKey;
        hintPanel(altState || fixed);
      },
    false);
    document.addEventListener("keyup",
      function(e){
        altState = e.altKey;
        hintPanel(altState || fixed);
      },
    false);

    var __onMyTyping = IM.onMyTyping;
    var __markRead = IM.markRead;
    var __markPeer = IM.markPeer;

    IM.onMyTyping = function() {
      // nothing at all
    }

    IM.markRead = function() {
      if (!altState && !fixed && __markRead) {
        __markRead.apply(this, arguments);
      }
    }

    IM.markPeer = function() {
      if (!altState && !fixed && __markPeer) {
        __markPeer.apply(this, arguments);
      }
    }

    var panel = false;
    var dispTimer = false;
    function hintPanel(visible) {
      if (dispTimer) {
        clearTimeout(dispTimer);
      }

      if (!panel) {
        if (!visible) return;

        var pl = ge('page_header');
        panel = ce('div', {}, {
          width: '280px',
          background: '#fff',
          position: 'absolute',
          top: '124px',
          right: '-280px',
          zIndex: '1000',
          border: '1px solid rgba(100, 100, 100, 0.08)',
          display: 'none',
        });
        panel.innerHTML = '<div style="\
        border: solid #D9E0E7; \
        border-width: 0px 1px 1px 0px;\
        text-align: center;\
        padding: 8px;\
        line-height: 160%;\
    ">Благодаря <a href="about:blank" onclick="window.postMessage({ message: \'openExtensions\' }, \'*\'); return false;" target="_blank">расширению <b>VK Silent Typing</b></a>, пока вы удерживаете <b>Alt</b>, все открываемые диалоги будут оставаться непрочитанными для собеседников.<div style="\
        margin: 10px 0px;\
        padding: 8px;\
        background: #EDF1F5;\
        color: #2B587A;\
        cursor: pointer;\
        border-radius: 3px;\
    " id="vkst_button">Зафиксировать в этом состоянии</div>А после нажатия этой кнопки эффект будет сохраняться и с отпущенным <b>Alt</b>.</div>';
        pl.appendChild(panel);

        var btn = ge('vkst_button');
        btn.onmouseover = function() {
          this.style.background = fixed ? '#597DA3' : '#E1E7ED';
        }
        btn.onmouseout = function() {
          updateBtn();
        }
        btn.onclick = function() {
          fixed = !fixed;
          window.postMessage({ message: 'updateStateInject', altState: altState, fixed: fixed }, '*');
          updateBtn();
          hintPanel(altState || fixed);
        }

        function updateBtn() {
          btn.style.color = fixed ? '#fff' : '#2B587A';
          btn.style.background = fixed ? '#597DA3' : '#EDF1F5';
          btn.innerHTML = fixed ? 'Отключить фиксацию' : 'Зафиксировать в этом состоянии';
        }

        updateBtn();
      }

      if (visible) {
        dispTimer = setTimeout(function() {
          dispTimer = false;
          panel.style.display = 'block';
        }, 400);
      } else {
        panel.style.display = 'none';
      }
    }
  })();
}