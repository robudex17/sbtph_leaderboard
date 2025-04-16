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

    let fullyear = req.query.fullyear
    const export_to_excel = req.query.export_to_excel
 
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
    
    // const agentId = req.params.agent_id

    let agentId 

    if(req.params.agent_id){
        agentId = req.params.agent_id
    }else{
        agentId = req.query.agent_id
    }

    // const connection =  await pool.getConnection()
    if(fullyear == 'true' || fullyear == true){
        const [result] = await pool.execute(
            'SELECT * FROM  `feedback` WHERE agent_id=?  AND year=?',[agentId,givenYear]  
        )
        if(export_to_excel){
            req.feeback_admin = result
            next()
        }else{
            res.json(result)
 
        }
    }else{
        const [result] = await pool.execute(
            'SELECT * FROM  `feedback` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
        )

        if(export_to_excel){
            req.feeback_admin = result
            next()
        }else{
            res.json(result)
 
        }
       
    }
   

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


 exports.addAgentsFeedback = async (req, res, next) => {
    
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    const { lm_id , lm_dbname, agent_id, agent_dbname, responses, feedback_score, total_score, percentage, date, month,year} = req.body
    const agentId = req.params.agent_id
        try {

            const responsesJson = JSON.stringify(responses)
            const query = "INSERT INTO agents_feedback (lm_id , lm_dbname, agent_id, agent_dbname, responses, feedback_score, total_score, percentage, date, month,year) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
            const [result]  = await pool.execute(query, [lm_id , lm_dbname, agentId, agent_dbname, responsesJson, feedback_score, total_score, percentage, date, month,year])

            res.status(201).json({
                message: `New Feedback  for agent_id: ${agent_id} are created or recorded`
            })
            
        }catch(error){
            console.error('Error inserting new feedback records', error)
            res.status(500).json({error: 'Database Error, Cannot create Agent Feedback'})
        }  

 }

 exports.updateAgentsFeedback = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { lm_id , lm_dbname, agent_id, agent_dbname, responses, feedback_score, total_score, percentage, month,year,date} = req.body
    const agentId = req.params.agent_id
    //check if can_update is true then the edit can processed else throw and error
    const [canUpdate] = await pool.execute(
        'SELECT can_update FROM  `agents_feedback` WHERE agent_id=? AND lm_id=? AND month=? AND year=?',[agentId, lm_id, month,year]  
    )

    if (!canUpdate[0].can_update) {
        return res.status(404).json({message: "You are not allowed to update your feedback response,Please contact your IT or Manager"})
    }
            
    try {
        const responsesJson = JSON.stringify(responses)
        const query = "UPDATE agents_feedback SET  responses=?, feedback_score=?, total_score=?, percentage=? WHERE agent_id=? AND lm_id=? AND month=? AND year=? AND date=?"
        
        const [result]  = await pool.execute(query, [responsesJson, feedback_score, total_score, percentage,agent_id, lm_id, month, year,date])
        
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

 exports.getAgentsFeedback = async (req, res, next) => {
    let givenMonth
    let givenYear 
    let fullyear = req.query.fullyear
    console.log(fullyear)
    const export_to_excel = req.export_to_excel
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
    
    // const agentId = req.params.agent_id
    let agentId 

    if(req.params.agent_id){
        agentId = req.params.agent_id
    }else{
        agentId = req.query.agent_id
    }

    // const connection =  await pool.getConnection()
    if(fullyear == 'true' || fullyear == true){
        const [result] = await pool.execute(
            'SELECT * FROM  `agents_feedback` WHERE agent_id=?  AND year=?',[agentId,givenYear]  
        )
        // connection.release()
        result.sort((a,b) => {
            return monthNames.indexOf(a.month.charAt(0).toUpperCase() + a.month.slice(1).toLowerCase()) - 
            monthNames.indexOf(b.month.charAt(0).toUpperCase() + b.month.slice(1).toLowerCase());
        })
        if(export_to_excel){
            return result
        }else{
          
            res.json(result)  
        }
              
    }else {
        const [result] = await pool.execute(
            'SELECT * FROM  `agents_feedback` WHERE agent_id=?  AND month=? AND year=?',[agentId,givenMonth,givenYear]  
        )
        // connection.release()
        if(export_to_excel){
            return result
        }else{
            
            res.json(result)
        }
      
    }
  

 }

 exports.removeAgentsFeedback = async(req,res, next) => {
    const agentId = req.params.agent_id
    const feedbackDate = req.body.date 
    const lmId = req.body.lm_id 
    const month = req.body.month 
    const year = req.body.year

    try {
        const query = "DELETE FROM agents_feedback WHERE agent_id=? AND lm_id=? AND date=? AND month=? AND year=?"
        const [result] = await pool.execute(query, [agentId, lmId,  feedbackDate, month, year])

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

 exports.addLmFeedback = async (req, res, next) => {

    const {manager_id, manager_dbname, lm_id , lm_dbname, responses, feedback_score, total_score, percentage, date, month,year} = req.body
    const lmId = req.params.lm_id
    // if agent_type is not 2 which senior manager  return 404 error
    // const user = req.user 
    const user = {}
    user.agent_type = 2

    if (user.agent_type != 2) {
        return res.status(404).json({message: "The Senior Manager is only allowed to give feedback on LMs"})
    }
    try {

        const responsesJson = JSON.stringify(responses)
        const query = "INSERT INTO lm_feedback (manager_id, manager_dbname,lm_id , lm_dbname,  responses, feedback_score, total_score, percentage, date, month,year) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [manager_id, manager_dbname, lmId , lm_dbname, responsesJson, feedback_score, total_score, percentage, date, month,year])

        res.status(201).json({
            message: `New Feedback  for lm_id: ${lm_id} are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting new feedback records', error)
        res.status(500).json({error: 'Database Error, Cannot create Local Manager Feedback'})
    }  
 }

 exports.updateLmFeedback = async (req, res, next) => {

    const {manager_id, manager_dbname, lm_id , lm_dbname, responses, feedback_score, total_score, percentage, date, month,year} = req.body
    const lmId = req.params.lm_id

        // if agent_type is not 2 which senior manager  return 404 error
    const user = req.user 
    // const user = {}
    // user.agent_type = 2

    if (user.agent_type != 2) {
        return res.status(404).json({message: "The Senior Manager is only allowed to give feedback on LMs"})
    }

    //check if can_update is true then the edit can processed else throw and error
    const [canUpdate] = await pool.execute(
        'SELECT can_update FROM  `lm_feedback` WHERE lm_id=? AND manager_id=? AND month=? AND year=?',[ lmId, manager_id, month,year]  
    )

    if (!canUpdate[0].can_update) {
        return res.status(404).json({message: "You are not allowed to update your feedback response,Please contact your IT or Manager"})
    }
            
    try {
        const responsesJson = JSON.stringify(responses)
        const query = "UPDATE lm_feedback SET  responses=?, feedback_score=?, total_score=?, percentage=? WHERE lm_id=? AND manager_id=? AND month=? AND year=? AND date=?"
        
        const [result]  = await pool.execute(query, [responsesJson, feedback_score, total_score, percentage,lm_id, manager_id, month, year,date])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Local Manager Feedback Not Found..'})
        }


        res.status(201).json({
            message: `Local Manager Feedback is updated`
        })
        
    }catch(error){
        console.error('Error Updating Local Manager Feedback records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Local Manager Feedback '})
    }
 }

 exports.getLmFeedback = async (req, res, next) => {

    // if agent_type is not 2 which senior manager  return 404 error
    const user = req.user 
    // const user = {}
    // user.agent_type = 2

    // if (user.agent_type != 2) {
    //     return res.status(404).json({message: "The Senior Manager is only allowed to get feedback on LMs"})
    // }

    let fullyear = req.query.fullyear
   
    const export_to_excel = req.export_to_excel

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
    
    // const lmId = req.params.lm_id

    let lmId

    if(req.params.lm_id){
        lmId = req.params.lm_id
    }else{
        lmId = req.query.agent_id
    }

    // const connection =  await pool.getConnection()
    if(fullyear == 'true' || fullyear == true){
        const [result] = await pool.execute(
            'SELECT * FROM  `lm_feedback` WHERE lm_id=?  AND year=?',[lmId,givenYear]  
        )

        if(export_to_excel){
            return result
        }else{
            res.json(result)
        }
    }else{
        const [result] = await pool.execute(
            'SELECT * FROM  `lm_feedback` WHERE lm_id=? AND month=? AND year=?',[lmId,givenMonth,givenYear]  
        )
        if(export_to_excel){
            return result
        }else{
            res.json(result)
        }

    }


 }

 exports.removeLmFeedback = async(req,res, next) => {

     const user = req.user 
    //   const user = {}
    //   user.agent_type = 2
  
      if (user.agent_type != 2) {
          return res.status(404).json({message: "The Senior Manager is only allowed to Delete feedback on LMs"})
      }


    const lmId = req.params.lm_id
    const feedbackDate = req.body.date 
    const managerId = req.body.manager_id
    const month = req.body.month 
    const year = req.body.year

    try {
        const query = "DELETE FROM lm_feedback WHERE lm_id=? AND manager_id=? AND date=? AND month=? AND year=?"
        const [result] = await pool.execute(query, [ lmId, managerId, feedbackDate, month, year])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Local Manager Feedback Not found'})
        }

        res.status(200).send({ message: 'Local Manager Feedback deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting Local Manager feedback:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Local Manager Feedback'})
    }
    
 }

 exports.addManagerFeedback = async (req, res, next) => {
    const {manager_id, manager_dbname, agent_id , agent_dbname, responses, feedback_score, total_score, percentage, date, month,year} = req.body
    const managerId = req.params.manager_id

    try {

        const responsesJson = JSON.stringify(responses)
        const query = "INSERT INTO managers_feedback (agent_id, agent_dbname,manager_id, manager_dbname,  responses, feedback_score, total_score, percentage, date, month,year) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        const [result]  = await pool.execute(query, [agent_id, agent_dbname, managerId, manager_dbname, responsesJson, feedback_score, total_score, percentage, date, month,year])

        res.status(201).json({
            message: `New Feedback  for manager with id : ${managerId } are created or recorded`
        })
        
    }catch(error){
        console.error('Error inserting new feedback records', error)
        res.status(500).json({error: 'Database Error, Cannot create  Manager Feedback'})
    }  
 }

 exports.updateManagerFeedback = async (req, res, next) => {

    console.log(req.body)
    const {manager_id, manager_dbname, agent_id , agent_dbname, responses, feedback_score, total_score, percentage, date, month,year} = req.body
    const managerId = req.params.manager_id



    //check if can_update is true then the edit can processed else throw and error
    const [canUpdate] = await pool.execute(
        'SELECT can_update FROM  `managers_feedback` WHERE agent_id=? AND manager_id=? AND month=? AND year=?',[ agent_id, managerId, month,year]  
    )

    if (!canUpdate[0].can_update) {
        return res.status(404).json({message: "You are not allowed to update your feedback response,Please contact your IT or Manager"})
    }
            
    try {
        const responsesJson = JSON.stringify(responses)
        const query = "UPDATE managers_feedback SET  responses=?, feedback_score=?, total_score=?, percentage=? WHERE agent_id=? AND manager_id=? AND month=? AND year=? AND date=?"
        
        const [result]  = await pool.execute(query, [responsesJson, feedback_score, total_score, percentage,agent_id, managerId, month, year,date])
        
        if (result.affectedRows === 0){
            return res.status(400).json({message: ' Manager Feedback Not Found..'})
        }


        res.status(201).json({
            message: ` Manager Feedback is updated`
        })
        
    }catch(error){
        console.error('Error Updating  Manager Feedback records', error)
        res.status(500).json({error: 'Database Error, Cannot Update Manager Feedback '})
    }
 }

 exports.getMangerFeedback = async (req, res, next) => {
   
    let givenMonth
    let givenYear 
    const currentDate = new Date()
    const export_to_excel = req.export_to_excel
    let fullyear = req.query.fullyear

    console.log(req.query)
    
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
    
    //const managerId = req.params.manager_id

    
    const agentId = req.query.agent_id

    let managerId 

    if (req.params.manager_id){
        managerId = req.params.manager_id
    }else{
        managerId = req.query.agent_id
    }

    if (agentId){   
        if(fullyear == 'true' || fullyear == true) {
            const [result] = await pool.execute(
                'SELECT * FROM  `managers_feedback` WHERE manager_id=? AND agent_id=?  AND year=?',[managerId, agentId,givenYear]  
            )
            if(export_to_excel){
                return result
            }else{
                res.json(result)
            }
        }else{
            const [result] = await pool.execute(
                'SELECT * FROM  `managers_feedback` WHERE manager_id=? AND agent_id=? AND month=? AND year=?',[managerId, agentId,givenMonth,givenYear]  
            )

            if(export_to_excel){
                return result
            }else{
              
                return  res.json(result)
            }
        }


        
   }else {
        if(fullyear == 'true' || fullyear == true){
            const [result] = await pool.execute(
                'SELECT * FROM  `managers_feedback` WHERE manager_id=?  AND year=?',[managerId,givenYear]  
            )
            if(export_to_excel){
                return result
            }else{
                res.json(result)
            }
        }else{
            const [result] = await pool.execute(
                'SELECT * FROM  `managers_feedback` WHERE manager_id=?  AND month=? AND year=?',[managerId,givenMonth,givenYear]  
            )
            if(export_to_excel){
               return result
            }else{
                
                return  res.json(result)
            }
            
        }
 
   }

       
 }
 exports.removeManagerFeedback = async(req,res, next) => {
 

    const managerId = req.params.manager_id
    const feedbackDate = req.body.date 
    const agentId = req.body.agent_id
    const month = req.body.month 
    const year = req.body.year

    try {
        const query = "DELETE FROM managers_feedback WHERE agent_id=? AND manager_id=? AND date=? AND month=? AND year=?"
        const [result] = await pool.execute(query, [ agentId, managerId, feedbackDate, month, year])

        if (result.affectedRows === 0){
            return res.status(400).json({message: ' Manager Feedback Not found'})
        }

        res.status(200).send({ message: ' Manager Feedback deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting  Manager feedback:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete  Manager Feedback'})
    }    
 }


 //CONTROLLER FEEDBACK BY QA
 exports.addAgentsFeedbackByQa = async (req, res, next) => {
    
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    const { qa_id , qa_dbname, agent_id, agent_dbname, role, feedback_score, date, month,year} = req.body
    const agentId = req.params.agent_id
        try {

            
            const query = "INSERT INTO feedback_by_qa (qa_id , qa_dbname, agent_id, agent_dbname, role, feedback_score, date, month,year) VALUES (?,?,?,?,?,?,?,?,?)"
            const [result]  = await pool.execute(query, [qa_id , qa_dbname, agentId, agent_dbname,role, feedback_score,  date, month,year])

            res.status(201).json({
                message: `New Feedback By QA  for agent_id: ${agent_id}  are created or recorded`
            })
            
        }catch(error){
            console.error('Error inserting new feedback records', error)
            res.status(500).json({error: 'Database Error, Cannot create Agent Feedback'})
        }  

 }

 exports.updateAgentsFeedbackByQa = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { qa_id , qa_dbname, agent_id, agent_dbname, role, feedback_score,  date, month,year} = req.body
    const agentId = req.params.agent_id
            
    try {
        
        const query = "UPDATE feedback_by_qa  SET  feedback_score=? WHERE agent_id=? AND qa_id=? AND month=? AND year=? AND date=?"
        
        const [result]  = await pool.execute(query, [ feedback_score ,agent_id, qa_id, month, year,date])
        
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

 exports.getAgentsFeedbackByQa = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let givenMonth
    let givenYear 
    const currentDate = new Date()
    const export_to_excel = req.export_to_excel
   
    let fullyear = req.query.fullyear
   
   
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
    
    //const agentId = req.params.agent_id

    let agentId 
    if(req.params.agent_id){
        agentId = req.params.agent_id
    }else{
        agentId = req.query.agent_id
    }

    // const connection =  await pool.getConnection()
    if(fullyear == 'true' || fullyear == true){
        const [result] = await pool.execute(
            'SELECT * FROM  `feedback_by_qa` WHERE agent_id=? AND year=?',[agentId,givenYear]  
        )
        if(export_to_excel){
            req.qa_feedback = result 
            next()
        }else{
           
            res.json(result)
    
        }
    }else{
        const [result] = await pool.execute(
            'SELECT * FROM  `feedback_by_qa` WHERE agent_id=? AND month=? AND year=?',[agentId,givenMonth,givenYear]  
        )
        if(export_to_excel){
            req.qa_feedback = result 
            next()
        }else{
           
            res.json(result)
    
        }
    }

    
 }

 exports.removeAgentsFeedbackByQa = async(req,res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const agentId = req.params.agent_id
    const feedbackDate = req.body.date 
    const qaId = req.body.qa_id
    const month = req.body.month 
    const year = req.body.year

    try {
        const query = "DELETE FROM feedback_by_qa WHERE agent_id=? AND qa_id=? AND date=? AND month=? AND year=?"
        const [result] = await pool.execute(query, [agentId, qaId,  feedbackDate, month, year])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Feedback Not found'})
        }

        res.status(200).send({ message: 'Agent Feedback By Qa deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting agent feedback:', error)
        res.status(500).json({error: 'Database Error, Cannot Delete Agent Feedback'})
    }
 }





