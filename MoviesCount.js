const AWS = require('aws-sdk');
const { countMovies } = require('./MovieOps')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

async function main() {
  const client = new AWS.DynamoDB.DocumentClient()
  try {
    const total = await countMovies(client)
    console.log(`Total: ${total}`);
  } catch(err) {
    console.error(`Unable to scan the table. Error JSON:\n${JSON.stringify(err, null, 2)}`);
  }
}

main()
