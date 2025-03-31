const express = require('express')
const router = express.Router()

const salesFeedbackController = require('../controllers/sales_feedback_controller')
const {
     validateFeedback,
     validateMonthYear, 
     validateFeedbackDate,
     validateFeedbackResponsesValues,
     validateAddAndUpdateAgentsFeedback,
     validateAddAndUpdateLmFeedback,
     validateAddAndUpdateManagerFeedback,
     validateAgentId,
     validateLmId,
     validateManagerId,
     validateAddAndUpdateAgentsFeedbackByQa,
     validateQaId

     } = require('../middleware/validator')

const { authenticateToken, authorizeRoles} = require('../middleware/auth')


router.post('/agent_feedback/:agent_id', authenticateToken,authorizeRoles('admin'), validateFeedback, salesFeedbackController.addNewFeedback)

router.get('/agent_feedback/:agent_id', authenticateToken, validateMonthYear,salesFeedbackController.fetchAgentFeedback)

router.put('/agent_feedback/:agent_id', authenticateToken,authorizeRoles('admin'), validateFeedback, salesFeedbackController.updateAgentFeedback)

router.delete('/agent_feedback/:agent_id', authenticateToken, authorizeRoles('admin'), salesFeedbackController.deleteAgentFeedback)

router.post('/feedback_by_qa/:agent_id',
     authenticateToken,
     authorizeRoles('admin'),
     validateAddAndUpdateAgentsFeedbackByQa,
     validateFeedbackDate,
     validateMonthYear,
     salesFeedbackController.addAgentsFeedbackByQa
)
router.get('/feedback_by_qa/:agent_id',
     authenticateToken,
     authorizeRoles('admin','manager', 'user'),
     validateAgentId,
     validateMonthYear,
     salesFeedbackController.getAgentsFeedbackByQa
)
router.put('/feedback_by_qa/:agent_id',
     authenticateToken,
     authorizeRoles('admin'),
     validateAddAndUpdateAgentsFeedbackByQa,
     validateFeedbackDate,
     validateMonthYear,
     salesFeedbackController.updateAgentsFeedbackByQa
)
router.delete('/feedback_by_qa/:agent_id',
     authenticateToken,
     authorizeRoles('admin'),
     validateAgentId,
     validateQaId,
     validateFeedbackDate,
     validateMonthYear,
     salesFeedbackController.removeAgentsFeedbackByQa
)

router.post('/agents_feedback/:agent_id', 
              authenticateToken,
              validateAddAndUpdateAgentsFeedback,
              validateFeedbackResponsesValues,
              validateFeedbackDate,
              validateMonthYear,
              salesFeedbackController.addAgentsFeedback
            )
router.get('/agents_feedback/:agent_id',
           authenticateToken,
           validateAgentId,
           validateMonthYear,
           salesFeedbackController.getAgentsFeedback
          )

router.put('/agents_feedback/:agent_id', 
           authenticateToken,
           validateAddAndUpdateAgentsFeedback,
           validateFeedbackResponsesValues,
           validateFeedbackDate,
           validateMonthYear,
           salesFeedbackController.updateAgentsFeedback
          )

router.delete('/agents_feedback/:agent_id', 
             authenticateToken,
             validateAgentId,
             validateLmId,
             validateFeedbackDate,
             validateMonthYear,
             salesFeedbackController.removeAgentsFeedback
            
             )

router.post('/lm_feedback/:lm_id',
            authenticateToken,
            validateAddAndUpdateLmFeedback,
            validateFeedbackResponsesValues,
            validateFeedbackDate,
            validateMonthYear,
            salesFeedbackController.addLmFeedback
           )
router.get('/lm_feedback/:lm_id',
           authenticateToken,
           validateLmId,
           validateMonthYear,
           salesFeedbackController.getLmFeedback
        
           )

router.put('/lm_feedback/:lm_id', 
           authenticateToken,
           validateAddAndUpdateLmFeedback,
           validateFeedbackResponsesValues,
           validateFeedbackDate,
           validateMonthYear,
           salesFeedbackController.updateLmFeedback
           )
router.delete('/lm_feedback/:lm_id', 
            authenticateToken,
            validateLmId,
            validateManagerId,
            validateFeedbackDate,
            validateMonthYear,
            salesFeedbackController.removeLmFeedback
        
            )

router.post('/managers_feedback/:manager_id',
            authenticateToken,
            validateAddAndUpdateManagerFeedback,
            validateFeedbackResponsesValues,
            validateFeedbackDate,
            validateMonthYear,
            salesFeedbackController.addManagerFeedback
            )

router.get('/managers_feedback/:manager_id', 
           authenticateToken,
           validateManagerId,
           validateMonthYear,
           salesFeedbackController.getMangerFeedback
           )

router.put('/managers_feedback/:manager_id',
             authenticateToken,
             validateAddAndUpdateManagerFeedback,
             validateFeedbackResponsesValues,
             validateFeedbackDate,
             validateMonthYear,
             salesFeedbackController.updateManagerFeedback
            )

router.delete('/managers_feedback/:manager_id',
           authenticateToken,
           validateManagerId,
           validateAgentId,
           validateFeedbackDate,
           validateMonthYear,
           salesFeedbackController.removeManagerFeedback
           )


module.exports = router