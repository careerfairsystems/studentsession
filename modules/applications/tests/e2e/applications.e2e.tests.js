'use strict';

describe('Applications E2E Tests:', function () {
  describe('Test Applications page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/applications');
      expect(element.all(by.repeater('application in applications')).count()).toEqual(0);
    });
  });
});
