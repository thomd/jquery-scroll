
TestCase("PluginTest", {
  testExistenceOfPlugin: function(){
    assertTrue("scroll plugin", !!$.fn.scrollbar);
  }
});


TestCase("ScrollbarGeneratorTest", {

  setUp: function(){
    this.fixture = jstestdriver.Fixture();
  },
  
  tearDown: function(){
    delete this.fixture;
  },
  
  testGenerationOfScrollbarHandle: function(){
    assertEquals(0, this.fixture.scrollbar.find('.scrollbar-handle').length);
    this.fixture.scrollbar.scrollbar();
    assertEquals(1, this.fixture.scrollbar.find('.scrollbar-handle').length);
  },
  
  testGenerationOfNoScrollbar: function(){
    this.fixture.noScrollbar.scrollbar();
    assertEquals(0, this.fixture.noScrollbar.find('.scrollbar-handle').length);
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
    this.fixture.scrollbar.scrollbar({handleHeight:20});
    assertEquals(20, this.fixture.scrollbar.find('.scrollbar-handle').height());
  },

  testMinimumHandleHeight: function(){
    this.fixture.scrollbar.scrollbar({
      handleMinHeight: 50
    });
    assertEquals("Minimum height of scrollbar handle", 50, this.fixture.scrollbar.find('.scrollbar-handle').height());
  },

  testAutoHandleHeight: function(){
    this.fixture.scrollbar.scrollbar({
      handleMinHeight: 0
    });
    assertEquals("Actual height of scrollbar handle", 32, this.fixture.scrollbar.find('.scrollbar-handle').height());
  },
  
  testScrollbarWithArrows: function(){
    this.fixture.scrollbar.scrollbar({
      arrows: true
    });
    assertEquals(1, this.fixture.scrollbar.find('.scrollbar-handle-container').length);
    assertEquals(1, this.fixture.scrollbar.find('.scrollbar-handle-up').length);
    assertEquals(1, this.fixture.scrollbar.find('.scrollbar-handle-down').length);
  },
  
  testScrollbarWithoutArrows: function(){
    this.fixture.scrollbar.scrollbar({
      arrows: false
    });
    assertEquals(1, this.fixture.scrollbar.find('.scrollbar-handle-container').length);
    assertEquals(0, this.fixture.scrollbar.find('.scrollbar-handle-up').length);
    assertEquals(0, this.fixture.scrollbar.find('.scrollbar-handle-down').length);
  },
  
  testScrollbarWithoutArrowsByClassAttribute: function(){
    this.fixture.noArrows.scrollbar();
    assertEquals(1, this.fixture.noArrows.find('.scrollbar-handle-container').length);
    assertEquals(0, this.fixture.noArrows.find('.scrollbar-handle-up').length);
    assertEquals(0, this.fixture.noArrows.find('.scrollbar-handle-down').length);
  }
});


