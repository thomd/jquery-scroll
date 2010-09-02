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
//                console.log($(this), $(this).height(), $(this).outerHeight());
                props.contentHeight += $(this).outerHeight();
            });
//            debugger;
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
        handleMinHeight: 30,         // min-height of handle (height is actually dependent on content height) 
        scrollSpeed: 100,       // TODO
        scrollStep: 10      // TODO
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
        this.initHandle();
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

            this.pane = this.container.find('.scrollbar-pane');
            this.handle = this.container.find('.scrollbar-handle');
            this.handleContainer = this.container.find('.scrollbar-handle-container');
            this.handleArrows = this.container.find('.scrollbar-handle-up, .scrollbar-handle-down');
        },
        
        //
        // append events on handle and handle-container
        //
        appendEvents: function(){
            
            // append hover event on scrollbar-handle
            this.handle.bind('mouseenter mouseleave', this.hoverHandle);
            
            // append hover event on scrollbar-arrows
            this.handleArrows.bind('mouseenter mouseleave', this.hoverHandle);
            
            // append drag-drop event on scrollbar-handle
            this.handle.bind('mousedown.handle', $.proxy(this, 'moveHandleStart'));
            
            // append click event on scrollbar-handle-container
            this.handleContainer.bind('mousedown.handle', $.proxy(this, 'clickHandleContainer'));
            
            // append click event on scrollbar-up- and down-handles
            this.handleArrows.bind('mousedown.arrows', $.proxy(this, 'clickHandleArrows'));
        },

        //
        // calculate height of handle.
        // height of handle should indicate height of content.
        //
        initHandle: function(){
            this.props.handleContainerHeight = this.handleContainer.height();
            
            // we need to calculate content-height again: due to the added scrollbar, the width decreased - hence the height increased!
            var contentHeight = 0;
            this.pane.children().each(function(){
                contentHeight += $(this).outerHeight();
            });
            this.props.contentHeight = contentHeight;
            
            this.props.handleHeight = Math.max(this.props.containerHeight * this.props.handleContainerHeight / this.props.contentHeight, this.opts.handleMinHeight);
            this.props.handleTop = {
                min: 0,
                max: this.props.handleContainerHeight - this.props.handleHeight
            };
            this.handle.height(this.props.handleHeight);
            this.handle.top = 0;
            this.handleContentRatio = (this.props.contentHeight - this.props.containerHeight) / (this.props.handleContainerHeight - this.props.handleHeight);
        },
        
        //
        // get mouse position
        //
        mousePosition: function(ev) {
			return ev.pageY || (ev.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		},


        // ---------- event handler ---------------------------------------------------------------

        //
        // start moving of handle
        //
        moveHandleStart: function(ev){
            ev.preventDefault();
            this.handle.start = this.handle.start || this.handle.top;
            this.mouse.start = this.mousePosition(ev);
    		$(document).bind('mousemove.handle', $.proxy(this, 'moveHandle')).bind('mouseup.handle', $.proxy(this, 'moveHandleEnd'));
    		this.handleArrows.unbind('mouseenter mouseleave', this.hoverHandle);
            this.handle.addClass('move');
        },

        //
        // on moving of handle
        //
        moveHandle: function(ev){
            this.mouse.delta = this.mousePosition(ev) - this.mouse.start;
            this.handle.top = this.handle.start + this.mouse.delta;
            
            // stay within range [handleTop.min, handleTop.max]
            this.handle.top = (this.handle.top > this.props.handleTop.max) ? this.props.handleTop.max : this.handle.top;
            this.handle.top = (this.handle.top < this.props.handleTop.min) ? this.props.handleTop.min : this.handle.top;
            this.handle[0].style.top = this.handle.top + 'px';
            
            this.pane.top = this.handleContentRatio * this.handle.top * (-1);
            this.pane[0].style.top = this.pane.top + 'px';
        },

        //
        // end moving of handle
        //
        moveHandleEnd: function(ev){
            this.handle.start = this.handle.top;
    		$(document).unbind('mousemove.handle', this.moveHandle).unbind('mouseup.handle', this.moveHandleEnd);
            this.handle.removeClass('move');
            this.handleArrows.bind('mouseenter mouseleave', this.hoverHandle);
        },
        
        //
        // append click handler on handle-container (to click up and down the handle) 
        //
        clickHandleContainer: function(ev){
            ev.preventDefault();
            if(!$(ev.target).hasClass('scrollbar-handle-container')) return false;
            
            var direction = (this.handle.offset().top < this.mousePosition(ev)) ? 1 : -1;
            this.handle.start = this.handle.top = direction == 1 ? this.handle.top + (this.props.handleTop.max - this.handle.top) * 0.5 : this.handle.top - (this.handle.top - this.props.handleTop.min) * 0.5;
            this.handle[0].style.top = this.handle.top + 'px';
        },

        //
        // append click handler on handle-arrows
        //
        clickHandleArrows: function(ev){
            ev.preventDefault();
            var direction = $(ev.target).hasClass('scrollbar-handle-up') ? -1 : 1;
            
            var timer = setInterval($.proxy(function(){
                this.handle.start = this.handle.top = direction == 1 ? Math.min(this.handle.top + this.opts.scrollStep, this.props.handleTop.max) : Math.max(this.handle.top - this.opts.scrollStep, this.props.handleTop.min);
                this.handle[0].style.top = this.handle.top + 'px';
            }, this), this.opts.scrollSpeed);
    		
    		var clearTimer = function(){
    		    clearInterval(timer);
        		$(document).unbind('mouseup.arrows', clearTimer);
    		}
    		$(document).bind('mouseup.arrows', clearTimer);
        },

        //
        // event handler for hovering the scrollbar-handle
        //
        hoverHandle: function(ev){
            if(ev.type == 'mouseenter'){
                $(this).addClass('hover');
            } else {
                $(this).removeClass('hover');
            }
        }
    };

})(jQuery);  // inject global jQuery object
