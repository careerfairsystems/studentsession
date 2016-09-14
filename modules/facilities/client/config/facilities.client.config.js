(function () {
  'use strict';

  angular
    .module('facilities')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Facilities',
      state: 'facilities',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'facilities', {
      title: 'Show facilities',
      state: 'facilities.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'facilities', {
      title: 'Create facilities',
      state: 'facilities.create',
      roles: ['admin']
    });
  }
})();
