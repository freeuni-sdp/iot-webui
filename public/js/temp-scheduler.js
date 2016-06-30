/**
 * Created by root_pc on 6/25/2016.
 */
var floor = 1;
var temperatureScheduler = "https://private-09e97-iottemperaturescheduler.apiary-mock.com/webapi/houses/";
var houseHeatingSwitch = "https://private-anon-945ad82df-iotheatingswitch.apiary-mock.com/house/";

function ajaxFunctionAfterHouseLoad(){

    $.ajax({
        type: 'GET',
        url: houseHeatingSwitch + currentlySelectedHouse.RowKey._,
        dataType: 'json',
        success: function (res) {
            drawFloors(res);
        }
    });

    $("#submit").click(function (){
        var stardate = $("#start-date").val() + ":00";
        stardate = stardate.replace("T"," ");
        var enddate = $("#end-date").val() + ":00"
        enddate = stardate.replace("T"," ");
        var floor = $("#floors").val();
        $.ajax({
            type: 'GET',
            url: temperatureScheduler +  currentlySelectedHouse.RowKey._ + "/floors/" + floor + "/schedule?start?"+stardate +"&end?"+enddate,
            dataType: 'json',
            success: function(res) {
                drawScheduler(res);
            }
        });
    });

    $("#submitSet").click(function (){
        var stardate = $("#start-dateSet").val() + ":00";
        stardate = stardate.replace("T"," ");
        var enddate = $("#end-dateSet").val() + ":00";
        enddate = enddate.replace("T"," ");
        var floor = $("#floors").val();
        var temp = $("#temperature").val();
        var data = {
            dateFrom : stardate,
            dateTo : enddate,
            temperature : temp
        }
        $.ajax({
            type: 'POST',
            url: temperatureScheduler + currentlySelectedHouse.RowKey._ + "/floors/" + floor,
            data: data,
            dataType: 'json',
            success: function(res) {
                alert("Schedule Updated !");
            },
            complete: function(res){
                if(res.status == 200){
                    alert("Schedule Updated !");
                }
            }
        });
    });
}


$(document).ready(function() {
    invokeAfterHousesLoaded(ajaxFunctionAfterHouseLoad);

});

function drawScheduler(res){
    var table =  $("#temp-result");
    table.empty();
    for (var value of res){
        table.append("<tr>");
        table.append("<td>" + value.dateFrom + "</td>");
        table.append("<td>" + value.dateTo + "</td>");
        table.append("<td>" + value.temperature + "</td>");
        table.append("</tr>");
    }
}

function drawFloors(result){
    jQuery.each(result.switches, function(i, value) {
        floorOption = document.getElementById('floors');
        floorOption.options[floorOption.options.length] = new Option('Floor#'+value.id, value.id);
    });
}
