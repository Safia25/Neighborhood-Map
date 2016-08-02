function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewURL ='https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src=" '+ streetviewURL +'">');

    //NY times AJAX request
   var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.jason?q='+ cityStr + '&sort=newest&api-key=39cb3493f5f64a74a155956310a38291';

    $.getJSON(nytimesUrl, function(data){
        $nytHeaderElem.text('New York Times Articles About' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+ article.web_url +'">'+article.headline.main + '</a>'+
                '<p>' + article.snippet + '</p>'+
                '</li>');
        }

    }).fail(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    //Wikipedia AJAX request
    var wikiUrl = 'http://en.Wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '
    &format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to Get Wikipedia Resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        done: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + 
                    articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);


