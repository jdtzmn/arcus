const mc = require('minecraft-protocol')

const MCStatus = function (options) {
  let host, port

  // assign values to host and port
  switch (typeof options) {
    case 'object':
      host = options.host
      port = options.port
      break
    case 'string':
      if (options.indexOf(':') !== -1) {
        host = options.split(':')[0]
        port = options.split(':')[1]
      } else {
        host = options
        port = '25565'
      }
      break
    default:
      return new Error('invalid options')
  }

  // ping a server for server info
  this.ping = () => new Promise((resolve, reject) => {
    mc.ping({ host, port }, (err, response) => {
      if (err) return reject(err)
      resolve(response)
    })
  })

  // watch a server for changes to playerlist
  this.watch = (refreshInterval, cb) => {
    if (typeof refreshInterval === 'function') {
      cb = refreshInterval
      refreshInterval = 5000 // refresh interval in ms [default]
    }

    // store previousPlayerData to check against
    let previousPlayerData

    // define a function to be run on an interval to detect changes to playerList
    const reportChanges = () => {
      this.ping()
        .then((response) => {
          const playerData = response.players

          if (previousPlayerData && previousPlayerData.online !== playerData.online) {
            playerData.type = previousPlayerData.online - playerData.online > 0 ? 'leave' : 'join'
            playerData.difference = determineDifference(previousPlayerData, playerData)
            cb(null, playerData)
          }

          previousPlayerData = response.players
        }).catch((err) => {
          cb(err, null)
        })
    }

    // start interval to reportChanges
    return setInterval(reportChanges, refreshInterval)
  }
}

const determineDifference = (previousPlayerData, playerData) => {
  const previousListIsBigger = previousPlayerData.online - playerData.online > 0
  const biggerPlayerList = previousListIsBigger ? previousPlayerData.sample : playerData.sample
  const smallerPlayerList = (previousListIsBigger ? playerData.sample : previousPlayerData.sample) || [] // if sample doesn't exist

  return biggerPlayerList.filter((player) => !idExistsInArray(player.id, smallerPlayerList))
}

const idExistsInArray = (id, playerList) => {
  return typeof playerList.find((playerData) => playerData.id === id) !== 'undefined'
}

module.exports = MCStatus
