/**
 * Created by root_pc on 6/11/2016.
 */

function ping(url,index){
    var startPingTime = new Date();
    $.ajax({
        type: 'GET',
        cache: false,
        url: url,
        dataType: 'jsonp',
        statusCode: {
            500: function() { //server error
                setWarning(index);
            },
            404: function() { // not found
                setNotFound(index);
            },
            503: function() { //timeout
                setWarning(index);
            },
            200: function() { // success
                setSuccess(index);
            }
        },
        complete: function(){
            var period = new Date() - startPingTime;
          //  setWarning(index);
            setPingStatus(period,index);
            makePing(url,index);
        }
    });
}

function makePing(url,index){
    setTimeout( function(){
        ping(url, index );
    }, 10000);
}

function setPingStatus(time,index){
    $('table tbody tr').eq(index).children().eq(2).html(time);
}

function setNotFound(index){
    $('table tbody tr').eq(index).children().eq(2).addClass('table-danger');
}

function setWarning(index){
    $('table tbody tr').eq(index).children().eq(2).addClass('table-warning');
}

function setSuccess(index){
    $('table tbody tr').eq(index).children().eq(2).addClass('table-success');
}



$(document).ready(function () {
    $('table tbody tr ').each(function (index){
       var url = ($(this).children().eq(1).html());
       ping(url,index);
    });
});


