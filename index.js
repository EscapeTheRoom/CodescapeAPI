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
const PORT = process.env.PORT || 8080

// App
app.get('/', (req, res) => {
  res.send('Hello Codescape')
})

app.post('/', async (req, res, next) => {
  async function appendFiles(coded, tested) {
    coded = coded + '\n'
    let files
    await fs.appendFileSync('code-test.js', coded, 'utf8')
    await fs.appendFileSync('code-test.js', tested, 'utf8')

    async function getVersion() {
      try {
        const {stdout} = await execFile('mocha', ['code-test.js'])

        files = stdout
        console.log('this is STDOUT', stdout)

        return files
      } catch (err) {
        files = err.stdout

        //console.log(err.stdout);
        return files
      }
    }
    let getfiles = await getVersion()
    return getfiles
  }
  try {
    console.log('REQBODYHEEEE', req.body)
    // let bufferOriginal1 = Buffer.from(req.body.code)
    // let bufferOriginal2 = Buffer.from(req.body.test)
    // let code = bufferOriginal1.toString('utf8')
    // let test = bufferOriginal2.toString('utf8')
    // console.log('thsi is code', code)
    // let respond = await appendFiles(code, test)
    console.log('thsi is the type of code in req', typeof req.body.code)
    let code = req.body.code.replace(/\n/g, ' ')
    let test = req.body.test.replace(/\n/g, ' ')
    console.log('reqex code???????', code)
    let respond = await appendFiles(code, test)
    //let respond = await appendFiles(req.body.code, req.body.test)
    console.log('RESPONDTOJSON', respond)
    res.json(respond)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

// app.use((req, res, next) => {
//   if (path.extname(req.path).length) {
//     const err = new Error('Not found')
//     err.status = 404
//     next(err)
//   } else {
//     next()
//   }
// })

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
