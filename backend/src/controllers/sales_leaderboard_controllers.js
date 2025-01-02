const  pool = require('../config/db')

const { validationResult } = require('express-validator')

exports.fetchAgentLeaderBoard = async (req, res, next) => {
    //check if there is a month and year in the query string
    // if there is no query string set month to the latest month

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

    try {
    //fetch all agent available and save it to sales_agent array
    const connection =  await pool.getConnection()

    //CHECK FIRST IF THERE ARE AVAILABLE MONTH AND YEAR ON target_shipok if not return empty array Imediately

    const [row] = await connection.execute(
       'SELECT COUNT(*) AS count FROM `target_shipok` WHERE month=? AND year=?',[givenMonth,givenYear]
    )

   const { count } = row[0]

   if (count == 0){
    connection.release()
    return  res.status(200).json([])
   }

    const [sales_agents] = await connection.execute(
        'SELECT * FROM  `sales_agents`'  
    )
   
    //fetch  evaluation_criteria value and save it to evalulation_criteria 
    const [evaluation_criteria_array] = await connection.execute(
       'SELECT * FROM `evaluation_criteria`'
    )
    
    const evaluation_criteria = evaluation_criteria_array[0]
    for (const agent of sales_agents){
       
      //add given month and year
      agent['month'] = givenMonth
      agent['year'] = givenYear
       /*fetch target and shipok of each agent for the given month and year and get the percentage
            with  performance_percent = shipok/target * 100
       */
       const [agentTargetShipOk] = await connection.execute(
        'SELECt target, ship_ok FROM `target_shipok` WHERE agent_id=? AND month=? AND year=?',[agent.id, givenMonth, givenYear]
       )
       
       if(agentTargetShipOk.length > 0) {
        const target = agentTargetShipOk[0].target
        const shipok = agentTargetShipOk[0].ship_ok
        const percentShipOk = Math.round(Number(shipok)/Number(target) * 100)
        
        //get the agent score performance
        const [scoreShipOk] = await connection.execute(
          'SELECT score FROM `performance_score`WHERE ? BETWEEN `min_value` AND `max_value`', [percentShipOk]
        ) 

      

        agent['target'] = target
        agent['shipok'] = shipok
        agent['shipok_percent'] = percentShipOk
        agent['shipok_score'] = scoreShipOk[0].score
      }else{
        agent['target'] = 0
        agent['shipok'] = 0
        agent['shipok_percent'] = 0
        agent['shipok_score'] = 0
      }

      //get agent total absences for the given month and year
      const [absences] = await connection.execute(
        'SELECT Count(*) as absences FROM absences WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
      )  
      let agentAbsenceScore;
      if (absences[0].absences === 0){
         agentAbsenceScore = 5
      }else {
        
        const [absenceScore] = await connection.execute(
          'SELECT score FROM absences_score WHERE absence_count=?', [absences[0].absences]
        )
        if (absenceScore.length == 0){
           agentAbsenceScore = 1
        }else{
          agentAbsenceScore = absenceScore[0].score
        }

      
      }
      

      agent['absence_score'] = agentAbsenceScore

     
      //get total agent tardiness for the given month and year and corresding score
      
      const [tardiness] = await connection.execute(
        'SELECT Count(*) as tardiness FROM tardiness WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
      )

      
      
      let agentTardinessScore
      if (tardiness[0].tardiness === 0){
         agentTardinessScore = 5
      }else {
        
        const [tardinessScore] = await connection.execute(
          'SELECT score FROM tardiness_score WHERE tardiness_count=?', [tardiness[0].tardiness]
        )
        if (tardinessScore.length == 0){
           agentTardinessScore = 1
        }else{
          agentTardinessScore = tardinessScore[0].score
        }

       
      }

      agent['tardiness_score'] = agentTardinessScore
      
     
    //get agent total memo for the given month and year and corressponding memo score

     
    const [memo] = await connection.execute(
      'SELECT Count(*) as memo FROM memo WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
    )

    
    
    let agentMemoScore
    if (memo[0].memo === 0){
       agentMemoScore = 5
    }else {
      
      const [memoScore] = await connection.execute(
        'SELECT score FROM memorandum_score WHERE memo_count=?', [memo[0].memo]
      )
      if (memoScore.length == 0){
         agentMemoScore= 1
      }else{
        agentMemoScore = memoScore[0].score
      }

     
    }

    agent['memo_score'] = agentMemoScore


    // get agent feedback for the given month and year
    const [feedback] = await connection.execute(
      'SELECT feedback FROM feedback WHERE agent_id=? AND month=? AND year=?', [agent.id, givenMonth, givenYear]
    )
    let agentFeedbackScore 
    if (feedback.length == 0) {
      agentFeedbackScore = 0
    }else{
      agentFeedbackScore = feedback[0].feedback
    }
       
    agent['feedback_score'] = agentFeedbackScore

    //get agent new deposit for the given and treat this as additional point
    
    const [newDeposit] = await connection.execute(
      'SELECT Count(*) AS deposit FROM new_deposit WHERE agent_id=? AND month=? AND year=?',[agent.id, givenMonth,givenYear]
    )
    let agentNewDepositScore
    if (newDeposit.length == 0){
      agentNewDepositScore = 0
    }else {
      agentNewDepositScore = newDeposit[0].deposit
    }
    
    agent['deposit_score'] = agentNewDepositScore

    //calculate score ratings

   
    
    agent['performance_rating'] = Math.round(( agent['shipok_score'] * evaluation_criteria.performance) * 100) /100
    agent['absence_rating'] = Math.round((agent['absence_score'] * evaluation_criteria.absence) * 100) / 100 
    agent['tardiness_rating'] = Math.round((agent['tardiness_score'] * evaluation_criteria.tardiness) * 100)/100 
    agent['memo_rating'] = Math.round((agent['memo_score']  * evaluation_criteria.memorandum_recieved) * 100 ) /100
    agent['feedback_rating'] = Math.round((agent['feedback_score'] * evaluation_criteria.feedback) * 100) /100 
    agent['additional_points'] = Math.round((agent['deposit_score'] * evaluation_criteria.additional_points) * 100 ) /100

    agent['final_ratings'] = Math.round((agent['performance_rating'] + agent['absence_rating'] + agent['tardiness_rating'] +
                            agent['memo_rating'] + agent['feedback_rating'] + agent['additional_points']
                            ) * 100) / 100

    // Get the result name base on the final_ratings

    const [ratings] = await connection.execute(
      'SELECT ratings_name FROM result_ratings WHERE ? BETWEEN min_value AND max_value',[agent['final_ratings']]
    )

    agent['ratings_name'] = ratings[0].ratings_name

  }

    connection.release()
   
    sales_agents.sort((a, b) => b.final_ratings - a.final_ratings)

    res.status(200).json(sales_agents)
 
    
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
        res.status(500).json({error: 'Error, Cannot Fetch Agent sales_leaderboard'})

   }
  //  finally {
  //    connection.release()
  //  }

}



