const data = [
  {"agent_id":2394,"db_name":"Rustan","market_id":9,"market_name":"philippines","year":2023,"month":"April","total_target":"319","total_shipok":"247","total_new_deposit":"0","total_absences":"0","total_memo_count":"0","total_tardiness_count":"0"},
  {"agent_id":2470,"db_name":"Sally","market_id":1,"market_name":"oceana","year":2023,"month":"April","total_target":"43","total_shipok":"39","total_new_deposit":"1","total_absences":"0","total_memo_count":"0","total_tardiness_count":"0"},
  {"agent_id":2472,"db_name":"Bry","market_id":5,"market_name":"jamaica","year":2023,"month":"April","total_target":"58","total_shipok":"34","total_new_deposit":"1","total_absences":"0","total_memo_count":"1","total_tardiness_count":"0"},
  
  {"agent_id":2846,"db_name":"Don","market_id":6,"market_name":"bahamas","year":2023,"month":"April","total_target":"42","total_shipok":"35","total_new_deposit":"0","total_absences":"0","total_memo_count":"0","total_tardiness_count":"0"}

]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


const transformData = []

 data.map(agentdata => {
    const findAgent = transformData.find(agent => agent.agent_id == agentdata.agent_id)
    if (!findAgent){
        const insertNewAgent = {
        agent_id: agentdata.agent_id,
        db_name: agentdata.db_name,
        ship_ok: [0,0,0,0,0,0,0,0,0,0,0,0],
        target: [0,0,0,0,0,0,0,0,0,0,0,0],
        new_deposit: [0,0,0,0,0,0,0,0,0,0,0,0],
        absences: [0,0,0,0,0,0,0,0,0,0,0,0],
        tardiness: [0,0,0,0,0,0,0,0,0,0,0,0],
        memos: [0,0,0,0,0,0,0,0,0,0,0,0],
        market_id: agentdata.market_id,
        market_name: agentdata.market_name,

       }
      transformData.push(insertNewAgent)



    }
    

    const AgentIndex = transformData.findIndex(agent => agent.agent_id == agentdata.agent_id)

    const monthIndex =  months.indexOf(agentdata.month)
   

     transformData[AgentIndex]['target'][monthIndex] += Number(agentdata.total_target)
     transformData[AgentIndex]['ship_ok'][monthIndex] += Number(agentdata.total_shipok)
     transformData[AgentIndex]['new_deposit'][monthIndex] += Number(agentdata.total_new_deposit)
     transformData[AgentIndex]['absences'][monthIndex] += Number(agentdata.total_absences)
     transformData[AgentIndex]['tardiness'][monthIndex] += Number(agentdata.total_tardiness_count)
     transformData[AgentIndex]['memos'][monthIndex] += Number(agentdata.total_memo_count)

 })

console.log(transformData)


// const transformData =  [
//   {
//       name: "Agent 1",
//       ship_ok: [60, 45, 72, 82, 65, 50, 55, 78, 90, 88, 61, 70],
//       target: [50, 55, 60, 72, 80, 65, 58, 73, 85, 78, 62, 69],
//       new_deposit: [3, 2, 4, 3, 1, 5, 4, 2, 3, 5, 3, 4],
//       absences: [1, 0, 2, 1, 3, 0, 1, 2, 0, 1, 0, 3],
//       tardiness: [0, 1, 0, 2, 1, 0, 1, 0, 2, 1, 0, 0],
//       memos: [0, 1, 1, 0, 2, 0, 1, 1, 0, 2, 1, 1],
//       market: 'oceana'
//     },
//     {
//       name: "Agent 2",
//       ship_ok: [62, 50, 80, 85, 70, 60, 65, 74, 91, 83, 64, 72],
//       target: [55, 62, 65, 77, 82, 70, 60, 75, 88, 80, 66, 71],
//       new_deposit: [2, 3, 4, 3, 2, 4, 3, 2, 5, 4, 2, 3],
//       absences: [0, 1, 1, 0, 0, 2, 1, 0, 1, 0, 2, 0],
//       tardiness: [1, 0, 2, 1, 0, 1, 2, 1, 0, 1, 0, 0],
//       memos: [1, 0, 2, 1, 1, 0, 2, 0, 1, 1, 0, 2],
//       market: 'oceana'
//     }

// ]