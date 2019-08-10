'use strict';

let rqpAddressButton = $('#rqpAddressButton');
let policyClaimButton = $('#policyClaimButton');


let claim_input = $('#claim_input');
let hint_input = $('#hint_input');
let rqpAddress_input = $('#rqpAddress_input');
let identifierText = $('#Identifier');



let logger = $('#logger');
//let nowAccount = "";
// let password = `nccutest`;

// 參考 https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
//解譯url中的參數
let url_string = window.location.href;
let url = new URL(url_string);

let nowAccount = url.searchParams.get("nowAccount");
let Auth_address = url.searchParams.get("Auth_address");
let password = url.searchParams.get("password");
let identifier = url.searchParams.get("identifier");
log(`nowAccount：${nowAccount} \nAuth_address:${Auth_address}\nidentifier:${identifier}` );


identifierText.html(`identifier:<br> ${identifier}`);

function log(...inputs) {
    for (let input of inputs) {
        if (typeof input === 'object') {
            input = JSON.stringify(input, null, 2)
        }
        logger.html(input + '\n' + logger.html())
    }
}

//按下policyClaimButton時
policyClaimButton.on('click', function () {
    waitTransactionStatus();

    $.post('/auth/setPolicy', {
        authAddress: Auth_address,
        account: nowAccount,
        password: password,
        identifier:identifier,
        hint:hint_input.val(),
        claim:claim_input.val(),
    }, function (result) {
        if(result.status === true){
            log(result);
            doneTransactionStatus();
        }else{
            log(`setPolicy失敗`);
            log(result);
            doneTransactionStatus();
        }
    });
});


//按下rqpAddressButton時
rqpAddressButton.on('click', function () {
    waitTransactionStatus();

    $.post('/auth/setParticipantOfIdentifier', {
        authAddress: Auth_address,
        account: nowAccount,
        password: password,
        identifier:identifier,
        rqpAddress:rqpAddress_input.val(),
    }, function (result) {
        if(result.status === true){
            log(result);
            doneTransactionStatus();
        }else{
            log(`setPolicy失敗`);
            log(result);
            doneTransactionStatus();
        }
    });
});

/*
refreshResourceSetButton.on('click', function () {

    //移除所有表格細項
    $("#resourceSetTable").find("tr:gt(0)").remove();
// 查看是否有新的resource資料存入
    $.post('/db/getResourceSet', {
        address:RM_address.toString(),
    }, function (result) {
        let rows =result.info;
        console.log(result);
        rows.forEach(function(row) {
            /!*let policyHref = `policy.html?Auth_address=${Auth_address}&nowAccount=${nowAccount}&password=${password}&identifier=${row.identifier}`;
            let cooperatorHref = `rqp_client.html?Auth_address=${Auth_address}&nowAccount=${nowAccount}&password=${password}&identifier=${row.identifier}`;
*!/
            let policyButton =`<button value="${row.identifier}" id="policyButton">policy</button>` ;
            //let cooperatorButton = `<button value="${row.identifier}" id=cooperatorButton">cooperator</button>`;
            $('#resourceSetTable tr:last').after(`<tr><th>${row.name}</th><th>${row.identifier}</th><th>${row.scope}</th><th>${row.registerTime}</th><th>${policyButton}</th></tr>`);
            //$('#resourceSetTable tr:last').after(`<tr><th>${row.name}</th><th>${row.identifier}</th><th>${row.scope}</th><th>${row.registerTime}</th><th><button onclick="javascript:location.href= ${policyHref}" value="${row.identifier}" id="policyButton">policy</button></th><th>${cooperatorButton}</th></tr>`);

        });
    });
});

//執行跳轉到policy頁，並帶入參數
$('body').on('click', '#policyButton', function(){
    let policyIdentifier = $(this).attr("value");
    alert(`換到policy頁\nidentifier:${policyIdentifier}`);
    window.location.href=`policy.html?Auth_address=${Auth_address}&nowAccount=${nowAccount}&password=${password}&identifier=${policyIdentifier}`;
});


// 查看是否有新的resource資料存入
$.post('/db/getResourceSet', {
    address:RM_address.toString(),
}, function (result) {
    let rows =result.info;
    console.log(result);
    rows.forEach(function(row) {
        let policyButton =`<button value="${row.identifier}" id="policyButton">policy</button>` ;
        //let cooperatorButton = `<button value="${row.identifier}" id=cooperatorButton">cooperator</button>`;
        $('#resourceSetTable tr:last').after(`<tr><th>${row.name}</th><th>${row.identifier}</th><th>${row.scope}</th><th>${row.registerTime}</th><th>${policyButton}</th></tr>`);
    });
});
*/

function waitTransactionStatus() {
    $('#accountStatus').html('帳戶狀態：<b style="color: blue">(等待區塊鏈交易驗證中...)</b>')
}

function doneTransactionStatus() {
    $('#accountStatus').text('帳戶狀態：')
}


// mouseover
$(function() {
    policyClaimButton.mouseover(function () {
        policyClaimButton.attr('style', 'background-color: #608de2' );
    });
    policyClaimButton.mouseout(function () {
        policyClaimButton.attr('style', 'background-color: #4364a1' );
    });
});

$(function() {
    rqpAddressButton.mouseover(function () {
        rqpAddressButton.attr('style', 'background-color: #608de2' );
    });
    rqpAddressButton.mouseout(function () {
        rqpAddressButton.attr('style', 'background-color: #4364a1' );
    });
});

