const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

function createTable(dynamodb, params) {
  return new Promise((resolve, reject) => {
    dynamodb.createTable(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

async function main() {
  const dynamodb = new AWS.DynamoDB()
  const params = {
    TableName : 'Movies',
    KeySchema: [       
      { AttributeName: 'year', KeyType: 'HASH'},  //Partition key
      { AttributeName: 'title', KeyType: 'RANGE' }  //Sort key
    ],
    AttributeDefinitions: [       
      { AttributeName: 'year', AttributeType: 'N' },
      { AttributeName: 'title', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 10, 
      WriteCapacityUnits: 10
    }
  }

  try {
    const data = await createTable(dynamodb, params)
    console.log('Created table. Table description JSON:\n', JSON.stringify(data, null, 2))
  } catch(err) {
    console.error('Unable to create table. Error JSON:\n', JSON.stringify(err, null, 2))
  }
}

main();