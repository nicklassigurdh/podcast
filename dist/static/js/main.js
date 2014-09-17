require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'vendor/jquery-1.10.2.min'
    }
});

require(['jquery', 'vendor/mustache'], function($, Mustache) {

    var localData = {};

    var getRanking = $.ajax({
        type: 'GET',
        url: "/getRanking",
        data: {},
        dataType: "json"
    });

    var renderPodsTemplate = function () {
        var podsTemplate = $('#podsTemplate').html();
        var rendered = Mustache.render(podsTemplate, localData);
        $('#target').html(rendered);
    };

    var sortData = function (type) {
        if(type==='likes'){
            localData.pods.sort(function(a, b){return b.likes- a.likes});
        }
        if(type==='shares'){
            localData.pods.sort(function(a, b){return b.shares- a.shares});
        }
        renderPodsTemplate();
    }

    getRanking.done(function (data){
        localData = data;
        renderPodsTemplate();
    });


    //Bind some events.
    $('.sort-Likes').on('click', function(){
        sortData('likes');
    });

    $('.sort-Shares').on('click', function(){
        sortData('shares');
    })
});