/* jshint browser:true,devel:true */
/* global chrome */


var searchTxt;


function createAndAppend(ul, liTxt) {
    var li = document.createElement('li');
    li.innerHTML = liTxt;

    ul.appendChild(li);
}

function parseJSON(responseText) {
    var resultObj = JSON.parse(responseText);

    var translateResult = resultObj.translateResult;
    var src = translateResult[0][0].src;
    var tgt = translateResult[0][0].tgt;

    var h2 = document.createElement('h2');
    h2.innerHTML = src;

    var ul = document.createElement('ul');
    createAndAppend(ul, tgt);

    var smartResult = resultObj.smartResult;
    if ( smartResult ) {
        var entries = smartResult.entries;
        for ( var i=1; i<entries.length; i++ ) {
            createAndAppend(ul, entries[i]);
        }
    }

    return [h2, ul];
}


function xhr(panel, loading) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=null', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send('type=AUTO&i=' + searchTxt + '&doctype=json&xmlVersion=1.8&keyfrom=fanyi.web&ue=UTF-8&action=FY_BY_ENTER&typoResult=true');
    xmlhttp.onreadystatechange = function() {
        if ( xmlhttp.readyState === 4 && xmlhttp.status === 200 ) {
            var parseResult = parseJSON(xmlhttp.responseText);
            panel.removeChild(loading);

            for ( var i=0; i<parseResult.length; i++ ) {
                panel.appendChild(parseResult[i]);
            }
        }
    };
}

function loadContent() {
    var button = document.getElementById('btn');
    button.style.display = 'none';

    var panel = document.getElementById('panel');
    if ( !panel ) {
        panel = document.createElement('div');
        panel.setAttribute('id', 'panel');

        document.body.appendChild(panel);
    } else {
        while ( panel.lastChild ) {
            panel.removeChild(panel.lastChild);
        }
    }

    var loading = document.createElement('p');
    loading.innerHTML = '查询中，请稍后...';
    panel.appendChild(loading);

    xhr(panel, loading);
}


function setAttr(element, attr) {
    for ( var i=0; i<attr.length; i++ ) {
        element.setAttribute(attr[i][0], attr[i][1]);
    }
}

function showBtn(pos) {
    var button = document.getElementById('btn');

    if ( !button ) {
        button = document.createElement('img');

        var attr = [
            ['id', 'btn'],
            ['src', 'https://raw.githubusercontent.com/Ovilia/handian-chrome-extension/master/res/handian32.png']
        ];
        setAttr(button, attr);

        button.style.position = 'absolute';
        button.style.pointer = 'cursor';
        button.style.zIndex = '1000';
    } else {
        button.style.display = 'block';
    }

    button.style.top = pos.bottom + window.pageYOffset + 10 + 'px';
    button.style.left = pos.left + window.pageXOffset + 'px';

    document.body.appendChild(button);
}

function close() {
    var button = document.getElementById('btn');
    if ( button ) {
        button.style.display = 'none';
    }

    var panel = document.getElementById('panel');
    if ( panel ) {
        document.body.removeChild(panel);
    }
}

document.onmouseup = function(event) {
    if ( event.target === document.getElementById('btn') ) {
        loadContent();
        return;
    }

    chrome.storage.sync.get('enableSwitch', function(result) {
        if ( result.enableSwitch ) {
            var selObj = window.getSelection();
            var selTxt = selObj.toString();

            if ( selTxt ) {
                searchTxt = selTxt;

                var pos = selObj.getRangeAt(0).getBoundingClientRect();
                showBtn(pos);
            } else { //在未选中内容的时候，通过鼠标点击事件将 button 和 panel 去除
                close();
            }
        } else {
            close();
        }
    });
};
