const express = require('express')
const path = require('path')
const app = express()

const apiRoutes = require('./api')
const port = process.env.PORT || 3000

// api
app.use('/api', apiRoutes)

// send default index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// listen on port
const listener = app.listen(port, () => {
  console.log('Listening on port: ' + listener.address().port)
})
