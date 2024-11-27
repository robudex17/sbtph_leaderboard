const pool = require('../config/db')
const { validationResult } = require('express-validator')

exports.addNewFeedback = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const feedback = req.body.feedback 
    const feedbackDate = req.body.feedback_date
    const agentId = req.params.agent_id

    const date = new Date(feedbackDate)
    const year = date.getFullYear()
    
        // Get the month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[date.getMonth()]; // getMonth() returns 0-based index

        
    try {
        const query = "INSERT INTO feedback ( agent_id, month,year,date,feedback) VALUES (?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, monthName, year, feedbackDate,feedback])

        res.status(201).json({
            message: `New Feedback Score for agent_id: ${agentId} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting new feedback records', error)
        res.status(500).json({error: 'Database Error, Cannot Feedback'})
    }  


 }