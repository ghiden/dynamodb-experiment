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
    client.get(params, (err, data) => {
      if (err) {
        console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
        return reject(err)
      }
      resolve(data)
    })
  })
}

function updateMovie(client, { year, title }, { rating, plot, actors }) {
  const UpdateExpression = 'set info.rating = :r, info.plot=:p, info.actors=:a'

  const params = {
    TableName,
    Key:{
      year,
      title
    },
    UpdateExpression,
    ExpressionAttributeValues:{
      ':r': rating,
      ':p': plot,
      ':a': actors,
    },
    ReturnValues:'UPDATED_NEW' // ALL_NEW
  }

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function increateMovieRating(client, { year, title }, rating) {
  const UpdateExpression = 'set info.rating = info.rating + :val'

  const params = {
    TableName,
    Key:{
      year,
      title
    },
    UpdateExpression,
    ExpressionAttributeValues:{
      ':val': rating,
    },
    ReturnValues:'UPDATED_NEW' // ALL_NEW
  }

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function removeActor(client, { year, title }, num) {
  const UpdateExpression = 'remove info.actors[0]'
  const ConditionExpression = 'size(info.actors) >= :num'

  const params = {
    TableName,
    Key:{
      year,
      title
    },
    UpdateExpression,
    ConditionExpression,
    ExpressionAttributeValues:{
      ':num': num,
    },
    ReturnValues:'UPDATED_NEW' // ALL_NEW
  }

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function deleteMovieWithCondition(client, { year, title }, rating) {
  const ConditionExpression = 'info.rating > :val'

  const params = {
    TableName,
    Key:{
      year,
      title
    },
    ConditionExpression,
    ExpressionAttributeValues:{
      ':val': rating,
    },
  }

  return new Promise((resolve, reject) => {
    client.delete(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  putMovie,
  getMovie,
  updateMovie,
  increateMovieRating,
  removeActor,
  deleteMovieWithCondition,
}
