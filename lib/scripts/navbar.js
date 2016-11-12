function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// Handles modal
(function($) {
  var $modal = $("#my-modal");

  $("#img-1").click(function (e) {

    console.log($modal);
    $modal.css({'display': 'block'});
  });

  $("#close").click(function (e) {
    $modal.css({'display': 'block'});
  });
})(jQuery);

// Set prim-nav active item
(function($) {
  var pageUrl = /\/\w*/.exec(window.location.pathname)[0].slice(1);
  if (pageUrl) {

    if (pageUrl === 'ics') return;

    $("#header").find('nav').children().each(function (item) {
      if ( $(this).text().toLowerCase() === pageUrl ) {
        $(this).addClass('active');
      }
    });
  } else {
    $("#header").find('nav').children().first().addClass('active');
  }
})(jQuery);


// Handles project interactivity
(function($) {
  $('[data-project]').click(function (e) {
    var targetUrl = $(this).attr('data-project');
    return window.location = '/work/' + targetUrl;
  })
})(jQuery);
