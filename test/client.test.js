/**
 * Created by shawn-liu on 2018/5/4.
 */
/* global describe, beforeEach, it */
const Client = require('../src/client');
const expect = require('chai').expect;
let db = null;
describe('test client', function () {
  before((done) => {
    db = new Client('http://localhost:3000', {
      host: 'localhost',
      db: 'britvicData'
    });
    done();
  })
  it('findOne test', async () => {
    const res = await db.collection('store').findOne({uniqueKey: 'SPEEDWAY,WV RT  10 HUFF JCT,MAN,WV,25635'});
    expect(res).not.null;
  });
});
