/**
 * Created by shawn-liu on 2018/5/4.
 */
const getConnection = require('./getConnection');

module.exports = async (credentials, coll, operation, args) => {
  const db = await getConnection(credentials);
  const col = db.collection(coll);
  const res = col[operation].apply(col, args);
  // const res = await db.collection(coll).findOne(args[0])
  if (operation === 'find') {
    return res.toArray();
  }
  return res;
}
