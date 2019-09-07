const AWS = require('aws-sdk')
const fs = require('fs')
const { putMovie } = require('./MovieOps')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

async function main() {
  const client = new AWS.DynamoDB.DocumentClient()

  console.log('Reading data...')
  const allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'))

  console.log('Importing movies into DynamoDB...')
  for (const [i, movie] of allMovies.entries()) {
    try {
      const response = await putMovie(client, movie)
      console.log(`Load movie #${i} succeeded: ${movie.title}`)
      console.log(response)
    } catch(err) {
      console.error(`Unable to add movie ${movie.title}. Error JSON: ${JSON.stringify(err, null, 2)}`)
    }
  }
}

main()
