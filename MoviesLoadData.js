const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
});

function putMovie(client, { year, title, info }) {
  const params = {
    TableName: 'Movies',
    Item: {
      year,
      title,
      info,
    }
  }
  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

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

if (require.main === module) {
  main()
}

module.exports = {
  putMovie,
}