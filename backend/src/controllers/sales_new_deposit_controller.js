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

exports.fetchAgentNewDeposit = async (req, res, next) => {
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

    const connection =  await pool.getConnection()

    const [result] = await connection.execute(
        'SELECT * FROM  `new_deposit` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth, givenYear]  
    )
    connection.release()
    res.json(result)
}


exports.updateAgentNewDeposit = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const agentId  = req.params.agent_id

    const depositId = req.query.deposit_id

    const  newDeposit = req.body.new_deposit 
    const depositDate = req.body.deposit_date

    try {
        const query = "UPDATE new_deposit SET  new_deposit=?, date=? WHERE id=? AND agent_id=?"
        
        const [result]  = await pool.execute(query, [newDeposit, depositDate, depositId,agentId])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'New Deposit ID Not Found'})
        }


        res.status(201).json({
            message: `Sales Agent New Deposit is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent New Deposit records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Agent Deposit '})
    }  


}

exports.deleteAgentNewDeposit = async (req, res, next) => {
    
    const agentId = req.params.agent_id 
    const  depositId = req.query.deposit_id

   

    try {
        const query = "DELETE FROM new_deposit WHERE id=? AND agent_id=?"
        const [result] = await pool.execute(query, [depositId, agentId])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent New Deposit ID Not found'})
        }

        res.status(200).send({ message: 'Agent New Deposit deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent new deposit:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent New Deposit'})
    }
}
