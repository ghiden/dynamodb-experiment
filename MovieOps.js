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

module.exports = {
  putMovie,
}
