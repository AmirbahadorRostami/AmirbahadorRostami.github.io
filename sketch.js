let bgSketch = function(p){
    /*10 PRINT CHR$(205.5+RND(1)) 
    BASIC program for the Commodore 6 
    */
    var canvas;
    var x = 0;
    var y = 0;
    var spacing = 80;
    var prob ;

    p.windowResized = function(){
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
        x=0;
        y=0;
        p.noLoop();
        p.redraw();
        p.loop();
    }

    p.setup = function() {
        p.createCanvas(p.windowWidth ,p.windowHeight);
        p.pixelDensity(1.0);
        p.background(0);
        prob = p.random();
    }

    p.draw = function() {
         
      var alpha =100;
      if(y < p.windowHeight) {

          var col = p.color(167, 20, 20, 180);

          p.stroke(col);

          p.strokeWeight(2);

            if (p.random(1) < prob) {

                p.line(x, y, x + spacing, y + spacing);
            } else {

                p.line(x, y + spacing, x + spacing, y);
            }
              x = x + spacing;

          if (x > p.windowWidth) {
              x = 0;
              y = y + spacing;
            }
          
          }else{ 
              y=0;
              p.noLoop();
          }
    }
    
}




// take the text in a div
// apply the effect to that div 

let nameAnimation = function(p){
    
    p.setup() = function () {

    }

    p.draw() =  function () {

    }



}

