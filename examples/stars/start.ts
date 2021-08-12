import { anime } from '../../src'

var layerCount = 4;
var starCount = 500;
var maxTime = 31;
var universe = document.getElementById('universe') as HTMLDivElement
var w = window;
var d = document;
var e = d.documentElement;
var g = d.getElementsByTagName('body')[0];
var width = w.innerWidth || e.clientWidth || g.clientWidth;
var height = w.innerHeight|| e.clientHeight|| g.clientHeight;
let ani: any
for (var i = 0; i < starCount; ++i) {
  var ypos = Math.round(Math.random() * height);
  var star = document.createElement('div');
  var speed = 1000 * (Math.random() * maxTime + 1);
  star.setAttribute('class', 'star' + (3 - Math.floor((speed / 1000) / 8)));
  star.style.backgroundColor = 'white';//rgb(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ')';
  universe.appendChild(star);
  ani = anime(star, [{transform: 'translate3d(' + width + 'px, ' + ypos + 'px, 0)'},
                {transform: 'translate3d(-' + Math.random() * 256 + 'px, ' + ypos + 'px, 0)'}],
               {delay: Math.random() * -speed, duration: speed, iterations: 1000})
}

// setTimeout(() => {
//   ani.pause()
// }, 100)