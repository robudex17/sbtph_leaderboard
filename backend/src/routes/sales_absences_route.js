const express = require('express')
const router = express.Router()
const salesAbsencesController = require('../controllers/sales_absences_controller')

const { validateAbsence,validateMonthYear } = require('../middleware/validator')
//encode absent


router.get('/agent_absent/:agent_id', validateMonthYear,salesAbsencesController.fetchAgentAbsent)

router.delete('/agent_absent/:agent_id', salesAbsencesController.deleteAgentAbsent)

router.put('/agent_absent/:agent_id', validateAbsence, salesAbsencesController.updateAgentAbsent)

router.post('/agent_absent/:agent_id', validateAbsence, salesAbsencesController.recordNewAbsent)



module.exports = router