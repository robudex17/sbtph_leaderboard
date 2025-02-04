const express = require('express')
const router = express.Router()

const salesMarketController = require('../controllers/sales_market_controller.js')


router.get('/agent_market', salesMarketController.fetchAgentMarket)



module.exports = router