const express = require('express')

const router = express.Router()

const { validateTarget } = require('../middleware/validator')
const salesTargetShipokController = require('../controllers/sales_target_shipok_controller')


router.post('/add_new_target/:agent_id',validateTarget, salesTargetShipokController.addNewTarget)

module.exports = router