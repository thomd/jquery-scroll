(function(){
    var style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "http://localhost.jquery/jquery-scrollbar/css/scrollbar.css";
    document.getElementsByTagName("head")[0].appendChild(style);
    var script1 = document.createElement('script');
    script1.type = "text/javascript";
    script1.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js";
    document.getElementsByTagName('body')[0].appendChild(script1);
    var script2 = document.createElement('script');
    script2.type = "text/javascript";
    script2.src = "http://localhost.jquery/jquery-scrollbar/jquery.scrollbar.js";
    document.getElementsByTagName('body')[0].appendChild(script1);
})()
