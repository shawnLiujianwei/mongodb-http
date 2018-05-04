/**
 * Created by shawn-liu on 2018/5/4.
 */
const rp = require('request-promise');
/**
 * options = {
 *  username: xxx // optional
 *  db: xxx // required
 *  host: xxx // required
 *  port: xxx // optional , default is 27010
 *  password: xxxx // required when username exist
 *  replicaSet: xxx //optional
 *  authSource: xxx //optional
 *  kms: true // optioanl
 * }
 * @param options
 */
const checkOption = options => {
  if (!options) {
    throw new Error('options is required');
  }
  if (!options.host) {
    throw new Error('host is required');
  }
  if (!options.db) {
    throw new Error('db is required');
  }
};
const defaultOptions = {
  kms: true,
  port: 27010
}
const DB = function (apiBase, options) {
  checkOption(options);
  this.apiBase = apiBase;
  this.options = Object.assign(options, defaultOptions);
  this.collections = {};
}
DB.prototype.collection = function (name) {
  const self = this;
  if (self.collections[name]) {
    return self.collections[name];
  }
  const coll = new Collection(name, self.apiBase, self.options);
  self.collections[name] = coll;
  return coll;
}

const Collection = function (name, api, dbConfig) {
  this.name = name;
  this.api = api;
  this.dbConfig = dbConfig;
  this._send = function (operation, ...args) {
    const self = this;
    return rp({
      uri: `${self.api}/collection/${self.name}`,
      method: 'POST',
      body: {
        credentials: self.dbConfig,
        operation,
        args
      },
      json: true
    });
  }
};

Collection.prototype.find = function (query) {
  return this._send('find', query);
};

Collection.prototype.findOne = function (query) {
  return this._send('findOne', query);
};

Collection.prototype.findOneAndUpdate = function (query, update) {
  return this._send('findOneAndUpdate', query, update);
};
Collection.prototype.findOneAndReplace = function (query, update) {
  return this._send('findOneAndReplace', query, update);
};

Collection.prototype.findOneAndDelete = function (query) {
  return this._send('findOneAndUpdate', query);
};

Collection.prototype.updateOne = function (query, update) {
  return this._send('updateOne', query, update);
};

Collection.prototype.updateMany = function (query, update) {
  return this._send('updateMany', query, update);
}

Collection.prototype.insertOne = function (insert) {
  return this._send('insertOne', insert);
};

Collection.prototype.insertMany = function (inserts) {
  return this._send('insertMany', inserts);
};

Collection.prototype.removeMany = function (query) {
  return this._send('removeMany', query);
};
Collection.prototype.removeOne = function (query) {
  return this._send('removeOne', query);
};

module.exports = DB;
