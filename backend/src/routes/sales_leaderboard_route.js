const express = require('express')

const router = express.Router()

const { validateMonthYear } = require('../middleware/validator')

const salesLeaderboardController = require('../controllers/sales_leaderboard_controllers')

router.get('/sales_leaderboard', validateMonthYear, salesLeaderboardController.fetchAgentLeaderBoard)




module.exports = router