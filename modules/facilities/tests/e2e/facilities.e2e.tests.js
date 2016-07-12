'use strict';

describe('Facilities E2E Tests:', function () {
  describe('Test Facilities page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/facilities');
      expect(element.all(by.repeater('facility in facilities')).count()).toEqual(0);
    });
  });
});
