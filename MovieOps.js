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

function getMoviesInYear(client, year) {
  const KeyConditionExpression = '#yr = :yyyy'

  const params = {
    TableName,
    KeyConditionExpression,
    ExpressionAttributeNames: {
      '#yr': 'year',
    },
    ExpressionAttributeValues: {
      ':yyyy': year,
    }
  }

  return new Promise((resolve, reject) => {
    client.query(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function getMoviesInYear2(client, year, letter1, letter2) {
  const ProjectionExpression = '#yr, title, info.genres, info.actors[0]'
  const KeyConditionExpression = '#yr = :yyyy and title between :letter1 and :letter2'

  const params = {
    TableName,
    ProjectionExpression,
    KeyConditionExpression,
    ExpressionAttributeNames:{
      '#yr': 'year'
    },
    ExpressionAttributeValues: {
      ':yyyy': year,
      ':letter1': letter1,
      ':letter2': letter2,
    }
  }

  return new Promise((resolve, reject) => {
    client.query(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function scanHelper(client, params) {
  return new Promise((resolve, reject) => {
    client.scan(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

async function *getMoviesInYearsBetween(client, from, to) {
  const ProjectionExpression = '#yr, title, info.rating'
  const FilterExpression = '#yr between :start_yr and :end_yr'

  const params = {
    TableName,
    ProjectionExpression,
    FilterExpression,
    ExpressionAttributeNames:{
      '#yr': 'year'
    },
    ExpressionAttributeValues: {
      ':start_yr': from,
      ':end_yr': to,
    }
  }

  while (true) {
    try {
      const result = await scanHelper(client, params)
      yield result.Items
      if (typeof result.LastEvaluatedKey != 'undefined') {
        params.ExclusiveStartKey = result.LastEvaluatedKey
      } else {
        return
      }
    } catch(err) {
      throw err
    }
  }
}

module.exports = {
  putMovie,
  getMovie,
  updateMovie,
  increateMovieRating,
  removeActor,
  deleteMovieWithCondition,
  getMoviesInYear,
  getMoviesInYear2,
  getMoviesInYearsBetween,
}
