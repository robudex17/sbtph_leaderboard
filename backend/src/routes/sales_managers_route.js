const express = require('express')
const router = express.Router()

const salesManagerController = require('../controllers/sales_managers_controller.js')


router.get('/managers',salesManagerController.fetchManager)



module.exports = router