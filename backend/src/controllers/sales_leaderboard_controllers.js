const  pool = require('../config/db')

const { validationResult } = require('express-validator')

exports.getAgentsMetrics = async ( agent_id, givenMonth,givenYear, withTrucks) => {
    //CHECK FIRST IF THERE ARE AVAILABLE MONTH AND YEAR ON target_shipok if not return empty array Imediately

  
     /*
      iF withTrucks is true , all agents
      if withTrucks is false , remove the market_id of 10 because it is trucks market
     */  
   let count ;
 
   if(agent_id != ""){
      const [row] = await pool.execute(
        'SELECT COUNT(*) AS count FROM `target_shipok` WHERE month=? AND year=? AND agent_id=?',[givenMonth,givenYear,agent_id]
    )
 
      count = row[0].count    
   }else {
    
      if (withTrucks == "true" ){
       
        const [row] = await pool.execute(
          'SELECT COUNT(*) AS count FROM `target_shipok` WHERE month=? AND year=?',[givenMonth,givenYear]
      )
        count = row[0].count
      }else{
       
        const [row] = await pool.execute(
          'SELECT COUNT(*) AS count FROM `target_shipok` WHERE month=? AND year=? AND market_id != 10',[givenMonth,givenYear]
      )
         count = row[0].count
         
      } 
   }
 
  
  if (count == 0){
  //  connection.release()
   return  []
  }

 /*
  iF withTrucks is true , all agents
  if withTrucks is false , remove the market_id of 10 because it is trucks market
 */

let sales_agents
if (agent_id != ""){
  const [sales_agents_result] = await pool.execute(
    'SELECT * FROM  `sales_agents` WHERE id=?',[agent_id]  
  )
  
  sales_agents = sales_agents_result
}else{

  if (withTrucks === "true" || withTrucks === true){
    const [sales_agents_result] = await pool.execute(
      'SELECT * FROM  `sales_agents`'  
    )
    
    sales_agents = sales_agents_result
  }else {
    
    const [sales_agents_result] = await pool.execute(
      'SELECT * FROM  `sales_agents` WHERE market_id !=?', [10]  
  )
  sales_agents = sales_agents_result
  }
}

   

   //fetch  evaluation_criteria value and save it to evalulation_criteria 
   const [evaluation_criteria_array] = await pool.execute(
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
      const [agentTargetShipOk] = await pool.execute(
       'SELECt target, ship_ok FROM `target_shipok` WHERE agent_id=? AND month=? AND year=?',[agent.id, givenMonth, givenYear]
      )
      
      if(agentTargetShipOk.length > 0) {
       const target = agentTargetShipOk[0].target
       const shipok = agentTargetShipOk[0].ship_ok
       const percentShipOk = Math.round(Number(shipok)/Number(target) * 100)
       
       //get the agent score performance
       const [scoreShipOk] = await pool.execute(
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
     const [absences] = await pool.execute(
       'SELECT Count(*) as absences FROM absences WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
     )  
     let agentAbsenceScore;
     if (absences[0].absences === 0){
        agentAbsenceScore = 5
     }else {
       
       const [absenceScore] = await pool.execute(
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
     
     const [tardiness] = await pool.execute(
       'SELECT Count(*) as tardiness FROM tardiness WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
     )

         
     let agentTardinessScore
     if (tardiness[0].tardiness === 0){
        agentTardinessScore = 5
     }else {
       
       const [tardinessScore] = await pool.execute(
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

   const [memo] = await pool.execute(
     'SELECT Count(*) as memo FROM memo WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
   )

   
   let agentMemoScore
   if (memo[0].memo === 0){
      agentMemoScore = 5
   }else {
     
     const [memoScore] = await pool.execute(
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
    

  //  const [feedback] = await pool.execute(
  //    'SELECT feedback FROM feedback WHERE agent_id=? AND month=? AND year=?', [agent.id, givenMonth, givenYear]
  //  )
  //  let agentFeedbackScore 
  //  if (feedback.length == 0) {
  //    agentFeedbackScore = 0
  //  }else{
  //    agentFeedbackScore = feedback[0].feedback
  //  }

   
   const [feedback] = await pool.execute(
    'SELECT feedback FROM feedback WHERE agent_id=? AND month=? AND year=?', [agent.id, givenMonth, givenYear]
  )
  let overallAverageFeedback
  if (feedback.length == 0) {
        let averageAgentFeedback = null
        let averageManagerFeedback = null
        let averageLmsFeedback = null
        let averageFeedbackByQa = null

        const getAverageFeedback = (feedback_result) => {
          if (!Array.isArray(feedback_result) || feedback_result.length === 0) return null;
          const total = feedback_result.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
          return (total / feedback_result.length).toFixed(2);
        }
        // for saleas agent
        if (agent.agent_type == 0){
          const [agents_feedback_result] = await pool.execute(
            'SELECT feedback_score FROM  `agents_feedback` WHERE agent_id=?  AND month=? AND year=?',[agent.id,givenMonth,givenYear]  
          )
          averageAgentFeedback  = getAverageFeedback(agents_feedback_result)
        }
       // for local manager
       if(agent.agent_type == 1){
          const [lm_feedback_result] = await pool.execute(
            'SELECT feedback_score FROM  `lm_feedback` WHERE lm_id=? AND month=? AND year=?',[agent.id,givenMonth,givenYear]  
          ) 
        
          const [managers_feedback_result] = await pool.execute(
            'SELECT feedback_score FROM  `managers_feedback` WHERE manager_id=?  AND month=? AND year=?',[ agent.id,givenMonth,givenYear]  
         )
         averageLmsFeedback = getAverageFeedback(lm_feedback_result )
         averageManagerFeedback  = getAverageFeedback(managers_feedback_result)
      }
      // for senior manager.
      if (agent.agent_type == 2){
          const [managers_feedback_result] = await pool.execute(
            'SELECT feedback_score FROM  `managers_feedback` WHERE manager_id=?  AND month=? AND year=?',[ agent.id,givenMonth,givenYear]  
          )
          averageManagerFeedback = getAverageFeedback(managers_feedback_result)
      }

      const [feedback_by_qa_result] = await pool.execute(
        'SELECT * FROM  `feedback_by_qa` WHERE agent_id=? AND month=? AND year=?',[agent.id,givenMonth,givenYear]  
      )

  
       averageFeedbackByQa = getAverageFeedback(feedback_by_qa_result)
    
        // Compute the overall average, excluding empty feedback categories
       const getOverallAverageFeedback = () => {
          const scores = [];

          if (averageAgentFeedback !== null) scores.push(parseFloat(averageAgentFeedback));
          if (averageManagerFeedback !== null) scores.push(parseFloat(averageManagerFeedback));
          if (averageLmsFeedback !== null) scores.push(parseFloat(averageLmsFeedback));
          if (averageFeedbackByQa !== null) scores.push(parseFloat(averageFeedbackByQa));
        
          if (scores.length === 0) return null; // Return null if there's no valid data

          return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2);
      };


    overallAverageFeedback = getOverallAverageFeedback()

      
  }else{
    overallAverageFeedback = feedback[0].feedback
  }
   

      
   agent['feedback_score'] = overallAverageFeedback

   //get agent new deposit for the given and treat this as additional point
   
   const [newDeposit] = await pool.execute(
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

   const [ratings] = await pool.execute(
     'SELECT ratings_name FROM result_ratings WHERE ? BETWEEN min_value AND max_value',[agent['final_ratings']]
   )

   agent['ratings_name'] = ratings[0].ratings_name

 }

  //  connection.release()
  
   sales_agents.sort((a, b) => b.final_ratings - a.final_ratings)

  return sales_agents

   
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



exports.fetchAgentLeaderBoard = async (req, res, next) => {
    //check if there is a month and year in the query string
    // if there is no query string set month to the latest month
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
            // Get the month name
    const monthNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
    ];

    let givenMonth
    let givenYear 
    let withTrucks
    let fullyear = req.query.fullyear
    let agentId 

    if(!req.query.agent_id){
      agentId = ""
    }else {
      agentId = req.query.agent_id
    }
    const currentDate = new Date()
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

    if(!req.query.withTrucks || req.query.withTrucks === ""){
      withTrucks = true      
    }else{
      withTrucks = req.query.withTrucks
    }

 

    try {
    //fetch all agent available and save it to sales_agent array
    // const connection =  await pool.getConnection()
    let agentMetircs
    if(fullyear == 'true'){
      
      const queries = monthNames.map(month => 
        this.getAgentsMetrics(agentId, month, givenYear, withTrucks).then(data => {
            if (data) {
                return data[0]
            }
            return null; // Skip null values
        })
    );
    
    const results = await Promise.all(queries);
    const agentMetircsFullYear= results.filter(item => item !== undefined); // Remove null values


 function calculateAverages(dataArray) {
      const keysToAverage = [
          "absence_score", 
          "feedback_score",
          "memo_score",
          "tardiness_score", 
          "deposit_score",
          "shipok_score",
          "absence_rating",
          "memo_rating", 
          "tardiness_rating", 
          "feedback_rating",
          "performance_rating",
          "final_ratings",
          "shipok_percent",
          "additional_points",
      ];
  
      const keysToSum = ["target", "shipok"];
  
      if (dataArray.length === 0) return {}; // Return empty if no data
  
      const sum = dataArray.reduce((acc, obj) => {
          keysToAverage.forEach(key => {
              acc[key] = (acc[key] || 0) + parseFloat(obj[key] || 0);
          });
          keysToSum.forEach(key => {
              acc[key] = (acc[key] || 0) + parseFloat(obj[key] || 0);
          });
          return acc;
      }, {});
  
      const count = dataArray.length;
  
      const result = {};
  
      // Calculate averages for the specified keys
      keysToAverage.forEach(key => {
          result[key] = Math.round((sum[key] / count) * 100) / 100; // Round to 2 decimal places
      });
  
      // Store sums for "target" and "shipok"
      keysToSum.forEach(key => {
          result[key] = sum[key]; // Keep as total sum
      });
   

   
      
      return result;
  }


  

   const data = {
    'agentMetircsFullYear': agentMetircsFullYear,
    'yearAverage': calculateAverages(agentMetircsFullYear)
   }

   const [year_ratings] = await pool.execute(
    'SELECT ratings_name FROM result_ratings WHERE ? BETWEEN min_value AND max_value',[data['yearAverage']['final_ratings']]
  )

  data['yearAverage']['ratings_name'] = year_ratings[0].ratings_name
  data['yearAverage']['db_name'] =  agentMetircsFullYear[0].db_name
  data['yearAverage']['image_link'] = agentMetircsFullYear[0].image_link
  data['yearAverage']['year'] = agentMetircsFullYear[0].year


    res.status(200).json(data)
    
    }else{
      agentMetircs = await this.getAgentsMetrics( agentId, givenMonth, givenYear, withTrucks)
      console.log(agentMetircs)
      res.status(200).json(agentMetircs)
    }
      
    // connection.release()
    
   
    
    }
    catch(error){
        console.error('Error, Cannot Fetch Agent sales_leaderboard', error)
        res.status(500).json({error: 'Error, Cannot Fetch Agent sales_leaderboard'})

   }
  //  finally {
  //    connection.release()
  //  }

}



