const pool = require('../config/db')
const { validationResult } = require('express-validator')

exports.addAgentNewTarget = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    console.log(req.body)
    const target = req.body.target
    const shipok = req.body.ship_ok
    const targetDate = req.body.date
    const marketId = req.body.market_id
    const month = req.body.month 
    const year = req.body.year

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
        const query = "INSERT INTO target_shipok ( agent_id, month,year,date,target,ship_ok,market_id) VALUES (?,?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, month, year, targetDate,target,shipok,marketId])

        res.status(201).json({
            message: `New Target for agent_id: ${agentId} are created or recorded`
        })
        
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
        WHERE ts.agent_id = ? AND ts.month = ? AND ts.year = ?
    
          `,[agentId,givenMonth,givenYear]
        )
            //if true pass it to the next middleware for export handling
        if(export_to_excel){
            req.agent_target = result
            next()
        }else{
            res.json(result)
        }
     
    }

}

exports.updateAgentTarget = async (req,res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const target = req.body.target
    const shipok = req.body.ship_ok
    const targetDate = req.body.date
    const marketId = req.body.market_id
    const agentId = req.params.agent_id
    

    const date = new Date(targetDate)
    const year = date.getFullYear()
    
        // Get the month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[date.getMonth()]; // getMonth() returns 0-based index



    try {
        const query = "UPDATE target_shipok SET  target=? , ship_ok=?  WHERE  agent_id=? AND date=?"
        
        const [result]  = await pool.execute(query, [target, shipok, agentId, targetDate ])
        
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
   
    const targetDate = req.query.date



    try {
        const query = "DELETE FROM target_shipok WHERE agent_id=? AND date=?"
        const [result] = await pool.execute(query, [agentId, targetDate])

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






