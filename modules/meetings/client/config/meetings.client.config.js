(function () {
  'use strict';

  angular
    .module('meetings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Meetings',
      state: 'meetings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'meetings', {
      title: 'List Meetings',
      state: 'meetings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'meetings', {
      title: 'Create Meeting',
      state: 'meetings.create',
      roles: ['user']
    });
  }
})();
