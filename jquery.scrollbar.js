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
        // append events on handle and handle-container
        //
        appendEvents: function(){
            
            // append hover event on scrollbar-handle
            this.container.handle.hover(this.hoverHandle);
            
            // append drag-drop event on scrollbar-handle
            this.container.handle.bind('mousedown.handle', $.proxy(this, 'moveHandleStart'));
            
            // append click event on scrollbar-handle-container
            this.container.handleContainer.bind('click.handle-container', $.proxy(this, 'clickHandleContainer'));
        },

        //
        // calculate height of handle.
        // height of handle should indicate height of content.
        //
        setHandleHeight: function(){
            this.props.handleContainerHeight = this.container.handleContainer.height();
            this.props.handleHeight = Math.max(this.props.containerHeight * this.props.handleContainerHeight / this.props.contentHeight, this.opts.handleMinHeight);
            this.props.handleTop = {
                min: 0,
                max: this.props.handleContainerHeight - this.props.handleHeight
            };
            this.container.handle.height(this.props.handleHeight);
        },
        
        //
        // get mouse position
        //
        mousePosition: function(ev) {
			return ev.pageY || (ev.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		},

        //
        // start moving of handle
        //
        moveHandleStart: function(ev){
            ev.preventDefault();
            this.container.handle.start = this.container.handle.start || 0;
            this.mouse.start = this.mousePosition(ev);
    		$(document).bind('mousemove.handle', $.proxy(this, 'moveHandle')).bind('mouseup.handle', $.proxy(this, 'moveHandleEnd'));
            this.container.handle.addClass('move');
        },

        //
        // on moving of handle
        //
        moveHandle: function(ev){
            this.mouse.delta = this.mousePosition(ev) - this.mouse.start;
            this.container.handle.top = this.container.handle.start + this.mouse.delta;
            
            // stay within range [handleTop.min, handleTop.max]
            this.container.handle.top = (this.container.handle.top > this.props.handleTop.max) ? this.props.handleTop.max : this.container.handle.top;
            this.container.handle.top = (this.container.handle.top < this.props.handleTop.min) ? this.props.handleTop.min : this.container.handle.top;

            this.container.handle[0].style.top = this.container.handle.top + 'px';
        },

        //
        // end moving of handle
        //
        moveHandleEnd: function(ev){
            this.container.handle.start = this.container.handle.top;
    		$(document).unbind('mousemove.handle', this.moveHandle).unbind('mouseup.handle', this.moveHandleEnd);
            this.container.handle.removeClass('move');
        },
        
        //
        // 
        //
        clickHandleContainer: function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            if(!$(ev.target).hasClass('scrollbar-handle-container')) return false;
            console.log('click on handleContainer');
        },

        //
        // event handler for hovering the scrollbar-handle
        //
        hoverHandle: function(ev){
            $(this).toggleClass('hover');
        }
    };

})(jQuery);  // inject global jQuery object


