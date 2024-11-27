const pool =  require('../config/db')
const { validationResult } = require('express-validator')

exports.createSalesAgentMemo = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentId = req.params.agent_id
    const memoDate  = req.body.memo_date
    const memoDescription = req.body.memo_description 
    
    
    try {
        const query = "INSERT INTO memo ( agent_id, description,date) VALUES (?, ?,?)"
        const [result]  = await pool.execute(query, [agentId, memoDescription,memoDate])

        res.status(201).json({
            message: `New memo for agent_id: ${agentId} are created`
        })
        
    }catch(error){
        console.error('Error inserting memo records', error)
        res.status(500).json({error: 'Database Error, Cannot memo'})
    }
    
}

