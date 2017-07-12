(function($) {
  var list = $('#secondary-navigation li');
  var currentUrl = window.location.pathname;
  console.log(currentUrl);

  // list.map(function (idx, el) {
  //   console.log(idx, el.innerText.toLowerCase());
  // });

  var active = list.filter(function (idx, item) {
    // console.log(item.innerText.toLowerCase())
    console.log(item.innerText.toLowerCase());
    return currentUrl.indexOf(item.innerText.toLowerCase()) !== -1;
  });

  console.log(active);

})(jQuery);