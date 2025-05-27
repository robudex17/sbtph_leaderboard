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
const salesTargetShipokRoutes = require('./routes/sales_target_shipok_route')
const salesLeaderboardRoutes = require('./routes/sales_leaderboard_route')
const salesDashboardRoutes = require('./routes/sales_dashboard_routes')
const salesAnalyticsRoutes = require('./routes/sales_analytics_route')
const salesMarketRoutes = require('./routes/sales_market_route')
const salesManagerRoutes = require('./routes/sales_managers_route')
const importExportDataRoutes = require('./routes/import_export_data_routes')
const salesLoginRoutes = require('./routes/sales_login_routes')
const standardUsersLoginRoutes = require('./routes/standardusers_login_routes')
const standardUsersRoutes = require('./routes/standardusers_routes')

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
app.use("/api", salesTargetShipokRoutes)
app.use("/api", salesLeaderboardRoutes)
app.use("/api", salesDashboardRoutes)
app.use("/api", salesAnalyticsRoutes)
app.use("/api", salesMarketRoutes)
app.use("/api", salesManagerRoutes)
app.use("/api", importExportDataRoutes())  // in test, we can pass fake io if needed

// OPTIONAL: test-only route
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' })
})

module.exports = app
