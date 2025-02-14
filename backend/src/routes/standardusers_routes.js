const express = require('express')

const router = express.Router()
const standaUserController = require ('../controllers/standardusers_controller')
const { validateNewAndUpdateStandardUser } = require('../middleware/validator')
const uploadImage = require('../middleware/fileupload')
const { authenticateToken, authorizeRoles} = require('../middleware/auth')


// router.get('/standardusers/:user_id', authenticateToken,salesAgensController.fetchSalesAgent)
router.get('/standardusers', standaUserController.fetchStandardUsers)


router.post('/standardusers', authenticateToken, authorizeRoles('admin'), uploadImage.single('image'),  validateNewAndUpdateStandardUser, standaUserController.addNewStandardUser  )

router.delete('/standardusers/:user_id', authenticateToken, authorizeRoles('admin'), standaUserController.deleteStandardUser)

router.put('/standardusers/:user_id', authenticateToken, authorizeRoles('admin'), uploadImage.single('image'),  validateNewAndUpdateStandardUser, standaUserController.updateStandardUser)



module.exports = router