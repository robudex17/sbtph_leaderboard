const express = require('express')

const router = express.Router()

const { validateTarget } = require('../middleware/validator')
const salesTargetShipokController = require('../controllers/sales_target_shipok_controller')


router.post('/agent_target/:agent_id',validateTarget, salesTargetShipokController.addAgentNewTarget)


router.get('/agent_target/:agent_id',salesTargetShipokController.fetchAgentTarget)


router.put('/agent_target/:agent_id', validateTarget, salesTargetShipokController.updateAgentTarget)


router.delete('/agent_target/:agent_id', salesTargetShipokController.deleteAgentTarget)


module.exports = router