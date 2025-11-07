const pool = require('../config/db')
const { validationResult} = require('express-validator')

const sqlQueries = require('../sql/sql')


   // Map month names to numbers
    const monthMap = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12"
    };


  // Get the month name
    const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
  


exports.fetchCustomSearch = async (req,res, next ) => {

   const startDate = req.query.start_date 
   const endDate = req.query.end_date 
   const current = new Date()

   const filterBy = req.query.filterBy 
   const filterId = req.query.filterId == 'all' ? "" : req.query.filterId

   

  

   //validation 
   if(!startDate || !endDate){
    return res.status(400).json({error: "start_date and end_date are required in YYYY-MM format." })
   }



    const start = new Date(`${startDate}-01`);
    const end = new Date(`${endDate}-01`);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM." });
    }

    if (start > end) {
      console.log('start_date cannot be after end_date.')
      return res.status(400).json({ error: "start_date cannot be after end_date." });
    }

      // 2️⃣ End month should not exceed the current month
    //    (Optional — remove if you allow future months)
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of current month
    console.log(current.getMonth())
   if (end > currentMonth) {
        console.log("Range cannot go beyond the current month.")
        return { valid: false, message: "Range cannot go beyond the current month." };
    }

    // ✅ Generate all months between start and end
    const getMonthsInRange = (start, end) => {
    const months = [];
    const cursor = new Date(start);
    while (cursor <= end) {
        const year = cursor.getFullYear();
        const month = String(cursor.getMonth() + 1).padStart(2, '0');
        months.push(`${year}-${month}`);
        cursor.setMonth(cursor.getMonth() + 1);
    }
    return months;
    };

    const monthRange = getMonthsInRange(start, end);

    console.log('Month range:', monthRange);

    let customSearchQuery = sqlQueries.dashboarddMasterQuery

    const fetchIndividualTargetShipok = async(agent_id,query, month, year) => {
        const monthNumber = monthMap[month];
        const snapshot = `${year}-${monthNumber.toString().padStart(2, '0')}`;  
        let individualTargets
        
        if(agent_id != ""){
            const [result] = await pool.execute(
                query,
                 [ month, year,snapshot, snapshot, snapshot, snapshot, snapshot, snapshot, month, year, agent_id]
              )   
                individualTargets  = result              
        }else{
            const [result] = await pool.execute(
                    query,
                    [ month, year,snapshot, snapshot, snapshot, snapshot, snapshot, snapshot, month, year]
                )

                const arranged = [
                ...result.filter(a => a.market_name.toLowerCase() !== 'trucks'),
                ...result.filter(a => a.market_name.toLowerCase() === 'trucks')
                ]

              individualTargets  = arranged
        }

        return individualTargets


   }

   const monthsToProcess = getMonthsInRange(start, end)
   let searchResult = []
   
   if((filterBy == 'agent' || filterBy == 'lms' || filterBy == 'all') && filterId != ""){
        console.log('agent and lm must go here')
        customSearchQuery = `${customSearchQuery} AND sa.id =?`
   }else if(filterBy == 'team' && filterId != ""){
      customSearchQuery = `${customSearchQuery} AND t.id =?`
   }

   else if(filterBy == 'market' && filterId != ""){
      customSearchQuery = `${customSearchQuery} AND m.id =?`
   }
   
   else if (filterBy == 'agent'){
     customSearchQuery = `${customSearchQuery} AND aa.agent_type = 0`
   }else if(filterBy == 'lms'){
         customSearchQuery = `${customSearchQuery} AND   r.role_name = 'Local Manager'`
   }


   const monthQueries = monthsToProcess.map(snapshot => {
         const [year, month] = snapshot.split("-");
        
         return fetchIndividualTargetShipok(filterId, `${customSearchQuery} ORDER BY t.id ASC;` , monthNames[month - 1], year);
        //  return fetchIndividualTargetShipok(agent_id, `${customSearchQuery} AND sa.id=?` , monthNames[month - 1], year);
    });
    const monthResults = await Promise.all(monthQueries);

                // Flatten results
     monthResults.forEach(result =>  searchResult.push(...result))  
     
     
    console.log(searchResult)
    
     return res.status(200).json(searchResult);


}