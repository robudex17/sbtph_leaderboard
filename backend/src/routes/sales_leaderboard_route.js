const express = require('express')

const router = express.Router()

const { validateSalesLeaderBoard } = require('../middleware/validator')

const salesLeaderboardController = require('../controllers/sales_leaderboard_controllers')

router.get('/sales_leaderboard', validateSalesLeaderBoard, salesLeaderboardController.fetchAgentLeaderBoard)




module.exports = router