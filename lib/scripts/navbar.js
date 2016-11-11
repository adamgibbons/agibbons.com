(function($) {
  var $modal = $("#my-modal");

  $("#img-1").click(function (e) {

    console.log($modal);
    $modal.css({'display': 'block'});
  });

  $("#close").click(function (e) {
    $modal.css({'display': 'block'});
  });

  $('[data-tab]').click(function (e) {
    console.log(e);
    e.preventDefault();
    $(this).tab('show');
  })

})(jQuery);
