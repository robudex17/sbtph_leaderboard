const express = require('express')
const cors = require('cors')
const coookieParser = require('cookie-parser')

require('dotenv').config()

const app = express()

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

const {authenticateToken, authorizeRoles  } = require('./middleware/auth')

const salesLoginRoutes = require('./routes/sales_login_routes')
const standardUsersLoginRoutes = require('./routes/standardusers_login_routes')
const standardUsersRoutes = require('./routes/standardusers_routes')

const path = require('path')
const pool = require('./config/db')

const PORT = process.env.PORT || 3000;


const  startServer = async () => {
    try {
        //test connection
        const connection = await pool.getConnection()
        console.log('Database connection established successfully')
        connection.release()  // Release the connection back to the pool

        app.use(express.json())
        app.use('/images', express.static(path.join(__dirname, 'images')))

        app.use(coookieParser())

        // app.get('/protected', authenticateToken, (req,res, next)  => {
        //     res.json({message: 'Welcome Authentication User'})
        // })
        
        // app.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res, next) => {
        //     res.json({message: 'Welcome Administrator...'})
        // })

        //enable cors in all origin..
        app.use(cors({
            origin: "http://localhost:3000", // Your frontend URL
            credentials: true, // Allow cookies to be sent
        }))
        app.use(salesLoginRoutes)
        app.use(standardUsersLoginRoutes)
        app.use(standardUsersRoutes)
        app.use(salesAgentsRoutes)
        app.use(salesMemoRoutes)
        app.use(salesAbsencesRoutes)
        app.use(salesNewDepositRoutes)
        app.use(salesFeedbackRoutes)
        app.use(salesTardinessRoutes)
        app.use(salesTargetShipokRoutes)
        app.use(salesLeaderboardRoutes)
        app.use(salesDashboardRoutes)
        app.use(salesAnalyticsRoutes)
        app.use(salesMarketRoutes)
        app.use(salesManagerRoutes)

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })

    }
    catch(error){
        console.log(error)
    }
}

startServer()

