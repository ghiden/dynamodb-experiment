const AWS = require('aws-sdk')
const { getMovie } = require('./MovieOps')

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

  try {
    const result = await getMovie(client, movie)
    console.log(`GetItem succeeded:\n${JSON.stringify(result, null, 2)}`)
  } catch(err) {
    console.error(`Unable to read item. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
