const pool = require('../config/db')
const { validationResult } = require('express-validator')

exports.recordNewTardiness = async (req,res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentId = req.params.agent_id
    const tardinessDate = req.body.tardiness_date 
    const tardinessDescription = req.body.tardiness_description

    try {
        const query = "INSERT INTO tardiness ( agent_id, description,date) VALUES (?, ?,?)"
        const [result]  = await pool.execute(query, [agentId, tardinessDescription, tardinessDate])

        res.status(201).json({
            message: `New Tardiness for agent_id: ${agentId} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting Tardiness records', error)
        res.status(500).json({error: 'Database Error, Cannot Create Tardiness Records'})
    }  


}

exports.fetchAgentTardiness = async (req, res, next) => {

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
        'SELECT * FROM  `tardiness` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
    )
    connection.release()
    res.json(result)
}

exports.updateAgentTardiness = async (req,res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentId = req.params.agent_id
    const tardinessId = req.query.tardiness_id

    const  agentTardinessDate = req.body.tardiness_date 
    const agentTardinessDescription = req.body.tardiness_description


    try {
        const query = "UPDATE tardiness SET  description=?, date=? WHERE id=? AND agent_id=?"
        
        const [result]  = await pool.execute(query, [agentTardinessDescription, agentTardinessDate, tardinessId,agentId])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Tardiness ID Not Found'})
        }


        res.status(201).json({
            message: `Sales Agent Tardiness is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent Tardiness records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Agent Tardiness '})
    }  
}

exports.deleteAgentTardiness = async (req, res, next) => {
    const  agentId = req.params.agent_id 
    const  tardinessId = req.query.tardiness_id


    try {
        const query = "DELETE FROM tardiness WHERE id=? AND agent_id=?"
        const [result] = await pool.execute(query, [tardinessId, agentId])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Tardiness ID Not found'})
        }

        res.status(200).send({ message: 'Agent Tardiness deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent tardiness:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent Tardiness'})
    }
}
