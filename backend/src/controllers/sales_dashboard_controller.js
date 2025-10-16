const  pool = require('../config/db')

const { validationResult } = require('express-validator')

 const { getAgentsMetrics } = require('./sales_leaderboard_controllers')

exports.fetchAgentDashboard = async (req,res,next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
   
  
    const currentDate = new Date()

    const loginUser = req.user

  
    

           // Get the month name
    const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

    const givenMonth = monthNames[currentDate.getMonth()]  // getMonth() returns 0-based index
    // const givenMonth = "June"
    const givenYear =    currentDate.getFullYear()

    
    const  withTrucks = true
    //const  dashboarOption = req.query.dashboardoption 

    let dashboarOption ;

    console.log(req.query.dashboardoption)
    if((!req.query.dashboardoption || req.query.dashboardoption == '') ){
        if(loginUser.agent_type == 2){
            dashboarOption = 'team'
        }else{
            dashboarOption = 'individual'
        }
    }else{
        dashboarOption = req.query.dashboardoption
    }

      // Map month names to numbers
    const monthMap = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12"
    };

  

 // Convert "March" -> "03"
    const monthNumber = monthMap[givenMonth];
    if (!monthNumber) {
      return res.status(400).json({ error: "Invalid givenMonth format" });
    }

  const snapshot = `${givenYear}-${monthNumber.toString().padStart(2, '0')}`;  

  let dashboarddMasterQuery = 
    `
       SELECT 
                sa.id AS id,
                sa.firstname,
                sa.lastname,
                sa.db_name,
                sa.email,
                sa.image_link,
                aa.agent_type,
                r.role_name AS agent_role,
                aa.manager_id,
                mgr.db_name AS manager_dbname,
                mr.role_name AS manager_role,
                m.id AS market_id,
                m.name AS market_name,
                t.id AS team_id,
                t.name AS team_name,
                ae.status AS employee_status,
                COALESCE(ts.target, 0) AS target,
                COALESCE(ts.ship_ok, 0) AS shipok
            FROM sales_agents2 sa
            JOIN (
                SELECT aa1.*
                FROM agent_assignments aa1
                JOIN (
                    SELECT agent_id, MAX(id) AS latest_id
                    FROM agent_assignments
                    WHERE DATE_FORMAT(effective_from, '%Y-%m') <= ?
                        AND (effective_to IS NULL OR DATE_FORMAT(effective_to, '%Y-%m') >= ?)
                    GROUP BY agent_id
                ) aa2 
                    ON aa1.agent_id = aa2.agent_id 
                AND aa1.id = aa2.latest_id
            ) aa ON sa.id = aa.agent_id
            JOIN (
                SELECT ae1.*
                FROM agent_employments ae1
                JOIN (
                    SELECT agent_id, MAX(id) AS latest_id
                    FROM agent_employments
                    WHERE DATE_FORMAT(start_date, '%Y-%m') <= ?
                        AND (end_date IS NULL OR DATE_FORMAT(end_date, '%Y-%m') >= ?)
                    GROUP BY agent_id
                ) ae2 
                    ON ae1.agent_id = ae2.agent_id 
                AND ae1.id = ae2.latest_id
            ) ae ON sa.id = ae.agent_id
            LEFT JOIN sales_agent_roles r ON aa.agent_type = r.id
            LEFT JOIN sales_agents2 mgr ON aa.manager_id = mgr.id
            LEFT JOIN agent_assignments maa ON mgr.id = maa.agent_id 
                AND maa.id = (
                    SELECT MAX(id) 
                    FROM agent_assignments 
                    WHERE agent_id = mgr.id
                    AND DATE_FORMAT(effective_from, '%Y-%m') <= ?
                    AND (effective_to IS NULL OR DATE_FORMAT(effective_to, '%Y-%m') >= ?)
                )
            LEFT JOIN sales_agent_roles mr ON maa.agent_type = mr.id
            LEFT JOIN markets m ON aa.market_id = m.id
            LEFT JOIN teams t ON aa.team_id = t.id
            LEFT JOIN target_shipok ts 
                ON ts.agent_id = sa.id 
                AND ts.month = ?
                AND ts.year = ?
            WHERE aa.agent_type  != 2
    `



    try {
      // connection = await pool.getConnection()
     
      const dashboard = {}
      dashboard.data = []
      
      //fetch current month target and ship ok  per individual, team , and overall 

      const  dashboardQueryForInvidualAgents = (filterBy,  operator, value, orderBy) => {
          
          const query = `
                 WITH deposit_count AS (
                    SELECT 
                        agent_id, 
                        month, 
                        year, 
                        COUNT(*) AS total_deposit
                    FROM new_deposit
                    WHERE month = ? AND year = ?
                    GROUP BY agent_id, month, year
                )
                SELECT 
                    sales_agents.id AS agent_id,
                    market.team_id,
                    sales_agents.db_name,
                    market.market_name,
                    target_shipok.month, 
                    target_shipok.year,
                    COALESCE(SUM(target_shipok.target), 0) AS total_target,
                    COALESCE(SUM(target_shipok.ship_ok), 0) AS total_ship_ok,
                    COALESCE(deposit_count.total_deposit, 0) AS total_deposit
                FROM 
                    sales_agents
                LEFT JOIN 
                    market ON sales_agents.market_id = market.id
                LEFT JOIN 
                    target_shipok 
                    ON sales_agents.id = target_shipok.agent_id
                    AND target_shipok.month = ?
                    AND target_shipok.year = ?
                LEFT JOIN 
                    deposit_count 
                    ON sales_agents.id = deposit_count.agent_id
                WHERE 
                    
                    ${filterBy} ${operator} ${value} AND sales_agents.status = 'active'  AND market.team_id !=0
                GROUP BY 
                    sales_agents.id, sales_agents.db_name, market.market_name, 
                    target_shipok.month, target_shipok.year, deposit_count.total_deposit
                ORDER BY 
                    ${orderBy}
          `

          return query

      }

      const dashboardQueryForMarkets = (filterBy, operator, value, orderBy) => {
        // const query = `
        //           WITH deposit_count AS (
        //       SELECT 
        //           market_id, 
        //           month, 
        //           year, 
        //           COUNT(*) AS total_deposit
        //       FROM new_deposit
        //       WHERE month = ? AND year = ?
        //       GROUP BY market_id, month, year
        //   )
        //   SELECT 
        //       market.id AS market_id,
        //       market.team_id,
        //       market.market_name,
        //       target_shipok.month AS month,
        //       target_shipok.year AS year,
        //       COALESCE(SUM(target_shipok.target), 0) AS total_target,
        //       COALESCE(SUM(target_shipok.ship_ok), 0) AS total_ship_ok,
        //       COALESCE(deposit_count.total_deposit, 0) AS total_deposit
        //   FROM 
        //       market
        //   LEFT JOIN 
        //       sales_agents ON market.id = sales_agents.market_id
        //   LEFT JOIN 
        //       target_shipok 
        //       ON sales_agents.id = target_shipok.agent_id
        //       AND target_shipok.month = ?
        //       AND target_shipok.year = ?
        //   LEFT JOIN 
        //       deposit_count 
        //       ON market.id = deposit_count.market_id
        //   WHERE 
        //       ${filterBy} ${operator} ${value}  AND market.team_id !=0
        //   GROUP BY 
        //       market.id, market.market_name, deposit_count.total_deposit
        //   ORDER BY 
        //       ${orderBy};
        //   `

        const query = `
                WITH deposit_count AS (
                    SELECT 
                        market_id, 
                        month, 
                        year, 
                        COUNT(*) AS total_deposit
                    FROM new_deposit
                    WHERE month = ? AND year = ?
                    GROUP BY market_id, month, year
                )
                SELECT 
                    market.id AS market_id,
                    market.team_id,
                    market.market_name,
                    target_shipok.month AS month,
                    target_shipok.year AS year,
                    COALESCE(SUM(target_shipok.target), 0) AS total_target,
                    COALESCE(SUM(target_shipok.ship_ok), 0) AS total_ship_ok,
                    COALESCE(deposit_count.total_deposit, 0) AS total_deposit
                FROM market
                LEFT JOIN sales_agents ON market.id = sales_agents.market_id
                LEFT JOIN target_shipok 
                    ON sales_agents.id = target_shipok.agent_id
                    AND target_shipok.month = ?
                    AND target_shipok.year = ?
                LEFT JOIN deposit_count 
                    ON market.id = deposit_count.market_id
                    AND deposit_count.month = target_shipok.month
                    AND deposit_count.year = target_shipok.year
                WHERE  ${filterBy} ${operator} ${value}  AND market.team_id !=0
                GROUP BY 
                    market.id, 
                    market.team_id,
                    market.market_name,
                    target_shipok.month,
                    target_shipok.year
                ORDER BY market.id;
                        
        `
          return query
      }


        const dashboardQueryForTeams = () => {
        const query = `
                    WITH deposit_count AS (
                    SELECT 
                        m.team_id,
                        d.month,
                        d.year,
                        COUNT(*) AS total_deposit
                    FROM new_deposit d
                    JOIN market m ON d.market_id = m.id
                    WHERE d.month = ? AND d.year = ?
                    GROUP BY m.team_id, d.month, d.year
                )
                SELECT 
                    market.team_id,
                    GROUP_CONCAT(DISTINCT market.market_name ORDER BY market.market_name SEPARATOR '/') AS team_name,
                    COALESCE(MAX(target_shipok.month), ?) AS month,
                    COALESCE(MAX(target_shipok.year), ?) AS year,
                    COALESCE(SUM(target_shipok.target), 0) AS total_target,
                    COALESCE(SUM(target_shipok.ship_ok), 0) AS total_ship_ok,
                    COALESCE(MAX(deposit_count.total_deposit), 0) AS total_deposit
                FROM 
                    market
                LEFT JOIN 
                    sales_agents ON market.id = sales_agents.market_id
                LEFT JOIN 
                    target_shipok 
                    ON sales_agents.id = target_shipok.agent_id
                    AND target_shipok.month = ?
                    AND target_shipok.year = ?
                LEFT JOIN 
                    deposit_count 
                    ON market.team_id = deposit_count.team_id
                WHERE 
                    market.team_id = ?
                    AND sales_agents.status = 'active' 
                    AND market.team_id != 0 
                GROUP BY 
                    market.team_id
                ORDER BY 
                    market.team_id;


          `
          return query
      }


   
   const fetchTeamTargetShipok = (result,month, year) => {
                let team_targets = result.reduce((acc, agent) => {

                const teamId = agent.team_id 
            
                
                //this section I use market_name as team_name if  more than one market in a team I 
                //will combine it with this format  'market1/market2'
                if(!acc[teamId]){
                    acc[teamId] = {
                        team_name: agent.market_name,
                        team_id: teamId,
                        martket_id: agent.market_id,
                        market_name: agent.market_name,
                        month: month,
                        year: year,
                        total_shipok: 0,
                        total_target: 0,
                       
                        teammembers:[]

                    }
                }

                if(acc[teamId.team_name != agent.market_name]){
                    acc[teamId].team_name = `${acc[teamId].team_name}/${agent.market_name}`
                }

                acc[teamId].total_target  +=  Number(agent.target || 0 )
                acc[teamId].total_shipok  +=  Number(agent.shipok || 0)
            

                acc[teamId].teammembers.push(agent)

                return acc

           }, {}) 
            //get the values only
            team_targets = Object.values(team_targets)

            const arrangedTeamTargets = [
                ...team_targets.filter(a => a.market_name.toLowerCase() !== 'trucks'),
                ...team_targets.filter(a => a.market_name.toLowerCase() === 'trucks')
            ]

            return arrangedTeamTargets
    }
     let individualTargets
      if (dashboarOption == 'individual'){
   
         if((loginUser.role =='admin' && loginUser.login_type == 'standarduser') || (loginUser.role == 'manager' && loginUser.agent_type == 2 ) ){
               const [result] = await pool.execute(
                dashboarddMasterQuery,
              [ snapshot, snapshot, snapshot, snapshot, snapshot, snapshot, givenMonth, givenYear]
            )
                const arranged = [
                ...result.filter(a => a.market_name.toLowerCase() !== 'trucks'),
                ...result.filter(a => a.market_name.toLowerCase() === 'trucks')
                ]

             individualTargets  = arranged

         }else{
            
            //queryIndividual = dashboardQueryForInvidualAgents("sales_agents.id ", "=", loginUser.login_id, "sales_agents.id")
            //  console.log( `${dashboarddMasterQuery} AND sa.id=?`)
            //  return
               const [result] = await pool.execute(
                `${dashboarddMasterQuery} AND sa.id=?`,
              [ snapshot, snapshot, snapshot, snapshot, snapshot, snapshot, givenMonth, givenYear, loginUser.login_id]
            )   
                individualTargets  = result  
         }
  

      

        // transform total_target and total_ship_ok value of null to 0
        dashboard.data = individualTargets.map(item => ({
          ...item,
          total_target: item.target == null ? 0: item.target,
          total_shipok: item.shipok == null ? 0 : item.shipok,
          month: item.month == null ? givenMonth : item.month,
          year: item.year == null ? givenYear : item.year,
        }))


      
      }else if (dashboarOption == 'team'){
        let teamTargets = []
      
        if((loginUser.role =='admin' && loginUser.login_type == 'standarduser') || (loginUser.role == 'manager' && loginUser.agent_type == 2 ) ){


          const [result] = await pool.execute(
                dashboarddMasterQuery,
              [ snapshot, snapshot, snapshot, snapshot, snapshot, snapshot, givenMonth, givenYear]
            )
        
          teamTargets = fetchTeamTargetShipok(result, givenMonth, givenYear)
          
        
         dashboard.data = teamTargets
        
        //get the specific market plus get the agents that belong to the market
        }else {
         

            const [result] = await pool.execute(
                `${dashboarddMasterQuery} AND m.id=?`,
              [ snapshot, snapshot, snapshot, snapshot, snapshot, snapshot, givenMonth, givenYear, loginUser.market_id]
            )

         teamTargets = fetchTeamTargetShipok(result, givenMonth, givenYear)
         dashboard.data = teamTargets
  
        }

      }else if ( dashboarOption == 'overall'){
           let overAllTargets = []
           let targetWithTrucks = []
           let targetWithoutTrucks = []
           const [result] = await pool.execute(
                dashboarddMasterQuery,
              [ snapshot, snapshot, snapshot, snapshot, snapshot, snapshot, givenMonth, givenYear]
            )
        
        let teamTargets = fetchTeamTargetShipok(result, givenMonth, givenYear)

       

        targetWithTrucks = teamTargets.map(({ teammembers, ...rest}) => rest).reduce((acc, team) => {
            let overTeam = 'overall'
            
            if(!acc[overTeam]){
                acc[overTeam] = {
                    month: givenMonth, 
                    year: givenYear,
                    total_target: 0, //Number(team.total_target || 0),
                    total_shipok: 0, //Number(team.total_shipok || 0),
                    team_name: 'overll market',
                    team: [],
                }
              
            }
            acc[overTeam].total_target += Number(team.total_target || 0)
            acc[overTeam].total_shipok += Number(team.total_shipok || 0) 
            acc[overTeam].team.push(team)

            return acc
        },{})

       
       
        let  getTheTrucks = teamTargets.filter(team => team.team_name !== 'trucks')

    
        targetWithoutTrucks = getTheTrucks.map(({teammembers, ...rest})=> rest).reduce((acc, team) => {
            let overTeam = 'overall'
            if(!acc[overTeam]){
                acc[overTeam] = {
                    month: givenMonth, 
                    year: givenYear,
                    total_target: 0, //Number(team.total_target || 0),
                    total_shipok: 0, //Number(team.total_shipok || 0),
                    team_name: 'overll market',
                    
                }
              
            }
            acc[overTeam].total_target += Number(team.total_target || 0)
            acc[overTeam].total_shipok += Number(team.total_shipok || 0) 
            // acc[overTeam].team.push(team)

            return acc

        }, {})


      
        targetWithTrucks = Object.values(targetWithTrucks)
        targetWithoutTrucks = Object.values(targetWithoutTrucks)



        overAllTargets.push(targetWithTrucks[0])
        overAllTargets.push(targetWithoutTrucks[0])
    
        dashboard.data = overAllTargets


      }


      console.log(dashboard)
      res.status(200).json(dashboard)


   
      
    }
    catch(error){
        
        console.error('Error in fetching sales dashboard', error)
        res.status(500).json({error: 'Error, Cannot Fetch sales dashboard..'})

   }

}


//note for dashboard
/* if dashboardoption is 'individual'  
     if admin -> get all individual target/shipok 
     if manager type 1 -> get all individual that belong to the markert or team
     if user -> get single target/shipok
*/

/*
  if dashboardoption is 'team' 
  if admin -> get all market/team target/shipok + get all individual  target/shipok that belong to the market or team
  if user and manager type -> get market or team target/shipok + get all individual that belong to the markert or team
*/


/*
  if dashboardoption is 'overall'
  get overall target/shipok  + get all market/team 
*/

