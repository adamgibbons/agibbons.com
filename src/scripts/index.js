(function($) {
  function getCurrentPath() {
    return window.location.pathname;
  }
  function menuItemIsInPath(idx, item) {
    return getCurrentPath().indexOf(item.text.toLowerCase()) !== -1;
  }

  $('#secondary-navigation li a')
  .filter(menuItemIsInPath)
  .parent()
  .addClass('is-active');
})(jQuery);
