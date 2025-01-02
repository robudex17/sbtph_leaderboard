const  pool = require('../config/db')

const { validationResult } = require('express-validator')

exports.fetchAgentDashboard = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let givenMonth
    let givenYear 
    const currentDate = new Date()
    if (!req.query.month ||  req.query.month ==="") {
        
            // Get the month name
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        givenMonth = monthNames[currentDate.getMonth()]; // getMonth() returns 0-based index
    }else {
        givenMonth = req.query.month
    }
    
    if(!req.query.year || req.query.year ===""){
        givenYear = currentDate.getFullYear()
    }else {
        givenYear = req.query.year
    }

    try {
      
      const connection =  await pool.getConnection()
      const dashboard = {}
      
      //fetch current month target and ship ok 
      const [currentMonthyTargetShipokResult] = await connection.execute(
        "SELECT month, year, SUM(target) AS monthly_target, SUM(ship_ok) AS total_shipok FROM `target_shipok` WHERE month=? AND year=? GROUP BY month,year",
        [givenMonth, givenYear]
      )
      
      
      const [currentMonthyTargetShipok] = currentMonthyTargetShipokResult
      dashboard.monthly_target_shipok = currentMonthyTargetShipok

      //fetch current year target shipok

      const [currentYearTargetShipokResult] = await connection.execute(
        "SELECT year, SUM(target) AS year_target, SUM(ship_ok) AS total_shipok FROM `target_shipok` WHERE year=? GROUP BY year",
        [ givenYear]
      )
      
      const [currentYearTargetShipok] = currentYearTargetShipokResult
      dashboard.year_target_shipok = currentYearTargetShipok

      //current month new_deposit 

      const [currentMOnthNewDepositResut] = await connection.execute("SELECT month, year, COUNT(*) AS new_deposit FROM `new_deposit` WHERE month=? AND year=?",[givenMonth,givenYear])
      const [currentMOnthNewDeposit] = currentMOnthNewDepositResut
      dashboard.current_month_newdeposit = currentMOnthNewDeposit

      // current year new_deposit
      const [currentYearNewDepositResult] =await connection.execute("SELECT  year, COUNT(*) AS new_deposit FROM `new_deposit` WHERE  year=?",[givenYear])
      const [currentYearNewDeposit]  = currentYearNewDepositResult
      dashboard.current_year_newdeposit = currentYearNewDeposit

      //active agents 

      const [ activeAgentsResult ]  = await connection.execute("SELECT COUNT(*) AS active_agents FROM `sales_agents`")

      const [activeAgents ] = activeAgentsResult
      dashboard.active_agents = activeAgents

      connection.release()
      res.status(200).json(dashboard)
    }
    catch(error){
        console.error('Error Updating Agent Tardiness records', error)
        res.status(500).json({error: 'Error, Cannot Fetch Agent sales_leaderboard'})

   }
//    finally {
//      connection.release()
//    }
}