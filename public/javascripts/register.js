/*
This page is to server the register web page and integrate dynamic interactions
using jQuery and AJAX calls when needed
*/

// The following code updates the feedback var of the html on the page start up
jQuery(document).ready(function () {
    jQuery.ajax({
   type: 'GET',
   url: '/registerUpdater',
   success: function (data) {
       console.log(data);
        jQuery('#feedback').append(data);
   },
  });
});