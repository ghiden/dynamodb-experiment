const AWS = require('aws-sdk')
const { updateMovie } = require('./MovieOps')

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

  const params = {
    rating: 5.5,
    plot :'Everything happens all at once.',
    actors: ['Larry', 'Moe', 'Curly'],
  }

  try {
    console.log('Updating the item...');
    const result = await updateMovie(client, movie, params)
    console.log(`UpdateItem succeeded:\n${JSON.stringify(result, null, 2)}`)
  } catch(err) {
    console.error(`Unable to update item. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
