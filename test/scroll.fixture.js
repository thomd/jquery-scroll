if (!jstestdriver) {
  jstestdriver = {};
}


jstestdriver.Fixture = function() {

  /*:DOC += 
  <div class="scrollbar" style="max-height:100px;">
    <p>1</p>
    <p>2</p>
    <p>3</p>
    <p>4</p>
    <p>5</p>
    <p>6</p>
    <p>7</p>
    <p>8</p>
    <p>9</p>
  </div>
  */

  /*:DOC += 
  <div class="no-scrollbar">
    <p>1</p>
    <p>2</p>
    <p>3</p>
    <p>4</p>
    <p>5</p>
    <p>6</p>
    <p>7</p>
    <p>8</p>
    <p>9</p>
  </div>
  */
  
  /*:DOC += 
  <div class="no-arrows" style="max-height:100px;">
    <p>1</p>
    <p>2</p>
    <p>3</p>
    <p>4</p>
    <p>5</p>
    <p>6</p>
    <p>7</p>
    <p>8</p>
    <p>9</p>
  </div>
  */
  
  return {
    scrollbar: $('.scrollbar'),
    noScrollbar: $('.no-scrollbar'),
    noArrows: $('.no-arrows')
  };
};
