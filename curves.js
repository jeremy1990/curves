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
  context.moveTo(-5, -canvas.height/2+5);
  context.lineTo(0, -canvas.height/2);
  context.lineTo(5, -canvas.height/2+5)
  context.stroke();
  context.closePath();

  context.beginPath();
  context.moveTo(-canvas.width/2, 0);
  context.lineTo(canvas.width/2, 0);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.moveTo(canvas.width/2-5, -5);
  context.lineTo(canvas.width/2, 0);
  context.lineTo(canvas.width/2-5, 5)
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

function drawArrow(context, t) {
  var r = 100;
  var start = {
    x: - r/2 * Math.sin(t) - 2*r * Math.cos(t/2),
    y: - r/2 * Math.cos(t) + 2*r * Math.sin(t/2)
  };
  var end = {
    x: r/2 * Math.sin(t) - 2*r * Math.cos(t/2),
    y: r/2 * Math.cos(t) + 2*r * Math.sin(t/2)
  };

  context.beginPath();
  context.moveTo(start.x, -start.y);
  context.lineTo(end.x, -end.y);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.strokeStyle = '#ff0000';
  context.fillStyle = '#ff0000';
  context.arc(end.x, -end.y, 4, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
  context.closePath();
}

function triangleArc(t) {
  var r = 100;
  return {
    x: r * Math.cos(t) - 2*r * Math.cos(t/2),
    y: - r * Math.sin(t) + 2*r * Math.sin(t/2)
  };
}

function triangleArcLeft(t) {
  var r = 100;
  return {
    x: - r * Math.cos(t) - 2*r * Math.cos(t/2),
    y: r * Math.sin(t) + 2*r * Math.sin(t/2)
  };
}

function triangleArcTop(t) {
  var r = 100;
  return {
    x: r * Math.sin(t) - 2*r * Math.cos(t/2),
    y: r * Math.cos(t) + 2*r * Math.sin(t/2)
  };
}

function triangleArcBottom(t) {
  var r = 100;
  return {
    x: - r * Math.sin(t) - 2*r * Math.cos(t/2),
    y: - r * Math.cos(t) + 2*r * Math.sin(t/2)
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
  context.strokeStyle = '#ff0000';
  context.moveTo(begin.x, -begin.y);
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

function paint(context, current) {
  var radius = 100;
  drawCircle(context, 0, 0, radius, '#000000');
  if (current >= 2 * Math.PI) {
    drawCircle(context, 2 * radius, 0, radius, '#ff0000');
    drawArrow(context, 2 * Math.PI);
  }
  var central = coreArc(current);
  drawCircle(context, central.x, -central.y, radius, '#ff0000');
  drawCurve(context, triangleArcLeft, 0, current);
  var left = triangleArcLeft(current);
  drawPoint(context, left.x, -left.y, 4);
  drawArrow(context, current);
}

function animate(context, canvas, current, delta, boundary) {
  if (current > boundary) {
    return;
  }
  context.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
  //drawAxis(canvas, context);
  paint(context, current);
  setTimeout(animate, 10, context, canvas, current+delta, delta, boundary);
}

function illustrate() {
  var canvas = document.getElementById('circle');
  var context = canvas.getContext('2d');

  canvas.width = 700
  canvas.height = 700
  context.save();
  context.translate(canvas.width/2, canvas.height/2);

  var end = 4 * Math.PI;
  animate(context, canvas, 0, end/1000, end);
}

window.addEventListener('load', illustrate, true)
