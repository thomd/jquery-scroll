/*jslint eqeqeq: true, regexp: true */
/*global document, window, setInterval, clearInterval, handler, jQuery */

/*
 * Scrollbar - a jQuery plugin for custom scrollbars
 *
 * @author     Thomas Duerr, me@thomd.net
 * @date       03.2010
 * @requires   jquery v1.4.2 
 *
 *
 * Usage:
 *
 *    Append scrollbar to an arbitrary container with overflowed content:
 *
 *         $('selector').scrollbar();
 *
 *
 *    Append scrollbar without arrows on top/bottom:
 *
 *         $('selector').scrollbar({
 *            arrows: false
 *         });
 *
 *
 *
 * A vertical scrollbar is based on the following box model:
 *
 *    +----------------------------------|
 *    |            <----------------------------- content container
 *    |  +-----------------+  +------+   |
 *    |  |                 |  |   <-------------- handle arrow up
 *    |  |                 |  |      |   |
 *    |  |                 |  +------+   |
 *    |  |                 |  | +--+ |   |
 *    |  |                 |  | |  | |   |
 *    |  |                 |  | | <-------------- handle
 *    |  |                 |  | |  | |   |
 *    |  |                 |  | |  | |   |
 *    |  |                 |  | |  | |   |
 *    |  |                 |  | +--+ |   |
 *    |  |                 |  |      |   |
 *    |  |                 |  |   <-------------- handle container
 *    |  |                 |  |      |   |
 *    |  |         <----------------------------- pane
 *    |  |                 |  |      |   |
 *    |  |                 |  |      |   |
 *    |  |                 |  +------+   |
 *    |  |                 |  |      |   |
 *    |  |                 |  |   <-------------- handle arrow down
 *    |  +-----------------+  +------+   |
 *    |                                  |
 *    +----------------------------------|
 *
 *
 */
