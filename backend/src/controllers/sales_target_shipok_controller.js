const pool = require('../config/db')
const { validationResult } = require('express-validator')

exports.addAgentNewTarget = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
  
 
    const target = req.body.target
    const shipok = req.body.shipok
    const targetDate = req.body.date 
    const month = req.body.month  || req.body.eval_month
    const year = req.body.year  || req.body.eval_year

    const agentId = req.params.agent_id
    console.log(req.body)

    

   if(Number(target) <= 0){
      res.status(401).json({
            message: `Target  less than or equal to zero not allowed`
        })
      return
   }
    try {
        const query = "INSERT INTO target_shipok ( agent_id, month,year,date,target,ship_ok) VALUES (?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, month, year, targetDate,target,shipok])

        res.status(201).json({
            message: `New Target for agent_id: ${agentId} are created or recorded`
        })
        console.log(result)
        return
        
    }catch(error){
        console.error('Error inserting new Target records', error)
        res.status(500).json({error: 'Database Error, Cannot Set New Target'})
    }  


 }


exports.fetchAgentTarget = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    let givenMonth
    let givenYear 
    let fullyear = req.query.fullyear
    const export_to_excel = req.export_to_excel

 
   
    const currentDate = new Date()

                // Get the month name
    const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
 
    if (!req.query.month ||  req.query.month ==="") {
        

        givenMonth = monthNames[currentDate.getMonth()]; // getMonth() returns 0-based index
    }else {
        givenMonth = req.query.month
    }
    
    if(!req.query.year || req.query.year ===""){
        givenYear = currentDate.getFullYear()
    }else {
        givenYear = req.query.year
    }



    let agentId 

    if(req.params.agent_id){
        agentId = req.params.agent_id
    }else{
        agentId = req.query.agent_id
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
  

    // const connection =  await pool.getConnection()
    if(fullyear == 'true' || fullyear == true){
        const [result] = await pool.execute(
            //  'SELECT * FROM  `target_shipok` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
    
          `
          SELECT 
            ts.agent_id,
            ts.month,
            ts.year,
            ts.date,
            ts.target,
            ts.ship_ok,
            ts.market_id,
            market.market_name
        FROM target_shipok ts
        JOIN market ON ts.market_id = market.id
        WHERE ts.agent_id = ?  AND ts.year = ?
    
          `,[agentId,givenYear]
        )
        // connection.release()
        result.sort((a, b) => {
            return monthNames.indexOf(a.month.charAt(0).toUpperCase() + a.month.slice(1).toLowerCase()) - 
           monthNames.indexOf(b.month.charAt(0).toUpperCase() + b.month.slice(1).toLowerCase());
        })
        //if true pass it to the next middleware for export handling
        if(export_to_excel){
            req.agent_target = result
            next()
        }else{
            res.json(result)  
        }
            
    }else {
        const [result] = await pool.execute(
    //         //  'SELECT * FROM  `target_shipok` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
  
    //       `
    //       SELECT 
    //          ts.agent_id,
    //         ts.month,
    //          ts.year,
    //         ts.date,
    //         ts.target,
    //          ts.ship_ok
    //    --      ts.market_id
    //      -- market.market_name
    //       FROM target_shipok ts
    //    -- JOIN market ON ts.market_id = market.id
    //     WHERE ts.agent_id = ? AND ts.month = ? AND ts.year = ?
    
    //       `
  
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
                    COALESCE(ses.month, ?) AS eval_month,
                    COALESCE(ses.year, ?) AS eval_year,
                    COALESCE(ses.submitted, 0) AS submitted,
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
                LEFT JOIN sales_evaluation_status ses 
                        ON ses.agent_id = sa.id
                        AND ses.month = ?
                        AND ses.year  = ?

                LEFT JOIN target_shipok ts 
                    ON ts.agent_id = sa.id 
                    AND ts.month = ?
                    AND ts.year = ?
                    
             WHERE  sa.id=?     
                   
        `

          
          
          ,[ givenMonth, givenYear, snapshot, snapshot, snapshot,snapshot, snapshot, snapshot,givenMonth, givenYear,givenMonth,givenYear,agentId]
        )
            //if true pass it to the next middleware for export handling
        if(export_to_excel){
            req.agent_target = result
             next()
        }else{
           console.log(result)
            res.json(result)
        }
     
    }

}

exports.updateAgentTarget = async (req,res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // const target = req.body.target
    // const shipok = req.body.shipok
    // const targetDate = req.body.date
    // const marketId = req.body.market_id
    // const agentId = req.params.agent_id

    const { agent_id , month, year, date, target, shipok} = req.body
    
     const agentId = req.params.agent_id

    // const date = new Date(targetDate)
    // const year = date.getFullYear()



        // Get the month name
    // const monthNames = [
    //     "January", "February", "March", "April", "May", "June",
    //     "July", "August", "September", "October", "November", "December"
    // ];
    // const monthName = monthNames[date.getMonth()]; // getMonth() returns 0-based index



    try {
        const query = "UPDATE target_shipok SET  target=? , ship_ok=?  WHERE  agent_id=? AND month=? AND year=?"
        
        const [result]  = await pool.execute(query, [target, shipok, agentId, month,year ])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Target Not Found'})
        }


        res.status(201).json({
            message: `Sales Agent Target is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent Target records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Agent Target '})
    }  
}

exports.deleteAgentTarget = async (req, res, next) => {
    
    const agentId = req.params.agent_id
   
    const month = req.query.month
    const year = req.query.year

  

    try {
        const query = "DELETE FROM target_shipok WHERE agent_id=? AND month=? AND year=?"
        const [result] = await pool.execute(query, [agentId, month, year])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Target Not found'})
        }

        res.status(200).send({ message: 'Agent Target deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent target:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent Target'})
    }
}






