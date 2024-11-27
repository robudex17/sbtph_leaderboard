const express = require('express')
const router = express.Router()
const salesAbsencesController = require('../controllers/sales_absences_controller')

const { validateAbsence } = require('../middleware/validator')
//encode absent


router.post('/record_new_absent/:agent_id', validateAbsence, salesAbsencesController.recordNewAbsent)

module.exports = router