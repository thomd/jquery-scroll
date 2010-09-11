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
            this.handle.bind('mousedown.handle', $.proxy(this, 'startOfHandleMove'));
            
            // append click event on scrollbar-handle-container
            this.handleContainer.bind('mousedown.handle', $.proxy(this, 'clickHandleContainer'));
            
            // append click event on scrollbar-up- and scrollbar-down-handles
            this.handleArrows.bind('mousedown.arrows', $.proxy(this, 'clickHandleArrows'));

            // appen mousewheel event on content container
            this.container.bind('mousewheel.container', $.proxy(this, 'onMouseWheel'));
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
        // get mouse position helper
        //
        mousePosition: function(ev) {
			return ev.pageY || (ev.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		},



        // ---------- event handler ---------------------------------------------------------------

        //
        // start moving of handle
        //
        startOfHandleMove: function(ev){
            ev.preventDefault();

            // set start top-position of mouse
            this.mouse.top = this.mousePosition(ev);
            
            // bind mousemove- and mouseout-event to document (binding it to document allows having a mousepointer outside handle while moving)
    		$(document).bind('mousemove.handle', $.proxy(this, 'onHandleMove')).bind('mouseup.handle', $.proxy(this, 'endOfHandleMove'));
    		
            // remove hover event on scrollbar-arrows (until end of handle move)
    		this.handleArrows.unbind('mouseenter mouseleave', this.hoverHandle);
    		
    		// add class for visual change while moving handle
            this.handle.addClass('move');
        },


        //
        // on moving of handle
        //
        onHandleMove: function(ev){
            
            var mousePos = this.mousePosition(ev);
            
            // calculate distance since last fireing of this handler
            var delta = mousePos - this.mouse.top;
            this.mouse.top = mousePos;
            
            // calculate new handle position
            this.handle.top += delta;

            // update positions
            this.setHandlePosition(this.handle.top);
            this.setContentPosition();
            
            
        },


        //
        // end moving of handle
        //
        endOfHandleMove: function(ev){
            
            // remove handle events
    		$(document).unbind('.handle');

            // re-attach hover event on scrollbar-arrows
            this.handleArrows.bind('mouseenter mouseleave', this.hoverHandle);

            // remove class for visual change 
            this.handle.removeClass('move');
        },
        

        //
        // set position of handle
        //
        setHandlePosition: function(delta){
            
            // stay within range [handleTop.min, handleTop.max]
            this.handle.top = (this.handle.top > this.props.handleTop.max) ? this.props.handleTop.max : this.handle.top;
            this.handle.top = (this.handle.top < this.props.handleTop.min) ? this.props.handleTop.min : this.handle.top;

            this.handle[0].style.top = this.handle.top + 'px';
        },


        //
        // set position of content
        //
        setContentPosition: function(){
            
            // derive position of content from position of handle 
            this.pane.top = -1 * this.handleContentRatio * this.handle.top;
            
            this.pane[0].style.top = this.pane.top + 'px';
        },


        //
        // mouse wheel movement
        //
        onMouseWheel: function(ev, delta){

            // calculate new handle position
            this.handle.top -= delta;

            this.setHandlePosition(this.handle.top);
            this.setContentPosition();
        },


        //
        // TODO: document!
        // append click handler on handle-container (to click up and down the handle) 
        //
        clickHandleContainer: function(ev){
            ev.preventDefault();
            if(!$(ev.target).hasClass('scrollbar-handle-container')) return false;
            
            var direction = (this.handle.offset().top < this.mousePosition(ev)) ? 1 : -1;
            this.handle.start = this.handle.top = direction == 1 ? this.handle.top + (this.props.handleTop.max - this.handle.top) * 0.5 : this.handle.top - (this.handle.top - this.props.handleTop.min) * 0.5;
            this.handle[0].style.top = this.handle.top + 'px';
            this.setContentPosition();
        },

        //
        // TODO: document!
        // append click handler on handle-arrows
        //
        clickHandleArrows: function(ev){
            ev.preventDefault();
            var direction = $(ev.target).hasClass('scrollbar-handle-up') ? -1 : 1;
            
            var timer = setInterval($.proxy(function(){
                this.handle.start = this.handle.top = direction == 1 ? Math.min(this.handle.top + this.opts.scrollStep, this.props.handleTop.max) : Math.max(this.handle.top - this.opts.scrollStep, this.props.handleTop.min);
                this.handle[0].style.top = this.handle.top + 'px';
                this.setContentPosition();
            }, this), this.opts.scrollSpeed);
    		
    		var clearTimer = function(){
    		    clearInterval(timer);
        		$(document).unbind('mouseup.arrows', clearTimer);
    		}
    		$(document).bind('mouseup.arrows', clearTimer);
        },


        //
        // TODO: document!
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



    // ----- mousewheel event ---------------------------------------------------------------------
    
    $.event.special.mousewheel = {
    
        setup: function(){
            if (this.addEventListener){
                this.addEventListener('mousewheel', handler, false);
                this.addEventListener('DOMMouseScroll', handler, false);
            } else {
                this.onmousewheel = handler;
            }
        },
    
        teardown: function(){
            if (this.removeEventListener){
                this.removeEventListener('mousewheel', handler, false);
                this.removeEventListener('DOMMouseScroll', handler, false);
            } else {
                this.onmousewheel = null;
            }
        }
    };


    $.fn.extend({
        mousewheel: function(fn){
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },
    
        unmousewheel: function(fn){
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, 
            args = [].slice.call(arguments, 1), 
            delta = 0, 
            returnValue = true, 
            deltaX = 0, 
            deltaY = 0;
            
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";
    
        // Old school scrollwheel delta
        if(event.wheelDelta){
            delta = event.wheelDelta / 120;
        }
        if(event.detail){
            delta = -event.detail / 3;
        }
    
        // Gecko
        if(orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS){
            deltaY = 0;
            deltaX = -1 * delta;
        }
    
        // Webkit
        if(orgEvent.wheelDeltaY !== undefined){
            deltaY = orgEvent.wheelDeltaY / 120;
        }
        if(orgEvent.wheelDeltaX !== undefined){
            deltaX = -1 * orgEvent.wheelDeltaX / 120;
        }
    
        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);
    
        return $.event.handle.apply(this, args);
    }

})(jQuery);  // inject global jQuery object

