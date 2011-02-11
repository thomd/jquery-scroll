
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
      handleHeight: 'auto',
      handleMinHeight: 25
    });
    assertEquals("Minimum height of scrollbar handle", 25, this.fixture.scrollbar.find('.scrollbar-handle').height());
  },

  testAutoHandleHeight: function(){
    this.fixture.scrollbar.scrollbar({
      handleHeight: 'auto',
      handleMinHeight: 0
    });
    assertEquals("Actual height of scrollbar handle", 22, this.fixture.scrollbar.find('.scrollbar-handle').height());
  }
});


