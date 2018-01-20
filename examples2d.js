function examples() {
  curves.configure({
    id: 'coinPath',
    isDynamic: true,
    height: 400,
    width: 400,
    paint: function(painter, currentPeriod) {
      var radius = 50;
      painter.configure({type: 'original', radius: radius})
             .draw(painter.shape.circle);

      function capture(moment) {
        painter.configure({ type: 'original',
                            strokeStyle: '#ff0000',
                            radius: radius,
                            x: -2 * radius * Math.cos(moment/2),
                            y: -2 * radius * Math.sin(moment/2)})
               .draw(painter.shape.circle);
        painter.configure({ type: 'original',
                            strokeStyle: '#ff0000',
                            fillStyle: '#ff0000',
                            start: painter.shape.cardioid.bind({
                              config: {
                                radius: radius,
                                alpha: -Math.PI/2,
                                ratio: 0.5
                              }
                            })(moment),
                            end: painter.shape.cardioid.bind({
                              config: {
                                radius: radius,
                                alpha: Math.PI/2,
                                ratio: 0.5
                              }
                            })(moment)})
               .draw(painter.shape.arrow);
      }

      if (currentPeriod >= Math.PI) {
        capture(Math.PI);
      }
      if (currentPeriod >= 2 * Math.PI) {
        capture(2 * Math.PI);
      }
      if (currentPeriod >= 3 * Math.PI) {
        capture(3 * Math.PI);
      }

      capture(currentPeriod);
      painter.configure({
               radius: radius,
               alpha: Math.PI,
               endT: currentPeriod
             })
             .draw(painter.shape.cardioid);
      var leftPoint = painter.shape.cardioid.bind({
        config: {
          radius: radius,
          alpha: Math.PI
        }
      })(currentPeriod);
      painter.configure({
               type: 'original',
               x: leftPoint.x,
               y: -leftPoint.y,
               radius: radius,
               size: 4,
               fillStyle: '#ff0000',
               strokeStyle: '#ff0000'
             })
             .draw(painter.shape.point);
    }
  }).illustrate();

  curves.configure({
    id: 'circularMotion',
    isDynamic: true,
    endPeriod: 2 * Math.PI,
    width: 400,
    height: 400,
    repaintCount: 300,
    loop: true,
    paint: function(painter, currentPeriod) {
      var radius = 50;
      var deltaXY = -100;
      painter.configure({
        type: 'original',
        radius: radius,
        x: deltaXY,
        y: deltaXY})
             .draw(painter.shape.circle);
      var currentPos = painter.shape.arc.bind({
        config:{radius: radius}
      })(currentPeriod);
      painter.configure({ type: 'original',
                          strokeStyle: '#ff0000',
                          fillStyle: '#ff0000',
                          start: {x: deltaXY, y: -deltaXY},
                          end: {x: currentPos.x + deltaXY,
                                y: currentPos.y - deltaXY}
                        })
             .draw(painter.shape.arrow);
      painter.configure({
               type: 'original',
               x: deltaXY,
               y: -currentPos.y+deltaXY,
               size: 4,
               fillStyle: '#ff0000',
               strokeStyle: '#ff0000'
             })
             .draw(painter.shape.point);
      painter.configure({
               type: 'original',
               x: currentPos.x+deltaXY,
               y: deltaXY,
               size: 4,
               fillStyle: '#ff0000',
               strokeStyle: '#ff0000'
             })
             .draw(painter.shape.point);
      painter.configure({
               type: 'rectangular',
               startX: deltaXY,
               endX: 600,
               deltaY: -deltaXY,
               period: 2*Math.PI/100,
               radius: -50,
               alpha: currentPeriod
             })
             .draw(painter.shape.sin);
      painter.configure({
               type: 'rectangular',
               reverse: true,
               startX: deltaXY,
               endX: 600,
               deltaY: -deltaXY,
               period: 2*Math.PI/100,
               radius: -50,
               alpha: currentPeriod + Math.PI/2
            })
            .draw(painter.shape.sin);
    }
  }).illustrate();
}

window.addEventListener('load', examples, true)
