const express =  require('express')

const router = express.Router()

const { validateYear } = require('../middleware/validator')

const  salesAnalyticsController = require('../controllers/sales_analytics_controller')


router.get('/analytics/:scope', validateYear, salesAnalyticsController.fetchAnalytics)

module.exports = router



