/**
 * Created by root_pc on 6/11/2016.
 */

function ping(url,index){
    var startTime = new Date();
    $.ajax({
        type: 'GET',
        async: true,
        cache: false,
        url: url,
        dataType: 'html',
        statusCode: {
            404: function() {

            },
            503: function() {

            },
            200: function() {

            }
        },

        timeout: timeout
    });


}