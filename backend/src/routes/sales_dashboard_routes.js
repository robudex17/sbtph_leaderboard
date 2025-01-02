const express = require('express')

const router = express.Router()

const { validateMonthYear } = require('../middleware/validator')


const salesDashboardController = require('../controllers/sales_dashboard_controller')

router.get('/sales_dashboard', validateMonthYear, salesDashboardController.fetchAgentDashboard)


module.exports = router