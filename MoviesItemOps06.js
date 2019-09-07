const AWS = require('aws-sdk')
const { deleteMovieWithCondition } = require('./MovieOps')

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

  const rating = 5

  try {
    console.log('Attempting a conditional delete...');
    const result = await deleteMovieWithCondition(client, movie, rating)
    console.log(`DeleteItem succeeded:\n${JSON.stringify(result, null, 2)}`)
  } catch(err) {
    console.error(`Unable to delete item. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
