/**
 * Created by root_pc on 6/24/2016.
 */
var sprinklerSwitchState = "https://private-anon-0daf60376-sprinklerswitch.apiary-mock.com/webapi/houses/";
var sprinklerSwitchChangeState = "https://private-anon-c802c2370-sprinklerswitch.apiary-mock.com/webapi/houses/";
var houseHeatingSwitch = "http://private-anon-293e85fef-iotheatingswitch.apiary-mock.com/house/";
var houseHeatingOn = "https://private-anon-293e85fef-iotheatingswitch.apiary-mock.com/house/";
var houseHeatingOff ="https://private-anon-293e85fef-iotheatingswitch.apiary-mock.com/house/";
var bathVentStatus = "http://private-anon-86028f42b-iotbathventswitch.apiary-mock.com/houses/";
var bathVentManual = "https://private-anon-67c972f5e-iotbathventswitch.apiary-mock.com/house/";
var airConditioningRoute = "http://private-anon-d79c364e6-airconditioningswitch.apiary-mock.com/webapi/houses/";


var sprinklerSwitchStateParams = {
    set_status: "on",
    timeout: 60
};

var timeIntervalSprinklerSwitch;

function updateConditioningStatus() {
    $.ajax({
        type: 'GET',
        url: airConditioningRoute + currentlySelectedHouse.RowKey._,
        dataType: 'json',
        success: function(res) {
            $('select#air-conditioning').val(res.status);
        }
    });
}



function makeAllRequestAfterLoadHouse(){
    sendAjax('GET',sprinklerSwitchState + currentlySelectedHouse.RowKey._,'',"sprinklerSwitchState");
    sendAjax('GET',houseHeatingSwitch + currentlySelectedHouse.RowKey._,'',"houseHeatingSwitch");
    sendAjax('GET',bathVentStatus +  currentlySelectedHouse.RowKey._,'',"bathVentStatus");
    $('select#air-conditioning').change(function() {
        $.ajax({
            type: 'POST',
            url: airConditioningRoute + currentlySelectedHouse.RowKey._,
            data: JSON.stringify({'status': $(this).val()})
        });
    })

    $("#sprinkler-switch-change-state").change(function () {
        if($(this)[0].checked){
            sprinklerSwitchStateParams.set_status = "on";
        }else{
            sprinklerSwitchStateParams.set_status = "off"
        }
        sprinklerSwitchStateParams.timeout = $("#sprinkler-switch-change-time").val() == '' ? 60 : $("#sprinkler-switch-change-time").val()
        sendAjax('PUT',sprinklerSwitchChangeState + currentlySelectedHouse.RowKey._,sprinklerSwitchStateParams,"sprinklerSwitchChangeState");
    });

    $(".checkbox").change(function(){
        var id = $(this)[0].id;
        var number = id.substr(id.length-1,1);
        if($(this)[0].checked){
            var data = {};
            var period = $("#heater-floor1-n-" +number).val();
            data.period = period == '' ? 600 : period;
            $.ajax({
                type: 'PUT',
                url: houseHeatingOn + currentlySelectedHouse.RowKey._ + "/floor/" + number,
                dataType: 'json',
                data:data,
                complete : function(){
                    sendAjax('GET',houseHeatingSwitch,'',"houseHeatingSwitch");
                }
            });
        }else{
            $.ajax({
                type: 'DELETE',
                url: houseHeatingOff + currentlySelectedHouse.RowKey._ + "/floor/" + number,
                complete : function(){
                    sendAjax('GET',bathVentStatus,'',"bathVentStatus");
                }
            });
        }
    });

    $("#bath-vent-manual").change(function (){
        var link =  bathVentManual + currentlySelectedHouse.RowKey._ + "/action/";
        console.log($(this));
        if($(this)[0].checked){
            link +="on";
        }else{
            link +="off";
        }
        $.ajax({
            type: 'PUT',
            url: link,
            dataType: 'json',
            complete : function(){
                sendAjax('GET',bathVentStatus,'',"bathVentStatus");
            }
        });

    });
}

$(document).ready(function() {
    invokeAfterHousesLoaded(updateConditioningStatus);
    invokeAfterHousesLoaded(makeAllRequestAfterLoadHouse);

});

function sendAjax(method,link,params,type) {
    $.ajax({
        type: method,
        url: link,
        dataType: 'json',
        data: params,
        success: function (result) {
            initial(result,type);
        }
    });
}

function initial(result,type){
    switch (type) {
        case "sprinklerSwitchState":
            getSprinklerStatus(result);
            break;
        case "sprinklerSwitchChangeState":
            setSprinklerStatus();
            break;
        case "houseHeatingSwitch":
            getHouseHeatingInfo(result);
            break;
        case "bathVentStatus":
            getBathStatus(result);
        default :
            break;
    }
}


function getBathStatus(result){
    $("#bath-vent-status").html(result.status);
}

function setSprinklerStatus(){
    $("#sprinkler-switch-change-time").val('');
    sendAjax('GET',sprinklerSwitchState,'');
}

function updateHeatingInfo(result){
    $("#bath-vent-status").html(result.status);
}

function getSprinklerStatus(result) {
    $('#sprinkler-switch-current-state').html(result.status);
    $('#sprinkler-switch-current-time').html(result.seconds_left);
    document.getElementById("sprinkler-switch-change-state").checked = result.status == "on" ? true : false;
    if(result.status == "on") {
        timeIntervalSprinklerSwitch = setInterval(function () {
            var t = $('#sprinkler-switch-current-time').html();
            $('#sprinkler-switch-current-time').html(t - 1);
            if (t <= 0) {
                $('#sprinkler-switch-current-time').html('0');
                clearInterval(timeIntervalSprinklerSwitch);
                sendAjax('GET',sprinklerSwitchState,'',"sprinklerSwitchState");
            }
        }, 1000);
    }
}


function getHouseHeatingInfo(result){

    var table =  $("#heating-switch-tb");
    table.empty();

    jQuery.each(result.switches, function(i, value) {
        table.append("<tr>");
        table.append("<td>" + value.id + "</td>");
        table.append("<td>" + value.status + "</td>");
        table.append("<td>" + value.available + "</td>");
        table.append("</tr>");
    });



}
