const express = require('express')
const Router = express.Router
const MCStatus = require('./MCStatus')

const api = new Router()

api.get('/ping', (req, res) => {
  if (!req.query.address) return res.sendStatus(400)
  const mcstatus = new MCStatus(req.query.address)
  mcstatus.ping()
    .then((response) => {
      res.send(response)
    })
    .catch((err) => {
      console.log(err)
      let status

      switch (err.code) {
        case 'ECONNREFUSED':
        case 'ENOTFOUND':
          status = 502
          break
        default:
          status = 500
      }

      res.sendStatus(status)
    })
})

module.exports = api
