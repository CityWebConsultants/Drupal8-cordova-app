/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  // Based on whether user is authenticated or not, display profile fields or redirect to login page.
  profileLoad: function(page){

    jDrupal.connect().then(function() {

      var user = jDrupal.currentUser();
      if (user.isAuthenticated()) {

        page.querySelector('#profile-name').innerHTML = user.getAccountName();
        page.querySelector('#profile-email').innerHTML = user.entity.mail[0].value;

      }
      else {
        document.querySelector('#myNavigator').pushPage('html/login.html');
      }

    });

  },

  // Send logout request.
  logout: function() {

    jDrupal.userLogout().then(function() {
      ons.notification.alert('Successfully logged out.');
      document.querySelector('#myNavigator').resetToPage('html/profile.html')
        .then(menu.close.bind(menu));
    });

  },

  user : {

    save : function(uid, list) {

      // Need to first load the user that is being saved.
      jDrupal.userLoad(uid).then(function (user) {

        var listElement = document.getElementById(list); //My ons-list element

        // Get all the fields from the form.
        Array.prototype.forEach.call(listElement.querySelectorAll('.list__item'), function (element) {

          // Get the field name.
          if (element.querySelector('ons-if') != null) {
            var key = element.querySelector('ons-if').innerText;
          }
          else {
            var key = element.querySelector('label').innerText;
          }

          // Get the field value.
          var value = element.querySelector('input').value;

          if (element.querySelector('input').type == 'checkbox') {
            value = element.querySelector('input').checked;
          }

          user.entity[key][0].value = value;
        });

        // Remove protected field.
        delete user.entity['changed'];

        // Show modal while saving.
        fn.modalShow();
        user.save().then(function () {

          // After saving go back to the previous page and refresh with new data.
          fn.pop({
            refresh: true, callback: function (e) {
              fn.modalHide();
              ons.notification.alert('Profile saved.');
            }
          });

        }, function (fail) {
          fn.modalHide();
          ons.notification.alert(fail.message);
        });


      }, function (fail) {
        ons.notification.alert(fail.message);
      });

    }
    ,
    update: function(uid, list) {

      jDrupal.userLoad(uid).then(function(user) {

        // Exclude from the form
        var excludeList = ['uid', 'uuid', 'changed'];

        // List to add elements to.
        var listElement = document.getElementById(list); //My ons-list element

        for (var key in user.entity) {
          // skip loop if the property is from prototype
          if (!user.entity.hasOwnProperty(key) || excludeList.indexOf(key) > -1) continue;

          var obj = user.entity[key];
          for (var prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) continue;

            if (typeof obj[0].value != 'undefined') {

              // TODO: Need to account for multi-value fields.
              var newItemElement = document.createElement('ons-list-item'); //My new item

              newItemElement.setAttribute('modifier', 'nodivider');
              var elementHTML = '';

              // Use toggles for boolean fields
              if (typeof obj[0].value == 'boolean') {

                var checked = null;
                if (obj[0].value === true) {
                  var checked = 'checked';
                }

                elementHTML += '<label class="center" for="inner-highlight-input">' + key + '</label>' +
                  '<label class="right">' +
                  '<ons-switch id="' + key +'-input" data-key="' + key + '" ' + checked + ' input-id="inner-highlight-input"></ons-switch>' +
                  '</label>';

              }
              else {
                // Else use textfields.
                elementHTML +=
                  '<ons-if platform="ios other" class="left left-label">' + key + '</ons-if>' +
                  '<div class="center">' +
                  '<ons-input input-id="' + key + '-input" type="text" value="' + obj[0].value + '" data-key="' + key + '" placeholder="' + key + '" float></ons-input>' +
                  '</div>';

              }


              newItemElement.innerHTML = elementHTML;
              // Add new element to list.
              listElement.appendChild(newItemElement)
            }
          }
        }
      });

    }

  },

  node: {

    // Save a node given a list of form elements.
    'save': function(nid, list) {
      // Load the node before saving.
      jDrupal.nodeLoad(nid).then(function(node) {

        var listElement = document.getElementById(list); //My ons-list element

        // Get the field elements.
        Array.prototype.forEach.call(listElement.querySelectorAll('.list__item'), function(element) {

          // Get the field name.
          if (element.querySelector('ons-if') != null) {
            var key = element.querySelector('ons-if').innerText;
          }
          else {
            var key = element.querySelector('label').innerText ;
          }
          // Get the field value.
          var value = element.querySelector('input').value;

          if (element.querySelector('input').type == 'checkbox') {
            value = element.querySelector('input').checked;
          }

          node.entity[key][0].value = value;
        });

        // Remove protected fields. These will return '403: Forbidden' if included.
        delete node.entity['uid'];
        delete node.entity['created'];
        delete node.entity['promote'];
        delete node.entity['sticky'];
        delete node.entity['path'];
        delete node.entity['comment'];

        // Show modal while saving.
        fn.modalShow();
        node.save().then(function() {

          // After saving, go back to previous page and refresh data.
          fn.pop({refresh: true, callback: function(e) {
            fn.modalHide();
            ons.notification.alert('Node saved.');
          }});

        }, function (fail) {
          fn.modalHide();
          ons.notification.alert(fail.message);
        });


      }, function(fail) {
        ons.notification.alert(fail.message);
      });


    },

    // Render an entity edit form.
    'update' : function(nid, list) {

      // Exclude fields from the form.
      var excludeList = ['nid', 'uuid', 'vid', 'revision_timestamp', 'revision_translation_affected'];
      // Load the node the selected node from previous page.
      jDrupal.nodeLoad(nid).then(function(node) {

        // List to add the form elements to.
        var listElement = document.getElementById(list); //My ons-list element

        for (var key in node.entity) {
          // skip loop if the property is from prototype
          if (!node.entity.hasOwnProperty(key) || excludeList.indexOf(key) > -1) continue;

          var obj = node.entity[key];
          for (var prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) continue;

            if (typeof obj[0].value != 'undefined') {

              // TODO: Need to account for multi-value fields.
              var newItemElement = document.createElement('ons-list-item'); //My new item

              newItemElement.setAttribute('modifier', 'nodivider');
              var elementHTML = '';

              // Boolean fields rendered as toggles.
              if (typeof obj[0].value == 'boolean') {

                var checked = null;
                if (obj[0].value === true) {
                  var checked = 'checked';
                }

                elementHTML += '<label class="center" for="inner-highlight-input">' + key + '</label>' +
                  '<label class="right">' +
                  '<ons-switch id="' + key +'-input" data-key="' + key + '" ' + checked + ' input-id="inner-highlight-input"></ons-switch>' +
                  '</label>';

              }
              else {

                // Else rendered as textfield.
                elementHTML +=
                  '<ons-if platform="ios other" class="left left-label">' + key + '</ons-if>' +
                  '<div class="center">' +
                  '<ons-input input-id="' + key + '-input" type="text" value="' + obj[0].value + '" data-key="' + key + '" placeholder="' + key + '" float></ons-input>' +
                  '</div>';

              }


              newItemElement.innerHTML = elementHTML;
              // Add new element to list.
              listElement.appendChild(newItemElement)
            }
          }
        }
      });

    },

    // Load a node and render in a list.
    load: function(nid, list){

      // Load the node data.
      jDrupal.nodeLoad(nid).then(function(node) {

        var listElement = document.getElementById(list); //My ons-list element

        for (var key in node.entity) {
          // skip loop if the property is from prototype
          if (!node.entity.hasOwnProperty(key)) continue;

          var obj = node.entity[key];
          for (var prop in obj) {
            // skip loop if the property is from prototype
            if(!obj.hasOwnProperty(prop)) continue;

            if (typeof obj[0].value != 'undefined') {

              // Add simple field: value list items.
              var newItemElement = document.createElement('ons-list-item'); //My new item
              newItemElement.innerText = key + " : " + obj[0].value; //Text or HTML inside

              // Add item to list.
              listElement.appendChild(newItemElement)
            }
          }
        }
      });

    }
  },

  //////////////////////
  // Animation Service //
  /////////////////////
  animators: {

    // Swipe animation for task completion.
    swipe: function(listItem, callback) {
      var animation = (listItem.parentElement.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
      listItem.classList.add('hide-children');
      listItem.classList.add(animation);

      setTimeout(function() {
        listItem.classList.remove(animation);
        listItem.classList.remove('hide-children');
        callback();
      }, 950);
    },

    // Remove animation for task deletion.
    remove: function(listItem, callback) {
      listItem.classList.add('animation-remove');
      listItem.classList.add('hide-children');

      setTimeout(function() {
        callback();
      }, 750);
    }
  },

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: [
    {
      title: 'Download OnsenUI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Install Monaca CLI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Star Onsen UI repo on Github',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Register in the community forum',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Send donations to Fran and Andreas',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Profit',
      category: '',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Visit Japan',
      category: 'Travels',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Enjoy an Onsen with Onsen UI team',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    }
  ]
};
