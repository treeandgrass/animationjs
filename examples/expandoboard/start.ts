import { anime } from '../../src'

function newBox(width: any, height: any, x: any, y: any, color: any) {
  var box = document.createElement('div')
  box.style.width = width + 'px'
  box.style.height = height + 'px'
  box.style.backgroundColor = color
  box.style.position = 'absolute';
  box.style.left = x + 'px'
  box.style.top = y + 'px'
  return box
}

var container = newBox(450, 450, 0, 0, 'white');
container.style.overflow = 'hidden';
container.style.left = 'calc(50vw - 225px)';
container.style.top = 'calc(50vh - 225px)';
container.style.borderRadius = '50%';

function bezToEasing(b: number[]) {
  return 'cubic-bezier(' + b[0] + ', ' + b[1] + ', ' + b[2] + ', ' + b[3] + ')';
}

for (var y = 0; y < 15; y++) {
  for (var x = 0; x < 15; x++) {
    var box = newBox(30, 30, x * 30, y * 30, ((x + y) % 2 == 0 ? 'white' : 'black'));
    var xDest = (x - 7) * 60;
    var yDest = (y - 7) * 60 + 30;

    var x2 = 0.5;
    var y2 = 0.25;
    var x3 = 0.5;
    var y3 = 0.25;

    anime(box, [{transform: 'translate(0px, 0px) scale(1)',
                  easing: bezToEasing([x2, y2, x3, y3])},
                 {transform: 'translate(' + xDest + 'px, ' + yDest + 'px) scale(3)'}],
                { duration: 2000, iterations: Infinity});

    container.appendChild(box);

    for (var yy = 0; yy < 3; yy++) {
      for (var xx = 0; xx < 3; xx++) {
        if ((xx + yy) % 2 == 0) {
          var boxbox = newBox(10, 10, x * 30 + xx * 10, y * 30 + yy * 10,
                              (x + y) % 2 == 0 ? 'black' : 'white');
          container.appendChild(boxbox);
          var xxDest = xDest + (xx - 1) * 20;
          var yyDest = yDest + (yy - 1) * 20;
          var distX = (x - 7) + (xx - 1);
          var distY = (y - 7) + (yy - 1);
          var dist = Math.sqrt(distX * distX + distY * distY) / 15;
          var offset = 0.2 + dist;

          // treat offset as a 't' parameter.
          var xs = 3 * x2 * offset * (1 - offset) * (1 - offset) + 3 * x3 * offset * offset * (1 - offset) + offset * offset * offset;
          var ys = 3 * y2 * offset * (1 - offset) * (1 - offset) + 3 * y3 * offset * offset * (1 - offset) + offset * offset * offset;

          var x12 = x2 * offset;
          var y12 = y2 * offset;
          var x23 = (x3 - x2) * offset + x2;
          var y23 = (y3 - y2) * offset + y2;
          var x34 = (1 - x3) * offset + x3;
          var y34 = (1 - y3) * offset + y3;
          var x123 = (x23 - x12) * offset + x12;
          var y123 = (y23 - y12) * offset + y12;
          var x234 = (x34 - x23) * offset + x23;
          var y234 = (y34 - y23) * offset + y23;
          var x1234 = (x234 - x123) * offset + x123;
          var y1234 = (y234 - y123) * offset + y123;

          var bez_before = [x12/x1234, y12/y1234, x123/x1234, y123/y1234];
          var bez_after = [(x234-x1234)/(1-x1234), (y234-y1234)/(1-y1234),
                           (x34-x1234)/(1-x1234), (y34-y1234)/(1-y1234)]

          anime(boxbox, [{
                              transform: 'translate(0px, 0px) scale(0.1)',
                              opacity: 0,
                              easing: bezToEasing(bez_before)
                          },
                          {
                              transform: 'translate(' + xxDest*ys + 'px, ' + yyDest*ys + 'px) scale(0.1)',
                              opacity: 0,
                              offset: xs
                          },
                          {
                              transform: 'translate(' + xxDest*ys + 'px, ' + yyDest*ys + 'px) scale(0.1)',
                              opacity: 1,
                              offset: xs,
                              easing: bezToEasing(bez_after)
                          },
                          {
                              transform: 'translate(' + xxDest + 'px, ' + yyDest + 'px) scale(3)',
                              opacity: 1
                          }],
                          { duration: 2000, iterations: Infinity});
        }
      }
    }
  }
}

anime(container, [{transform: 'rotate(0deg)', easing: 'cubic-bezier(1, 0, 0, 1)'}, {transform: 'rotate(1440deg)'}], {duration: 20000, iterations: Infinity});

document.documentElement.appendChild(container);