### Operate MongoDB by Http

#### Usage
1. `npm run start`  
   will start the web server that ready to operate mongodb, the default port is `3000`
2. use the client to call the api  
   1. in the target project run `npm install mongodb-http`
   2. `const MongoDBHttp = require('mongodb-http')`;
   3. `const db = new MongodDBHttp('http://localhost:8080',options)`

### Server Sample
   `POST http://localhost:3000/collection/store`  
   ```javascript
{
	"credentials":{
		"host": "localhost",
		"db":"britvicData"
	},
	"operation":"find",
	"args":[
			{
				"uniqueKey":"SPEEDWAY,WV RT  10 HUFF JCT,MAN,WV,25635"
			}
		]
}
```
   
### Client Sample  
```javascript
const MongodbHttp = require('./src/client');
const url = 'http://localhost:3000';
const options = {
  username: 'username',
  password: 'password',
  host: 'localhost',
  port: '27010',
  replicaSet: 'replicaSet',
  kms: false // whether use aws kms , default is false
};

const db = new MongodbHttp(url, options);
// then you can use it like Mongodb driver

//insert one
db.collection('test').insertOne({name: 'test'});

//find

db.collection('test').find({});
```
