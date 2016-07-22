(function () {
  'use strict';

  angular
    .module('companies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Företag',
      state: 'companies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'Företagslista',
      state: 'companies.list',
      roles: ['*']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'Skapa ett företag',
      state: 'companies.create',
      roles: ['admin']
    });
  }
})();
