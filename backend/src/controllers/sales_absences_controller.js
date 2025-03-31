
const pool =  require('../config/db')
const { validationResult } = require('express-validator')
exports.recordNewAbsent = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
   
    const agentId = req.params.agent_id
    const  agentAbsentDate = req.body.date 
    const absentMonth = req.body.month
    const absentYear = req.body.year
    const agentAbsentDescription = req.body.description

    
    try {
        const query = "INSERT INTO absences ( agent_id, month, year, date, description) VALUES (?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, absentMonth, absentYear, agentAbsentDate,agentAbsentDescription])

        res.status(201).json({
            message: `New absence for agent_id: ${agentId} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting absense records', error)
        res.status(500).json({error: 'Database Error, Cannot Absent'})
    }  


}

exports.fetchAgentAbsent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    let givenMonth
    let givenYear
    let fullyear  = req.query.fullyear
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
    const agentId = req.params.agent_id

    // const connection =  await pool.getConnection()
 
    if(fullyear == 'true' || fullyear == true) {
        const [result] = await pool.execute(
            'SELECT * FROM  `absences` WHERE agent_id=?  AND year=?',[agentId,givenYear]  
        )
        // connection.release()
        result.sort((a, b) => {
            return monthNames.indexOf(a.month.charAt(0).toUpperCase() + a.month.slice(1).toLowerCase()) - 
            monthNames.indexOf(b.month.charAt(0).toUpperCase() + b.month.slice(1).toLowerCase());
        })
        res.json(result)  
    }else {
        const [result] = await pool.execute(
            'SELECT * FROM  `absences` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
        )
        // connection.release()
        res.json(result)
    }
    
}

exports.updateAgentAbsent = async (req,res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentId = req.params.agent_id
    // const absenceId = req.query.id

    const  agentAbsentDate = req.body.date 
    const agentAbsentDescription = req.body.description
    const absenceId = req.body.id 
    const absentMonth = req.body.month 
    const absentYear = req.body.year 



    try {
        const query = "UPDATE absences SET description=?, date=?, month=?, year=?  WHERE id=? AND agent_id=?"
        
        const [result]  = await pool.execute(query, [agentAbsentDescription, agentAbsentDate, absentMonth, absentYear, absenceId,agentId])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Absence ID Not Found'})
        }


        res.status(201).json({
            message: `Sales Agent Absence is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent Absence records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Agent Absence '})
    }  
}

exports.deleteAgentAbsent = async (req, res, next) => {
    const { agent_id } = req.params 
  

    const absenceId = req.body.id

    try {
        const query = "DELETE FROM absences WHERE id=? AND agent_id=?"
        const [result] = await pool.execute(query, [absenceId, agent_id])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Absence ID Not found'})
        }

        res.status(200).send({ message: 'Agent Absence deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent absence:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent Absence'})
    }
}







