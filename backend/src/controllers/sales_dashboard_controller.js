const  pool = require('../config/db')

const { validationResult } = require('express-validator')

 const { getAgentMetrics } = require('./sales_leaderboard_controllers')

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
    // const connection =  await pool.getConnection()
    // let connection 
    
    try {
      // connection = await pool.getConnection()
     
      const dashboard = {}
      
      //fetch current month target and ship ok 
      const [currentMonthyTargetShipokResult] = await pool.execute(
        "SELECT month, year, SUM(target) AS monthly_target, SUM(ship_ok) AS total_shipok FROM `target_shipok` WHERE month=? AND year=? GROUP BY month,year",
        [givenMonth, givenYear]
      )
      
      
      let [currentMonthyTargetShipok] = currentMonthyTargetShipokResult

      if ( currentMonthyTargetShipok == null || currentMonthyTargetShipok == ""){
        currentMonthyTargetShipok = {month:givenMonth,year: givenYear,monthly_target:"0",total_shipok:"0"}
      }
      dashboard.monthly_target_shipok = currentMonthyTargetShipok

      //fetch current year target shipok

      const [currentYearTargetShipokResult] = await pool.execute(
        "SELECT year, SUM(target) AS year_target, SUM(ship_ok) AS total_shipok FROM `target_shipok` WHERE year=? GROUP BY year",
        [ givenYear]
      )
      
      let [currentYearTargetShipok] = currentYearTargetShipokResult

      if (currentYearTargetShipok == null || currentYearTargetShipok == ""){
        currentYearTargetShipok =  {year:givenYear,year_target:"0",total_shipok:"0"}
      }
      dashboard.year_target_shipok = currentYearTargetShipok

      //current month new_deposit 

      const [currentMOnthNewDepositResut] = await pool.execute("SELECT month, year, COUNT(*) AS new_deposit FROM `new_deposit` WHERE month=? AND year=? GROUP BY month,year",[givenMonth,givenYear])
      let [currentMOnthNewDeposit] = currentMOnthNewDepositResut

      if (currentMOnthNewDeposit == null || currentMOnthNewDeposit == ""){
        currentMOnthNewDeposit = {month:givenMonth,year:givenYear,new_deposit:0}
      }
      dashboard.current_month_newdeposit = currentMOnthNewDeposit

      // current year new_deposit
      const [currentYearNewDepositResult] =await pool.execute("SELECT  year, COUNT(*) AS new_deposit FROM `new_deposit` WHERE  year=? GROUP BY year",[givenYear])
     
      let [currentYearNewDeposit]  = currentYearNewDepositResult

      if (currentYearNewDeposit == null || currentYearNewDeposit == ""){
        currentYearNewDeposit = {year:givenYear,new_deposit:0}
      }
      dashboard.current_year_newdeposit = currentYearNewDeposit

      //active agents 

      const [ activeAgentsResult ]  = await pool.execute("SELECT COUNT(*) AS active_agents FROM `sales_agents` WHERE status='active'")

      const [activeAgents ] = activeAgentsResult
      dashboard.active_agents = activeAgents

      //get ratings summarries
      const agentMetics =  await getAgentMetrics( givenMonth, givenYear)

      const ratingsCount = {
        EXCEPTIONAL: 0,
        VERY_SATISFACTORY: 0,
        SATISFACTORY: 0,
        NEEDS_IMPROVEMENT: 0,
        POOR: 0
      }

      const calculateRatings = (agentMetics,ratingsCount) => {

        agentMetics.forEach(agentMetic => {
          if (ratingsCount[agentMetic.ratings_name] != undefined) {
            ratingsCount[agentMetic.ratings_name]++
          }
        })

        return ratingsCount
      }

      if (agentMetics.length > 0){
         console.log(agentMetics.length)
        dashboard.agent_ratings = calculateRatings(agentMetics, ratingsCount)
      }else{
        dashboard.agent_ratings = ratingsCount
      }

      //get per market
      const [marketTargetShipok] = await pool.execute(
        `
        SELECT 
            market.id AS market_id,
            market.market_name,
            SUM(target_shipok.target) AS total_target,
            SUM(target_shipok.ship_ok) AS total_ship_ok
        FROM 
            market
        LEFT JOIN 
            sales_agents 
        ON 
            market.id = sales_agents.market_id
        LEFT JOIN 
            target_shipok 
        ON 
            sales_agents.id = target_shipok.agent_id
            AND target_shipok.month = ?
            AND target_shipok.year = ?
        WHERE 
            market.id != 0
        GROUP BY 
            market.id, market.market_name
        `,
        [givenMonth, givenYear]
      )



      // transform total_target and total_ship_ok value of null to 0
      dashboard.market = marketTargetShipok.map(item => ({
        ...item,
        total_target: item.total_target == null ? 0: item.total_target,
        total_ship_ok: item.total_ship_ok == null ? 0 : item.total_ship_ok
      }))
      //attendance behavior metrics

      
      const [tardinessResult] = await pool.execute(
        "SELECT COUNT(*) AS tardiness  FROM `tardiness` WHERE `month`=? AND `year`=? GROUP BY month,year", [givenMonth,givenYear]
      )
      
      const [memoResult]  = await pool.execute(
        "SELECT COUNT(*) AS memos  FROM `memo` WHERE `month`=? AND `year`=? GROUP BY month,year", [givenMonth,givenYear]
      )

      const [absenceResult]  = await pool.execute(
        "SELECT COUNT(*) AS absences  FROM `absences` WHERE `month`=? AND `year`=? GROUP BY month,year", [givenMonth,givenYear]
      ) 

      let [ tardines ] =  tardinessResult

      if (tardines == null || tardines=="") {
        tardines = { tardines: 0}
      }

      let [ memos ] =  memoResult 

      if (memos == null || memos == ""){
        memos = {
          memos: 0
        }
      }
      
      let [ absences ] = absenceResult

      if (absences == null || absences == ""){
        absences = {
          absences: 0
        }
      }
      

      dashboard.attendance = { ...tardines, ...absences, ...memos}
      // connection.release()
      
      res.status(200).json(dashboard)
      
    }
    catch(error){
        
        console.error('Error in fetching sales dashboard', error)
        res.status(500).json({error: 'Error, Cannot Fetch sales dashboard..'})

   }
  //  finally {
  //   if(connection){
  //     console.log('connection is closed...')
  //     connection.release()
  //   }

  //  }
}


//Performanace 



//Target and Shipok Market  Distribution 


// Employee Behavior/Attendance Section