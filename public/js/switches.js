/**
 * Created by root_pc on 6/24/2016.
 */
var currentHouse = 1234;
var sprinklerSwitchState = "https://private-anon-0daf60376-sprinklerswitch.apiary-mock.com/webapi/houses/" + currentHouse;
var sprinklerSwitchChangeState = "https://private-anon-c802c2370-sprinklerswitch.apiary-mock.com/webapi/houses/" + currentHouse;
var houseHeatingSwitch = "http://private-anon-293e85fef-iotheatingswitch.apiary-mock.com/house/" + currentHouse;
var houseHeatingOn = "https://private-anon-293e85fef-iotheatingswitch.apiary-mock.com/house/" + currentHouse + "/floor/";
var houseHeatingOff ="https://private-anon-293e85fef-iotheatingswitch.apiary-mock.com/house/" + currentHouse  + "/floor/";

var sprinklerSwitchStateParams = {
    set_status: "on",
    timeout: 60
};

$(document).ready(function() {
    sendAjax('GET',sprinklerSwitchState,'',"sprinklerSwitchState");
    sendAjax('GET',houseHeatingSwitch,'',"houseHeatingSwitch");
    $("#sprinkler-switch-change-state").change(function () {
        if($(this).attr('checked')){
            sprinklerSwitchStateParams.set_status = "on";
        }else{
            sprinklerSwitchStateParams.set_status = "off"
        }
        sprinklerSwitchStateParams.timeout = $("#sprinkler-switch-change-time").val() == '' ? 60 : $("#sprinkler-switch-change-time").val()
        sendAjax('PUT',sprinklerSwitchChangeState,sprinklerSwitchStateParams,"sprinklerSwitchChangeState");
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
                url: houseHeatingOn + number,
                dataType: 'json',
                data:data,
                complete : function(){
                    sendAjax('GET',houseHeatingSwitch,'',"houseHeatingSwitch");
                }
            });
        }else{
            $.ajax({
                type: 'DELETE',
                url: houseHeatingOff + number,
                complete : function(){
                    sendAjax('GET',houseHeatingSwitch,'',"houseHeatingSwitch");
                }
            });
        }
    });
});

function sendAjax(method,link,params,type) {
    $.ajax({
        type: method,
        url: link,
        dataType: 'json',
        data: params,
        success: function (result) {
            console.log(link);
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
        default :
            break;
    }
}

function setSprinklerStatus(){
    $("#sprinkler-switch-change-time").val('');
    sendAjax('GET',sprinklerSwitchState,'');
}

function updateHeatingInfo(result){

}

function getSprinklerStatus(result) {
    $('#sprinkler-switch-current-state').html(result.status);
    $('#sprinkler-switch-current-time').html(result.seconds_left);
    document.getElementById("sprinkler-switch-change-state").checked = result.status == "on" ? true : false;
}


function getHouseHeatingInfo(result){

    var table =  $("#heating-switch-tb");
    table.empty();
    for (let value of result.values){
        table.append("<tr>");
        table.append("<td>" + value.id + "</td>");
        table.append("<td>" + value.status + "</td>");
        table.append("<td>" + value.available + "</td>");
        table.append("</tr>");
    }
}
