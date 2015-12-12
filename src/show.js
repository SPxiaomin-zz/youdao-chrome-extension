/* jshint browser:true,devel:true */
/* global chrome */

var searchTxt;


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

    var loading = document.createElement('p');
    loading.innerHTML = '查询中，请稍候...';
    loading.setAttribute('id', 'youdao-loading');
    panel.appendChild(loading);

    document.body.appendChild(panel);

    return panel;
}


function DOMAppend(father, child, child2) {
    father.appendChild(child).appendChild(child2);
}


function getResult(panel, responseText) {
    var resultObj = JSON.parse(responseText);

    var translateResult = resultObj.translateResult[0][0];
    var src = translateResult.src;
    var tgt = translateResult.tgt;

    var li;
    var liTxt;
    var ul = document.createElement('ul');

    var h2 = document.createElement('h2');
    var h2Txt = document.createTextNode(src);
    DOMAppend(panel, h2, h2Txt);
    
    li = document.createElement('li');
    liTxt = document.createTextNode(tgt);
    DOMAppend(ul, li, liTxt);

    var smartResult = resultObj.smartResult;
    if ( smartResult ) {
        var entries = smartResult.entries;
    
        for ( var i=1; i<entries.length; i++ ) {
            li = document.createElement('li');
            liTxt = document.createTextNode(entries[i]);
            DOMAppend(ul, li, liTxt);
        }
    }

    panel.appendChild(ul);
}


function loadYoudao() {
    closeYoudao();
    var panel = initPanel();


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=null', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send('type=AUTO&i=' + searchTxt  + '&doctype=json&xmlVersion=1.8&keyfrom=fanyi.web&ue=UTF-8&action=FY_BY_ENTER&typoResult=true');
    
    xmlhttp.onreadystatechange = function() {
        if ( xmlhttp.readyState === 4 && xmlhttp.status === 200 ) {
            var loading = document.getElementById('youdao-loading');
            if ( loading ) {
                panel.removeChild(loading);
            }
            
            getResult(panel, xmlhttp.responseText);
        }
    };
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
                searchTxt = selText;
            } else {
                closeYoudao();
            }
        } else {
            closeYoudao();
        }
    });
};
