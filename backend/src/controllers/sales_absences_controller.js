
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

exports.fetchAgentAbsent = async (req, res, next) => {

    const agentId = req.params.agent_id

    const connection =  await pool.getConnection()

    const [result] = await connection.execute(
        'SELECT * FROM  `absences` WHERE agent_id=?',[agentId]  
    )
    connection.release()
    res.json(result)
}

exports.updateAgentAbsent = async (req,res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentId = req.params.agent_id
    const absenceId = req.query.absence_id

    const  agentAbsentDate = req.body.absent_date 
    const agentAbsentDescription = req.body.absent_description


    try {
        const query = "UPDATE absences SET  description=?, date=? WHERE id=? AND agent_id=?"
        
        const [result]  = await pool.execute(query, [agentAbsentDescription, agentAbsentDate, absenceId,agentId])
        
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
    const  absenceId = req.query.absence_id

    console.log(agent_id)
    console.log(absenceId)

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
