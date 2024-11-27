const express = require('express')
const router = express.Router()

const salesFeedbackController = require('../controllers/sales_feedback_controller')
const { validateFeedback } = require('../middleware/validator')


router.post('/add_feedback/:agent_id', validateFeedback, salesFeedbackController.addNewFeedback)


module.exports = router