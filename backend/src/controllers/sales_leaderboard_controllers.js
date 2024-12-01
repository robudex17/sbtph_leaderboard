const  pool = require('../config/db')

exports.fetchAgentLeaderBoard = async (req, res, next) => {
    //check if there is a month and year in the query string
    // if there is no query string set month to the latest month

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

    try {
    //fetch all agent available and save it to sales_agent array
    const connection =  await pool.getConnection()

    const [sales_agents] = await connection.execute(
        'SELECT * FROM  `sales_agents`'  
    )
    connection.release()

    //fetch  evaluation_criteria value and save it to evalulation_criteria 
    
   /*fetch target and shipok of each agent for the given month, and get the perentage
    with  performance_percent = shipok/target * 100
   
    - roundoff it to the nearest  whole number, get the equivalent score in  performance_score table and store it in
    agent_performance_score variables
    
    - get the 80%  of the performance_score and save it to performance_total 
      performance_total = performance_score * evalualtion_criteria.performance 

    - get total tardiness and absence of the agent for the given month and get the score equivalent to tardiness_score and absences_score 
      and save it to agent_tardiness_score and agent_absences_score variable
      get the sum of these two and multiply it with 10% or .10 and store the variable to  attentance_total_score 
      
    - get the feedback of each agent for the given month and save it to agent_feedback variable
      get the agent feedback_score (agent_feedback * evaulation_criteria.feedback)
      get the  memo fo the agent for the given month and get the equivalent score in memorandum_socre
      agent_memorandum_score = agent_memo_score * evaluation_criteria.memorandum_recieved 
    - get the  total new_deposit of each agent for the given month and get the new_deposit_score
      additional_points= new_deposit_total * evaluatin_criteria.additional_points
     
    -get the total_result of each agent for the given month 
     agent_total_result = agent_perfomance_result + agent_attendance_result + agent_memo_feedback_result + agent_additional_result

    - get the result_name name of each agent base on the agent_total_result in the result_ratings table.

   */
    }
    catch(error){
        console.error('Error Updating Agent Tardiness records', error)
        res.status(500).json({error: 'Error, Cannot Fetch Agent sales_leaderboard'
    }

}