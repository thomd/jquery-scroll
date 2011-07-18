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
TestCase("HtmlGeneratorTest", {

  setUp: function(){
    var fixtures = jstestdriver.fixtures();
    this.fixture_1 = fixtures.fixture_1;
    this.fixture_2 = fixtures.fixture_2;
  },

  tearDown: function(){
    delete this.fixture_1;
    delete this.fixture_2;
  },

  testGenerationOfScrollbarHandle: function(){
    assertEquals(0, this.fixture_1.find('.scrollbar-handle').length);
    this.fixture_1.scrollbar();
    assertEquals(1, this.fixture_1.find('.scrollbar-handle').length);
  },

  testGenerationOfNoScrollbar: function(){
    this.fixture_2.scrollbar();
    assertEquals(0, this.fixture_2.find('.scrollbar-handle').length);
  },

  testFullVisibleContentContainer: function(){
    var contentHeight = $.fn.scrollbar.contentHeight(this.fixture_2);
    this.fixture_2.scrollbar({
      containerHeight: contentHeight + 1
    });
    assertEquals(0, this.fixture_2.find('.scrollbar-handle').length);
  },

  testOverflowedContentContainer: function(){
    var contentHeight = $.fn.scrollbar.contentHeight(this.fixture_2);
    this.fixture_2.scrollbar({
      containerHeight: contentHeight - 1
    });
    assertEquals(1, this.fixture_2.find('.scrollbar-handle').length);
  },

  testHtmlStructureAfterMeassuringHeight: function(){
    var before = this.fixture_2.html();
    this.fixture_2.scrollbar();
    var after = this.fixture_2.html();
    assertEquals(before, after);
  }
});


//
// test for plugin options and class-based options
//
TestCase("OptionsTest", {

  setUp: function(){
    var fixtures = jstestdriver.fixtures();
    this.fixture_1 = fixtures.fixture_1;
    this.fixture_2 = fixtures.fixture_2;
  },

  tearDown: function(){
    delete this.fixture_1;
    delete this.fixture_2;
  },

  testFixedHandleHeight: function(){
    this.fixture_1.scrollbar({
      handleHeight: 20
    });
    assertEquals(20, this.fixture_1.find('.scrollbar-handle').height());
  },

  testMinimumHandleHeight: function(){
    this.fixture_1.scrollbar({
      handleMinHeight: 60
    });
    assertEquals("Minimum height of scrollbar handle", 60, this.fixture_1.find('.scrollbar-handle').height());
  },

  testAutoHandleHeight: function(){
    var contentHeight = $.fn.scrollbar.contentHeight(this.fixture_2);
    this.fixture_2.scrollbar({
      arrows: false,
      containerHeight: Math.ceil(contentHeight / 2),
      handleMinHeight: 0
    });
    var handleHeight = Math.ceil(contentHeight / 4);               // if container is half of content, the handle height should be half of container height (which is a quarter of content height)
    assertEquals("Actual height of scrollbar handle", handleHeight, this.fixture_2.find('.scrollbar-handle').height());
  },

  testScrollbarWithArrows: function(){
    this.fixture_1.scrollbar({
      arrows: true
    });
    assertEquals(1, this.fixture_1.find('.scrollbar-handle-container').length);
    assertEquals(1, this.fixture_1.find('.scrollbar-handle-up').length);
    assertEquals(1, this.fixture_1.find('.scrollbar-handle-down').length);
  },

  testScrollbarWithoutArrows: function(){
    this.fixture_1.scrollbar({
      arrows: false
    });
    assertEquals(1, this.fixture_1.find('.scrollbar-handle-container').length);
    assertEquals(0, this.fixture_1.find('.scrollbar-handle-up').length);
    assertEquals(0, this.fixture_1.find('.scrollbar-handle-down').length);
  },
});


