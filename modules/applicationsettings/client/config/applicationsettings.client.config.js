(function () {
  'use strict';

  angular
    .module('applicationsettings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Inställningar',
      state: 'applicationsettings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'applicationsettings', {
      title: 'Visa inställningar',
      state: 'applicationsettings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'applicationsettings', {
      title: 'Skapa inställning',
      state: 'applicationsettings.create',
      roles: ['user']
    });
  }
})();
