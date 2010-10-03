// javascript:(function(){var%20b=document.createElement(%22link%22);b.type=%22text/css%22;b.rel=%22stylesheet%22;b.href=%22http://localhost.jquery/jquery-scrollbar/css/scrollbar.css%22;document.getElementsByTagName(%22head%22)[0].appendChild(b);var%20a=document.createElement(%22script%22);a.type=%22text/javascript%22;a.src=%22http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js%22;a.onload=function(){var%20c=document.createElement(%22script%22);c.type=%22text/javascript%22;c.src=%22http://localhost.jquery/jquery-scrollbar/jquery.scroll.js%22;document.getElementsByTagName(%22body%22)[0].appendChild(c)};document.getElementsByTagName(%22body%22)[0].appendChild(a)})();

(function(){
    var style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "http://localhost.jquery/jquery-scrollbar/css/scrollbar.css";
    document.getElementsByTagName("head")[0].appendChild(style);

    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js";
    script.onload = function(){
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "http://localhost.jquery/jquery-scrollbar/jquery.scroll.js";
        document.getElementsByTagName('body')[0].appendChild(script);
    };
    document.getElementsByTagName('body')[0].appendChild(script);
})()
