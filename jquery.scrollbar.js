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
        }
    };



    $.fn.scrollbar = function(options){

        // Extend default options
        var options = $.extend({}, $.scrollbar.defaults, options);

        //
        // Scrollbar class properties
        //
        var Scrollbar = function(container, props){
            this.container = container || null;
            this.props =     props || {};
            this.mouse =     {};
        };
        
        //
        // Scrollbar class methods
        //
        Scrollbar.prototype = {
            
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
            buildHtml: function(){
                var cont = this.container;
                cont.children().wrapAll('<div class="scrollbar-pane" />');
                cont.append('<div class="scrollbar-handle-container"><div class="scrollbar-handle" /></div>')
                    .append('<div class="scrollbar-handle-up" />')
                    .append('<div class="scrollbar-handle-down" />');

                cont.handle = cont.find('.scrollbar-handle');
                cont.handleContainer = cont.find('.scrollbar-handle-container');
            },
            
            //
            // calculate height of handle.
            // height of handle should indicate height of content.
            //
            setHandleHeight: function(){
                var cont = this.container;
                var prop = this.props;
                prop.handleContainerHeight = cont.handleContainer.height();
                prop.handleHeight = Math.max(prop.containerHeight * prop.handleContainerHeight / prop.contentHeight, options.handleMinHeight);
                cont.handle.height(prop.handleHeight);
            },
            
            //
            // append events on handle
            //
            appendEvents: function(){
                var cont = this.container;
                cont.handle.bind('mousedown.handle', {elem: this}, startHandleMove);
            },
            
            
            
        };
        
        //
        // get mouse position
        //
        var getMousePos = function (event) {
			return event['pageY'] || (event['clientY'] + (document.documentElement['scrollTop'] || document.body['scrollTop'])) || 0;
		};
		
        //
        // start moving of handle
        //
        var startHandleMove = function(ev){
            ev.preventDefault();
            var self = $(ev.data.elem)[0];
            self.container.handle.top = self.container.handle.offset().top;
            self.mouse.start = getMousePos(ev);
            self.container.handle.addClass('move');
    		$(document).bind('mousemove.handle', {elem: self}, onHandleMove).bind('mouseup.handle', {elem: self}, endHandleMove);

console.log('startHandleMove', self.container.handle.top);
        };

        //
        // on moving of handle
        //
        var onHandleMove = function(ev){
            var self = $(ev.data.elem)[0];
            self.mouse.delta = getMousePos(ev) - self.mouse.start;
            self.mouse.top = self.mouse.delta + self.container.handle.top;
console.log('onHandleMove', self.mouse.delta, self.mouse.top, self.container.handle.top);
            self.container.handle.css({'top': self.mouse.delta + 'px'});
        };


        //
        // end moving of handle
        //
        var endHandleMove = function(ev){
            var self = $(ev.data.elem)[0];
            self.container.handle.top = self.container.handle.offset().top;
    		$(document).unbind('mousemove.handle', onHandleMove).unbind('mouseup.handle', endHandleMove);
            self.container.handle.removeClass('move');
        };
        
		
        
        

/*
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
*/

        



        //
        // append scrollbar to every found element and return jquery object
        //
        return this.each(function(i){

            var container = $(this);
            var props = {};
            
            // determine heights
            props.containerHeight = container.height();

            props.contentHeight = 0;
            container.children().each(function(){
                props.contentHeight += $(this).outerHeight();
            });
            

            // append scrollbar only if neccessary
            if(props.contentHeight > props.containerHeight){
                var scrollbar = new Scrollbar(container, props);
                scrollbar.buildHtml();
                scrollbar.setHandleHeight();
                scrollbar.appendEvents();
            }
        });
    }





    /**
    * Function that is not accessible from the outside
    */
    function someFunction1(){
//        console.log("someFunction1: ",  $.scrollbar.defaults.option2);
    }

})(jQuery);  // inject global jQuery object
