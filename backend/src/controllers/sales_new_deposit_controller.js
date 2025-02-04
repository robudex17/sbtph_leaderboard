const pool  =  require('../config/db')
const { validationResult } = require('express-validator')

exports.addNewDeposit = async (req, res, next ) => {
   
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   

    console.log(req.body)

    const agentId = req.params.agent_id
    const newDeposit =  req.body.new_deposit
    const depositDate = req.body.date
    const depositMOnth = req.body.month
    const depositYear = req.body.year
    const depositDescription = req.body.description

       
    try {
        const query = "INSERT INTO new_deposit ( agent_id, month, year,new_deposit,description,date) VALUES (?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, depositMOnth,depositYear, newDeposit, depositDescription,depositDate])
        console.log('the result is:', result)
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
    
    console.log(req.body)
  
    const agentId  = req.params.agent_id

    const depositId = req.body.id

    const  newDeposit = req.body.new_deposit 
    const depositDate = req.body.date
    const  depositMonth = req.body.month 
    const depositYear = req.body.year
    const depositDescription = req.body.description

    try {
        const query = "UPDATE new_deposit SET  new_deposit=?, date=?, month=?, year=?, description=? WHERE id=? AND agent_id=?"
        
        const [result]  = await pool.execute(query, [newDeposit, depositDate, depositMonth, depositYear, depositDescription, depositId,agentId])
        
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
    const  depositId = req.body.id
  

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
