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