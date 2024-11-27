const pool = require('../config/db')
const { validationResult } = require('express-validator')

exports.addNewTarget = async (req, res, next) => {
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
        const query = "INSERT INTO target ( agent_id, month,year,date,target,ship_ok) VALUES (?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, monthName, year, targetDate,target,shipok])

        res.status(201).json({
            message: `New Target for agent_id: ${agentId} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting new Target records', error)
        res.status(500).json({error: 'Database Error, Cannot Set New Target'})
    }  


 }