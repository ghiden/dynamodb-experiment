const AWS = require('aws-sdk')
const { getMoviesInYear2 } = require('./MovieOps')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

async function main() {
  const client = new AWS.DynamoDB.DocumentClient()

  const year = 1985
  const letter1 = 'A'
  const letter2 = 'L'

  try {
    console.log(`Querying for movies from ${year} - titles ${letter1}-${letter2}, with genres and lead actor`);
    const result = await getMoviesInYear2(client, year, letter1, letter2)
    console.log('Query succeeded.')
    result.Items.forEach((item) => {
      console.log(` -${item.year}: ${item.title} ... ${item.info.genres} ... ${item.info.actors[0]}`)
    });
  } catch(err) {
    console.error(`Unable to query. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
