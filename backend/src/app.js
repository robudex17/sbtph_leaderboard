const express = require('express')

require('dotenv').config()

const app = express()

const salesAgentsRoutes = require('./routes/sales_agents_route')
const salesMemoRoutes = require('./routes/sales_memo_route')
const salesAbsencesRoutes = require('./routes/sales_absences_route')
const salesNewDepositRoutes = require('./routes/sales_new_deposit_route')
const salesFeedbackRoutes = require('./routes/sales_feedback_route')
const salesTardinessRoutes = require('./routes/sales_tardiness_route')
const salesTargetShipokRoutes = require('./routes/sales_target_shipok_route')
const pool = require('./config/db')


const PORT = process.env.PORT || 3000;

app.use(express.json())




const  startServer = async () => {
    try {
        //test connection
        const connection = await pool.getConnection()
        console.log('Database connection established successfully')
        connection.release()  // Release the connection back to the pool

        app.use(salesAgentsRoutes)
        app.use(salesMemoRoutes)
        app.use(salesAbsencesRoutes)
        app.use(salesNewDepositRoutes)
        app.use(salesFeedbackRoutes)
        app.use(salesTardinessRoutes)
        app.use(salesTargetShipokRoutes)

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })

    }
    catch(error){
        console.log(error)
    }
}

startServer()

