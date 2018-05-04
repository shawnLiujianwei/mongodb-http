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
      db: 'storeLocator_lambda'
    });
    done();
  })
  it('findOne test', async () => {
    const res = await db.collection('store').insertOne(
      {
        placeId: "﻿ChIJ9bln5cgitkcRW0zZZQIBI_8"
      })
    ;
    expect(res).not.null;
  });
});
