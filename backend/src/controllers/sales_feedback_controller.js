const pool = require('../config/db')
const { validationResult } = require('express-validator')

exports.addNewFeedback = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    console.log(req.body)
    const feedback = req.body.feedback 
    const feedbackDate = req.body.date
    const feedbackMonth = req.body.month 
    const feedbackYear = req.body.year 

    const agentId = req.params.agent_id

  
        
    try {
        const query = "INSERT INTO feedback ( agent_id, month,year,date,feedback) VALUES (?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, feedbackMonth, feedbackYear, feedbackDate,feedback])

        res.status(201).json({
            message: `New Feedback Score for agent_id: ${agentId} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting new feedback records', error)
        res.status(500).json({error: 'Database Error, Cannot Feedback'})
    }  



 }

 exports.updateAgentFeedback = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   

  

    const feedback = req.body.feedback 
    const feedbackDate = req.body.date
    const agentId = req.params.agent_id
    const feedbackMonth = req.body.month 
    const feedbackYear = req.body.year 
 
        
    try {
        const query = "UPDATE feedback SET  feedback=? WHERE agent_id=? AND date=?"
        
        const [result]  = await pool.execute(query, [feedback, agentId, feedbackDate])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Feedback Not Found..'})
        }


        res.status(201).json({
            message: `Sales Agent Feedback is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent Feedback records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Agent Feedback '})
    }  

 }

 exports.fetchAgentFeedback = async (req, res, next) => {
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

    // const connection =  await pool.getConnection()

    const [result] = await pool.execute(
        'SELECT * FROM  `feedback` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
    )
    // connection.release()
    res.json(result)

 }

 exports.deleteAgentFeedback = async (req, res, next) => {
    
    const agentId = req.params.agent_id
    const feedbackDate = req.query.date 

    try {
        const query = "DELETE FROM feedback WHERE  agent_id=? AND date=?"
        const [result] = await pool.execute(query, [agentId, feedbackDate])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Feedback Not found'})
        }

        res.status(200).send({ message: 'Agent Feedback deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent feedback:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent Feedback'})
    }
 }