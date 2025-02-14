const express = require('express')
const router = express.Router()

const salesFeedbackController = require('../controllers/sales_feedback_controller')
const { validateFeedback,validateMonthYear } = require('../middleware/validator')

const { authenticateToken, authorizeRoles} = require('../middleware/auth')


router.post('/agent_feedback/:agent_id', authenticateToken,authorizeRoles('admin'), validateFeedback, salesFeedbackController.addNewFeedback)

router.get('/agent_feedback/:agent_id', authenticateToken, validateMonthYear,salesFeedbackController.fetchAgentFeedback)

router.put('/agent_feedback/:agent_id', authenticateToken,authorizeRoles('admin'), validateFeedback, salesFeedbackController.updateAgentFeedback)

router.delete('/agent_feedback/:agent_id', authenticateToken, authorizeRoles('admin'), salesFeedbackController.deleteAgentFeedback)


module.exports = router