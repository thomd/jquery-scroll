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
 *
 *
 * CSS:
 * ====
 *
 *
 */
;(function($){

    $.fn.scrollbar = function(options){

        // Extend default options
        var options = $.extend({}, $.fn.scrollbar.defaults, options);

        
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
                var scrollbar = new $.fn.scrollbar.Scrollbar(container, props, options);
                scrollbar.buildHtml();
                
                scrollbar.setHandleHeight();
                scrollbar.appendEvents();
            }
        });
    }



    //
    // default options
    //
    $.fn.scrollbar.defaults = {
        handleMinHeight: 30         // min-height of handle (height is actually dependent on content height) 
    };



    //
    // Scrollbar class properties
    //
    $.fn.scrollbar.Scrollbar = function(container, props, options){
        this.container = container || null;
        this.props =     props || {};
        this.opts =      options || $.fn.scrollbar.defaults;
        this.mouse =     {};
    };
    
    //
    // Scrollbar class methods
    //
    $.fn.scrollbar.Scrollbar.prototype = {
        
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
            prop.handleHeight = Math.max(prop.containerHeight * prop.handleContainerHeight / prop.contentHeight, this.opts.handleMinHeight);
            cont.handle.height(prop.handleHeight);
        },
        
        //
        // append events on handle
        //
        appendEvents: function(){
            var cont = this.container;
            cont.handle.bind('mousedown.handle', {elem: this}, this.startHandleMove);
        },
        
        

        //
        // get mouse position
        //
        getMousePos: function(event) {
			return event['pageY'] || (event['clientY'] + (document.documentElement['scrollTop'] || document.body['scrollTop'])) || 0;
		},

        //
        // start moving of handle
        //
        startHandleMove: function(ev){
            ev.preventDefault();
            var self = $(ev.data.elem)[0];
            self.container.handle.top = self.container.handle.offset().top;
            self.mouse.start = self.getMousePos(ev);
            self.container.handle.addClass('move');
    		$(document).bind('mousemove.handle', {elem: self}, self.onHandleMove).bind('mouseup.handle', {elem: self}, self.endHandleMove);

console.log('startHandleMove', self.container.handle.top);
        },

        //
        // on moving of handle
        //
        onHandleMove: function(ev){
            var self = $(ev.data.elem)[0];
            self.mouse.delta = self.getMousePos(ev) - self.mouse.start;
            self.mouse.top = self.mouse.delta + self.container.handle.top;
console.log('onHandleMove', self.mouse.delta, self.mouse.top, self.container.handle.top);
            self.container.handle.css({'top': self.mouse.delta + 'px'});
        },


        //
        // end moving of handle
        //
        endHandleMove: function(ev){
            var self = $(ev.data.elem)[0];
            self.container.handle.top = self.container.handle.offset().top;
    		$(document).unbind('mousemove.handle', self.onHandleMove).unbind('mouseup.handle', self.endHandleMove);
            self.container.handle.removeClass('move');
        }
    };


})(jQuery);  // inject global jQuery object


