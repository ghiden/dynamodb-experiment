const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

function deleteTable(dynamodb, tableName) {
  const params = {
    TableName : tableName
  }
  return new Promise((resolve, reject) => {
    dynamodb.deleteTable(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

async function main() {
  const dynamodb = new AWS.DynamoDB()
  const tableName = 'Movies'

  try {
    const result = await deleteTable(dynamodb, tableName)
    console.log(`Deleted table. Table description JSON:\n${JSON.stringify(result, null, 2)}`)
  } catch(err) {
    console.error(`Unable to delete table. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