(function($, document){

    $.fn.scrollbar = function(opts){

        // Extend default options
        var options = $.extend({}, $.fn.scrollbar.defaults, opts);

        
        //
        // append scrollbar to selected overflowed containers and return jquery object for chainability
        //
        return this.each(function(){

            var container = $(this), 
                
                // properties
                props = {
                    arrows: options.arrows
                };

            // set new container height if explicitly set by an option
            if(options.containerHeight){
                container.height(options.containerHeight);
            }

            // save container height in properties
            props.containerHeight = container.height();

            // save inner content height in properties. This is the height of all elements within the container.
            props.contentHeight = 0;
            container.children().each(function(){
                props.contentHeight += $(this).outerHeight();
            });

            // if the content height is lower than the container height, do nothing and return.
            if(props.contentHeight <= props.containerHeight){
                return true;
            }

            // create scrollbar object
            var scrollbar = new $.fn.scrollbar.Scrollbar(container, props, options);
            
            // build, initialize & append events
            scrollbar.buildHtml();
            scrollbar.initHandle();
            scrollbar.appendEvents();
        });
    };



    //
    // default options
    //
    $.fn.scrollbar.defaults = {
        containerHeight:   null,       // height of content container. If set to null, the current height before DOM manipulation is used
        
        arrows:            true,       // render up- and down-arrows
        handleHeight:      'auto',     // height of handle [px || 'auto']. If set to 'auto', the height will be calculated proportionally to the container-content height.
        handleMinHeight:   30,         // min-height of handle [px]. This property is only used if handleHeight is set to 'auto'
        
        scrollSpeed:       50,         // speed of handle while mousedown on arrows [milli sec]
        scrollStep:        20,         // handle increment between two mousedowns on arrows [px]
        
        scrollSpeedArrows: 40,         // speed of handle while mousedown within the handle container [milli sec]
        scrollStepArrows:  3           // handle increment between two mousedowns within the handle container [px]
    };



    //
    // Scrollbar constructor
    //
    $.fn.scrollbar.Scrollbar = function(container, props, options){

        // set object properties
        this.container = container;
        this.props =     props;
        this.opts =      options;
        this.mouse =     {};

        // disable arrows via class attribute 'no-arrows' on a container
        this.props.arrows = this.container.hasClass('no-arrows') ? false : this.props.arrows;
    };

    //
    // Scrollbar methods
    //
    $.fn.scrollbar.Scrollbar.prototype = {

        //
        // build DOM nodes for pane and scroll-handle
        //
        //   from:
        //
        //      <div class="foo">                                   --> arbitrary element with a fixed height or a max-height lower that its containing elements
        //          [...]
        //      </div>
        //
        //   to:
        //
        //      <div class="foo">                                   --> this.container
        //          <div class="scrollbar-pane">                    --> this.pane
        //              [...]
        //          </div>
        //          <div class="scrollbar-handle-container">        --> this.handleContainer
        //              <div class="scrollbar-handle"></div>        --> this.handle
        //          </div>
        //          <div class="scrollbar-handle-up"></div>         --> this.handleArrows
        //          <div class="scrollbar-handle-down"></div>       --> this.handleArrows
        //      </div>
        //
        //
        // TODO: use detach-transform-attach or DOMfragment
        //
        buildHtml: function(){

            // build new DOM nodes 
            this.container.children().wrapAll('<div class="scrollbar-pane"/>');
            this.container.append('<div class="scrollbar-handle-container"><div class="scrollbar-handle"/></div>');
            if(this.props.arrows){
                this.container.append('<div class="scrollbar-handle-up"/>').append('<div class="scrollbar-handle-down"/>');
            }

            // save height of container to re-set it after some DOM manipulations
            var height = this.container.height();

            // set scrollbar-object properties
            this.pane =            this.container.find('.scrollbar-pane');
            this.handle =          this.container.find('.scrollbar-handle');
            this.handleContainer = this.container.find('.scrollbar-handle-container');
            this.handleArrows =    this.container.find('.scrollbar-handle-up, .scrollbar-handle-down');
            this.handleArrowUp =   this.container.find('.scrollbar-handle-up');
            this.handleArrowDown = this.container.find('.scrollbar-handle-down');

            // set some default CSS attributes (may be overwritten by CSS definitions in an external CSS file)
            this.pane.defaultCss({
                'top':      0,
                'left':     0
            });
            this.handleContainer.defaultCss({
                'right':    0
            });
            this.handle.defaultCss({
                'top':      0,
                'right':    0
            });
            this.handleArrows.defaultCss({
                'right':    0
            });
            this.handleArrowUp.defaultCss({
                'top':      0
            });
            this.handleArrowDown.defaultCss({
                'bottom':   0
            });

            // set some necessary CSS attributes (can NOT be overwritten by CSS definitions)
            this.container.css({
                'position': this.container.css('position') === 'absolute' ? 'absolute' : 'relative',
                'overflow': 'hidden',
                'height':   height
            });
            this.pane.css({
                'position': 'absolute',
                'overflow': 'visible',
                'height':   'auto'
            });
            this.handleContainer.css({
                'position': 'absolute',
                'top':      this.handleArrowUp.outerHeight(true),
                'height':   (this.props.containerHeight - this.handleArrowUp.outerHeight(true) - this.handleArrowDown.outerHeight(true)) + 'px'
            });
            this.handle.css({
                'position': 'absolute',
                'cursor':   'pointer'
            });
            this.handleArrows.css({
                'position': 'absolute',
                'cursor':   'pointer'
            });            
        },


        //
        // calculate positions and dimensions of handle and arrow-handles
        //
        initHandle: function(){
            this.props.handleContainerHeight = this.handleContainer.height();
            this.props.contentHeight = this.pane.height();

           // height of handle
            this.props.handleHeight = this.opts.handleHeight == 'auto' ? Math.max(Math.ceil(this.props.containerHeight * this.props.handleContainerHeight / this.props.contentHeight), this.opts.handleMinHeight) : this.opts.handleHeight;
            this.handle.height(this.props.handleHeight);
            
            // if handle has a border (always be aware of the css box-model), we need to correct the handle height.
            this.handle.height(2 * this.handle.height() - this.handle.outerHeight(true));

            // min- and max-range for handle
            this.props.handleTop = {
                min: 0,
                max: this.props.handleContainerHeight - this.props.handleHeight
            };

            // ratio of handle-container-height to content-container-height (to calculate position of content related to position of handle)
            this.props.handleContentRatio = (this.props.contentHeight - this.props.containerHeight) / (this.props.handleContainerHeight - this.props.handleHeight);

            // initial position of handle at top
            this.handle.top = 0;
        },


        //
        // append events on handle and handle-container
        //
        appendEvents: function(){

            // append drag-drop event on scrollbar-handle
            this.handle.bind('mousedown.handle', $.proxy(this, 'startOfHandleMove'));

            // append mousedown event on handle-container
            this.handleContainer.bind('mousedown.handle', $.proxy(this, 'onHandleContainerMousedown'));

            // append hover event on handle-container
            this.handleContainer.bind('mouseenter.container mouseleave.container', $.proxy(this, 'onHandleContainerHover'));

            // append click event on scrollbar-up- and scrollbar-down-handles
            this.handleArrows.bind('mousedown.arrows', $.proxy(this, 'onArrowsMousedown'));

            // append mousewheel event on content container
            this.container.bind('mousewheel.container', $.proxy(this, 'onMouseWheel'));

            // append hover event on content container
            this.container.bind('mouseenter.container mouseleave.container', $.proxy(this, 'onContentHover'));

            // do not bubble down click events into content container
            this.handle.bind('click.scrollbar', this.preventClickBubbling);
            this.handleContainer.bind('click.scrollbar', this.preventClickBubbling);
            this.handleArrows.bind('click.scrollbar', this.preventClickBubbling);
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
            ev.stopPropagation();

            // set start position of mouse
            this.mouse.start = this.mousePosition(ev);

            // set start position of handle
            this.handle.start = this.handle.top;

            // bind mousemove- and mouseout-event on document (binding it to document allows having a mousepointer outside handle while moving)
            $(document).bind('mousemove.handle', $.proxy(this, 'onHandleMove')).bind('mouseup.handle', $.proxy(this, 'endOfHandleMove'));

            // add class for visual change while moving handle
            this.handle.addClass('move');
            this.handleContainer.addClass('move');
        },


        //
        // on moving of handle
        //
        onHandleMove: function(ev){
            ev.preventDefault();

            // calculate distance since last fireing of this handler
            var distance = this.mousePosition(ev) - this.mouse.start;

            // calculate new handle position
            this.handle.top = this.handle.start + distance;

            // update positions
            this.setHandlePosition();
            this.setContentPosition();
        },


        //
        // end moving of handle
        //
        endOfHandleMove: function(ev){

            // remove handle events (which were attached in the startOfHandleMove-method)
            $(document).unbind('.handle');

            // remove class for visual change 
            this.handle.removeClass('move');
            this.handleContainer.removeClass('move');
        },


        //
        // set position of handle
        //
        setHandlePosition: function(){

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
            this.pane.top = -1 * this.props.handleContentRatio * this.handle.top;

            this.pane[0].style.top = this.pane.top + 'px';
        },


        //
        // mouse wheel movement
        //
        onMouseWheel: function(ev, delta){

            // calculate new handle position
            this.handle.top -= delta;

            this.setHandlePosition();
            this.setContentPosition();

            // prevent default scrolling of the entire document if handle is within [min, max]-range
            if(this.handle.top > this.props.handleTop.min && this.handle.top < this.props.handleTop.max){
                ev.preventDefault();
            }
        },


        //
        // append click handler on handle-container (outside of handle itself) to click up and down the handle 
        //
        onHandleContainerMousedown: function(ev){
            ev.preventDefault();

            // do nothing if clicked on handle
            if(!$(ev.target).hasClass('scrollbar-handle-container')){
                return false;
            }

            // determine direction for handle movement (clicked above or below the handler?)
            this.handle.direction = (this.handle.offset().top < this.mousePosition(ev)) ? 1 : -1;

            // set incremental step of handle
            this.handle.step = this.opts.scrollStep;

            // stop handle movement on mouseup
            var that = this;
            $(document).bind('mouseup.handlecontainer', function(){
                clearInterval(timer);
                that.handle.unbind('mouseenter.handlecontainer');
                $(document).unbind('mouseup.handlecontainer');
            });

            // stop handle movement when mouse is over handle
            //
            // TODO: this event is fired by Firefox only. Damn!
            //       Right now, I do not know any workaround for this. Mayby I should solve this by collision-calculation of mousepointer and handle
            this.handle.bind('mouseenter.handlecontainer', function(){
                clearInterval(timer);
            });

            // repeat handle movement while mousedown
            var timer = setInterval($.proxy(this.moveHandle, this), this.opts.scrollSpeed);
        },


        //
        // append mousedown handler on handle-arrows
        //
        onArrowsMousedown: function(ev){
            ev.preventDefault();

            // determine direction for handle movement
            this.handle.direction = $(ev.target).hasClass('scrollbar-handle-up') ? -1 : 1;

            // set incremental step of handle
            this.handle.step = this.opts.scrollStepArrows;

            // add class for visual change while moving handle
            $(ev.target).addClass('move');

            // repeat handle movement while mousedown
            var timer = setInterval($.proxy(this.moveHandle, this), this.opts.scrollSpeedArrows);

            // stop handle movement on mouseup
            $(document).one('mouseup.arrows', function(){
                clearInterval(timer);
                $(ev.target).removeClass('move');
            });
        },
        
        
        //
        // move handle by a distinct step while click on arrows or handle-container 
        //
        moveHandle: function(){
            this.handle.top = (this.handle.direction === 1) ? Math.min(this.handle.top + this.handle.step, this.props.handleTop.max) : Math.max(this.handle.top - this.handle.step, this.props.handleTop.min);
            this.handle[0].style.top = this.handle.top + 'px';

            this.setContentPosition();
        },
        
        
        //
        // add class attribute on content while interacting with content
        //
        onContentHover: function(ev){
            if(ev.type === 'mouseenter'){
                this.container.addClass('hover');
                this.handleContainer.addClass('hover');
            } else {
                this.container.removeClass('hover');
                this.handleContainer.removeClass('hover');
            }
        },
        
        
        //
        // add class attribute on handle-container while hovering it
        //
        onHandleContainerHover: function(ev){
            if(ev.type === 'mouseenter'){
                this.handleArrows.addClass('hover');
            } else {
                this.handleArrows.removeClass('hover');
            }
        },
        
        
        //
        // do not bubble down to avoid triggering click events attached within the container
        //
        preventClickBubbling: function(ev){
            ev.stopPropagation();
        }
    };



    // ----- default css ---------------------------------------------------------------------

    $.fn.defaultCss = function(styles){

        // 'not-defined'-values
        var notdef = {
            'right':    'auto',
            'left':     'auto',
            'top':      'auto',
            'bottom':   'auto',
            'position': 'static'
        };

        // loop through all style definitions and check for a definition already set by css. 
        // if no definition is found, apply the default css definition
        return this.each(function(){
            var elem = $(this);
            for(var style in styles){
                if(elem.css(style) === notdef[style]){
                    elem.css(style, styles[style]);
                }
            }
        });
    };

    //
    // ----- mousewheel event ---------------------------------------------------------------------
    // based on jquery.mousewheel.js from Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
    //

    $.event.special.mousewheel = {

        setup: function(){
            if (this.addEventListener){
                this.addEventListener('mousewheel', $.fn.scrollbar.mouseWheelHandler, false);
                this.addEventListener('DOMMouseScroll', $.fn.scrollbar.mouseWheelHandler, false);
            } else {
                this.onmousewheel = $.fn.scrollbar.mouseWheelHandler;
            }
        },

        teardown: function(){
            if (this.removeEventListener){
                this.removeEventListener('mousewheel', $.fn.scrollbar.mouseWheelHandler, false);
                this.removeEventListener('DOMMouseScroll', $.fn.scrollbar.mouseWheelHandler, false);
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


    $.fn.scrollbar.mouseWheelHandler = function(event) {
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
    };
    
})(jQuery, document);  // inject global jQuery object
