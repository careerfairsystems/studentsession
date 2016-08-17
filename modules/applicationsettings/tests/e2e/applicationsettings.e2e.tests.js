'use strict';

describe('Applicationsettings E2E Tests:', function () {
  describe('Test Applicationsettings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/applicationsettings');
      expect(element.all(by.repeater('applicationsetting in applicationsettings')).count()).toEqual(0);
    });
  });
});
