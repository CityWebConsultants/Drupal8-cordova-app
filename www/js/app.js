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
  jDrupal.config('sitePath', 'http://myjisc.local');

  // Define jDrupal hooks.
  jDrupal.modules['cordova'] = ['cordova_rest_pre_process', 'cordova_rest_post_process'];

  jDrupal.contentType('article').then(function(schema) {

  }, function(fail) {
    alert(fail.message);
  })

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
