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
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'facilities', {
      title: 'List Facilities',
      state: 'facilities.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'facilities', {
      title: 'Create Facility',
      state: 'facilities.create',
      roles: ['user']
    });
  }
})();
