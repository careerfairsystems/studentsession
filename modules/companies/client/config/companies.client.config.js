(function () {
  'use strict';

  angular
    .module('companies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Companies',
      state: 'companies',
      type: 'dropdown',
      roles: ['admin']
    });

    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'Generate Companies',
      state: 'companies.multiple',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'List of Companies',
      state: 'companies.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'Create a Company',
      state: 'companies.create',
      roles: ['admin']
    });
  
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'Scheduling Information',
      state: 'companies.scheduling',
      roles: ['admin']
    });
  
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'companies', {
      title: 'Time',
      state: 'companies.time',
      roles: ['admin']
    });
  }
})();
