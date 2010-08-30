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
        // append scrollbar to every found container and return jquery object for chainability
        //
        return this.each(function(i){

            var container = $(this), 
                props = {};
            
            // determine container height
            props.containerHeight = container.height();

            // determine inner content height
            props.contentHeight = 0;
            container.children().each(function(){
                props.contentHeight += $(this).outerHeight();
            });
            
            // do nothing and return if a scrollbar is not neccessary
            if(props.contentHeight <= props.containerHeight) return true;
            
            // create scrollbar
            var scrollbar = new $.fn.scrollbar.Scrollbar(container, props, options);
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
        this.container = container;
        this.props =     props;
        this.opts =      options;
        this.mouse =     {};
        
        // initialize
        this.buildHtml();
        this.setHandleHeight();
        this.appendEvents();
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
            this.container.children().wrapAll('<div class="scrollbar-pane" />');
            this.container.append('<div class="scrollbar-handle-container"><div class="scrollbar-handle" /></div>')
                .append('<div class="scrollbar-handle-up" />')
                .append('<div class="scrollbar-handle-down" />');

            this.container.handle = this.container.find('.scrollbar-handle');
            this.container.handleContainer = this.container.find('.scrollbar-handle-container');
        },
        
        //
        // append events on handle
        //
        appendEvents: function(){
            this.container.handle.bind('mousedown.handle', $.proxy(this, 'startHandleMove'));
        },

        //
        // calculate height of handle.
        // height of handle should indicate height of content.
        //
        setHandleHeight: function(){
            this.props.handleContainerHeight = this.container.handleContainer.height();
            this.props.handleHeight = Math.max(this.props.containerHeight * this.props.handleContainerHeight / this.props.contentHeight, this.opts.handleMinHeight);
            this.container.handle.height(this.props.handleHeight);
        },
        
        //
        // get mouse position
        //
        getMousePos: function(ev) {
			return ev.pageY || (ev.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		},

        //
        // start moving of handle
        //
        startHandleMove: function(ev){
            ev.preventDefault();
            this.container.handle.top = this.container.handle.offset().top;
            this.mouse.start = this.getMousePos(ev);
            this.container.handle.addClass('move');
    		$(document).bind('mousemove.handle', $.proxy(this, 'onHandleMove')).bind('mouseup.handle', $.proxy(this, 'endHandleMove'));
//console.log('startHandleMove', self.container.handle.top);
        },

        //
        // on moving of handle
        //
        onHandleMove: function(ev){
            this.mouse.delta = this.getMousePos(ev) - this.mouse.start;
            this.mouse.top = this.mouse.delta + this.container.handle.top;
//console.log('onHandleMove', self.mouse.delta, self.mouse.top, self.container.handle.top);
            this.container.handle.css({'top': this.mouse.delta + 'px'});
        },

        //
        // end moving of handle
        //
        endHandleMove: function(ev){
            this.container.handle.top = this.container.handle.offset().top;
    		$(document).unbind('mousemove.handle', this.onHandleMove).unbind('mouseup.handle', this.endHandleMove);
            this.container.handle.removeClass('move');
        }
    };


})(jQuery);  // inject global jQuery object


