(function () {
  'use strict';

  angular
    .module('applications')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Application',
      state: 'applications',
      type: 'dropdown',
      roles: ['admin']
    }); // vart kommer man med denna?

    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'Received applications',
      state: 'applications.list',
      roles: ['admin']
    });

    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'F.A.Q',
      state: 'applications.info',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'Apply',
      state: 'applications.create',
      roles: ['admin']
    });
  }
})();
