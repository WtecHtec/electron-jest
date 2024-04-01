const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const geminiApi = require('./gemini.ai')
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.post('/data', (req, res) => {
  res.json(req.body)
})

geminiApi(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

