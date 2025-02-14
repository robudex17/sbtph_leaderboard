const express = require('express')

const router = express.Router()


const { validateTarget, validateMonthYear } = require('../middleware/validator')
const salesTargetShipokController = require('../controllers/sales_target_shipok_controller')

const { authenticateToken, authorizeRoles} = require('../middleware/auth')


router.post('/agent_target_shipok/:agent_id', authenticateToken, authorizeRoles('admin', 'manager'), validateTarget, salesTargetShipokController.addAgentNewTarget)


router.get('/agent_target_shipok/:agent_id', authenticateToken,validateMonthYear,salesTargetShipokController.fetchAgentTarget)


router.put('/agent_target_shipok/:agent_id', authenticateToken, authorizeRoles('admin', 'manager'), validateTarget, salesTargetShipokController.updateAgentTarget)


router.delete('/agent_target_shipok/:agent_id', authenticateToken, authorizeRoles('admin', 'manager'), salesTargetShipokController.deleteAgentTarget)


module.exports = router