/**
 * Created by root_pc on 6/25/2016.
 */
var currentHouse = 1234;
var floor = 1;
var temperatureScheduler = "https://private-09e97-iottemperaturescheduler.apiary-mock.com/webapi/houses/"
                            + currentHouse + "/floors/" + floor + "/schedule?";

$(document).ready(function() {

    $("#submit").click(function (){
        var stardate = $("#start-date").val() + ":00";
        var enddate = $("#end-date").val() + ":00";
        $.ajax({
            type: 'GET',
            url: temperatureScheduler + "start?"+stardate +"&end?"+enddate,
            dataType: 'json',
            success: function(res) {
                drawScheduler(res);
            }
        });
    });
});

function drawScheduler(res){
    var table =  $("#temp-result");
    table.empty();
    for (let value of res){
        table.append("<tr>");
        table.append("<td>" + value.dateFrom + "</td>");
        table.append("<td>" + value.dateTo + "</td>");
        table.append("<td>" + value.temperature + "</td>");
        table.append("</tr>");
    }
}