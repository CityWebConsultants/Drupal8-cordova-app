// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {

  // Spook the browser to render like an android app.
  //ons.platform.select('android');

  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Define the path of the backend Drupal site.
  jDrupal.config('sitePath', '[host url]');

  // Define jDrupal hooks.
  jDrupal.modules['cordova'] = ['cordova_rest_pre_process', 'cordova_rest_post_process'];

});

/**
 * Implements hook_rest_pre_process()
 * @param xhr
 * @param data
 */
window.cordova_rest_pre_process = function(xhr, data) {

  // Required for sharing cookies across domains.
  xhr.withCredentials = true;

}

/**
 * Implements hook_rest_post_process()
 * @param xhr
 * @param data
 */
window.cordova_rest_post_process = function(xhr, data) {

}
