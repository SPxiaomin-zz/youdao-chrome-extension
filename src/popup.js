/* jshint browser:true,devel:true */
/* global chrome */

function addLoadEvent(newFunc) {
    var func = window.onload;

    if ( typeof func !== 'function' ) {
        window.onload = newFunc;
    } else {
        window.onload = function() {
            func();
            newFunc();
        };
    }
}


var enableSwitch = false;
var button;


function updatePopup() {
    button.className = enableSwitch ? '' : 'disabled';
    document.getElementById('enableVal').innerHTML = enableSwitch ? '已' : '未';
    chrome.browserAction.setIcon({
        path: 'handian48' + (enableSwitch ? '' : '-disabled') + '.png'
    }, function() {});
}


function toggle() {
    enableSwitch = !enableSwitch;
    chrome.storage.sync.set({
        'enableSwitch': enableSwitch
    }, function() {
        updatePopup();
    });

}


function init() {
    button = document.getElementById("enableBtn");
    button.onclick = toggle;

    chrome.storage.sync.get('enableSwitch', function(result) {
        if ( result ) {
            enableSwitch =  result.enableSwitch;
        }
        updatePopup();
    });
}

addLoadEvent(init);
