const express = require('express')

const router = express.Router()
const salesAgensController = require ('../controllers/sales_agent_controller')


router.get('/sales_agents', salesAgensController.fetchSalesAgents)


router.post('sales_agents', )



module.exports = router