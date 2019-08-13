'use strict';
let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');

let selectResourceName = $('#selectResourceName');
let selectNamButton = $('#selectNamButton');
let requestResourceButton = $('#requestResourceButton');



let logger = $('#logger');
//let nowAccount = "";
// let password = `nccutest`;

// 參考 https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
//解譯url中的參數
let url_string = window.location.href;
let url = new URL(url_string);

let nowAccount = null;
/*let Auth_address = url.searchParams.get("Auth_address");
let password = url.searchParams.get("password");
let identifier = url.searchParams.get("identifier");
log(`nowAccount：${nowAccount} \nAuth_address:${Auth_address}\nidentifier:${identifier}` );*/

let nowName = null;

function log(...inputs) {
    for (let input of inputs) {
        if (typeof input === 'object') {
            input = JSON.stringify(input, null, 2)
        }
        logger.html(input + '\n' + logger.html())
    }
}


// 當按下登入按鍵時
whoamiButton.on('click', async function () {
    nowAccount = whoami.val();
    log(nowAccount, '目前選擇的以太帳戶')
});

// 載入使用者至 select tag
$.get('/blockchain/accounts', function (accounts) {
    for (let account of accounts) {
        whoami.append(`<option value="${account}">${account}</option>`)
    }
    nowAccount = whoami.val();
    log(nowAccount, '目前選擇的以太帳戶')
});


// 載入使用者至 select tag
$.get('/db/getResourceName', function (results) {
    for (let info of results.info) {
        selectResourceName.append(`<option value="${info.name}">${info.name}</option>`)
    }
    nowName = selectResourceName.val();
    log(nowName, '目前選擇的Resource')
});


// 當按下登入按鍵時
selectNamButton.on('click', async function () {
    nowName = selectResourceName.val();
    log(nowName, '目前選擇的Resource')
});





// mouseover
$(function() {
    requestResourceButton.mouseover(function () {
        requestResourceButton.attr('style', 'background-color: #608de2' );
    });
    requestResourceButton.mouseout(function () {
        requestResourceButton.attr('style', 'background-color: #4364a1' );
    });
});

$(function() {
    whoamiButton.mouseover(function () {
        whoamiButton.attr('style', 'background-color: #608de2' );
    });
    whoamiButton.mouseout(function () {
        whoamiButton.attr('style', 'background-color: #4364a1' );
    });
});


$(function() {
    selectNamButton.mouseover(function () {
        selectNamButton.attr('style', 'background-color: #608de2' );
    });
    selectNamButton.mouseout(function () {
        selectNamButton.attr('style', 'background-color: #4364a1' );
    });
});

