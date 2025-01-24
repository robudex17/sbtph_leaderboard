const express = require('express')
const router = express.Router()

const salesFeedbackController = require('../controllers/sales_feedback_controller')
const { validateFeedback,validateMonthYear } = require('../middleware/validator')


router.post('/agent_feedback/:agent_id', validateFeedback, salesFeedbackController.addNewFeedback)

router.get('/agent_feedback/:agent_id', validateMonthYear,salesFeedbackController.fetchAgentFeedback)

router.put('/agent_feedback/:agent_id', validateFeedback, salesFeedbackController.updateAgentFeedback)

router.delete('/agent_feedback/:agent_id', salesFeedbackController.deleteAgentFeedback)


module.exports = router