var curves = (function() {
  var illustrations = {};
  var illustrationIdQueue = [];
  var illustrationCount = 0;

  function isUndefined(variable) {
    return typeof(variable) === 'undefined';
  }

  function validateThis() {
    var cfg = this.config;
    var context = cfg.context;
    if (isUndefined(cfg)) {
      throw 'Could not find config in this scope!';
    }
    if (isUndefined(context)) {
      throw 'Could not find context in this.config!';
    }
  }

  function Shape() {
    this.isConfigured = false;

    this.config = {};

    this.drawParametric = function(context, shape) {
      var begin = shape.bind(this)(this.config.startT);
      context.beginPath();
      context.moveTo(begin.x, -begin.y);
      for (var i = 1; i <= this.config.tCount; ++i) {
        var current = shape.bind(this)(
                      (this.config.endT - this.config.startT)
                      / this.config.tCount * i);
        context.lineTo(current.x, -current.y);
      }
      context.stroke();
      context.closePath();
    };

    this.drawRectangular = function(context, shape) {
      var startY = shape.bind(this)(this.config.startX) + this.config.deltaY;
      context.beginPath();
      if (this.config.reverse) {
        context.moveTo(-startY, this.config.startX);
      } else {
        context.moveTo(this.config.startX, -startY);
      }
      for (var i = 1; i <= this.config.xCount; ++i) {
        var currentX = this.config.startX
                       + (this.config.endX - this.config.startX)
                       / this.config.xCount * i;
        var currentY = shape.bind(this)(currentX) + this.config.deltaY;
        if (this.config.reverse) {
          context.lineTo(-currentY, currentX);
        } else {
          context.lineTo(currentX, -currentY);
        }
      }
      context.stroke();
      context.closePath();
    };
  }

  Shape.prototype.configure = function(config) {
    if (isUndefined(config)) {
      this.config = {};
    }
    this.config = config;

    // check type
    if (isUndefined(config.type)) {
      this.config.type = 'parametric';
    }

    if (this.config.type === 'parametric') {
      if (isUndefined(this.config.startT)) {
        this.config.startT = 0;
      }

      if (isUndefined(this.config.endT)) {
        this.config.endT = 2 * Math.PI;
      }

      if (isUndefined(this.config.tCount)) {
        this.config.tCount = 500;
      }
    } else if (this.config.type === 'rectangular') {
      if (isUndefined(this.config.startX)) {
        this.config.startX = -200;
      }

      if (isUndefined(this.config.endX)) {
        this.config.endX = 200;
      }

      if (isUndefined(this.config.xCount)) {
        this.config.xCount = 1000;
      }

      if (isUndefined(this.config.reverse)) {
        this.config.reverse = false;
      }

      if (isUndefined(this.config.deltaY)) {
        this.config.deltaY = 0;
      }
    } else if (this.config.type === 'original') {
      if (isUndefined(this.config.strokeStyle)) {
        this.config.strokeStyle = '#000000';
      }
      if (isUndefined(this.config.fillStyle)) {
        this.config.fillStyle = "#000000";
      }
    } else {
      throw 'config.type must be parametric, rectangular or original!';
    }

    this.isConfigured = true;
  }

  Shape.prototype.draw = function(context, shape) {
    if (!this.isConfigured) {
      throw 'painter.configure must be called before this function.';
    }

    if (this.config.type === 'original') {
      this.config.context = context;
      shape.bind(this)();
    } else if (this.config.type === 'parametric') {
      this.drawParametric.bind(this)(context, shape);
    } else {
      this.drawRectangular.bind(this)(context, shape);
    }
  };

  Shape.point = function() {
    var cfg = this.config;
    var context = cfg.context;
    validateThis.bind(this)();

    if (isUndefined(cfg.x)) { cfg.x = 0; }
    if (isUndefined(cfg.y)) { cfg.y = 0; }
    if (isUndefined(cfg.size)) { cfg.size = 1; }
    if (isUndefined(cfg.strokeStyle)) { cfg.strokeStyle = '#000000' };
    if (isUndefined(cfg.fillStyle)) { cfg.fillStyle = '#000000' };

    context.beginPath();
    context.strokeStyle = cfg.strokeStyle;
    context.fillStyle = cfg.fillStyle;
    context.arc(cfg.x, cfg.y, cfg.size, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
    context.closePath();
  };

  Shape.circle = function() {
    var cfg = this.config;
    var context = cfg.context;
    validateThis.bind(this)();

    if (isUndefined(cfg.x)) { cfg.x = 0; }
    if (isUndefined(cfg.y)) { cfg.y = 0; }
    if (isUndefined(cfg.radius)) {cfg.radius = 100; }
    if (isUndefined(cfg.strokeStyle)) { cfg.strokeStyle = '#000000' };

    context.beginPath();
    context.strokeStyle = cfg.strokeStyle;
    context.arc(cfg.x, cfg.y, cfg.radius, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();
  };

  Shape.arrow = function() {
    var cfg = this.config;
    var context = cfg.context;
    validateThis.bind(this)();

    if (isUndefined(cfg.start)) { cfg.start = {x: 0, y: 0}; }
    if (isUndefined(cfg.end)) { cfg.end = {x: 100, y:0}; }
    if (isUndefined(cfg.radius)) { cfg.radius = 100; }
    if (isUndefined(cfg.strokeStyle)) { cfg.strokeStyle = '#000000' };

    context.beginPath();
    context.strokeStyle = cfg.strokeStyle;
    context.moveTo(cfg.start.x, -cfg.start.y);
    context.lineTo(cfg.end.x, -cfg.end.y);
    context.stroke();
    context.closePath();

    cfg.size = 4;
    cfg.x = cfg.end.x;
    cfg.y = -cfg.end.y;
    Shape.point.bind(this)();
  };

  Shape.cardioid = function(t) {
    if (!isUndefined(this.config)) {
      var r = this.config.radius;
      var a = this.config.alpha;
      var b = this.config.ratio;
    }

    if (isUndefined(r)) { r = 100; }
    if (isUndefined(a)) { a = 0; }
    if (isUndefined(b)) { b = 1; }

    return {
      x: r * b * Math.cos(t-a) - 2*r * Math.cos(t/2),
      y: - r * b * Math.sin(t-a) + 2*r * Math.sin(t/2)
    };
  };

  Shape.arc = function(t) {
    if (!isUndefined(this.config)) {
      var r = this.config.radius;
      var p = this.config.period;
      var a = this.config.alpha;
    }

    if (isUndefined(r)) { r = 100; }
    if (isUndefined(p)) { p = 1; }
    if (isUndefined(a)) { a = 0; }

    return {
      x: r * Math.cos(p * t + a),
      y: - r * Math.sin(p * t + a)
    };
  };

  Shape.sin = function(x) {
    if (!isUndefined(this.config)) {
      var r = this.config.radius;
      var p = this.config.period;
      var a = this.config.alpha;
    }

    if (isUndefined(r)) { r = 100; }
    if (isUndefined(p)) { p = 1; }
    if (isUndefined(a)) { a = 0; }

    return r * Math.sin(p * x + a);
  };

  /**
   * An instance of Illustration is a picture in a web page painted through
   * Canvas API. In other words, an illustration is also a canvas. The HTML id
   * of the canvas severs as the unique id of the illustration. The id can be
   * configured through configure() function.
   *
   * Besides the id, paint() function is required as well for configuration.
   */
  function Illustration() {
    this.isConfigured = false;
    this.config = {};
    this.shapes = {};
    this.shapeIdQueue = [];
    this.shapeCount = 0;
  }

  Illustration.prototype.getPainter = function() {
    return {
      configure: Illustration.prototype.configureShape,
      draw: Illustration.prototype.drawShape,
      context: this.config.context,
      config: this.config, // illustration config
      shape: {
        point: Shape.point,
        circle: Shape.circle,
        arrow: Shape.arrow,
        cardioid: Shape.cardioid,
        arc: Shape.arc,
        sin: Shape.sin
      }
    };
  }

  Illustration.prototype.configureShape = function(config) {
    // this is expected to bind to painter
    var painter = this;
    var illustration = illustrations[painter.config.id];
    var shapeId = 'shape' + ++illustration.shapeCount;
    illustration.shapes[shapeId] = new Shape();
    illustration.shapeIdQueue.push(shapeId);
    illustration.shapes[shapeId].configure(config);
    return painter;
  }

  Illustration.prototype.drawShape = function(shape) {
    // this is expected to bind to painter
    var painter = this;
    var illustration = illustrations[painter.config.id];
    if (illustration.shapeIdQueue.length > 0) {
      illustration.shapes[illustration.shapeIdQueue.shift()]
                  .draw(painter.context, shape);
    }
  }

  Illustration.prototype.clear = function() {
    // this is expected to bind to illustration
    this.config.context.clearRect(-this.config.canvas.width/2,
                                  -this.config.canvas.height/2,
                                  this.config.canvas.width,
                                  this.config.canvas.height);
    var illustration = this;
    Object.keys(this.shapes).forEach(function (key) {
      illustration.shapes[key] = null;
    });
    this.shapes = null;
    this.shapes = {};
    this.shapeIdQueue = [];
    this.shapeCount = 0;
  };

  Illustration.prototype.animate = function(currentPeriod) {
    // this is expected to bind to illustration
    if (currentPeriod > this.config.endPeriod) {
      if (this.config.loop) {
        currentPeriod = this.config.startPeriod;
      } else {
        return;
      }
    }
    this.clear.bind(this)();
    this.config.paint(this.getPainter.bind(this)(), currentPeriod);
    var delta = (this.config.endPeriod - this.config.startPeriod)
                / this.config.repaintCount;
    setTimeout(this.animate.bind(this),
               this.config.repaintInterval,
               currentPeriod+delta);
  };

  Illustration.prototype.configure = function(config) {
    if (isUndefined(config)) {
      config = {};
    }

    this.config = config;

    if (isUndefined(config.id)) {
      throw 'Illustration id is required, cannot be undefined!';
    }

    if (isUndefined(config.width)) {
      this.config.width = 700;
    }

    if (isUndefined(config.height)) {
      this.config.height = 700;
    }

    if (isUndefined(config.traslateToX)) {
      this.config.translateToX = this.config.width / 2;
    }

    if (isUndefined(config.traslateToY)) {
      this.config.translateToY = this.config.height / 2;
    }

    if (isUndefined(config.is2d)) {
      this.config.is2d = true;
    }

    if (isUndefined(config.isDynamic)) {
      this.config.isDynamic = false;
    }

    if (this.config.isDynamic) {
      if (isUndefined(config.startPeriod)) {
        this.config.startPeriod = 0;
      }

      if (isUndefined(config.endPeriod)) {
        this.config.endPeriod = 4 * Math.PI;
      }

      if (isUndefined(config.repaintCount)) {
        this.config.repaintCount = 1000;
      }

      if (isUndefined(config.repaintInterval)) {
        this.config.repaintInterval = 10;
      }

      if (isUndefined(config.loop)) {
        this.config.loop = false;
      }
    }

    if (typeof(config.paint) !== 'function') {
      throw 'config.paint is expected as a function, cannot be other types!'
    }

    this.isConfigured = true;
  };

  Illustration.prototype.illustrate = function() {
    // this is expected to bind to illustration
    if (!this.isConfigured) {
      throw 'curves.configure must be called before this function.';
    }
    this.config.canvas = document.getElementById(this.config.id);
    this.config.context = this.config.canvas.getContext(
                          this.config.is2d ? '2d' : 'webgl');
    this.config.canvas.width = this.config.width;
    this.config.canvas.height = this.config.height;
    if (this.config.is2d) {
      this.config.context.translate(this.config.translateToX,
                                    this.config.translateToY);
    }
    if (this.config.isDynamic) {
      this.animate.bind(this)(this.config.startPeriod);
    } else {
      this.config.paint(this.getPainter.bind(this)());
    }
  };

  function configure(config) {
    var illustration;
    if (isUndefined(config) || isUndefined(config.id)) {
      throw 'config.id is required, cannot be undefined!';
    } else if (isUndefined(illustrations[config.id])) {
      illustration = new Illustration();
      illustrations[config.id] = illustration;
    } else {
      illustration = illustrations[config.id];
    }
    illustrationCount++;
    illustrationIdQueue.push(config.id);
    illustration.configure(config);
    return curvesContext;
  }

  function illustrate() {
    if (illustrationIdQueue.length > 0) {
      illustrations[illustrationIdQueue.shift()].illustrate();
    }
  }

  var curvesContext = {
    configure: configure,
    illustrate: illustrate
  };

  return curvesContext;
})();
