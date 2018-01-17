/**
 * @param context canvas context, cannot be undefined
 * @param x the x position, default 0
 * @param y the y position, default 0
 * @param size the point size, default 1
 * @param color the point color, default #ff3300
 */
function drawPoint(context, x=0, y=0, size=1, color='#ff3300') {
  context.beginPath();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.arc(x, y, size, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
  context.closePath();
}

function drawAxis(canvas, context, x=0, y=0) {
  context.beginPath();
  context.strokeStyle = '#000000';
  context.moveTo(0, -canvas.height/2);
  context.lineTo(0, canvas.height/2);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.moveTo(-canvas.height/2, 0);
  context.lineTo(canvas.height/2, 0);
  context.stroke();
  context.closePath();
}

function drawCircle(context, x=0, y=0, radius=100, color="rgba(25,225,25,0.1)") {
  context.beginPath();
  context.strokeStyle = color;
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.stroke();
  context.closePath();
}

function triangleArc(t) {
  var r = 100;
  return {
    x: r * Math.cos(t) - 2*r * Math.cos(t/2),
    y: r * Math.sin(t) + 2*r * Math.sin(t/2)
  };
}

function triangleArcLeft(t) {
  var r = 100;
  return {
    x: - r * Math.cos(t) - 2*r * Math.cos(t/2),
    y: - r * Math.sin(t) + 2*r * Math.sin(t/2)
  };
}

function coreArc(t) {
  var r = 100;
  return {
    x: -2*r * Math.cos(t/2),
    y: 2*r * Math.sin(t/2)
  };
}

function drawCurve(context, pfunc, start=0, end=2*Math.PI) {
  var steps = 500;
  var begin = pfunc(start);
  context.beginPath();
  context.strokeStyle = '#0000ff';
  context.moveTo(begin.x, begin.y);
  for (var i = 1; i <= steps; ++i) {
    var current = pfunc((end-start)/steps*i);
    context.lineTo(current.x, -current.y);
  }
  context.stroke();
  context.closePath();
}

function animateCurve(context, pfunc, pcurve, start=0, end=2*Math.PI) {
  startAnimation(context, pfunc, pcurve, start, end, start);
}

function startAnimation(context, pfunc, pcurve, start, end, current) {
  if (current > end) {
    return;
  }
  var steps = 1400;
  var interval = (end-start)/steps;
  var central = pfunc(current);
  pcurve(context, central.x, -central.y);
  setTimeout(startAnimation, 10, context, pfunc, pcurve, start, end, current+interval);
}

function drawCoins() {
  var canvas = document.getElementById('circle');
  var context = canvas.getContext('2d');

  canvas.width = 700
  canvas.height = 700
  context.save();
  context.translate(canvas.width/2, canvas.height/2);
  drawAxis(canvas, context);

  var radius = 100;
  drawCircle(context, 0, 0, radius, '#000000');
  drawCircle(context, -2 * radius, 0, radius, '#ff0000');
  drawCircle(context, 2 * radius, 0, radius, '#ff0000');
  drawPoint(context);
  //drawCurve(context, coreArc);
  //drawCurve(context, triangleArc);
  animateCurve(context, coreArc, drawCircle, 0, 4*Math.PI);
  animateCurve(context, coreArc, drawPoint, 0, 4*Math.PI);
  animateCurve(context, triangleArc, drawPoint, 0, 4*Math.PI);
  animateCurve(context, triangleArcLeft, drawPoint, 0, 4*Math.PI);
  //context.restore();
}

window.addEventListener('load', drawCoins, true)
