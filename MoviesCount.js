const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

function scan(client, startKey) {
  const params = {
    TableName: 'Movies',
    Select: 'COUNT',
  }

  if (startKey) {
    params.ExclusiveStartKey = startKey
  }

  return new Promise((resolve, reject) => {
    client.scan(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

async function count(client) {
  let total = 0
  let startKey

  while (true) {
    try {
      const result = await scan(client, startKey)
      total += result.Count
      if (result.LastEvaluatedKey) {
        console.log('Scanning for more...')
        startKey = result.LastEvaluatedKey
      } else {
        return total
      }
    } catch(err) {
      throw err
    }
  }
}

async function main() {
  const client = new AWS.DynamoDB.DocumentClient()
  try {
    const total = await count(client)
    console.log(`Total: ${total}`);
  } catch(err) {
    console.error(`Unable to scan the table. Error JSON:\n${JSON.stringify(err, null, 2)}`);
  }
}

main()