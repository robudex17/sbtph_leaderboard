const express = require('express')

const router = express.Router()
const uploadData = require('../middleware/fileupload_excel')

const importExportDataController =  require('../controllers/import_export_data_controller')

const salesLeaderboardController = require('../controllers/sales_leaderboard_controllers')

const salesTargetShipokController = require('../controllers/sales_target_shipok_controller')

const salesNewDepositController = require('../controllers/sales_new_deposit_controller')

const salesAbsencesController = require('../controllers/sales_absences_controller')

const salesTardinessController = require('../controllers/sales_tardiness_controller')


const salesMemoController = require('../controllers/sales_memo_controller')
const salesFeedbackController = require('../controllers/sales_feedback_controller')

const salesAgentsController = require ('../controllers/sales_agent_controller')

const { authenticateToken, authorizeRoles} = require('../middleware/auth')

const salesMarketController = require('../controllers/sales_market_controller.js')



module.exports = (io) => {
    
    router.post('/upload_target_shipok_data',
                 uploadData.single("file"),  
                 (req, res,) =>  importExportDataController.importTargetShipokData(req, res, io) 
                )
  
    router.post('/upload_new_deposit_data', 
                 authenticateToken, authorizeRoles('admin'),uploadData.single("file"), 
                (req, res,) =>  importExportDataController.importNewDepositData(req, res, io) )
    

    router.get('/sales_leaderboard_export', authenticateToken, authorizeRoles('admin'), (req, res, next) => {
        req.export_to_excel = true
        next()
        }, salesLeaderboardController.fetchAgentLeaderBoard, (req,res, next) => {
        next()
        }, importExportDataController.salesLeaderboardExportToExcel 
   )
   router.get('/sales_agent_performanace_export',  authenticateToken, authorizeRoles('admin'),
        (req,res, next) => {
            req.export_to_excel = true
           
            next()
        },salesLeaderboardController.fetchAgentLeaderBoard,
        salesAbsencesController.fetchAgentAbsent,
        salesTargetShipokController.fetchAgentTarget, 
        salesNewDepositController.fetchAgentNewDeposit ,
        salesTardinessController.fetchAgentTardiness,
        salesMemoController.fetchAgentMemo, 
        salesAgentsController.fetchSalesAgent,
        salesFeedbackController.getAgentsFeedbackByQa,
        async (req, res, next) => {

        if(req.agent_type == 0){
            req.agent_feedback = await salesFeedbackController.getAgentsFeedback(req, res, next)
            req.manager_feedback = []
            req.lm_feedback = []
            next()
        }

        if(req.agent_type === 1){
            req.params.manager_id = req.query.agent_id
            req.params.lm_id = req.query.agent_id
            req.query.agent_id = null 
            
            req.agent_feedback = []
            req.manager_feedback = await salesFeedbackController.getMangerFeedback(req, res, next)
            req.lm_feedback  =  await salesFeedbackController.getLmFeedback(req, res, next)
            next()
        }

        if(req.agent_type == 2){
            req.params.manager_id = req.query.agent_id
            req.query.agent_id = null 

            req.agent_feedback = []
            req.lm_feedback = []
            req.manager_feedback = await salesFeedbackController.getMangerFeedback(req, res, next)
            next()

        }
        
        }, importExportDataController.salesAgentMonthlyPerformanceExportToExcel
  )
  
  
  
  
router.get('/agent_market_target_shipok_new_deposit_export', authenticateToken, authorizeRoles('admin'),
            (req, res, next) => {
               req.export_to_excel = true
               req.year_only = false
               next()
            },
            salesMarketController.fetchAgentMarketTargetShipok,
            salesMarketController.fetchAgentMarketNewDeposit, 
            importExportDataController.salesTeamPerformanceExportToExcel
           )    


router.get('/agent_market_target_shipok_new_deposit_year_export', authenticateToken ,authorizeRoles('admin'),
     (req, res, next) => {
        req.export_to_excel = true 
        req.year_only = true 
        next()
     },
     salesMarketController.fetchAgentMarketTargetShipokYear,
     salesMarketController.fetchAgentMarketNewDepositYear,
     importExportDataController.salesTeamPerformanceExportToExcel
   )



    return router

}