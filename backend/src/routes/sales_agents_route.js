const express = require('express')

const router = express.Router()
const salesAgensController = require ('../controllers/sales_agent_controller')
const { validateNewAndUpdateAgent } = require('../middleware/validator')
const uploadImage = require('../middleware/fileupload')


router.get('/sales_agents', salesAgensController.fetchSalesAgents)


router.post('/sales_agents', uploadImage.single('image'), validateNewAndUpdateAgent,salesAgensController.addNewSalesAgent  )

router.delete('/sales_agents/:agent_id', salesAgensController.deleteSalesAgent)

router.put('/sales_agents/:agent_id', uploadImage.single('image'), validateNewAndUpdateAgent, salesAgensController.updateSalesAgent)

module.exports = router