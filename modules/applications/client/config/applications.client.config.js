(function () {
  'use strict';

  angular
    .module('applications')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Applications',
      state: 'applications',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'List Applications',
      state: 'applications.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'applications', {
      title: 'Create Application',
      state: 'applications.create',
      roles: ['user']
    });
  }
})();
