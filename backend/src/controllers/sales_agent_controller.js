const pool = require('../config/db')
const { validationResult} = require('express-validator')

exports.fetchSalesAgents = async (req,res, next ) => {
    const connection =  await pool.getConnection()

    const [rows, fields] = await connection.execute(
        'SELECT * FROM  `sales_agents`'  
    )
    connection.release()
    res.json(rows)
}

exports.addNewSalesAgent = async( req, res, next) => {
    const connection  = await pool.getConnection()
    
    
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }else{
        console.log('All input is valid..')
    }

    const agentId  = req.body.agent_id
    const mangerId = req.body.manager_id 
    const agentType = req.body.agent_type 
    const agentFirstname = req.body.agent_firstname 
    const agentLastname = req.body.agent_lastname 
    const agentDbname = req.body.agent_dbname 
    


    let imageLink = ""
    if (!req.file) {
        imageLink = null
    }else {
         // Construct the URL for the uploaded image
       imageLink = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    try {
        const query = "INSERT INTO sales_agents ( id, manager_id,agent_type,firstname,lastname,db_name,image_link) VALUES (?,?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, mangerId,agentType,agentFirstname,agentLastname,agentDbname,imageLink])

        res.status(201).json({
            message: `New Sales Agent for is created..`
        })
        
    }catch(error){
        console.error('Error inserting New Agents records', error)
        res.status(500).json({error: 'Database Error, Cannot New Agents'})
    }  
}

exports.updateSalesAgent = async( req, res, next) => {
    const connection  = await pool.getConnection()
    
    
    console.log(req.body)
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }else{
        console.log('All input is valid..')
    }

    const agentId  = req.params.agent_id
    const mangerId = req.body.manager_id 
    const agentType = req.body.agent_type 
    const agentFirstname = req.body.agent_firstname 
    const agentLastname = req.body.agent_lastname 
    const agentDbname = req.body.agent_dbname 
    let imageLink = req.body.agent_image_link

  
    if (req.file) {
        imageLink = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    try {
        const query = "UPDATE sales_agents SET manager_id=?, agent_type=?, firstname=?, lastname=?, db_name=?, image_link=? WHERE id=?"
        
        const [result]  = await pool.execute(query, [mangerId,agentType,agentFirstname,agentLastname,agentDbname,imageLink,agentId])

        res.status(201).json({
            message: `Sales Agent Info is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Agent'})
    }  
}

exports.deleteSalesAgent = async (req, res, next) => {

    const { agent_id } = req.params 

    try {
        const query = "DELETE FROM sales_agents WHERE id=?"
        const [result] = await pool.execute(query, [agent_id])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent not ound'})
        }

        res.status(200).send({ message: 'Agent deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent'})
    }
}
