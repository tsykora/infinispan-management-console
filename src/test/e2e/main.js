'use strict';

describe('The main view', function () {

  beforeEach(function () {
    browser.get('http://localhost:3000/index.html');
  });

  it('should just pass now', function () {
    expect(2 > 1).toBeTruthy();
  });
});
