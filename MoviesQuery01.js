const AWS = require('aws-sdk')
const { getMoviesInYear } = require('./MovieOps')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

async function main() {
  const client = new AWS.DynamoDB.DocumentClient()

  const year = 1985

  try {
    console.log(`Querying for movies from ${year}.`)
    const result = await getMoviesInYear(client, year)
    console.log('Query succeeded.')
    result.Items.forEach((item) => {
      console.log(` -${item.year}: ${item.title}`)
    })
  } catch(err) {
    console.error(`Unable to query. Error JSON:\n${JSON.stringify(err, null, 2)}`)
  }
}

main()
