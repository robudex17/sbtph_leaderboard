const pool  =  require('../config/db')
const { validationResult } = require('express-validator')

exports.newDeposit = async (req, res, next ) => {
   
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    const agentId = req.params.agent_id
    const newDeposit = req.body.new_deposit
    const depositDate = req.body.deposit_date

       
    try {
        const query = "INSERT INTO new_deposit ( agent_id, new_deposit,date) VALUES (?, ?,?)"
        const [result]  = await pool.execute(query, [agentId, newDeposit, depositDate])

        res.status(201).json({
            message: `New Deposit for agent_id: ${agentId} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting new_deposit records', error)
        res.status(500).json({error: 'Database Error, Cannot memo'})
    }  

  

}