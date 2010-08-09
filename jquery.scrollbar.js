/*
 * Scrollbar - a jQuery plugin for custom scrollbars
 *
 * @author     Thomas Duerr, me@thomd.net
 * @date       03.2010
 * @requires   jquery v1.4.2 
 *
 *
 * Usage:
 * ======
 *
 *
 *
 *
 * CSS:
 * ====
 *
 *
 */
;(function($){

    /**
    * Extending jQuery namespace,
    * we could add public funtions here
    */
    $.scrollbar = {
        // Default options that can be easily changed
        defaults: {
            option1: "value",
            option2: "something"
        },

        makeSomething: function(){
            console.log("makeSomething: ", $.scrollbar.defaults.option1);
        }
    };


    $.fn.scrollbar = function(options){
        // Extend default options
        var options = $.extend({}, $.scrollbar.defaults, options);

        return this.each(function(){

            var container = $(this);

            console.log("scrollbar", this, container, options.option1);
            someFunction1();
            $.scrollbar.makeSomething();


            // build DOM nodes for pane and scroll-handle
            //
            //      <div class="scrollbar">
            //          <div class="scrollbar-pane">
            //              [...]
            //          </div>
            //          <div class="scrollbar-handle-container">
            //              <div class="scrollbar-handle"></div>
            //          </div>
            //          <div class="scrollbar-handle-up"></div>
            //          <div class="scrollbar-handle-down"></div>
            //      </div>
            //
            // The DOM is slow - you want to avoid manipulating it as much as possible. Remove an element from the DOM while you work with it:
            var cont = container.children().detach();
            cont.wrapAll('<div class="scrollbar-pane" />');
            cont.after('<div class="scrollbar-handle-container"><div class="scrollbar-handle" /></div>');
            cont.after('<div class="scrollbar-handle-up" />');
            cont.after('<div class="scrollbar-handle-down" />');
            container.append(cont);
        });
    }

    /**
    * Function that is not accessible from the outside
    */
    function someFunction1(){
        console.log("someFunction1: ",  $.scrollbar.defaults.option2);
    }

})(jQuery);  // inject global jQuery object
