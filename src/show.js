/* jshint browser:true,devel:true */
/* global chrome */

var gb = {
    searchTxt: null,
    enableSwitch: true
};


function closeYoudao() {
    var panel = document.getElementById('youdao');
    if ( panel ) {
        document.body.removeChild(panel);
    }

    var button = document.getElementById('youdao-btn');
    if ( button ) {
        button.style.display = 'none';
    }
}


function initPanel() {
    var panel = document.createElement('div');
    panel.setAttribute('id', 'youdao');
    panel.style.width = '400px';
    panel.style.backgroundColor = '#EEF3F0';
    panel.style.position = 'fixed';
    panel.style.top = '0';
    panel.style.left = '0';
    panel.style.maxHeight = '100%';
    panel.style.zIndex = '10000';
    panel.style.textAlign = 'left';
    panel.style.padding = '20px';
    panel.style.overflow = 'auto';

    var loading = document.createElement('p');
    loading.innerHTML = '查询中，请稍候...';
    loading.setAttribute('id', 'youdao-loading');
    panel.appendChild(loading);

    document.body.appendChild(panel);
    
    return panel;
}


function loadYoudao() {
    closeYoudao();
    var panel = initPanel();

    var previousContent = document.getElementById('youdao-content');
    if ( previousContent ) {
        panel.removeChild(previousContent);
    }
    /*
    var content = document.createElement('iframe');
    content.setAttribute('frameborder', '0');
    content.setAttribute('src', 'http://dict.youdao.com/search?q=' + gb.searchTxt);
    content.setAttribute('id', 'youdao-content');
    content.style.display = 'none';
    content.style.width = '100%';
    content.style.height = window.innerHeight - 40 + 'px';
    content.onload = function() {
        var loading = document.getElementById('youdao-loading');
        if ( loading ) {
            panel.removeChild(loading);
        }
        content.style.removeProperty('display');
    };
    */
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://dict.youdao.com/search?q=' + gb.searchTxt, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if ( xmlhttp.readyState === 4 && xmlhttp.status === 200 ) {
            var loading = document.getElementById('youdao-loading');
            if ( loading ) {
                panel.removeChild(loading);
            }
            //panel.innerHTML = xmlhttp.responseText;
            //panel.innerHTML = xmlhttp.responseXML.getElementById('results');
            var regExp = /(\<div /;
        }
    };


    //panel.appendChild(content);
}


document.onmouseup = function(event) {
    if ( event.target === document.getElementById('youdao-btn') ) {
        loadYoudao();
        return ;
    }

    chrome.storage.sync.get('enableSwitch', function(result) {
        if ( result.enableSwitch ) {
            var selObj = window.getSelection();
            var pos = selObj.getRangeAt(0).getBoundingClientRect();

            var button = document.getElementById('youdao-btn');
            if ( !button ) {
                button = document.createElement('img');
                button.setAttribute('id', 'youdao-btn');
                button.setAttribute('src', 'https://raw.githubusercontent.com/Ovilia/handian-chrome-extension/master/res/handian32.png');
                button.style.position = 'absolute';
                button.style.cursor = 'pointer';
                button.style.zIndex = '1000';

                document.body.appendChild(button);
            } else {
                button.style.display = 'block';
            }

            button.style.top = pos.bottom + window.pageYOffset + 10 + 'px';
            button.style.left = pos.left + window.pageXOffset + 'px';

            var selText = selObj.toString();

            if ( selText ) {
                gb.searchTxt = encodeURIComponent(selText);
                //gb.searchTxt = selText;
            } else {
                closeYoudao();
            }
        } else {
            closeYoudao();
        }
    });
};
