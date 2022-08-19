const express = require('express')
const app = express()
const port = 3000
const constants = require('./src/utils/constants');
app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// controllers
const analyticsController = require('./src/controllers/analyticsController'); 

app.get('/', (request, response) => {
  response.send({ status: constants.STATUS.OK })
})

app.post('/collect', async (req, res) => {
  await analyticsController.collect(req, res)
})

app.listen(port, () => {
  console.log(`QoE service listening on port ${port}`)
})