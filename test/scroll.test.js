//
// test existence of plugin
//
TestCase("PluginTest", {
  testExistenceOfPlugin: function(){
    assertTrue("scroll plugin", !!$.fn.scrollbar);
  }
});


//
// test generation of html nodes
//
TestCase("ScrollbarGeneratorTest", {

  setUp: function(){
    this.fixture = jstestdriver.Fixture();
  },
  
  tearDown: function(){
    delete this.fixture;
  },
  
  testGenerationOfScrollbarHandle: function(){
    assertEquals(0, this.fixture.scroll.find('.scrollbar-handle').length);
    this.fixture.scroll.scrollbar();
    assertEquals(1, this.fixture.scroll.find('.scrollbar-handle').length);
  },
  
  testGenerationOfNoScrollbar: function(){
    this.fixture.visible.scrollbar();
    assertEquals(0, this.fixture.visible.find('.scrollbar-handle').length);
  },
  
  testFullVisibleContentContainer: function(){
    var contentHeight = $.fn.scrollbar.contentHeight(this.fixture.visible);
    this.fixture.visible.scrollbar({
      containerHeight: contentHeight + 1
    });
    assertEquals(0, this.fixture.visible.find('.scrollbar-handle').length);
  },
  
  testOverflowedContentContainer: function(){
    var contentHeight = $.fn.scrollbar.contentHeight(this.fixture.visible);
    this.fixture.visible.scrollbar({
      containerHeight: contentHeight - 1
    });
    assertEquals(1, this.fixture.visible.find('.scrollbar-handle').length);
  }
});


//
// test for plugin options and class-based options
//
TestCase("OptionsTest", {
  setUp: function(){
    this.fixture = jstestdriver.Fixture();
  },
  
  tearDown: function(){
    delete this.fixture;
  },

  testFixedHandleHeight: function(){
    this.fixture.scroll.scrollbar({
      handleHeight: 20
    });
    assertEquals(20, this.fixture.scroll.find('.scrollbar-handle').height());
  },

  testMinimumHandleHeight: function(){
    this.fixture.scroll.scrollbar({
      handleMinHeight: 60
    });
    assertEquals("Minimum height of scrollbar handle", 60, this.fixture.scroll.find('.scrollbar-handle').height());
  },

  testAutoHandleHeight: function(){
    var contentHeight = $.fn.scrollbar.contentHeight(this.fixture.visible);
    this.fixture.visible.scrollbar({
      arrows: false,
      containerHeight: Math.ceil(contentHeight / 2),
      handleMinHeight: 0
    });
    var handleHeight = Math.ceil(contentHeight / 4);               // if container is half of content, the handle height should be half of container height (which is a quarter of content height)
    assertEquals("Actual height of scrollbar handle", handleHeight, this.fixture.visible.find('.scrollbar-handle').height());
  },
  
  testScrollbarWithArrows: function(){
    this.fixture.scroll.scrollbar({
      arrows: true
    });
    assertEquals(1, this.fixture.scroll.find('.scrollbar-handle-container').length);
    assertEquals(1, this.fixture.scroll.find('.scrollbar-handle-up').length);
    assertEquals(1, this.fixture.scroll.find('.scrollbar-handle-down').length);
  },
  
  testScrollbarWithoutArrows: function(){
    this.fixture.scroll.scrollbar({
      arrows: false
    });
    assertEquals(1, this.fixture.scroll.find('.scrollbar-handle-container').length);
    assertEquals(0, this.fixture.scroll.find('.scrollbar-handle-up').length);
    assertEquals(0, this.fixture.scroll.find('.scrollbar-handle-down').length);
  },
});


