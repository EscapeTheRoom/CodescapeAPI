const Sequelize = require('sequelize')
const db = require('../db')

const Test = db.define('test', {
    content: {
        type: Sequelize.TEXT
    },
    questionId: {
        type: Sequelize.INTEGER
    }
})

module.exports = Test;