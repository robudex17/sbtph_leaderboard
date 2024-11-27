const express = require('express')
const router = express.Router()

const salesMemoController = require('../controllers/sales_memo_controller')
const { validateMemo } = require('../middleware/validator')

router.post('/create_memo/:agent_id', validateMemo, salesMemoController.createSalesAgentMemo)

module.exports = router