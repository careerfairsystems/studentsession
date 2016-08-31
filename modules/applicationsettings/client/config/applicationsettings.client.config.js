(function () {
  'use strict';

  angular
    .module('applicationsettings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Settings',
      state: 'applicationsettings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'applicationsettings', {
      title: 'Show settings',
      state: 'applicationsettings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'applicationsettings', {
      title: 'Create setting',
      state: 'applicationsettings.create',
      roles: ['user']
    });
  }
})();
