const express = require('express')

const router = express.Router()


const {  validateMonthYear } = require('../middleware/validator')
const salesEvaluationDataController = require('../controllers/sales_evaluation_data_controller')

const { authenticateToken, authorizeRoles} = require('../middleware/auth')

// I remove the validateTarget because it is not needed for now

// router.post('/sales_evaluation_data', authenticateToken, authorizeRoles('admin', 'manager'),  salesTargetShipokController.addAgentNewTarget)


router.get('/sales_evaluation_data', authenticateToken,authorizeRoles('admin', 'manager'),validateMonthYear, salesEvaluationDataController.fetchSalesEvaluationData)


// router.put('/agent_target_shipok/:agent_id', authenticateToken, authorizeRoles('admin', 'manager'),  salesTargetShipokController.updateAgentTarget)


// router.delete('/sales_evaluation_data/:agent_id', authenticateToken, authorizeRoles('admin', 'manager'), salesTargetShipokController.deleteAgentTarget)


module.exports = router