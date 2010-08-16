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
        
        // default options
        defaults: {
            handleMinHeight: 30,         // min-height of handle (height is actually dependent on content height) 
            option2: "something"
        },

        makeSomething: function(){
//            console.log("makeSomething: ", $.scrollbar.defaults.option1);
        }
    };


    $.fn.scrollbar = function(options){

        // Extend default options
        var options = $.extend({}, $.scrollbar.defaults, options);


        // Properties
        var props = {};
        
        
        // scroll container
        var container = null;


        //
        // append scrollbar to container
        //
        var append = {
            scrollbar: function(i){
                return {
                    to: function(node){

                        container = node;
                        
                        // build HTML
                        build.html();
                        
                        // set corrent height of handle
                        build.handleHeight();
                        
                        // append event handler
                        build.appendEvents();
                    }
                }
            }
        }

        //
        // DOM builder
        //
        var build = {
            
            html: function(){
                //
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
                container.children().wrapAll('<div class="scrollbar-pane" />');
                container.append('<div class="scrollbar-handle-container"><div class="scrollbar-handle" /></div>')
                    .append('<div class="scrollbar-handle-up" />')
                    .append('<div class="scrollbar-handle-down" />');
                    
                container.handle = container.find('.scrollbar-handle');
                container.handleContainer = container.find('.scrollbar-handle-container');
            },
            
            handleHeight: function(){
                //
                // calculate height of handle.
                // height of handle should indicate height of content.
                //
                props.handleContainerHeight = container.handleContainer.height();
                props.handleHeight = Math.max(props.containerHeight * props.handleContainerHeight / props.contentHeight, options.handleMinHeight);
                container.handle.height(props.handleHeight);
            },
            
            appendEvents: function(){
                //
                // append events on handle
                //
                container.handle.bind('mousedown.handle', startHandleMove);
            }
        }


        //
        // start moving of handle
        //
        var startHandleMove = function(ev){
            ev.preventDefault();
            container.handle = $(ev.target);
//            console.log(container.handle);
            container.handle.addClass('move');
    		$(document).bind('mousemove.handle', onHandleMove).bind('mouseup.handle', endHandleMove);
        };


        //
        // on moving of handle
        //
        var onHandleMove = function(ev){
            ev.preventDefault();
        };


        //
        // end moving of handle
        //
        var endHandleMove = function(ev){
    		$(document).unbind('mousemove.handle', onHandleMove).unbind('mouseup.handle', endHandleMove);
            container.handle.removeClass('move');
        };


        //
        // append scrollbar to every found element and return jquery object
        //
        return this.each(function(i){

            var container = $(this);
            
            
            // determine heights
            props.containerHeight = container.height();

            props.contentHeight = 0;
            container.children().each(function(){
                props.contentHeight += $(this).outerHeight();
            });
            

            // append scrollbar only if neccessary
            if(props.contentHeight > props.containerHeight){
                append.scrollbar(i).to(container);
            }
        });
    }





    /**
    * Function that is not accessible from the outside
    */
    function someFunction1(){
        console.log("someFunction1: ",  $.scrollbar.defaults.option2);
    }

})(jQuery);  // inject global jQuery object
