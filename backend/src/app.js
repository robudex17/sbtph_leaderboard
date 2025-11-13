// app.js
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()

const salesAgentsRoutes = require('./routes/sales_agents_route')
const salesMemoRoutes = require('./routes/sales_memo_route')
const salesAbsencesRoutes = require('./routes/sales_absences_route')
const salesNewDepositRoutes = require('./routes/sales_new_deposit_route')
const salesFeedbackRoutes = require('./routes/sales_feedback_route')
const salesTardinessRoutes = require('./routes/sales_tardiness_route')
// const salesTargetShipokRoutes = require('./routes/sales_target_shipok_route')
const salesLeaderboardRoutes = require('./routes/sales_leaderboard_route')
const salesDashboardRoutes = require('./routes/sales_dashboard_routes')
const salesAnalyticsRoutes = require('./routes/sales_analytics_route')
const salesMarketRoutes = require('./routes/sales_market_route')
const salesTeamRoutes = require('./routes/sales_teams_routes')
const salesManagerRoutes = require('./routes/sales_managers_route')
// const importExportDataRoutes = require('./routes/import_export_data_routes')
const salesLoginRoutes = require('./routes/sales_login_routes')
const standardUsersLoginRoutes = require('./routes/standardusers_login_routes')
const standardUsersRoutes = require('./routes/standardusers_routes')
const salesEvaluationDataRoutes = require('./routes/sales_evaluation_data_routes')
const salesDeductionRoutes = require('./routes/sales_deduction_routes')
const customSearchRoutes = require('./routes/custom_search_routes')


//new added for experiment 
const salesAgentsRoutes2 = require('./routes/sales_agents_route2')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use("/api", salesLoginRoutes)
app.use("/api", standardUsersLoginRoutes)
app.use("/api", standardUsersRoutes)
app.use("/api", salesAgentsRoutes)
app.use("/api", salesMemoRoutes)
app.use("/api", salesAbsencesRoutes)
app.use("/api", salesNewDepositRoutes)
app.use("/api", salesFeedbackRoutes)
app.use("/api", salesTardinessRoutes)
// app.use("/api", salesTargetShipokRoutes)
app.use("/api", salesLeaderboardRoutes)
app.use("/api", salesDashboardRoutes)
app.use("/api", salesAnalyticsRoutes)
app.use("/api", salesMarketRoutes)
app.use("/api", salesTeamRoutes)
app.use("/api", salesManagerRoutes)
app.use('/api',salesEvaluationDataRoutes)
app.use('/api', salesDeductionRoutes)
app.use("/api", customSearchRoutes)


//new added for production 
app.use("/api/prod", salesAgentsRoutes2)


// app.use("/api", importExportDataRoutes(io))  // in test, we can pass fake io if needed

// OPTIONAL: test-only route
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' })
})

module.exports = app
