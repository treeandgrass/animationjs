import { anime } from '../../src'

'use strict';
var layers = 9;
var start = 4;
for (var i = 1; i <= layers; i++) {
  var n = i * start;
  for (var j = 0; j < n; j++) {
    addCircle(i, j / n);
  }
}

function addCircle(layer: any, fraction: any) {
  var element = document.createElement('div') as any;
  element.classList.add('circle');
  element.layer = i;
  element.fraction = j / n;
  var rotate = 'rotate(' + (360 * element.fraction) + 'deg)';
  var translate = 'translate(' + (element.layer * 20 - 2.5) + 'px)';
  element.style.transform = rotate + ' ' + translate;
  anime(element, [
    {transform: rotate + ' rotate(0deg) ' + translate},
    {transform: rotate + ' rotate(360deg) ' + translate},
  ], {
    duration: 1000 * layer,
    iterations: Infinity,
  });
  document.body.appendChild(element);
}