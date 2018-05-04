/**
 * Created by shawn-liu on 17/9/4.
 */

const MongoDB = require('mongodb').MongoClient;
const Promise = require('bluebird');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-west-1'
})
const kms = Promise.promisifyAll(new AWS.KMS({
  apiVersion: '2014-11-01'
}));

/**
 * config = {
 *  username: xxx // optional
 *  db: xxx // required
 *  host: xxx // required
 *  port: xxx // optional , default is 27010
 *  password: xxxx // required when username exist
 *  replicaSet: xxx //optional
 *  authSource: xxx //optional
 *  kms: true // optioanl
 * }
 * @param config
 */
const getDbUrl = async (config) => {
  console.log(JSON.stringify(config));
  const array = ['mongodb://'];
  if (config.username && config.password) {
    array.push(config.username);
    array.push(':');
    if (config.kms) {
      const res = await kms.decryptAsync({
        CiphertextBlob: new Buffer(config.password, 'base64')
      })
      const password = res.Plaintext.toString('utf-8');
      array.push(encodeURIComponent(password));
    } else {
      array.push(config.password);
    }
    array.push('@');
  }
  array.push(config.host);
  array.push('/');
  array.push(config.db);

  if (config.replicaSet || config.authSource) {
    array.push('?');
    const temp = [];
    if (config.replicaSet) {
      temp.push(`replicaSet=${config.replicaSet}`)
    }
    if (config.authSource) {
      temp.push(`authSource=${config.authSource}`);
    }
    array.push(temp.join('&'));
  }
  const url = array.join('');
  return url;
}

const pool = {};
module.exports = async config => {
  const url = await getDbUrl(config);
  if (pool[url]) {
    return pool[url];
  }
  console.log(`Connection to mongodb:${url}`);
  const client = await MongoDB.connect(url,
    {
      promiseLibrary: Promise,
      poolSize: 50
    });
  const db = client.db();
  console.log(`Connected to mongodb:${url}`);
  pool[url] = db;
  return db;
};
