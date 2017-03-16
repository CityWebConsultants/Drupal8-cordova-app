/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Profile Edit Page Controller //
  //////////////////////////
  profileEditPage: function(page) {

    // Get and load the current user.
    var user = jDrupal.currentUser();

    // Render the user form.
    myApp.services.user.update(user.entity.uid[0].value, 'profile-field-list');


    // Save button click event.
    page.querySelector('[component="button/save-node"]').onclick = function() {

      ons.notification.confirm(
        {
          title: 'Save changes?',
          message: 'Previous data will be overwritten.',
          buttonLabels: ['Discard', 'Save']
        }
      ).then(function(buttonIndex) {
        if (buttonIndex === 1) {

          // Save the user entity.
          myApp.services.user.save(user.entity.uid[0].value, 'profile-field-list');

        }
      });

    }

  },

  //////////////////////////
  // Node Edit Page Controller //
  //////////////////////////
  nodeEditPage: function(page) {

    // Populate the node edit form.
    myApp.services.node.update(document.querySelector('#myNavigator').topPage.data.nid, 'edit-field-list');

    // Node save button click event.
    page.querySelector('[component="button/save-node"]').onclick = function() {

      ons.notification.confirm(
        {
          title: 'Save changes?',
          message: 'Previous data will be overwritten.',
          buttonLabels: ['Discard', 'Save']
        }
      ).then(function(buttonIndex) {
        if (buttonIndex === 1) {

          myApp.services.node.save(document.querySelector('#myNavigator').topPage.data.nid, 'edit-field-list');

        }
      });

    }

  },

  //////////////////////////
  // Node Create Page Controller //
  //////////////////////////
  nodeCreatePage: function(page) {

    // Save button click event.
    page.querySelector('[component="button/save-node"]').onclick = function() {

      myApp.services.node.save(null, 'edit-field-list');

    };

  },

  //////////////////////////
  // Node View Page Controller //
  //////////////////////////
  nodePage: function(page) {

    // Click handler for Edit button
    page.querySelector('[component="button/edit-node"]').onclick = function () {
      fn.push('html/node_edit.html', {data: {nid : document.querySelector('#myNavigator').topPage.data.nid}});
    };

    // Refresh the previous page on clicking back incase node was updated.
    document.querySelector('#nodePage ons-back-button').options = {refresh: true}

    // Load node and append to list.
    myApp.services.node.load(document.querySelector('#myNavigator').topPage.data.nid, 'field-list');

  },

  //////////////////////////
  // Node Listing Page Controller //
  //////////////////////////
  contentViewPage: function(page) {

    // Load the 'Frontpage' view which has had the 'Rest export' display added.
    jDrupal.viewsLoad('front').then(function(view) {

      var results = view.getResults();
      var listElement = document.getElementById('content-list'); //My ons-list element

      for (var i = 0; i < results.length; i ++) {

        var node = new jDrupal.Node(results[i]);
        var newItemElement = document.createElement('ons-list-item'); //My new item
        newItemElement.innerText = node.getTitle(); //Text or HTML inside
        newItemElement.setAttribute('tappable', '');
        newItemElement.setAttribute('onclick', "fn.push('html/node.html', {data: {nid: " + node.id() + "}})");
        listElement.appendChild(newItemElement)

      }
    });

  },

  //////////////////////////
  // Login Page Controller //
  //////////////////////////
  loginPage: function(page) {

    // Login button click handler.
    page.querySelector('[component="button/login"]').onclick = function() {

      // Login using username and password.
      fn.modalShow();
      jDrupal.userLogin(page.querySelector('#name-input').value, page.querySelector('#pass-input').value).then(function(e) {

        fn.pop({callback: function(e) {
          myApp.services.profileLoad(document.querySelector('#myNavigator').topPage);
          fn.modalHide();
        }});

      }, function (fail) {
        ons.notification.alert('failed: ' + fail.message);
      });

    };

    // Register button click handler.
    page.querySelector('[component="button/register"]').onclick = function() {

      fn.pop({callback : function(e) {
        // Load the register page.
        fn.push('html/register.html');
      }});

    };

  },

  //////////////////////////
  // Register Page Controller //
  //////////////////////////
  registerPage: function(page) {

    // Register button click handler.
    page.querySelector('[component="button/register"]').onclick = function() {

      // Submit request.
      fn.modalShow();
      jDrupal.userRegister(
        page.querySelector('#name-input').value,
        page.querySelector('#pass-input').value,
        page.querySelector('#email-input').value
      ).then(function(e) {

        ons.notification.alert('Registration successful. Please login.');
        fn.pop({callback: function(e) {
          myApp.services.profileLoad(document.querySelector('#myNavigator').topPage);
          fn.modalHide();
        }});

      }, function (fail) {
        ons.notification.alert('Failed: ' + fail.message);
      });

    }

  },

  //////////////////////////
  // Profile Page Controller //
  //////////////////////////
  profilePage: function(page) {

    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function () {
      document.querySelector('#menu').open();
    };

    // Load the profile fields.
    myApp.services.profileLoad(page);

  },

  ////////////////////////
  // Group Page Controller //
  ////////////////////////
  groupViewPage : function(page) {

    // Load the 'Frontpage' view which has had the 'Rest export' display added.
    jDrupal.viewsLoad('groups').then(function(view) {

      var results = view.getResults();
      var listElement = document.getElementById('group-list'); //My ons-list element

      for (var i = 0; i < results.length; i ++) {

        var node = new jDrupal.Node(results[i]);

        var newItemElement = document.createElement('ons-list-item'); //My new item
        newItemElement.innerText = node.entity.label[0].value; //Text or HTML inside
        newItemElement.setAttribute('tappable', '');
        newItemElement.setAttribute('onclick', "fn.push('html/group.html', {data: {nid: " + node.id() + "}})");
        listElement.appendChild(newItemElement)

      }
    });

  },
  //////////////////////////
  // Group View Page Controller //
  //////////////////////////
  groupPage: function(page) {

    // Click handler for Edit button
    page.querySelector('[component="button/edit-group"]').onclick = function () {
      fn.push('html/node_edit.html', {data: {nid : document.querySelector('#myNavigator').topPage.data.nid}});
    };

    // Refresh the previous page on clicking back incase node was updated.
    document.querySelector('#nodePage ons-back-button').options = {refresh: true}

    // Load node and append to list.
    myApp.services.node.load(document.querySelector('#myNavigator').topPage.data.nid, 'field-list');

  },
  ////////////////////////
  // Menu Page Controller //
  ////////////////////////
  menuPage: function(page) {

  }
};

window.fn = {};

// Show modal 'Loading'.
window.fn.modalShow = function() {
  document.getElementById('loadingModal').show();
}

// Hide modal 'Loading'.
window.fn.modalHide = function() {
  document.getElementById('loadingModal').hide();
}

// Open the menu.
window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

// pushPage extension to show/hide modals and close menu afterwards.
window.fn.push = function(page, options) {

  if (!options) {
    options = {};
  }
  var menu = document.getElementById('menu');

  window.fn.modalShow();
  options.callback = window.fn.modalHide();
  document.querySelector('#myNavigator').pushPage(page, options)
    .then(menu.close.bind(menu));

}

// popPage extension.
window.fn.pop = function(options) {
  var content = document.getElementById('myNavigator');
  if (!options) {
    options = {};
  }
  content.popPage(options);
};

