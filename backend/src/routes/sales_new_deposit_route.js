const express = require('express')
const router = express.Router()

const salesNewDepositController = require('../controllers/sales_new_deposit_controller')
const { validateNewDeposit } = require('../middleware/validator')

router.post('/new_deposit/:agent_id', validateNewDeposit, salesNewDepositController.newDeposit )


module.exports = router