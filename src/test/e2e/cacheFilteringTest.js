'use strict';

describe('Node filtering', function () {

  beforeEach(function () {
    browser.get('http://localhost:3000/index.html#/cluster/clustered');
  });

  it('should find cacheOrNodeFilterQueryInput element on cluster/clustered page', function() {
    expect(element(by.id('cacheOrNodeFilterQueryInput')).isPresent()).toBe(true);
  });

  it('should filter caches when user types cache name into filter input field', function () {
    var cacheList = element.all(by.repeater('cache in currentCluster.caches | filter:cacheOrNodeFilterQuery'));
    var query = element(by.model('cacheOrNodeFilterQuery.name'));

    browser.sleep(1000);
    expect(cacheList.count()).toBe(3);

    query.sendKeys('default');

    expect(cacheList.count()).toBe(1);
    query.clear();
    // memcachedCache + namedCache
    query.sendKeys('cache');
    expect(cacheList.count()).toBe(2);
  });
});