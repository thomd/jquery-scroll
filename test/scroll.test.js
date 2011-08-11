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
    this.fixture_1 = fixtures.fixture_1;         // scrollbar with container of 100px height
    this.fixture_2 = fixtures.fixture_2;         // no scrollbar
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


//
// test repainting of scrollbar (in case of dynamic addition of new content)
//
TestCase("RepaintTest", {

  setUp: function(){
    var fixtures = jstestdriver.fixtures();
    this.fixture_1 = fixtures.fixture_1;         // scrollbar with container of 100px height
  },

  tearDown: function(){
    delete this.fixture_1;
  },


  //
  // if content is doubled, the height of the handle should be half
  //
  testDoubleContentHandleHeight: function(){

    // render custom scrollbar
    var containerHeight = this.fixture_1.height();
    var contentHeight = $.fn.scrollbar.contentHeight(this.fixture_1);
    this.fixture_1.scrollbar({
      handleHeight    : "auto",
      handleMinHeight : 0,
      arrows          : false
    });
    var handleHeight = Math.ceil(containerHeight * containerHeight / contentHeight);

    // now double content
    this.fixture_1.find('.scrollbar-pane').children().clone().appendTo('.scrollbar-pane');

    // repaint scrollbar
    this.fixture_1.scrollbar("repaint");

    // assert height of handle as half of before
    assertEquals(Math.ceil(handleHeight / 2), this.fixture_1.find('.scrollbar-handle').height());
  },


  //
  // if content is added, the handles distance to the top should be reduced
  //
  testDoubleContentHandlePosition: function(){

    // render custom scrollbar
    this.fixture_1.scrollbar({
      handleHeight    : "auto",
      handleMinHeight : 0,
      arrows          : false
    });

    // assert initial handle position: top = 0
    assertEquals('0px', this.fixture_1.find('.scrollbar-handle').css('top'));

    // scroll down 100px
    this.fixture_1.scrollbar("scrollto", 100);

    // get current handle position
    var top = this.fixture_1.find('.scrollbar-handle').css('top');

     // now double content
    this.fixture_1.find('.scrollbar-pane').children().clone().appendTo('.scrollbar-pane');

    // repaint scrollbar
    this.fixture_1.scrollbar("repaint");

    // assert reduced handle position
    assertTrue(this.fixture_1.find('.scrollbar-handle').css('top') < top);
  }
});


