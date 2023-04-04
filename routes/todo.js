const express = require('express')
const router =  express.Router()
const todoController = require('../controllers/todo')

router.get('/', todoController.getTask)

router.post('/createTask', todoController.createTask)

router.put('/markTask', todoController.markTask)

router.put('/unmarkTask', todoController.unmarkTask)

router.delete('/deleteTask', todoController.deleteTask)


module.exports = router