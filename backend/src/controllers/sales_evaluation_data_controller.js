const { agent } = require('supertest');
const  pool = require('../config/db')

const { validationResult } = require('express-validator')

exports.getEvaluationSalesData = async ( givenMonth,givenYear) => {

 

  
  const [sales_agents_result] = await pool.execute(
    

    `
      SELECT 
        sa.*,
        COALESCE(ses.month, ?) AS month,
        COALESCE(ses.year, ?) AS year,
        COALESCE(ses.submitted, 0) AS submitted,
        COALESCE(ts.target, 0) AS target,
        COALESCE(ts.ship_ok, 0) AS ship_ok,
        COALESCE(COUNT(DISTINCT nd.id), 0) AS total_new_deposit,
        COALESCE(COUNT(DISTINCT ab.id), 0) AS total_absences,
        COALESCE(COUNT(DISTINCT td.id), 0) AS total_tardiness,
        COALESCE(COUNT(DISTINCT mm.id), 0) AS total_memo,
        COALESCE(fba.feedback, 0) AS feedback_admin,
        COALESCE(fbq.feedback_score, 0) AS feedback_qa
    FROM sales_agents sa
    LEFT JOIN sales_evaluation_status ses
        ON sa.id = ses.agent_id
      AND ses.month = ?
      AND ses.year = ?
    LEFT JOIN target_shipok ts
        ON sa.id = ts.agent_id
      AND ts.month = ?
      AND ts.year = ?
    LEFT JOIN new_deposit nd
        ON sa.id = nd.agent_id
      AND nd.month = ?
      AND nd.year = ?
    LEFT JOIN absences ab
        ON sa.id = ab.agent_id
      AND ab.month =  ?
      AND ab.year = ?
    LEFT JOIN tardiness td
        ON sa.id = td.agent_id
      AND td.month = ?
      AND td.year = ?
    LEFT JOIN memo mm
        ON sa.id = mm.agent_id
      AND mm.month = ?
      AND mm.year = ?
    LEFT JOIN feedback fba
        ON sa.id = fba.agent_id
      AND fba.month = ?
      AND fba.year = ?
    LEFT JOIN feedback_by_qa fbq
        ON sa.id = fba.agent_id
      AND fbq.month = ?
      AND fbq.year = ?  
    WHERE sa.status = 'active'
    GROUP BY sa.id, fba.feedback, fbq.feedback_score;

      `, [givenMonth,givenYear,givenMonth,givenYear,givenMonth,givenYear,
          givenMonth,givenYear,givenMonth,givenYear,givenMonth,givenYear,
          givenMonth,givenYear,givenMonth,givenYear,givenMonth,givenYear,

        ]
  )

  sales_agents = sales_agents_result


//    for (const agent of sales_agents){
      
//      //add given month and year
//      agent['month'] = givenMonth
//      agent['year'] = givenYear


//       /*fetch target and shipok of each agent for the given month and year and get the percentage 
//            with  performance_percent = shipok/target * 100
//       */
//       let targetShipok
    
//       if (leaderboardOption == 'lm'){
         
//           const [lmTargetShipOk] = await pool.execute( targetShipokQueryForLM, [agent.team_id, givenMonth, givenYear])
//           targetShipok = lmTargetShipOk
          
          
//       }else if(leaderboardOption == 'team') {
//         if(agent.agent_type == 1){
//            const [lmTargetShipOk] = await pool.execute( targetShipokQueryForLM, [agent.team_id, givenMonth, givenYear])
//           targetShipok = lmTargetShipOk
         
//         }else if(agent.agent_type == 0){
//            const [agentTargetShipOk] = await pool.execute(
//            targetShipokQueryForAgent,[agent.id, givenMonth, givenYear]

//          )
//          targetShipok = agentTargetShipOk
       
//         }
//       }
//       else if(leaderboardOption == 'agent'){
        
//           const [agentTargetShipOk] = await pool.execute(
//            targetShipokQueryForAgent,[agent.id, givenMonth, givenYear]

//          )
//          targetShipok = agentTargetShipOk
        
         
//       }else {
       
//         if(agent.agent_type == 1){
//           const [lmTargetShipOk] = await pool.execute( targetShipokQueryForLM, [agent.team_id, givenMonth, givenYear])
//           targetShipok = lmTargetShipOk
//         }else {
         
//           const [agentTargetShipOk] = await pool.execute(
//            targetShipokQueryForAgent,[agent.id, givenMonth, givenYear]

//          )
//          targetShipok = agentTargetShipOk
//         }
//       }
      
     

//       if(targetShipok.length > 0 && targetShipok[0].target != null && targetShipok[0].ship_ok != null ) {

//        const target = Number(targetShipok[0].target)
//        const shipok = Number(targetShipok[0].ship_ok)
//        const percentShipOk = Math.round(Number(shipok)/Number(target) * 100)
       
//        //get the agent score performance
//        const [scoreShipOk] = await pool.execute(
//          'SELECT score FROM `performance_score`WHERE ? BETWEEN `min_value` AND `max_value`', [percentShipOk]
//        ) 

//        agent['target'] = target
//        agent['shipok'] = shipok
//        agent['shipok_percent'] = percentShipOk
//        agent['shipok_score'] = scoreShipOk[0].score
//      }else{
//        agent['target'] = 0
//        agent['shipok'] = 0
//        agent['shipok_percent'] = 0
//        agent['shipok_score'] = 0
//      }

    
//      if(agent.submitted == 0){
//        agent['absences'] = 0
//        agent['absence_score'] = 0
//        agent['tardiness'] = 0 
//        agent['tardiness_score'] = 0
//        agent['memo'] = 0
//        agent['memo_score'] = 0
//       agent['feedback_score'] = 0
//      }else{
//                     //get agent total absences for the given month and year
//               const [absences] = await pool.execute(
//                 'SELECT Count(*) as absences FROM absences WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
//               )  
//               let agentAbsenceScore;
//               if (absences[0].absences === 0){
//                   agentAbsenceScore = 5
//               }else {
                
//                 const [absenceScore] = await pool.execute(
//                   'SELECT score FROM absences_score WHERE absence_count=?', [absences[0].absences]
//                 )
//                 if (absenceScore.length == 0){
//                     agentAbsenceScore = 0
//                 }else{
//                   agentAbsenceScore = absenceScore[0].score
//                 }

              
//               }
//               agent['absences'] = absences[0].absences
//               agent['absence_score'] = agentAbsenceScore
          
      

//           //get total agent tardiness for the given month and year and corresding score
          
//           const [tardiness] = await pool.execute(
//             'SELECT Count(*) as tardiness FROM tardiness WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
//           )

              
//           let agentTardinessScore
//           if (tardiness[0].tardiness === 0){
//               agentTardinessScore = 5
//           }else {
            
//             const [tardinessScore] = await pool.execute(
//               'SELECT score FROM tardiness_score WHERE tardiness_count=?', [tardiness[0].tardiness]
//             )
//             if (tardinessScore.length == 0){
//                 agentTardinessScore = 0
//             }else{
//               agentTardinessScore = tardinessScore[0].score
//             }

            
//           }
//           agent['tardiness'] = tardiness[0].tardiness
//           agent['tardiness_score'] = agentTardinessScore
          
          
//         //get agent total memo for the given month and year and corressponding memo score

//         const [memo] = await pool.execute(
//           'SELECT Count(*) as memo FROM memo WHERE agent_id=? and month=? and year=?', [agent.id, givenMonth, givenYear]
//         )

        
//         let agentMemoScore
//         if (memo[0].memo === 0){
//             agentMemoScore = 5
//         }else {
          
//           const [memoScore] = await pool.execute(
//             'SELECT score FROM memorandum_score WHERE memo_count=?', [memo[0].memo]
//           )
//           if (memoScore.length == 0){
//               agentMemoScore= 0
//           }else{
//             agentMemoScore = memoScore[0].score
//           }

          
//         }

//         agent['memo'] = memo[0].memo
//         agent['memo_score'] = agentMemoScore



        
//         const [feedback] = await pool.execute(
//           'SELECT feedback FROM feedback WHERE agent_id=? AND month=? AND year=?', [agent.id, givenMonth, givenYear]
//         )
//         let overallAverageFeedback
//         if (feedback.length == 0) {
//               let averageAgentFeedbackByLm = null
//               let averageLmFeedbackByAgent = null
//               let averageLmFeedbackByUm = null
//               let averageUmFeedbackByLm = null
//               let averageFeedbackByQa = null

//               const getAverageFeedback = (feedback_result) => {
//                 if (!Array.isArray(feedback_result) || feedback_result.length === 0) return null;
//                 const total = feedback_result.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
//                 return (total / feedback_result.length).toFixed(4);
//               }
//               // for saleas agent
//               if (agent.agent_type == 0){
      
//                   const [agents_feedback_result] = await pool.execute(
//                   'SELECT * FROM  `feedback_agents_by_lm` WHERE agent_id=?  AND month=? AND year=?',[agent.id,givenMonth,givenYear]  
//                 )
//                 averageAgentFeedbackByLm  = getAverageFeedback(agents_feedback_result)
//               }
//             // for local manager
//             if(agent.agent_type == 1){
//                 const [lm_feedback_by_agent_result] = await pool.execute(
//                   'SELECT * FROM  `feedback_lm_by_agents` WHERE lm_id=? AND month=? AND year=?',[agent.id,givenMonth,givenYear]  
//                 ) 
              
//                 const [lm_feedback_by_um_result] = await pool.execute(
//                   'SELECT * FROM  `feedback_lm_by_um` WHERE lm_id=?  AND month=? AND year=?',[agent.id,givenMonth,givenYear]  
//               )
//               averageLmFeedbackByAgent = getAverageFeedback(lm_feedback_by_agent_result)
//               averageLmFeedbackByUm = getAverageFeedback(lm_feedback_by_um_result)
//             }
//             // for senior manager.
//             if (agent.agent_type == 2){
//                 const [managers_feedback_result] = await pool.execute(
//                   'SELECT * FROM  `feedback_um_by_lm` WHERE manager_id=?  AND month=? AND year=?',[ agent.id,givenMonth,givenYear]  
//                 )
//                 averageUmFeedbackByLm = getAverageFeedback(managers_feedback_result)
//             }

//             const [feedback_by_qa_result] = await pool.execute(
//               'SELECT * FROM  `feedback_by_qa` WHERE agent_id=? AND month=? AND year=?',[agent.id,givenMonth,givenYear]  
//             )

        
//             averageFeedbackByQa = getAverageFeedback(feedback_by_qa_result)
          
//               // Compute the overall average, excluding empty feedback categories
//             const getOverallAverageFeedback = () => {
//                 const scores = [];

//                 if (averageAgentFeedbackByLm !== null) scores.push(parseFloat(averageAgentFeedbackByLm));
//                 if (averageLmFeedbackByAgent !== null) scores.push(parseFloat(averageLmFeedbackByAgent));
//                 if (averageLmFeedbackByUm !== null) scores.push(parseFloat(averageLmFeedbackByUm));
//                 if (averageUmFeedbackByLm !== null) scores.push(parseFloat(averageUmFeedbackByLm));
//                 if (averageFeedbackByQa !== null) scores.push(parseFloat(averageFeedbackByQa));
              
//                 if (scores.length === 0) return null; // Return null if there's no valid data

//                 return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(4);
//             };


//           overallAverageFeedback = getOverallAverageFeedback()

            
//         }else{
//           overallAverageFeedback = feedback[0].feedback
//         }
        

            
//         agent['feedback_score'] =   Number(overallAverageFeedback).toFixed(4)

//    }

//    //get agent new deposit for the given and treat this as additional point
   
//    const [newDeposit] = await pool.execute(
//      'SELECT Count(*) AS deposit FROM new_deposit WHERE agent_id=? AND month=? AND year=?',[agent.id, givenMonth,givenYear]
//    )
//    let agentNewDepositScore
//    if (newDeposit.length == 0){
//      agentNewDepositScore = 0
//    }else {
//      agentNewDepositScore = newDeposit[0].deposit
//    }
   
//    agent['deposit_score'] = agentNewDepositScore

//    //calculate score ratings

 
//   //  agent['performance_rating'] = Math.round(( agent['shipok_score'] * evaluation_criteria.performance) * 100) /100
//   //  agent['absence_rating'] = Math.round((agent['absence_score'] * evaluation_criteria.absence) * 100) / 100 
//   //  agent['tardiness_rating'] = Math.round((agent['tardiness_score'] * evaluation_criteria.tardiness) * 100)/100 
//   //  agent['memo_rating'] = Math.round((agent['memo_score']  * evaluation_criteria.memorandum_recieved) * 100 ) /100
//   //  agent['feedback_rating'] = Math.round((agent['feedback_score'] * evaluation_criteria.feedback) * 100) /100 
//   //  agent['additional_points'] = Math.round((agent['deposit_score'] * evaluation_criteria.additional_points) * 100 ) /100

  


//   agent['performance_rating'] = parseFloat(( agent['shipok_score'] * evaluation_criteria.performance).toFixed(4))
//    agent['absence_rating'] = parseFloat((agent['absence_score'] * evaluation_criteria.absence).toFixed(4))
//   agent['tardiness_rating'] = parseFloat((agent['tardiness_score'] * evaluation_criteria.tardiness).toFixed(4))
//   agent['memo_rating'] =   parseFloat((agent['memo_score']  * evaluation_criteria.memorandum_recieved).toFixed(4)) 
//    agent['feedback_rating'] =  parseFloat((agent['feedback_score'] * evaluation_criteria.feedback).toFixed(4)) 
//    agent['additional_points'] = parseFloat((agent['deposit_score'] * evaluation_criteria.additional_points).toFixed(4))

 


//     //  agent['final_ratings'] = Math.round((agent['performance_rating'] + agent['absence_rating'] + agent['tardiness_rating'] +
//     //                        agent['memo_rating'] + agent['feedback_rating'] + agent['additional_points']
//     //                        ) * 1000) / 1000

   

    

//   agent['final_ratings'] = (
//   agent['performance_rating'] +
//   agent['absence_rating'] +
//   agent['tardiness_rating'] +
//   agent['memo_rating'] +
//   agent['feedback_rating'] +
//   agent['additional_points']
// ).toFixed(4);



//    // Get the result name base on the final_ratings

//    const [ratings] = await pool.execute(
//      'SELECT ratings_name FROM result_ratings WHERE ? BETWEEN min_value AND max_value',[agent['final_ratings']]
//    )

//   //  console.log( ratings[0].ratings_name || false)

//    agent['ratings_name'] = ratings[0].ratings_name 

  
  
//  }

  //  connection.release()
  
  //  sales_agents.sort((a, b) => b.final_ratings - a.final_ratings)

  return sales_agents

  
}



exports.fetchSalesEvaluationData= async (req, res, next) => {
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
   
   
    

    const currentDate = new Date()
    if (!req.query.month ||  req.query.month ==="") {
        
        givenMonth =  monthNames[currentDate.getMonth()]; // getMonth() returns 0-based index
    }else {
        givenMonth = req.query.month
    }
    
    if(!req.query.year || req.query.year ===""){
        givenYear =  currentDate.getFullYear()
    }else {
        givenYear = req.query.year
    }

    
 

    try {

    const result =   await this.getEvaluationSalesData(givenMonth, givenYear)


    console.log(result)
    res.status(200).json(result)
    
  
    }
    catch(error){
        console.error('Error, Cannot Fetch Sales Evaluation', error)
        res.status(500).json({error: 'Error, Cannot Fetch Agent sales_leaderboard'})

   }
  //  finally {
  //    connection.release()
  //  }

}



