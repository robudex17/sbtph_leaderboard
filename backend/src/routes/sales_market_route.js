const express = require('express')
const router = express.Router()

const salesMarketController = require('../controllers/sales_market_controller.js')
const { authenticateToken, authorizeRoles} = require('../middleware/auth')

const  {validateMonthYear} = require('../middleware/validator.js')

router.get('/agent_market', authenticateToken, salesMarketController.fetchAgentMarket)

router.get('/agent_market_target_shipok', authenticateToken, validateMonthYear,salesMarketController.fetchAgentMarketTargetShipok)


router.get('/agent_market_new_deposit', authenticateToken, validateMonthYear,salesMarketController.fetchAgentMarketNewDeposit)

router.get('/agent_market_target_shipok_year', authenticateToken, validateMonthYear,salesMarketController.fetchAgentMarketTargetShipokYear)


router.get('/agent_market_new_deposit_year', authenticateToken, validateMonthYear,salesMarketController.fetchAgentMarketNewDepositYear)

module.exports = router