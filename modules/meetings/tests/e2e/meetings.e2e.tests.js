'use strict';

describe('Meetings E2E Tests:', function () {
  describe('Test Meetings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/meetings');
      expect(element.all(by.repeater('meeting in meetings')).count()).toEqual(0);
    });
  });
});
