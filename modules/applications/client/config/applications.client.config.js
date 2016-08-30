(function () {
  'use strict';

  angular
    .module('applications')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Ansök',
      state: 'applications',
      type: 'dropdown',
      roles: ['*']
    }); // vart kommer man med denna?

    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'Information',
      state: 'applications.info',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'Inkomna ansökningar',
      state: 'applications.list',
      roles: ['admin'] //ny!
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'Skapa en ansökan',
      state: 'applications.create',
      roles: ['user']
    });
  }
})();
