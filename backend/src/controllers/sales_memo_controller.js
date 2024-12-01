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

exports.fetchAgentMemo = async (req, res, next) => {

    const agentId = req.params.agent_id

    const connection =  await pool.getConnection()

    const [result] = await connection.execute(
        'SELECT * FROM  `memo` WHERE agent_id=?',[agentId]  
    )
    connection.release()
    res.json(result)
}

exports.updateAgentMemo = async (req,res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentId = req.params.agent_id
    const memoId = req.query.memo_id

    const  agentMemoDate = req.body.memo_date 
    const agentMemoDescription = req.body.memo_description


    try {
        const query = "UPDATE memo SET  description=?, date=? WHERE id=? AND agent_id=?"
        
        const [result]  = await pool.execute(query, [agentMemoDescription, agentMemoDate, memoId,agentId])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Memo ID Not Found'})
        }


        res.status(201).json({
            message: `Sales Agent Memo is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent Memo records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Memo Absence '})
    }  
}

exports.deleteAgentMemo = async (req, res, next) => {
    const { agent_id } = req.params 
    const  memoId = req.query.memo_id

 

    try {
        const query = "DELETE FROM memo WHERE id=? AND agent_id=?"
        const [result] = await pool.execute(query, [memoId, agent_id])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Memo ID Not found'})
        }

        res.status(200).send({ message: 'Agent Memo deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent memo:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent Memo'})
    }
}



