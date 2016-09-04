(function () {
  'use strict';

  angular
    .module('applicationsettings')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    Menus.addMenuItem('topbar', {
      title: 'Settings',
      state: 'applicationsettings',
      type: 'dropdown',
      roles: ['*']
    });

    Menus.addSubMenuItem('topbar', 'applicationsettings', {
      title: 'Show settings',
      state: 'applicationsettings.list'
    });

    Menus.addSubMenuItem('topbar', 'applicationsettings', {
      title: 'Choose active setting',
      state: 'applicationsettings.active'
    });

    Menus.addSubMenuItem('topbar', 'applicationsettings', {
      title: 'Create setting',
      state: 'applicationsettings.create',
      roles: ['user']
    });
  }
})();
