if (!jstestdriver) {
  jstestdriver = {};
}


jstestdriver.Fixture = function() {

  /*:DOC += 
  <div class="scroll" style="height:100px;">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
    <div>9</div>
  </div>
  */

  /*:DOC += 
  <div class="visible">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
    <div>9</div>
  </div>
  */
  
  return {
    scroll: $('.scroll'),
    visible: $('.visible'),
  };
};
