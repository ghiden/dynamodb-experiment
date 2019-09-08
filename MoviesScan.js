const AWS = require('aws-sdk')
const { getMoviesInYearsBetween } = require('./MovieOps')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

async function main() {
  const client = new AWS.DynamoDB.DocumentClient()

  const yearFrom = 1950
  const yearTo = 1959
  let total = 0

  console.log(`Scanning for movies from ${yearFrom} - to ${yearTo}`);
  const scanner = getMoviesInYearsBetween(client, yearFrom, yearTo)
  while (true) {
    try {
      let result = await scanner.next()
      if (result.done) {
        break
      }
      total += result.value.length
      result.value.forEach((movie) => {
        console.log(`${movie.year}: ${movie.title} - rating: ${movie.info ? movie.info.rating : 'NR'}`)
      })
    } catch(err) {
      console.error(`Unable to scan. Error JSON:\n${JSON.stringify(err, null, 2)}`)
      break
    }
  }
  console.log('scanned count:', total)
}

main()

