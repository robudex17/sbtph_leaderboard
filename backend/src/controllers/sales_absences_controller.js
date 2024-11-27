
const pool =  require('../config/db')
const { validationResult } = require('express-validator')
exports.recordNewAbsent = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const agentId = req.params.agent_id
    const  agentAbsentDate = req.body.absent_date 
    const agentAbsentDescription = req.body.absent_description

    
    try {
        const query = "INSERT INTO absences ( agent_id, description,date) VALUES (?, ?,?)"
        const [result]  = await pool.execute(query, [agentId, agentAbsentDescription, agentAbsentDate])

        res.status(201).json({
            message: `New absence for agent_id: ${agentId} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting absense records', error)
        res.status(500).json({error: 'Database Error, Cannot memo'})
    }  


}