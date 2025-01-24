const express = require('express')
const router = express.Router()

const salesMemoController = require('../controllers/sales_memo_controller')
const { validateMemo, validateMonthYear } = require('../middleware/validator')


router.post('/agent_memo/:agent_id', validateMemo, salesMemoController.createSalesAgentMemo)

router.get('/agent_memo/:agent_id', validateMonthYear,salesMemoController.fetchAgentMemo)

router.put('/agent_memo/:agent_id', validateMemo, salesMemoController.updateAgentMemo)

router.delete('/agent_memo/:agent_id', salesMemoController.deleteAgentMemo)


module.exports = router