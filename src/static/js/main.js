require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'vendor/jquery-1.10.2.min'
    }
});

require(['jquery'], function($) {
    $.ajax({
        type: 'GET',
        url: "http://www.startuppodden.se/feed/",
        data: {},
        dataType: "xml"
    }).done(function (xml){
            var items = $(xml).find('item');

            console.log(items);
        });

});