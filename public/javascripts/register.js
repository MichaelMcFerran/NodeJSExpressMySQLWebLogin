/*
This page is to server the register web page and integrate dynamic interactions
using jQuery and AJAX calls when needed
*/

// The following code updates the feedback var of the html on start up
jQuery(document).ready(function () {
    jQuery.ajax({
   type: 'GET',
   url: '/registerUpdater',
   success: function (data) {
       console.log(data);
    // let len = data.length;
    // for (let i = 0; i < len; i++) {
    //  console.log(data[i].sessionTitle);
        jQuery('#feedback').append(data);
    //}
   },
  });
});