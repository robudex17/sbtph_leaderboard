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
        COALESCE(fbq.feedback_score, 0) AS feedback_qa,
        market.market_name
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
    LEFT JOIN market
        ON sa.market_id = market.id
    WHERE sa.status = 'active'
    GROUP BY sa.id, fba.feedback, fbq.feedback_score;

      `, [givenMonth,givenYear,givenMonth,givenYear,givenMonth,givenYear,
          givenMonth,givenYear,givenMonth,givenYear,givenMonth,givenYear,
          givenMonth,givenYear,givenMonth,givenYear,givenMonth,givenYear,

        ]
  )

  sales_agents = sales_agents_result

   sales_agents.sort((a, b) => b.agent_type - a.agent_type)

      // Step 1: calculate totals for non-type-2 agents
      const totalTarget = sales_agents
        .filter(agent => agent.agent_type !== 2)
        .reduce((sum, agent) => sum + (Number(agent.target) || 0), 0)

      const totalShipOk = sales_agents
        .filter(agent => agent.agent_type !== 2)
        .reduce((sum, agent) => sum + (Number(agent.ship_ok) || 0), 0)

      // Step 2: update type-2 agents
      sales_agents.forEach(agent => {
        if (agent.agent_type === 2) {
          agent.target = totalTarget
          agent.ship_ok = totalShipOk
        }
      })

  //return sales_agents 

  //attempting to add the feedback of each agents 

// helper to run query safely
async function runQuery(query, params, errorMsg) {
  try {
    const [result] = await pool.execute(query, params);
    return result;
  } catch (error) {
    console.error(errorMsg, error);
    return [];
  }
}

for (const agent of sales_agents) {
  const managerId = agent.manager_id; // ✅ avoid extra query

  if (agent.agent_type === 0) {
    agent.feedback_by_um = null;
    agent.feedback_by_agents = null;

     agent.ave_feedback_by_um = null;
     agent.ave_feedback_by_agents = null;

    const query = `
      SELECT 
          sa.id AS who_give_feedback_id,
          sa.firstname,
          sa.lastname,
          sa.image_link,
          sa.db_name AS who_give_feedback_name,
          sa.manager_id,
          COALESCE(fbalm.feedback_score, 0) AS feedback_score,
          COALESCE(fbalm.responses, "{}") AS responses,
          COALESCE(fbalm.month, ?) AS month,
          COALESCE(fbalm.year, ?)  AS year,
          fbalm.agent_id AS who_receive_feedback_id,
          fbalm.agent_dbname,
          fbalm.can_update
      FROM sales_agents sa
      LEFT JOIN feedback_agents_by_lm fbalm
        ON sa.id = fbalm.lm_id
       AND fbalm.month = ?
       AND fbalm.year = ?
       AND fbalm.agent_id = ?
      WHERE sa.id = ? 
      AND sa.status = 'active'
      ORDER BY fbalm.year, fbalm.month
    `;

    agent.feedback_by_lm = await runQuery(
      query,
      [givenMonth, givenYear, givenMonth, givenYear, agent.id, managerId],
      "Error, Cannot Fetch Feedback by LM"
    );




  } else if (agent.agent_type === 1) {
    agent.feedback_by_lm = null;

    const query_by_agents = `
      SELECT 
          sa.id AS who_give_feedback_id,
          sa.firstname,
          sa.lastname,
          sa.image_link,
          sa.db_name AS who_give_feedback_name,
          sa.manager_id AS lm_id,
          COALESCE(fba.feedback_score, 0) AS feedback_score,
          COALESCE(fba.responses, "{}") AS responses,
          COALESCE(fba.month, ?)  AS month,
          COALESCE(fba.year,  ?)  AS year,
          fba.percentage,
          fba.total_score,
          fba.lm_id AS who_receive_feedback_id,
          fba.can_update
      FROM sales_agents sa
      LEFT JOIN feedback_lm_by_agents fba 
        ON sa.id = fba.agent_id
       AND sa.manager_id = fba.lm_id
       AND fba.month = ?
       AND fba.year = ?
      WHERE sa.manager_id = ? 
        AND sa.status = 'active'
      ORDER BY fba.year, fba.month
    `;

    const query_by_um = `
      SELECT 
          sa.id AS who_give_feedback_id,
          sa.firstname,
          sa.lastname,
          sa.image_link,
          sa.db_name AS who_give_feedback_name,
          sa.manager_id,
          COALESCE(fblmum.feedback_score, 0) AS feedback_score,
          COALESCE(fblmum.responses, "{}") AS responses,
          COALESCE(fblmum.month, ?)  AS month,
          COALESCE(fblmum.year, ?)  AS year,
          fblmum.total_score,
          fblmum.percentage,
          fblmum.lm_id AS who_receive_feedback_id,
          fblmum.lm_dbname,
          fblmum.can_update
      FROM sales_agents sa
      LEFT JOIN feedback_lm_by_um fblmum
        ON sa.id = fblmum.manager_id
       AND fblmum.month = ?
       AND fblmum.year = ?
       AND fblmum.lm_id = ?
      WHERE sa.id = ? 
        AND sa.status = 'active'
      ORDER BY fblmum.year, fblmum.month
    `;

    // ✅ run both queries in parallel
    const [result_by_agents, result_by_um] = await Promise.all([
      runQuery(query_by_agents, [givenMonth, givenYear, givenMonth, givenYear, agent.id], "Error feedback by agents"),
      runQuery(query_by_um, [givenMonth, givenYear, givenMonth, givenYear, agent.id, managerId], "Error feedback by um")
    ]);

    agent.feedback_by_agents = result_by_agents;
    agent.feedback_by_um = result_by_um;



  } else if (agent.agent_type === 2) {
    agent.feedback_by_agents = null;
    agent.feedback_by_um = null;

    const query_by_lm = `
      SELECT 
          sa.id AS who_give_feedback_id,
          sa.firstname,
          sa.lastname,
          sa.image_link,
          sa.db_name as who_give_feedback_name,
          sa.manager_id as um_id,
          COALESCE(fbumlm.feedback_score, 0) AS feedback_score,
          COALESCE(fbumlm.responses, '{}') AS responses,
          COALESCE(fbumlm.month, ?)  AS month,
          COALESCE(fbumlm.year, ?)  AS year,
          fbumlm.total_score,
          fbumlm.percentage,
          fbumlm.um_id AS who_receive_feedback_id,
          fbumlm.can_update
      FROM sales_agents sa
      LEFT JOIN feedback_um_by_lm fbumlm
        ON sa.id = fbumlm.lm_id
       AND sa.manager_id = fbumlm.um_id
       AND fbumlm.month = ?
       AND fbumlm.year = ?
      WHERE sa.manager_id = ? 
        AND sa.id != 2394 
        AND sa.status = 'active'
      ORDER BY fbumlm.year, fbumlm.month
    `;

    agent.feedback_by_lm = await runQuery(
      query_by_lm,
      [givenMonth, givenYear, givenMonth, givenYear, agent.id],
      "Error, Cannot Fetch Feedback by LM"
    );
  }

        // --- compute averages with 4 decimals ---
  const computeAverage = (feedbackList) => {
    if (!feedbackList || feedbackList.length === 0) return null
    const total = feedbackList.reduce((sum, fb) => sum + (Number(fb.feedback_score) || 0), 0)
    const avg = total / feedbackList.length
    return avg.toFixed(4)   // number with 4 decimal places
  }

  agent.ave_feedback_by_agents = computeAverage(agent.feedback_by_agents)
  agent.ave_feedback_by_um = computeAverage(agent.feedback_by_um)
  agent.ave_feedback_by_lm = computeAverage(agent.feedback_by_lm)


    let feedbackArrays = []

    if (agent.agent_type === 0) {
      feedbackArrays = [agent.feedback_by_lm]
    } else if (agent.agent_type === 1) {
      feedbackArrays = [agent.feedback_by_agents, agent.feedback_by_um]
    } else if (agent.agent_type === 2) {
      feedbackArrays = [agent.feedback_by_lm]
    }

    // Filter only valid arrays with objects having feedback_score
    const validFeedbacks = feedbackArrays.filter(
      fb => Array.isArray(fb) && fb.some(item => item && 'feedback_score' in item)
    )

    let isReady = false

    if (validFeedbacks.length > 0) {
      const combined = validFeedbacks.flat()

      // Check if all feedback_score > 0
      isReady = combined.every(
        fb => fb && 'feedback_score' in fb && Number(fb.feedback_score) > 0
      )
    }

    // Enforce feedback_qa > 0
    if (Number(agent.feedback_qa) <= 0) {
      isReady = false
    }

    // Final override: if feedback_admin > 0 → ready_to_submit = true
    if (Number(agent.feedback_admin) > 0) {
      isReady = true
    }

    agent.ready_to_submit = isReady
}

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

exports.addSalesEvaluationData= async (req, res, next) => {

  const agent_id  = req.params.agent_id 

  if (agent_id === 'all') {
     // delete all records first base on month and year
     // then insert new records
      const payload = req.body; // array of agents
      
      if (!Array.isArray(payload) || payload.length === 0) {
        return res.status(400).json({ error: "Invalid payload" });
      }

        // Get month and year from the first item
       const { month, year } = payload[0];
      try {
          // 1. Delete existing rows for that month & year
          await pool.query(
            `DELETE FROM sales_evaluation_status WHERE month = ? AND year = ?`,
            [month, year]
          );

          // 2. Prepare new values for bulk insert
          const values = payload.map(agent => [
            agent.agent_id,
            agent.agent_dbname,
            agent.month,
            agent.year,
            agent.date,
            agent.submitted
          ]);

          // 3. Insert all in one query
          const [result] = await pool.query(
            `INSERT INTO sales_evaluation_status 
              (agent_id, agent_dbname, month, year, date, submitted) 
            VALUES ?`,
            [values]
          );

          res.json({
            success: true,
            deletedOld: true,
            inserted: result.affectedRows
          });
        } catch (error) {
          console.error("Error in submit-all:", error);
          res.status(500).json({ error: "Database operation failed" });
        }

  }else{
    // insert new record base on month and year
    const {agent_dbname, month, year, date, submitted } = req.body

    try {
      const [result] = await pool.execute(
        `INSERT INTO sales_evaluation_status (agent_id, agent_dbname, month, year, date, submitted)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE submitted = VALUES(submitted)`,
        [agent_id, agent_dbname, month, year, date, submitted]
      );
              res.status(201).json({
            message: `Evaluation for agent_id: ${agent_id} are created or recorded`
        });
    } catch (error) {
      console.error('Error inserting sales evaluation data:', error);
      res.status(500).json({ error: 'Error inserting sales evaluation data' });
    }
  }
}


exports.deleteSalesEvaluationData = async (req, res, next) => {
    
   const agent_id  = req.params.agent_id 
   const { month, year } = req.body

   console.log(req.body)

    try {
        const query = "DELETE FROM sales_evaluation_status WHERE agent_id=? AND month=? AND year=? "
        const [result] = await pool.execute(query, [agent_id, month, year])

        if (result.affectedRows === 0){
            return res.status(400).json({message: 'Agent Target Not found'})
        }

        res.status(200).send({ message: `Sales Evaluation Data for ${agent_id} is marked for review` });
    }
    catch(error) {
        console.error('Error marked for review:', error)
        res.status(500).json({error: 'Database Error, Cannot marked for review'})
    }
}



