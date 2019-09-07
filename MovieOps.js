const TableName = 'Movies'

function putMovie(client, { year, title, info }) {
  const params = {
    TableName,
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

function getMovie(client, { title, year }) {
  const params = {
    TableName,
    Key:{
      year,
      title
    }
  };

  return new Promise((resolve, reject) => {
    client.get(params, function(err, data) {
      if (err) {
        console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
        return reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  putMovie,
  getMovie,
}
