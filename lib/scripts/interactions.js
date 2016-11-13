function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkColor() {
    var color = getCookie("agibbonsColor");
    if (color) {
        $("body")
        .removeClass("scheme-red scheme-blue scheme-turquoise scheme-green")
        .addClass("scheme-" + color);
    }

    var $colorBtns = $("#footer").find("[data-color]");

    $colorBtns.removeClass('active')
    .each(function (el) {
      if ( $(this).attr("data-color") === color ) {
        $(this).addClass("active"); 
      }
    });
}

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


// Project handler
(function($) {
  $('[data-project]').click(function (e) {
    var targetUrl = $(this).attr('data-project');
    return window.location = '/work/' + targetUrl;
  })
})(jQuery);

// Footer handler
(function($) {
  $("#footer").find("[data-color]").click(function (e) {
    var selectedColor = $(this).attr('data-color');
    $(this).siblings().removeClass("active")
    $(this).addClass("active");

    $("body")
    .removeClass("scheme-red scheme-blue scheme-turquoise scheme-green")
    .addClass("scheme-" + selectedColor);    

    setCookie("agibbonsColor", selectedColor, 365);
  });
})(jQuery);

checkColor();
