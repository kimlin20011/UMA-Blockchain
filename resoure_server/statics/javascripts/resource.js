'use strict';

let confirm_resource_set_button = $('#confirm_resource_set_button');
let refreshResourceSetButton = $('#refreshResourceSetButton');

let inputResourceName = $('#inputResourceName');
let inputScope = $('#inputScope');
let resourceSetTable = $('#resourceSetTable');

let logger = $('#logger');
//let nowAccount = "";
// let password = `nccutest`;

// 參考 https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
let url_string = window.location.href;
let url = new URL(url_string);

let nowAccount = url.searchParams.get("nowAccount");
let RM_address = url.searchParams.get("RM_address");
let Auth_address = url.searchParams.get("Auth_address");
let password = url.searchParams.get("password");
log(`nowAccount：${nowAccount}\nRM_address:${RM_address} \nAuth_address:${Auth_address}` );

function log(...inputs) {
    for (let input of inputs) {
        if (typeof input === 'object') {
            input = JSON.stringify(input, null, 2)
        }
        logger.html(input + '\n' + logger.html())
    }
}
//按下deploy_RM_contract_button時
confirm_resource_set_button.on('click', function () {
    waitTransactionStatus();

    $.post('/resourceManage/registerResourceSet', {
        rmAddress: RM_address,
        account: nowAccount,
        password: password,
        name:inputResourceName.val(),
        scope:inputScope.val(),
    }, function (result) {
        if(result.status === true){
            log(result);
            doneTransactionStatus();
        }else{
            log(`registerResource失敗`);
            log(result);
            doneTransactionStatus();
        }
    });
});

refreshResourceSetButton.on('click', function () {

    $("#resourceSetTable").find("tr:gt(0)").remove();
// 查看是否有新的resource資料存入
    $.post('/db/getResourceSet', {
        address:RM_address.toString(),
    }, function (result) {
        let rows =result.info;
        console.log(result);
        rows.forEach(function(row) {
            let policyButton =`<button id="${row.identifier}policyButton">policy</button>` ;
            let cooperatorButton = `<button id="${row.identifier}cooperatorButton">cooperator</button>`;
            $('#resourceSetTable tr:last').after(`<tr><th>${row.name}</th><th>${row.identifier}</th><th>${row.scope}</th><th>${row.registerTime}</th><th>${policyButton}</th><th>${cooperatorButton}</th></tr>`);
            //'<tr><td>my data</td><td>more data</td></tr>'
        });
    });
});

// 查看是否有新的resource資料存入
$.post('/db/getResourceSet', {
    address:RM_address.toString(),
}, function (result) {
    let rows =result.info;
    console.log(result);
    rows.forEach(function(row) {
        let policyButton =`<button id="${row.identifier}policyButton">policy</button>` ;
        let cooperatorButton = `<button id="${row.identifier}cooperatorButton">cooperator</button>`;
        $('#resourceSetTable tr:last').after(`<tr><th>${row.name}</th><th>${row.identifier}</th><th>${row.scope}</th><th>${row.registerTime}</th><th>${policyButton}</th><th>${cooperatorButton}</th></tr>`);
        //'<tr><td>my data</td><td>more data</td></tr>'
    });
});

function waitTransactionStatus() {
    $('#accountStatus').html('帳戶狀態：<b style="color: blue">(等待區塊鏈交易驗證中...)</b>')
}

function doneTransactionStatus() {
    $('#accountStatus').text('帳戶狀態：')
}


// mouseover
$(function() {
    confirm_resource_set_button.mouseover(function () {
        confirm_resource_set_button.attr('style', 'background-color: #608de2' );
    });
    confirm_resource_set_button.mouseout(function () {
        confirm_resource_set_button.attr('style', 'background-color: #4364a1' );
    });
});

$(function() {
    refreshResourceSetButton.mouseover(function () {
        refreshResourceSetButton.attr('style', 'background-color: #608de2' );
    });
    refreshResourceSetButton.mouseout(function () {
        refreshResourceSetButton.attr('style', 'background-color: #4364a1' );
    });
});

