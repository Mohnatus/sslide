window.xanim = (function() {
  var updatePeriod = 5; // период обновления свойств - 5ms
  var defaultSpeed = 400; // скорость анимации по умолчанию - 400ms

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

  var free = function(el) {
    el.queue.splice(0, 1);
    next(el);
  }

  var next = function(el) {
    console.log('next', el.queue.length);
    
    if (el.queue.length) {
      var isFree = false;
      console.log(el.queue[0])
      el.queue[0]();
    }
  };

  var slideDown = function slideDown(el, ms, callback) {
    console.log('do slide down')
    // получить высоту
    var height = getHeight(el);

    // установить нулевую высоту
    el.style.height = 0;
    var overflow = el.style.overflow;
    el.style.overflow = 'hidden';    
    el.style.display = 'block';    

    // сколько пикселей за раз
    var diff = getDiff(height, ms);

    // сколько раз
    var counter = 0;

    // обновление высоты
    var timer = setInterval(function() {
      // высота на текущий момент
      var currentHeight = ++counter * diff;
      el.style.height = currentHeight + 'px';

      if (currentHeight >= height) {
        clearInterval(timer);
        el.style.height = 'auto';
        callback ? callback(el) : null;
        console.log('finish slide down')
        free(el);
      }
    }, updatePeriod);

    return el;
  };

  var slideUp = function slideUp(el, ms, callback) {
    console.log('do slide up')
    var height = getHeight(el);
    el.style.overflow = 'hidden';

    var diff = getDiff(height, ms);

    // сколько раз
    var counter = 0;

    // обновление высоты
    var timer = setInterval(function() {
      // высота на текущий момент
      var currentHeight = height - ++counter * diff;
      el.style.height = currentHeight + 'px';

      if (currentHeight <= 0) {
        clearInterval(timer);
        el.style.display = 'none';
        el.style.height = 'auto';
        console.log('finish slide up')
        callback ? callback(el) : null;
        free(el);
      }

    }, updatePeriod)
    return el;
  };

  var add = function(foo, el, ms, callback) {
    console.log('add', el.queue.length)

      el.queue.push(function() {
        foo(el, ms, callback);
      });
      console.log('now', el.queue.length);
      if (el.queue.length == 1) next(el);
  };

  return function(el) {
    el.queue = [];
    el.slideDown = function(ms, callback) {
      console.log('slide down')
      add(slideDown, el, ms, callback);
      return el;
    };
    el.slideUp = function(ms, callback) {
      console.log('slide up')
      add(slideUp, el, ms, callback);
      return el;
    };
    
    return el;
  }
})();