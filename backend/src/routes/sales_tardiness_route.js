const express = require('express')

const router = express.Router()

const { validateTardiness } = require('../middleware/validator')
const salesTardinessController = require('../controllers/sales_tardiness_controller')

router.post('/record_new_tardiness/:agent_id',validateTardiness, salesTardinessController.recordNewTardiness)

module.exports = router