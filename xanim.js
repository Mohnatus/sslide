window.xanim = (function() {
  var updatePeriod = 5; // update period - 5ms
  var defaultSpeed = 400; // default animation speed - 400ms

  var getHeight = function(el) {
    var height = el.offsetHeight;
    if (!height) {
      el.style.visibility = 'hidden';
      var position = el.style.position || 'unset';
      el.style.position = 'absolute';
      el.style.display = 'block';
      height = el.offsetHeight;
      el.style.display = 'none';
      el.style.position = position;
      el.style.visibility = 'visible';
    }
    return height;
  };

  var getDiff = function(height, time) {
    time = time || defaultSpeed;
    return height / time * updatePeriod;
  };

  // queue foo has finished
  var free = function(el) {
    el.queue.splice(0, 1);
    next(el);
  };

  // next queue foo start
  var next = function(el) {
    if (el.queue.length) {
      var isFree = false;
      el.queue[0]();
    }
  };

  // add foo to queue
  var add = function(foo, el, ms, callback) {
      el.queue.push(function() {
        foo(el, ms, callback);
      });
      if (el.queue.length == 1) next(el);
  };

  var slideDown = function slideDown(el, ms, callback) {
    var height = getHeight(el);

    el.style.height = 0;
    var overflow = el.style.overflow;
    el.style.overflow = 'hidden';    
    el.style.display = 'block';    

    var diff = getDiff(height, ms);

    var counter = 0;

    var timer = setInterval(function() {
      var currentHeight = ++counter * diff;
      el.style.height = currentHeight + 'px';

      if (currentHeight >= height) {
        clearInterval(timer);
        el.style.height = 'auto';
        callback ? callback(el) : null;
        free(el);
      }
    }, updatePeriod);

    return el;
  };

  var slideUp = function slideUp(el, ms, callback) {
    var height = getHeight(el);
    el.style.overflow = 'hidden';

    var diff = getDiff(height, ms);

    var counter = 0;

    var timer = setInterval(function() {
      var currentHeight = height - ++counter * diff;
      el.style.height = currentHeight + 'px';

      if (currentHeight <= 0) {
        clearInterval(timer);
        el.style.display = 'none';
        el.style.height = 'auto';
        callback ? callback(el) : null;
        free(el);
      }

    }, updatePeriod)
    return el;
  };

  return function(el) {
    el.queue = [];
    el.slideDown = function(ms, callback) {
      add(slideDown, el, ms, callback);
      return el;
    };
    el.slideUp = function(ms, callback) {
      add(slideUp, el, ms, callback);
      return el;
    };
    
    return el;
  }
})();