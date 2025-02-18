const pool =  require('../config/db')
const { validationResult } = require('express-validator')

exports.fetchAgentMarket = async (req, res, next) => {


    // const connection =  await pool.getConnection()

    const [result] = await pool.execute(
        'SELECT id,market_name FROM `market`'  
    )
    // connection.release()
    res.json(result)
}

exports.fetchAgentMarketTargetShipok = async (req, res, next)  => {
   
      
   const errors = validationResult(req)
   
     if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
    }else{
         console.log('All input is valid..')
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
    

     const query  =  `
     SELECT 
    market.id AS market_id,
    market.market_name, 
    COALESCE(ts.year, ?) AS year, 
    COALESCE(ts.month, ?) AS month, 
    COALESCE(SUM(ts.target), 0) AS total_target, 
    COALESCE(SUM(ts.ship_ok), 0) AS total_ship_ok,
    COALESCE(SUM(ts.target), 0) - COALESCE(SUM(ts.ship_ok), 0) AS shortage,
    COALESCE(ROUND((SUM(ts.ship_ok) / NULLIF(SUM(ts.target), 0)) * 100, 0), 0) AS achievement
FROM market
LEFT JOIN target_shipok ts ON market.id = ts.market_id 
    AND ts.year = ?
    AND ts.month = ?
WHERE market.market_name <> 'all_market'
GROUP BY market.id, market.market_name, ts.year, ts.month;


     `

     try {
        
        const [result]  = await pool.execute(query, [givenYear, givenMonth, givenYear, givenMonth])

        res.json(result)
        
    }catch(error){
        console.error(`Cannot fetch target shipok per market`, error)
        res.status(500).json({message: 'Cannot fetch target shipok per market'})
    }  

     
}

exports.fetchAgentMarketNewDeposit = async (req, res, next)  => {
    const errors = validationResult(req)
   
    if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
   }else{
        console.log('All input is valid..')
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
    

     const query  =  `
       SELECT 
        market.id as market_id,  
        market.market_name, 
        IFNULL(nd.year, ?) AS year, 
        IFNULL(nd.month, ?) AS month, 
        IFNULL(nd.new_deposit, 0) AS new_deposit
    FROM market 
    LEFT JOIN (
        SELECT market_id, year, month, COUNT(*) AS new_deposit 
        FROM new_deposit 
        WHERE month = ? AND year = ?  -- Filtering inside subquery
        GROUP BY market_id, year, month
    ) nd ON market.id = nd.market_id
    WHERE market.market_name <> 'all_market';

     `

     try {
        
        const [result]  = await pool.execute(query, [ givenYear, givenMonth,givenMonth, givenYear])

        res.json(result)
        
    }catch(error){
        console.error(`Cannot fetch new deposit per market`, error)
        res.status(500).json({message: 'Cannot fetch new deposit per market'})
    }  

     
}







