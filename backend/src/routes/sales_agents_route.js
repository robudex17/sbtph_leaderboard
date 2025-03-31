const express = require('express')

const router = express.Router()
const salesAgensController = require ('../controllers/sales_agent_controller')
const { validateNewAndUpdateAgent } = require('../middleware/validator')
const uploadImage = require('../middleware/fileupload')
const { authenticateToken, authorizeRoles} = require('../middleware/auth')


router.get('/sales_agents/:agent_id',authenticateToken, authorizeRoles('admin', 'manager', 'user'),salesAgensController.fetchSalesAgent)
router.get('/sales_agents', authenticateToken,authorizeRoles('admin', 'manager', 'user'),salesAgensController.fetchSalesAgents)


router.post('/sales_agents', authenticateToken, authorizeRoles('admin'), uploadImage.single('image'), validateNewAndUpdateAgent,salesAgensController.addNewSalesAgent  )

router.delete('/sales_agents/:agent_id', authenticateToken, authorizeRoles('admin'), salesAgensController.deleteSalesAgent)

router.put('/sales_agents/:agent_id', authenticateToken, authorizeRoles('admin'), uploadImage.single('image'), validateNewAndUpdateAgent, salesAgensController.updateSalesAgent)



module.exports = router