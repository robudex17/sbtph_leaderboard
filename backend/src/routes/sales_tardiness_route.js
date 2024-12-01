const express = require('express')

const router = express.Router()

const { validateTardiness } = require('../middleware/validator')
const salesTardinessController = require('../controllers/sales_tardiness_controller')

router.post('/agent_tardiness/:agent_id',validateTardiness, salesTardinessController.recordNewTardiness)

router.get('/agent_tardiness/:agent_id', salesTardinessController.fetchAgentTardiness)

router.put('/agent_tardiness/:agent_id', validateTardiness, salesTardinessController.updateAgentTardiness)

router.delete('/agent_tardiness/:agent_id', salesTardinessController.deleteAgentTardiness)

module.exports = router