const agents = [
    {
        name: "Agent 1",
        ship_ok: [60, 45, 72, 82, 65, 50, 55, 78, 90, 88, 61, 70],
        target: [50, 55, 60, 72, 80, 65, 58, 73, 85, 78, 62, 69],
        new_deposit: [3, 2, 4, 3, 1, 5, 4, 2, 3, 5, 3, 4],
        absences: [1, 0, 2, 1, 3, 0, 1, 2, 0, 1, 0, 3],
        tardiness: [0, 1, 0, 2, 1, 0, 1, 0, 2, 1, 0, 0],
        memos: [0, 1, 1, 0, 2, 0, 1, 1, 0, 2, 1, 1],
        market: 'oceana'
      },
      {
        name: "Agent 2",
        ship_ok: [62, 50, 80, 85, 70, 60, 65, 74, 91, 83, 64, 72],
        target: [55, 62, 65, 77, 82, 70, 60, 75, 88, 80, 66, 71],
        new_deposit: [2, 3, 4, 3, 2, 4, 3, 2, 5, 4, 2, 3],
        absences: [0, 1, 1, 0, 0, 2, 1, 0, 1, 0, 2, 0],
        tardiness: [1, 0, 2, 1, 0, 1, 2, 1, 0, 1, 0, 0],
        memos: [1, 0, 2, 1, 1, 0, 2, 0, 1, 1, 0, 2],
        market: 'oceana'
      },
      {
        name: "Agent 3",
        ship_ok: [55, 60, 72, 85, 67, 62, 59, 68, 89, 80, 63, 75],
        target: [53, 58, 66, 80, 77, 70, 64, 79, 83, 75, 68, 70],
        new_deposit: [1, 2, 3, 4, 2, 3, 1, 4, 5, 2, 3, 4],
        absences: [2, 1, 0, 2, 1, 3, 0, 1, 0, 1, 0, 2],
        tardiness: [1, 0, 1, 2, 0, 0, 1, 2, 0, 1, 1, 0],
        memos: [0, 1, 0, 2, 1, 0, 1, 2, 1, 0, 1, 1],
        market: 'malawi'
      },
      {
        name: "Agent 4",
        ship_ok: [65, 70, 75, 80, 66, 67, 69, 73, 88, 85, 64, 74],
        target: [58, 62, 72, 79, 74, 67, 68, 77, 86, 82, 70, 73],
        new_deposit: [2, 4, 3, 5, 2, 3, 4, 2, 3, 4, 3, 5],
        absences: [0, 1, 2, 0, 1, 0, 2, 1, 1, 0, 2, 1],
        tardiness: [0, 1, 1, 2, 0, 1, 2, 1, 0, 1, 0, 0],
        memos: [1, 0, 2, 1, 2, 0, 1, 1, 2, 0, 1, 2],
         market: 'malawi'
      },
      {
        name: "Agent 5",
        ship_ok: [62, 59, 71, 77, 65, 68, 74, 82, 89, 87, 66, 71],
        target: [54, 63, 68, 80, 74, 69, 65, 78, 85, 81, 68, 72],
        new_deposit: [3, 2, 5, 4, 3, 3, 2, 4, 3, 2, 4, 5],
        absences: [1, 2, 0, 1, 0, 1, 2, 1, 0, 1, 0, 2],
        tardiness: [0, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0],
        memos: [0, 2, 1, 0, 1, 2, 0, 1, 1, 2, 0, 0],
        market: 'cyprus'
      },
      {
        name: "Agent 6",
        ship_ok: [63, 56, 79, 84, 68, 70, 66, 75, 91, 78, 67, 74],
        target: [59, 65, 67, 78, 72, 74, 70, 76, 88, 80, 71, 77],
        new_deposit: [4, 3, 2, 4, 3, 2, 3, 5, 4, 2, 3, 3],
        absences: [0, 1, 2, 1, 3, 0, 2, 1, 0, 2, 1, 0],
        tardiness: [0, 0, 1, 0, 2, 1, 1, 1, 0, 1, 2, 0],
        memos: [1, 2, 0, 1, 0, 1, 2, 0, 1, 1, 0, 2],
        market: 'cyprus'
      },
      {
        name: "Agent 7",
        ship_ok: [60, 61, 77, 81, 66, 72, 68, 74, 90, 84, 60, 79],
        target: [52, 60, 72, 76, 78, 69, 70, 75, 86, 79, 67, 70],
        new_deposit: [1, 4, 3, 2, 5, 3, 2, 4, 3, 3, 2, 1],
        absences: [1, 0, 2, 3, 1, 0, 1, 0, 2, 1, 3, 0],
        tardiness: [0, 1, 1, 0, 2, 0, 1, 1, 2, 0, 1, 0],
        memos: [1, 0, 1, 1, 2, 1, 0, 1, 2, 0, 2, 1],
        market: 'guyana'
      },
      {
        name: "Agent 8",
        ship_ok: [64, 69, 78, 85, 73, 77, 68, 76, 90, 80, 69, 71],
        target: [56, 63, 74, 79, 76, 72, 70, 74, 88, 79, 70, 78],
        new_deposit: [2, 5, 3, 4, 3, 4, 2, 3, 4, 5, 4, 3],
        absences: [1, 2, 1, 0, 3, 0, 1, 2, 1, 1, 0, 2],
        tardiness: [1, 1, 0, 2, 0, 1, 1, 2, 0, 1, 0, 1],
        memos: [0, 1, 2, 1, 1, 0, 2, 1, 1, 0, 1, 0],
        market: 'guyana'
      },
      {
        name: "Agent 9",
        ship_ok: [62, 53, 76, 80, 64, 69, 75, 78, 91, 79, 61, 70],
        target: [59, 60, 71, 78, 77, 73, 69, 74, 82, 85, 68, 71],
        new_deposit: [2, 4, 3, 5, 4, 3, 2, 5, 3, 3, 4, 4],
        absences: [0, 1, 2, 1, 0, 3, 1, 0, 2, 1, 0, 2],
        tardiness: [1, 0, 2, 1, 1, 0, 1, 2, 1, 0, 0, 0],
        memos: [1, 2, 1, 0, 1, 0, 1, 0, 1, 2, 0, 1],
        market: 'jamaica'
      },
      {
        name: "Agent 10",
        ship_ok: [65, 71, 72, 80, 68, 66, 69, 77, 89, 81, 64, 75],
        target: [60, 66, 70, 79, 74, 72, 73, 75, 87, 84, 68, 76],
        new_deposit: [4, 2, 3, 4, 3, 2, 3, 4, 5, 3, 4, 5],
        absences: [1, 0, 2, 1, 2, 3, 0, 1, 2, 0, 1, 0],
        tardiness: [0, 1, 1, 0, 2, 1, 0, 2, 1, 1, 0, 0],
        memos: [2, 0, 1, 1, 0, 2, 1, 0, 1, 0, 2, 1],
        market: 'jamaica'
      },

      {
        name: "Agent 11",
        ship_ok: [68, 62, 79, 82, 75, 69, 67, 73, 88, 84, 65, 80],
        target: [61, 68, 72, 78, 75, 70, 74, 80, 85, 77, 69, 74],
        new_deposit: [3, 5, 2, 4, 3, 2, 4, 5, 3, 4, 5, 2],
        absences: [1, 0, 1, 0, 2, 1, 3, 1, 0, 1, 0, 2],
        tardiness: [0, 1, 2, 0, 1, 1, 0, 2, 1, 1, 0, 1],
        memos: [2, 1, 1, 0, 0, 1, 2, 1, 0, 1, 2, 0],
        market: 'bahamas'
      },
      {
        name: "Agent 12",
        ship_ok: [64, 70, 77, 85, 71, 74, 68, 79, 90, 86, 70, 76],
        target: [59, 65, 74, 80, 76, 72, 69, 78, 85, 82, 73, 75],
        new_deposit: [4, 3, 2, 5, 3, 4, 2, 3, 5, 4, 3, 3],
        absences: [0, 2, 1, 1, 0, 0, 2, 1, 3, 1, 0, 2],
        tardiness: [1, 0, 2, 1, 0, 1, 0, 1, 2, 1, 1, 0],
        memos: [1, 2, 0, 1, 1, 2, 1, 0, 1, 2, 0, 1],
        market: 'bahamas'
      },
      {
        name: "Agent 13",
        ship_ok: [67, 75, 72, 80, 78, 71, 68, 77, 85, 82, 76, 74],
        target: [60, 69, 75, 83, 77, 73, 70, 78, 88, 79, 72, 80],
        new_deposit: [2, 4, 3, 5, 4, 3, 2, 4, 3, 5, 4, 3],
        absences: [1, 0, 2, 1, 0, 2, 0, 1, 1, 3, 2, 1],
        tardiness: [0, 1, 1, 2, 0, 0, 1, 2, 1, 1, 0, 2],
        memos: [0, 1, 1, 0, 2, 1, 1, 0, 2, 1, 0, 1],
        market: 'kenya'
      },
      {
        name: "Agent 14",
        ship_ok: [72, 70, 75, 80, 76, 74, 71, 77, 89, 83, 70, 78],
        target: [65, 71, 76, 81, 80, 73, 68, 80, 90, 85, 74, 79],
        new_deposit: [3, 5, 4, 3, 4, 5, 3, 2, 4, 4, 3, 5],
        absences: [0, 1, 1, 2, 0, 3, 1, 2, 1, 0, 2, 1],
        tardiness: [1, 2, 1, 0, 0, 1, 0, 2, 1, 0, 1, 1],
        memos: [1, 0, 2, 1, 2, 0, 1, 1, 2, 0, 1, 2],
        market: 'kenya'
      },
      {
        name: "Agent 15",
        ship_ok: [65, 74, 78, 80, 72, 70, 76, 79, 85, 88, 71, 73],
        target: [58, 64, 75, 79, 76, 73, 69, 77, 85, 82, 72, 76],
        new_deposit: [2, 3, 4, 5, 3, 4, 2, 5, 4, 3, 4, 4],
        absences: [1, 1, 2, 0, 2, 1, 3, 2, 1, 0, 2, 1],
        tardiness: [0, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 1],
        memos: [0, 1, 0, 2, 1, 0, 1, 2, 0, 2, 1, 1],
        market: 'mozambique'
      },
      {
        name: "Agent 16",
        ship_ok: [68, 72, 76, 81, 70, 75, 67, 80, 88, 85, 77, 82],
        target: [60, 67, 74, 79, 75, 72, 70, 76, 86, 81, 73, 77],
        new_deposit: [3, 2, 4, 5, 4, 3, 2, 3, 4, 2, 3, 5],
        absences: [2, 1, 3, 0, 2, 1, 0, 1, 1, 2, 0, 1],
        tardiness: [1, 2, 0, 1, 1, 0, 2, 1, 0, 2, 1, 0],
        memos: [0, 1, 2, 0, 1, 1, 1, 2, 0, 1, 0, 1],
        market: 'mozambique'
      },
      {
        name: "Agent 17",
        ship_ok: [70, 67, 76, 81, 69, 74, 72, 77, 88, 84, 75, 78],
        target: [61, 66, 74, 79, 73, 72, 70, 76, 85, 82, 70, 74],
        new_deposit: [2, 3, 5, 4, 3, 3, 4, 3, 4, 2, 5, 3],
        absences: [0, 2, 1, 0, 3, 1, 0, 1, 2, 1, 0, 1],
        tardiness: [1, 0, 2, 1, 0, 1, 1, 0, 2, 1, 0, 0],
        memos: [0, 1, 2, 1, 0, 2, 1, 0, 1, 0, 2, 1],
        market: 'philippines'
      },
      {
        name: "Agent 18",
        ship_ok: [63, 65, 75, 77, 72, 70, 68, 79, 85, 80, 69, 74],
        target: [58, 62, 76, 80, 74, 72, 69, 75, 88, 82, 71, 76],
        new_deposit: [4, 3, 2, 4, 3, 4, 5, 2, 4, 3, 3, 4],
        absences: [0, 1, 1, 0, 2, 2, 1, 3, 1, 0, 1, 2],
        tardiness: [1, 1, 0, 1, 0, 2, 1, 0, 1, 1, 2, 0],
        memos: [1, 0, 2, 1, 0, 1, 1, 2, 1, 0, 0, 2],
        market: 'philippines'
      },
      {
        name: "Agent 19",
        ship_ok: [67, 73, 76, 82, 79, 72, 69, 75, 88, 85, 74, 79],
        target: [63, 66, 74, 78, 77, 74, 71, 79, 89, 80, 73, 75],
        new_deposit: [3, 5, 4, 3, 5, 4, 3, 2, 4, 3, 5, 2],
        absences: [1, 2, 1, 0, 1, 0, 2, 3, 1, 2, 0, 1],
        tardiness: [0, 1, 2, 1, 1, 0, 0, 1, 2, 0, 1, 2],
        memos: [1, 2, 0, 1, 2, 0, 1, 0, 2, 1, 0, 1],
        market: 'philippines'
      },
  ];
  
  const aggregatedData = {};
  
  agents.forEach((agent) => {
    const market = agent.market;
  
    if (!aggregatedData[market]) {
      aggregatedData[market] = {
        ship_ok: Array(agent.ship_ok.length).fill(0),
        target: Array(agent.target.length).fill(0),
        new_deposit: Array(agent.new_deposit.length).fill(0),
        agents: [],
      };
    }
  
    // Add agent name to the market's agent list
    aggregatedData[market].agents.push(agent.name);
  
    // Aggregate data
    aggregatedData[market].ship_ok = aggregatedData[market].ship_ok.map(
      (value, index) => value + agent.ship_ok[index]
    );
  
    aggregatedData[market].target = aggregatedData[market].target.map(
      (value, index) => value + agent.target[index]
    );
  
    aggregatedData[market].new_deposit = aggregatedData[market].new_deposit.map(
      (value, index) => value + agent.new_deposit[index]
    );
  });
  
  // Convert object to array
  const resultArray = Object.entries(aggregatedData).map(([market, data]) => ({
    market,
    ship_ok: data.ship_ok,
    target: data.target,
    new_deposit: data.new_deposit,
    agents: data.agents,
  }));
  
  console.log(resultArray);
  