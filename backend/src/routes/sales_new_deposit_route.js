const express = require('express')
const router = express.Router()

const salesNewDepositController = require('../controllers/sales_new_deposit_controller')
const { validateNewDeposit, validateMonthYear } = require('../middleware/validator')


router.post('/agent_deposit/:agent_id', validateNewDeposit, salesNewDepositController.newDeposit )

router.get('/agent_deposit/:agent_id', validateMonthYear,salesNewDepositController.fetchAgentNewDeposit )

router.put('/agent_deposit/:agent_id', validateNewDeposit, salesNewDepositController.updateAgentNewDeposit )

router.delete('/agent_deposit/:agent_id', salesNewDepositController.deleteAgentNewDeposit )

module.exports = router