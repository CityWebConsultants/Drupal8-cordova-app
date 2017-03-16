// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {

  // Spook the browser to render like an android app.
 // ons.platform.select('android');

  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Define the path of the backend Drupal site.
  if (ons.platform.isAndroid()) {

    // On Android emulators you cannot access local domains the same way you could on a browser of even iOS.
    // To access localhost, instead of 127.0.0.1, you have to use 10.0.2.2. This causes issues when trying to access
    // cookies from local domains.
    jDrupal.config('sitePath', 'http://mysite.local:8888/mysite');
  }
  else {
    jDrupal.config('sitePath', 'http://mysite.local:8888/mysite');
  }


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
