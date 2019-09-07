const AWS = require('aws-sdk');
const { putMovie } = require('./MovieOps')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

async function main() {
  const client = new AWS.DynamoDB.DocumentClient();

  const movie = {
    year: 2015,
    title: 'The Big New Movie',
    info: {
      plot: 'Nothing happens at all.',
      rating: 0,
    }
  }

  try {
    console.log("Adding a new item...")
    const result = await putMovie(client, movie)
    console.log(`Added item:\n${JSON.stringify(result, null, 2)}`)
  } catch(err) {
    console.error(`Unable to add item. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
