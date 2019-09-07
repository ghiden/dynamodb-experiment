const AWS = require('aws-sdk')
const { removeActor } = require('./MovieOps')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

async function main() {
  const client = new AWS.DynamoDB.DocumentClient()

  const movie = {
    year: 2015,
    title: 'The Big New Movie',
  }

  const num = 3

  try {
    console.log('Remove one actor...');
    const result = await removeActor(client, movie, num)
    console.log(`UpdateItem succeeded:\n${JSON.stringify(result, null, 2)}`)
  } catch(err) {
    console.error(`Unable to update item. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
