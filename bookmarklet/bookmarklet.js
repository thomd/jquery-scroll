// javascript:(function(){if(typeof%20jQuery==%22undefined%22||jQuery.fn.jquery.split(%22.%22)[1]<4||jQuery.fn.jquery.split(%22.%22)[2]<2){var%20c=typeof%20$==%22function%22;a(function(){if(c){jQuery.noConflict()}b()})}else{b()}function%20b(){jQuery(%22head%22).append(%22<link>%22);jQuery(%22head%22).children(%22:last%22).attr({type:%22text/css%22,rel:%22stylesheet%22,href:%22http://thomd.github.com/jquery-scroll/bookmarklet.css%22});jQuery.getScript(%22https://raw.github.com/thomd/jquery-scroll/master/jquery.scroll.js%22,function(){jQuery(%22*%22).filter(function(){return%20jQuery(this).css(%22overflow%22).match(/auto|scroll/)||jQuery(this).css(%22overflow-y%22).match(/auto|scroll/)}).scrollbar()})}function%20a(f){var%20e=document.createElement(%22script%22);e.src=%22http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js%22;var%20d=false;e.onload=e.onreadystatechange=function(){if(!d&&(!this.readyState||this.readyState==%22loaded%22||this.readyState==%22complete%22)){d=true;f()}};document.getElementsByTagName(%22head%22)[0].appendChild(e)}})();

(function(){
  if(typeof jQuery == 'undefined' || jQuery.fn.jquery.split(".")[1] < 4 || jQuery.fn.jquery.split(".")[2] < 2){
    var otherlib = typeof $ == 'function';
    loadJQuery(function(){
      if(otherlib) jQuery.noConflict();
      loadScrollbar();
    });
  } else {
    loadScrollbar();
  }

  function loadScrollbar(){
    jQuery('head').append('<link>');
    jQuery('head').children(':last').attr({
      type : 'text/css',
      rel  : 'stylesheet',
      href : 'http://thomd.github.com/jquery-scroll/bookmarklet.css'
    });
    jQuery.getScript('https://raw.github.com/thomd/jquery-scroll/master/jquery.scroll.js', function(){
      jQuery('*').filter(function(){return jQuery(this).css('overflow').match(/auto|scroll/) || jQuery(this).css('overflow-y').match(/auto|scroll/)}).scrollbar();
    });
  }

  function loadJQuery(fn){
    var script = document.createElement('script');
    script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
    var done = false;
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        done = true;
        fn();
      }
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  }
})();
