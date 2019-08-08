let updatePeriod = 5; // update period - 5ms
let defaultSpeed = 400; // default animation speed - 400ms

// queue foo has finished
let free = function(el) {
  el.queue.splice(0, 1);
  next(el);
};

// next queue foo start
let next = function(el) {
  if (el.queue.length) {
    el.queue[0]();
  }
};

// add foo to queue
let add = function(foo, el, ms, callback) {
    el.queue.push(function() {
      foo(el, ms, callback);
    });
    if (el.queue.length == 1) next(el);
};

let set = function(el, props) {
  for (let prop in props) {
    el.style[prop] = props[prop] || '';
  }
};

let hasHeight = function(el) {
  return !!el.offsetHeight;
}

let getHeight = function(el) {
  let height = el.offsetHeight;
  if (!height) {
    set(el, {
      'visibility': 'hidden',
      'position': 'absolute',
      'display': 'block'
    });
    
    height = el.offsetHeight;

    set(el, {
      'position': '',
      'display': '',
      'visibility': '',
    });
  }
  return height;
};

let getDiff = function(values, time) {
  time = time || defaultSpeed;
  let diffs = {};

  for (let prop in values) {
    let value = values[prop];
    diffs[prop] = value ? (value/time * updatePeriod) : 0; 
  }

  return diffs;
};

let getVerticalMetrics = function(el) {
  let height = getHeight(el);
  let style = getComputedStyle(el);
  let paddingTop = parseFloat(style.paddingTop) || 0;
  let paddingBottom = parseFloat(style.paddingBottom) || 0;

  return {
    height: height,
    paddingTop: paddingTop,
    paddingBottom: paddingBottom,
  };
};

let slideDown = function slideDown(el, ms, callback) {
  let metrics = getVerticalMetrics(el);

  set(el, {
    'overflow': 'hidden',
    'height': '0px',
    'paddingTop': '0px',
    'paddingBottom': '0px',
    'display': 'block',
  });

  let diffs = getDiff(metrics, ms);

  let counter = 0;

  let timer = setInterval(function() {
    counter++;
    let currentHeight = counter * diffs.height;
    set(el, { 
      'height': currentHeight + 'px',
      'paddingTop': counter * diffs.paddingTop + 'px',
      'paddingBottom': counter * diffs.paddingBottom + 'px',
    });

    if (currentHeight >= metrics.height) {
      clearInterval(timer);
      set(el, {
        'height': '',
        'paddingTop': '',
        'paddingBottom': '',
        'overflow': '',
      });
      callback ? callback(el) : null;
      free(el);
    } 

  }, updatePeriod);

  return el;
};

let slideUp = function slideUp(el, ms, callback) {
  let metrics = getVerticalMetrics(el);

  set(el, {
    'overflow': 'hidden',
    'height': metrics.height,
    'minHeight': ''
  });

  let diffs = getDiff(metrics, ms);

  let counter = 0;

  let timer = setInterval(function() {
    let currentHeight = metrics.height - counter * diffs.height;

    set(el, {
      'height': currentHeight + 'px',
      'paddingTop': metrics.paddingTop - counter * diffs.paddingTop + 'px',
      'paddingBottom': metrics.paddingBottom - counter * diffs.paddingBottom + 'px',
    });
    
    counter++;

    if (currentHeight <= 0) {
      clearInterval(timer);

      set(el, {
        'display': 'none',
        'height': '',
        'overflow': '',
        'paddingTop': '',
        'paddingBottom': ''
      });

      callback ? callback(el) : null;
      free(el);
    } 

  }, updatePeriod)
  return el;
};



let lib =  function(el) {
  el.queue = [];
  el.slideDown = function(ms, callback) {
    add(slideDown, el, ms, callback);
    return el;
  };
  el.slideUp = function(ms, callback) {
    add(slideUp, el, ms, callback);
    return el;
  };
  el.slideToggle = function(ms, callback) {
    if (hasHeight(el)) return el.slideUp(ms, callback);
    return el.slideDown(ms, callback);
  }
  
  return el;
}

export default lib;