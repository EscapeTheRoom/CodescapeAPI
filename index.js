'use strict'

const express = require('express')
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)
const db = require('./db')
var XRegExp = require('xregexp').XRegExp
const Regex = require('regex')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Constants
const PORT = process.env.PORT || 8000
// helper functions 
function appendFiles(coded, tested) {
  //turn the test which is a buffer into string
  const codeTest = 'code-test.js'
  coded = coded + '\n'
  // tested = tested.toString()
  fs.appendFileSync('code-test.js', coded, 'utf8', err => {
    if (err) throw err
  })
  fs.appendFileSync('code-test.js', tested, 'utf8', err => {
    if (err) throw err
  })
  return codeTest
}
async function executeFile(){
  try {
    const {stdout} = await execFile('mocha', ['code-test.js'])
    let files = stdout
    console.log('this is STDOUT', stdout)
    console.log("typeOf File", typeof files)
    return files
  } catch (err) {
    let files = err.stdout
    console.log("ERROR",err.stdout);
    console.log("typeOf File", typeof files)
    return files
  }
}


// App
app.get('/', (req, res) => {
  res.send('Hello Codescape')
})

app.post('/', async (req, res, next) => {
  try{
    console.log('REQ BODY',req.body)
    const file = await appendFiles(req.body.code, req.body.test)
    let testResult = await executeFile()
    res.json(testResult);
  }
  catch (err){
    console.error(err)
    next(err)
  }
})
  

app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

db.sync().then(() => {
  app.listen(PORT, err => {
    if (err) {
      console.error('Internal server error', err)
    }
    console.log(`Server running on PORT ${PORT}`)
  })
})
