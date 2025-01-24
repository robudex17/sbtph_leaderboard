const pool = require('../config/db')
const { validationResult } = require('express-validator')

exports.addAgentNewTarget = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const target = req.body.target
    const shipok = req.body.shipok
    const targetDate = req.body.target_date

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
        const query = "INSERT INTO target_shipok ( agent_id, month,year,date,target,ship_ok) VALUES (?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, monthName, year, targetDate,target,shipok])

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

    const agentId = req.params.agent_id

    const connection =  await pool.getConnection()

    const [result] = await connection.execute(
        'SELECT * FROM  `target_shipok` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
    )
    connection.release()
    res.json(result)
}

exports.updateAgentTarget = async (req,res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const target = req.body.target
    const shipok = req.body.shipok
    const targetDate = req.body.target_date

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
        const query = "UPDATE target_shipok SET  month=?, year=?, date=?, target=? , ship_ok=?  WHERE  agent_id=? AND date=?"
        
        const [result]  = await pool.execute(query, [monthName, year, targetDate,target, shipok, agentId, targetDate ])
        
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
   
    const targetDate = req.query.target_date



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







