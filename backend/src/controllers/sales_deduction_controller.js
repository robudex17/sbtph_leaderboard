const pool =  require('../config/db')
const { validationResult } = require('express-validator')

exports.createAgentDeduction = async (req, res, next) => {

    // const errors = validationResult(req)

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }


    const agentId = req.params.agent_id
   
    const month = req.body.month || req.body.eval_month
    const year = req.body.year || req.body.eval_year

    const evaluation  = req.body.evaluation
    const deduction = req.body.deduction
    const agentDbname = req.body.agent_dbname

    try {
       const query = "INSERT INTO deduction ( agent_id, agent_dbname, month, year, deduction) VALUES (?,?,?,?,?)"
 
        
        
        // const query = "INSERT INTO memo ( agent_id, month, year, description,date) VALUES (?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agentId, agentDbname,month,year, deduction])

        res.status(201).json({
            message: `New Deduction for agent_id: ${agentId} are created`
        })
        
    }catch(error){
        console.error('Error inserting deduction records', error)
        res.status(500).json({error: 'Database Error, Cannot create deduction'})
    }
    
}

// exports.fetchAgentD = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
   
//     let givenMonth
//     let givenYear 
//     let fullyear = req.query.fullyear
//     const currentDate = new Date()

//     const export_to_excel = req.export_to_excel 


//               // Get the month name
//     const monthNames = [
//                 "January", "February", "March", "April", "May", "June",
//                 "July", "August", "September", "October", "November", "December"
//             ];
 
//     if (!req.query.month ||  req.query.month ==="") {
        
  
//         givenMonth = monthNames[currentDate.getMonth()]; // getMonth() returns 0-based index
//     }else {
//         givenMonth = req.query.month
//     }
    
//     if(!req.query.year || req.query.year ===""){
//         givenYear = currentDate.getFullYear()
//     }else {
//         givenYear = req.query.year
//     }

//     // const agentId = req.params.agent_id

//     let agentId 
//     if (req.params.agent_id){
//         agentId = req.params.agent_id
//     }else{
//         agentId = req.query.agent_id
//     }

//     const connection =  await pool.getConnection()

//     if (fullyear == 'true' || fullyear == true){
//         const [result] = await connection.execute(
//             'SELECT * FROM  `memo` WHERE agent_id=?  AND year=?',[agentId,givenYear]  
//         )
//         connection.release()
//         result.sort((a,b) => {
//             return monthNames.indexOf(a.month.charAt(0).toUpperCase() + a.month.slice(1).toLowerCase()) - 
//             monthNames.indexOf(b.month.charAt(0).toUpperCase() + b.month.slice(1).toLowerCase());
//         })

//         if(export_to_excel){
//             req.agent_memo = result
//             next()
//         }else{
//             res.json(result)
//         }
       
//     }else {
//         const [result] = await connection.execute(
//             'SELECT * FROM  `memo` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
//         )
//         connection.release()
//         if(export_to_excel){
//             req.agent_memo = result
//             next()
//         }else{
//             res.json(result)  
//         }
            
//     }
    
// }

exports.updateAgentDeduction = async (req,res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const agentId = req.params.agent_id
    const month = req.body.month
    const year = req.body.year
    const deduction = req.body.deduction
    const agentDbname = req.body.agent_dbname
    const evaluation  = req.body.evaluation

  
    try {
        const query = "UPDATE deduction SET  deduction=?  WHERE month=? AND year=?  AND agent_id=?"
        
        const [result]  = await pool.execute(query, [deduction, month, year, agentId])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Deduction Record Not Found'})
        }


        res.status(201).json({
            message: `Sales Agent Deduction is updated`
        })
        
    }catch(error){
        console.error('Error Updating Agent Deduction records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Deduction  '})
    }  
}

exports.deleteAgentDeduction = async (req, res, next) => {
   
    const agentId = req.params.agent_id
  
    const evaluation = req.body.evaluation  
    const month = req.body.month || req.body.eval_month
    const year = req.body.year || req.body.eval_year


    

    try {
       
        const query = "DELETE FROM deduction WHERE  agent_id=? AND month=? AND year=?"
        const [result] = await pool.execute(query, [agentId, month, year]);
  

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Deduction ID Not found'})
        }

        res.status(200).send({ message: 'Agent Deduction deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent deduction:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent Deduction'})
    }
}



