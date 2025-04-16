const ExcelJS = require('exceljs');
const xlsx = require('xlsx');
const pool = require('../config/db')

const createTargetExcelTable = (data, worksheet, secondTableStartRow, title) => {
  const getCell = (rowOffset, col) => worksheet.getCell(secondTableStartRow + rowOffset, col);

  // Cell styles
  const headerStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B050' } },
    font: { bold: true, color: { argb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'medium', color: { argb: '000000' } },
      left: { style: 'medium', color: { argb: '000000' } },
      bottom: { style: 'medium', color: { argb: '000000' } },
      right: { style: 'medium', color: { argb: '000000' } },
    },
  };

  const dataBorder = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  };

  // Add Title
  const titleRow = worksheet.getRow(secondTableStartRow);
  worksheet.mergeCells(secondTableStartRow, 1, secondTableStartRow, 9);
  titleRow.getCell(1).value = title;
  titleRow.getCell(1).font = { bold: true, size: 18 };
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.height = 25;

  // Header row
  const headers = [
    'AGENT_ID', 'MONTH', 'YEAR', 'DATE',
    'TARGET', 'SHIPOK', 'PERCENTAGE',
    'MARKET_ID', 'MARKET_NAME',
  ];

  const headerRowNumber = secondTableStartRow + 1;
  const headerRow = worksheet.getRow(headerRowNumber);

  headers.forEach((header, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = header;
    Object.assign(cell, headerStyle);
  });

  // Add data
  const dataStartRow = headerRowNumber + 1;

  data.forEach((item, index) => {
    const row = worksheet.getRow(dataStartRow + index);
    const percentage = item.ship_ok && item.target
      ? `${((item.ship_ok / item.target) * 100).toFixed(2)}%`
      : '0%';

    row.values = [
      item.agent_id || '',
      item.month || '',
      item.year || '',
      item.date || '',
      item.target || 0,
      item.ship_ok || 0,
      percentage,
      item.market_id || '',
      item.market_name || '',
    ];

    row.eachCell((cell) => {
      cell.border = dataBorder;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

  // Adjust column widths
  const widths = [12, 15, 10, 15, 10, 10, 15, 12, 20];
  worksheet.columns = widths.map(width => ({ width }));
};

const createNewDepositAbenseTardinesAndMemoTable = (data, worksheet, thirdTableStartRow, title) => {
  const getCell = (rowOffset, col) => worksheet.getCell(thirdTableStartRow + rowOffset, col);

  // Styles
  const headerStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B050' } },
    font: { bold: true, color: { argb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'medium', color: { argb: '000000' } },
      left: { style: 'medium', color: { argb: '000000' } },
      bottom: { style: 'medium', color: { argb: '000000' } },
      right: { style: 'medium', color: { argb: '000000' } },
    },
  };

  const dataBorder = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  };

  // Add title row
  const titleRow = worksheet.getRow(thirdTableStartRow);
  worksheet.mergeCells(thirdTableStartRow, 1, thirdTableStartRow, 6); // Extra column merged for description
  titleRow.getCell(1).value = title;
  titleRow.getCell(1).font = { bold: true, size: 18 };
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.height = 25;

  // Add header row
  const headers = ['AGENT_ID', 'MONTH', 'YEAR', 'DATE', 'DESCRIPTION'];
  const headerRowNumber = thirdTableStartRow + 1;
  const headerRow = worksheet.getRow(headerRowNumber);

  // Insert headers (DESCRIPTION will span 2 columns)
  headers.forEach((header, idx) => {
    const colIndex = idx + 1;
    const cell = headerRow.getCell(colIndex);
    cell.value = header;
    Object.assign(cell, headerStyle);
  });

  worksheet.mergeCells(headerRowNumber, 5, headerRowNumber, 6); // Merge DESCRIPTION column headers

  // Add data rows
  const dataStartRow = headerRowNumber + 1;

  data.forEach((item, index) => {
    const rowNumber = dataStartRow + index;
    const row = worksheet.getRow(rowNumber);

    row.getCell(1).value = item.agent_id || '';
    row.getCell(2).value = item.month || '';
    row.getCell(3).value = item.year || '';
    row.getCell(4).value = item.date || '';
    row.getCell(5).value = item.description || '';

    worksheet.mergeCells(rowNumber, 5, rowNumber, 6); // Merge DESCRIPTION columns per row

    row.eachCell((cell, colNumber) => {
      cell.border = dataBorder;
      cell.alignment = {
        horizontal: colNumber === 5 ? 'left' : 'center',
        vertical: 'middle',
        wrapText: colNumber === 5,
      };
    });

    row.height = 30; // Increase row height for better readability of long text
  });

  // Adjust column widths
  const widths = [12, 12, 10, 12, 40, 0]; // Last column is merged, still needs width for rendering
  worksheet.columns = widths.map((width) => ({ width }));
};

const createAgentFeedbackExcelTable = (data, worksheet, startRow, title, agent_type) => {
  const baseColumns = ['AGENT_ID', 'DB_NAME', 'MONTH', 'YEAR'];
  let columns = [];

  if (agent_type === 0) {
    columns = [...baseColumns, 'Feedback From Manager', 'Feedback From QA', 'Overall Feedback', ];
  } else if (agent_type === 1) {
    columns = [...baseColumns, 'Feedback From Agents', 'Feedback From Manager', 'Feedback From QA', 'Overall Feedback'];
  } else if (agent_type === 2) {
    columns = [...baseColumns, 'Feedback From LM', 'Feedback From QA', 'Overall Feedback'];
  }

  // Write the title
  const titleRow = worksheet.getRow(startRow);
  titleRow.getCell(1).value = title;
  titleRow.font = { bold: true, size: 14 };
  worksheet.mergeCells(startRow, 1, startRow, columns.length);
  startRow++;

  
  // Write header
  const headerRow = worksheet.getRow(startRow);
  columns.forEach((col, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = col;
    cell.font = { bold: true,  color: { argb: 'FFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00B050' },
    };
  });
  startRow++;

  // Write data
  data.forEach((item, i) => {
    const row = worksheet.getRow(startRow + i);

    let colIndex = 1;
    row.getCell(colIndex++).value = item.agent_id;
    row.getCell(colIndex++).value = item.db_name;
    row.getCell(colIndex++).value = item.month;
    row.getCell(colIndex++).value = item.year;
   

    if (agent_type === 0) {
      row.getCell(colIndex++).value = item.average_agent_feedback || 'No Feedback';
      row.getCell(colIndex++).value = item.average_feedback_by_qa || 'No Feedback';
      row.getCell(colIndex++).value = item.over_all_average_feedback || 'No Feedback';
    } else if (agent_type === 1) {
      row.getCell(colIndex++).value = item.average_manager_feedback || 'No Feedback';
      row.getCell(colIndex++).value =  item.average_lms_feedback || 'No Feedback';
      row.getCell(colIndex++).value = item.average_feedback_by_qa || 'No Feedback';
      row.getCell(colIndex++).value = item.over_all_average_feedback || 'No Feedback';
     
    } else if (agent_type === 2) {
      row.getCell(colIndex++).value = item.average_manager_feedback || 'No Feedback';
      row.getCell(colIndex++).value = item.average_feedback_by_qa || 'No Feedback';
      row.getCell(colIndex++).value = item.over_all_average_feedback || 'No Feedback';
    }
  });
};


const createPerformanceExcelTable = (data, worksheet, startRow = 1, title, performanceType, fullyear, yearlyFinalRatings, yearlyRatingsName) => {
  const getCell = (rowOffset, col) => worksheet.getCell(startRow + rowOffset, col);
  let agent_ratings_name = data[0].ratings_name
  if (performanceType == 'agent'){
    if(fullyear == 'true' || fullyear == true){
       title = `${title} ${yearlyFinalRatings} / ${yearlyRatingsName}`
    }else{
        title = `${title} ${data[0].final_ratings} / ${data[0].ratings_name}`
    }
  
  }

  // Cell style functions
  const getHeaderStyle = () => ({
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B050' } },
    font: { bold: true, color: { argb: 'FFFFFF' } },
  });

  const getHeaderBorder = () => ({
    top: { style: 'medium', color: { argb: '000000' } },
    left: { style: 'medium', color: { argb: '000000' } },
    bottom: { style: 'medium', color: { argb: '000000' } },
    right: { style: 'medium', color: { argb: '000000' } },
  });

  const getDataBorder = () => ({
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'medium', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'medium', color: { argb: '000000' } },
  });

  // Add report title above the table
  const titleRow = worksheet.getRow(startRow);
  const totalCols = 16; // Total number of columns in the table
  worksheet.mergeCells(startRow, 1, startRow, totalCols);
  titleRow.getCell(1).value = title
  titleRow.getCell(1).font = { bold: true, size: 24 };
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.height = 30; // Optional: increase row height for title

  startRow += 1; // Move down after title

  const columnGroups = [
    { label: 'YEAR', span: 1 },
    { label: 'MONTH', span: 1 },
    { label: 'EMPLOYEE NAME', span: 1 },
    { label: 'PERFORMANCE (80%)', span: 2, subHeaders: ['SCORE', 'TOTAL'] },
    { label: 'ATTENDANCE (10%)', span: 3, subHeaders: ['ABSENCES', 'TARDINESS', 'TOTAL'] },
    { label: 'MEMO AND FEEDBACK(10%)', span: 3, subHeaders: ['POINT', 'POINT', 'TOTAL'] },
    { label: 'ADDITIONAL POINTS(10%)', span: 2, subHeaders: ['NEW DEPOSIT', 'TOTAL'] },
    { label: 'GRAND TOTAL', span: 1 },
    { label: 'RATING', span: 1 },
    { label: 'MEMO', span: 1 },
  ];

  // Set headers
  let currentCol = 1;
  columnGroups.forEach(group => {
    const startCol = currentCol;
    const endCol = currentCol + group.span - 1;
    const startCell = getCell(0, startCol);
    startCell.value = group.label;
    startCell.style = getHeaderStyle();
    startCell.alignment = { horizontal: 'center', vertical: 'middle' };
    startCell.border = getHeaderBorder();

    if (group.span > 1) {
      worksheet.mergeCells(startRow, startCol, startRow, endCol);
      for (let i = 0; i < group.span; i++) {
        const subCell = getCell(1, startCol + i);
        subCell.value = group.subHeaders[i];
        subCell.style = getHeaderStyle();
        subCell.alignment = { horizontal: 'center', vertical: 'middle' };
        subCell.border = getHeaderBorder();
      }
    } else {
      worksheet.mergeCells(startRow, startCol, startRow + 1, startCol);
    }

    currentCol = endCol + 1;
  });

  // Fix column widths
  const columnWidths = [
    10, 12, 25, 10, 10, 10, 10, 10,
    10, 10, 10, 15, 10, 15, 20, 30
  ];
  worksheet.columns = columnWidths.map((width) => ({ width }));

  // Add data rows (starting from row after headers)
  const dataStartRow = startRow + 2;

  data.forEach((rowData, index) => {
    const row = worksheet.getRow(dataStartRow + index);
    row.values = [
      rowData.year || '',
      rowData.month || '',
      rowData.db_name || '',
      rowData.shipok_score || 0,
      rowData.performance_rating || 0,
      rowData.absence_score || 0,
      rowData.tardiness_score || 0,
      rowData.absence_rating + rowData.tardiness_rating || 0,
      rowData.memo_score || 0,
      rowData.feedback_score || 0,
      rowData.memo_rating + rowData.feedback_rating || 0,
      rowData.deposit_score || 0,
      rowData.additional_points || 0,
      rowData.final_ratings || 0,
      rowData.ratings_name || '',
      rowData.memo_text || '',
    ];

    row.eachCell((cell, colNumber) => {
      cell.border = getDataBorder();
      cell.alignment = { horizontal: 'center', vertical: 'middle' };

      // FINAL RATING column (14)
      if (colNumber === 14) {
        let fontColor;
        switch (true) {
          case (cell.value >= 5): fontColor = '7414DB'; break;
          case (cell.value >= 4): fontColor = '0069DB'; break;
          case (cell.value >= 3): fontColor = '00DB4E'; break;
          case (cell.value >= 2): fontColor = 'D9BC4F'; break;
          default: fontColor = 'DB211A';
        }
        cell.font = { bold: true, color: { argb: fontColor } };
      }

      // RATING column (15)
      if (colNumber === 15) {
        let fillColor = 'FFFFFF';
        let fontColor = '000000';
        switch (cell.value) {
          case 'EXCEPTIONAL': fillColor = '7414DB'; fontColor = 'FFFFFF'; break;
          case 'VERY SATISFACTORY': fillColor = '0069DB'; fontColor = 'FFFFFF'; break;
          case 'SATISFACTORY': fillColor = '00DB4E'; break;
          case 'NEEDS IMPROVEMENT': fillColor = 'D99307'; break;
          case 'POOR': fillColor = 'DB211A'; break;
        }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
        cell.font = { bold: true, color: { argb: fontColor } };
      }
    });
  });
};

const createTeamPerformanceExcelTable = (
  worksheet,
  targetShipokData,
  newDepositData,
  targtShipokTitle,
  newDepositTitle,
  yearOnly,
  
) => {
  let currentRow = 1;

  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } }, // white font
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF008000' }, // green fill
    },
  };

  // Helper to style and write headers
  const setHeaders = (headers, startRow) => {
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(startRow, index + 1);
      cell.value = header;
      Object.assign(cell, headerStyle);
    });
  };

  // === FIRST TABLE: TARGET / SHIPOK ===
  worksheet.mergeCells(`A${currentRow}:${yearOnly ? 'F' : 'G'}${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = targtShipokTitle;
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  currentRow++;

  const targetHeaders = yearOnly
    ? ['MARKET', 'YEAR', 'TARGET', 'SHIPOK', 'SHORTAGE', 'ACHIEVEMENT']
    : ['MARKET', 'MONTH', 'YEAR', 'TARGET', 'SHIPOK', 'SHORTAGE', 'ACHIEVEMENT'];

  setHeaders(targetHeaders, currentRow);
  currentRow++;

  targetShipokData.forEach((row) => {
    const values = yearOnly
      ? [
          row.market_name,
          row.year,
          row.total_target,
          row.total_ship_ok,
          row.shortage,
          row.achievement,
        ]
      : [
          row.market_name,
          row.month,
          row.year,
          row.total_target,
          row.total_ship_ok,
          row.shortage,
          row.achievement,
        ];
    values.forEach((val, colIndex) => {
      worksheet.getCell(currentRow, colIndex + 1).value = val;
    });
    currentRow++;
  });

  currentRow += 2; // space between tables

  // === SECOND TABLE: NEW DEPOSIT ===
  worksheet.mergeCells(`A${currentRow}:${yearOnly ? 'C' : 'D'}${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = newDepositTitle;
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  currentRow++;

  const depositHeaders = yearOnly
    ? ['MARKET', 'YEAR', 'NEW DEPOSIT']
    : ['MARKET', 'MONTH', 'YEAR', 'NEW DEPOSIT'];

  setHeaders(depositHeaders, currentRow);
  currentRow++;

  newDepositData.forEach((row) => {
    const values = yearOnly
      ? [row.market_name, row.year, row.new_deposit]
      : [row.market_name, row.month, row.year, row.new_deposit];
    values.forEach((val, colIndex) => {
      worksheet.getCell(currentRow, colIndex + 1).value = val;
    });
    currentRow++;
  });
};

const feedbackData = (agendId, dbName, givenMonth,givenYear, agentFeedback, managerFeedback, lmsFeedback, feedbackByQa, fullyear ) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // 0-based index

  const results = [];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


  const processMonth = (month, index) => {
   
  
    // Skip future months in current year
    if (parseInt(givenYear) === currentYear && index > currentMonthIndex) return;

    // Filter feedbacks by month and year
    const filterByMonthYear = (data) => {
    
      return data.filter(item => 
        
        item.month === month && item.year === parseInt(givenYear)
      );
    };

    const agentData = filterByMonthYear(agentFeedback || []);
    const managerData = filterByMonthYear(managerFeedback || []);
    const lmsData = filterByMonthYear(lmsFeedback || []);
    const qaData = filterByMonthYear(feedbackByQa || []);
    
   
    const calculateAverage = (data) => {
      if (!Array.isArray(data) || data.length === 0) return null;
      const total = data.reduce((sum, item) => sum + parseFloat(item.feedback_score || 0), 0);
      return (total / data.length).toFixed(2);
    };

    const avgAgent = calculateAverage(agentData);
    const avgManager = calculateAverage(managerData);
    const avgLms = calculateAverage(lmsData);
    const avgQa = calculateAverage(qaData);

    const overall = (() => {
      const scores = [avgAgent, avgManager, avgLms, avgQa]
        .filter(score => score !== null)
        .map(parseFloat);
      if (scores.length === 0) return null;
      return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    })();

    results.push({
      month,
      year: givenYear,
      agent_id: agendId,
      db_name: dbName,
      average_agent_feedback: avgAgent,
      average_lms_feedback: avgManager,
      average_lms_feedback: avgLms,
      average_feedback_by_qa: avgQa,
      over_all_average_feedback: overall


    });
  };

  if (fullyear == 'true' || fullyear == true) {
    monthNames.forEach((month, index) => {
      processMonth(month, index);
    });
  } else {
    const selectedIndex = monthNames.findIndex(m => m === givenMonth);
   
    if (selectedIndex !== -1) {
      processMonth(givenMonth, selectedIndex);
    }
  }

  return results;
};



exports.salesLeaderboardExportToExcel = async (req, res, next) => {
 
  const performance = req.performance
  const workbook = new ExcelJS.Workbook();
  const monthly_score = `${performance[0].month}-${performance[0].year}-SCORE`
  const worksheet = workbook.addWorksheet(monthly_score)


  createPerformanceExcelTable(performance, worksheet, 1, 'SALES LEADERBORAD (MONTHLY PERFORMANCE)', 'leaderboard')
  

  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `users-${timestamp}.xlsx`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  await workbook.xlsx.write(res);
};

exports.salesAgentMonthlyPerformanceExportToExcel = async (req,res, next) => {
          
   // Generate file
  console.log(req.query)
  const workbook = new ExcelJS.Workbook();
  const performance = req.performance

  const agent_target = req.agent_target 
  const agent_new_deposit = req.agent_new_deposit 
  const agent_absences = req.agent_absences
  const agent_tardiness = req.agent_tardiness
  const agent_memos = req.agent_memo
  const agentFeedback = req.agent_feedback 
  const managerFeedback = req.manager_feedback
  const lmsFeedback = req.lm_feedback
  const feedbackByQa =  req.qa_feedback
  const agent_type = req.agent_type
  const givenMonth = req.query.month 
  const givenYear = req.query.year

 
  const fullyear = req.query.fullyear 

  if( fullyear == 'true' || fullyear == true){
    
    const yearAverage = req.performance.yearAverage 
    console.log(yearAverage)
    const agentsFullYearPerformance = req.performance.agentMetircsFullYear
    const yearPerformanceWorksheetName = `${yearAverage.db_name}-${yearAverage.year}-SCORE`
    const yearPerformanceWorksheet = workbook.addWorksheet(yearPerformanceWorksheetName)
    createPerformanceExcelTable(agentsFullYearPerformance , yearPerformanceWorksheet, 1, `${yearAverage.db_name} - (Yearly PERFORMANCE)`, 'agent', fullyear, yearAverage.final_ratings, yearAverage.ratings_name )
   
   
    // agent target table to another worksheet
    const yearlyTargetShipokWorksheeName = `${yearAverage.year}-${yearAverage.db_name}-Target Shipok`
    const yearlyTargetShipokWorksheet = workbook.addWorksheet(yearlyTargetShipokWorksheeName)
    createTargetExcelTable(agent_target, yearlyTargetShipokWorksheet, 1, 'Sales Agent Target/ShipOk')

     // agent new deposit table to another worksheet
     const yearlyNewDepositWorksheeName = `${yearAverage.year}-${yearAverage.db_name}-New Deposit`
     const yearlyNewDepositWorksheet = workbook.addWorksheet(yearlyNewDepositWorksheeName)
     createNewDepositAbenseTardinesAndMemoTable(agent_new_deposit, yearlyNewDepositWorksheet, 1, 'Sales Agent New Deposit')
    
       // agent absences table to another worksheet
     const yearlyAbsencesWorksheeName = `${yearAverage.year}-${yearAverage.db_name}-Absences`
     const yearlyAbsencesWorksheet = workbook.addWorksheet(yearlyAbsencesWorksheeName)
     createNewDepositAbenseTardinesAndMemoTable(agent_absences, yearlyAbsencesWorksheet , 1, 'Sales Agent Absences')


       // agent tardiness table to another worksheet
     const yearlyTardinessWorksheeName = `${yearAverage.year}-${yearAverage.db_name}-Tardiness`
     const yearlyTardinesssWorksheet = workbook.addWorksheet(yearlyTardinessWorksheeName)
     createNewDepositAbenseTardinesAndMemoTable(agent_tardiness, yearlyTardinesssWorksheet, 1, 'Sales Agent Tardiness')


      // agent memo's table to another worksheet
     const yearlyMemosWorksheeName = `${yearAverage.year}-${yearAverage.db_name}-Memos`
     const yearlyMemosWorksheet = workbook.addWorksheet(yearlyMemosWorksheeName)
     createNewDepositAbenseTardinesAndMemoTable(agent_memos, yearlyMemosWorksheet,  1, 'Sales Agent Memo')


        // agent feedback's table to another worksheet
     const yearlyFeedbackWorksheeName = `${yearAverage.year}-${yearAverage.db_name}-Feedback`
     const yearlyFeedbackWorksheet = workbook.addWorksheet(yearlyFeedbackWorksheeName)
     const yearlyFeedbackData = feedbackData(yearAverage.agent_id, yearAverage.db_name,givenMonth,givenYear, agentFeedback, managerFeedback, lmsFeedback, feedbackByQa, fullyear )
     createAgentFeedbackExcelTable(yearlyFeedbackData , yearlyFeedbackWorksheet, 1,  `Agent Feedback Information for the Year of  ${yearAverage.year}`, agent_type)
    
     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
     const filename = `users-${timestamp}.xlsx`;
  
     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    return await workbook.xlsx.write(res);
  }
  const agent_monthly_score = `${performance[0].db_name}-${performance[0].month}-${performance[0].year}-SCORE`
  const worksheet = workbook.addWorksheet(agent_monthly_score)
   
 
   createPerformanceExcelTable(performance, worksheet, 1, `${performance[0].db_name} - (MONTHLY PERFORMANCE)`, 'agent', "", "", "")
   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
   const filename = `users-${timestamp}.xlsx`;

   
   const lastUsedRow = worksheet.lastRow.number;
   const secondTableStartRow = lastUsedRow + 3;

   

   createTargetExcelTable(agent_target, worksheet, secondTableStartRow, 'Sales Agent Target/ShipOk')


   const thirdTableStartRow = worksheet.lastRow.number + 3;
  
  
   //create new deposit table
createNewDepositAbenseTardinesAndMemoTable(agent_new_deposit, worksheet, thirdTableStartRow, 'Sales Agent New Deposit')



const forthTableStartRow = worksheet.lastRow.number + 3;
const monthFeedbackData = feedbackData(performance[0].id, performance[0].db_name,givenMonth,givenYear, agentFeedback, managerFeedback, lmsFeedback, feedbackByQa, fullyear )

createAgentFeedbackExcelTable(monthFeedbackData, worksheet, forthTableStartRow,  `Agent Feedback Information for the month of ${performance[0].month} ${performance[0].year}`, agent_type)



const fifthTableRow = worksheet.lastRow.number + 3 

createNewDepositAbenseTardinesAndMemoTable(agent_absences, worksheet, fifthTableRow, 'Sales Agent Absences')

const sixTableRow = worksheet.lastRow.number + 3 

createNewDepositAbenseTardinesAndMemoTable(agent_tardiness, worksheet, sixTableRow, 'Sales Agent Tardiness')

const siventthTableRow = worksheet.lastRow.number + 3 

createNewDepositAbenseTardinesAndMemoTable(agent_memos, worksheet,  siventthTableRow, 'Sales Agent Memo')



   res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
   await workbook.xlsx.write(res);
  
}



exports.salesTeamPerformanceExportToExcel = async (req, res, next) => {

     // Generate file
  
     const workbook = new ExcelJS.Workbook();
    
     let worksheetName = ""
     let targetShipokData = []
     let newDepositData = []
     let targetShipokTitle = ""
     let newDepositTitle = ""
     if(req.year_only){
      targetShipokData = req.year_market_target_shipok
      newDepositData = req.year_market_new_deposit
      worksheetName = `Market Year (${targetShipokData[0].year}) Performance `
      targetShipokTitle  = `Market Target/ShipOk (${targetShipokData[0].year}) `
      newDepositTitle = `Market New Deposit (${targetShipokData[0].year})`
     }else{
      targetShipokData = req.month_market_target_shipok
      newDepositData = req.month_market_new_deposit
      worksheetName = `Market Month ( ${targetShipokData[0].month}  ${targetShipokData[0].year}) Performance `
      targetShipokTitle  = `Market Target/ShipOk ( ${targetShipokData[0].month}  ${targetShipokData[0].year}) `
      newDepositTitle = `Market New Deposit (${targetShipokData[0].month}  ${targetShipokData[0].year})`
     }
     const worksheet = workbook.addWorksheet(worksheetName)
     const yearOnly = req.year_only
     createTeamPerformanceExcelTable(
      worksheet,
      targetShipokData,
      newDepositData,
      targetShipokTitle,
      newDepositTitle,
      yearOnly,
      
    )
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `users-${timestamp}.xlsx`;
  
     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
     await workbook.xlsx.write(res);
    

}


exports.importTargetShipokData = async (req, res, io, next) => {
  const duplicateAction = req.query.duplicateAction || 'skip'; // 'skip' | 'update' | 'replace'

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    if (!/^target$/i.test(sheetName)) {
      return res.status(400).json({
        error: `Invalid sheet name: "${sheetName}". Sheet name must be 'target' (case-insensitive).`,
        sheetName
      });
    }

    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
 
    if (data.length === 0) {
      return res.status(400).json({ error: 'Sheet is empty', sheetName });
    }

    const requiredFields = ['YEAR', 'MONTH', 'TARGET', 'SHIPOK', 'AGENT_ID'];
    const headers = Object.keys(data[0]);
    const missingFields = requiredFields.filter(field => !headers.includes(field));

    // if (missingFields.length > 0) {
    //   return res.status(400).json({
    //     error: `Missing required fields: ${missingFields.join(', ')}`,
    //     sheetName
    //   });
    // }

    let totalRecords = data.length;
    let insertedCount = 0;
    let updatedCount = 0;
    let replacedCount = 0;
    let duplicateSkippedCount = 0;
    let notRegisteredAgentCount = 0;
    let emptyValuesCount = 0;

    for (let i = 0; i < totalRecords; i++) {
      const row = data[i];
      const dataFileds = Object.keys(row)
      const missingFields = requiredFields.filter(field => !dataFileds.includes(field));
      
      if (missingFields.length > 0) {
        emptyValuesCount++;
        console.log('did I came here?')
        continue;
      }

      const [agentResult] = await pool.execute(
        "SELECT market_id FROM sales_agents WHERE id = ?",
        [row.AGENT_ID]
      );

      if (agentResult.length === 0) {
        notRegisteredAgentCount++;
        continue;
      }

      const marketId = agentResult[0].market_id;

      const [checkResult] = await pool.execute(
        "SELECT COUNT(*) AS count FROM target_shipok_test WHERE agent_id = ? AND month = ? AND year = ?",
        [row.AGENT_ID, row.MONTH, row.YEAR]
      );

      const isDuplicate = checkResult[0].count > 0;
      const date = new Date();
      const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (isDuplicate) {
        if (duplicateAction === 'update') {
          await pool.execute(
            `UPDATE target_shipok_test SET date = ?, target = ?, ship_ok = ?, market_id = ?
             WHERE agent_id = ? AND month = ? AND year = ?`,
            [currentDate, row.TARGET, row.SHIPOK, marketId, row.AGENT_ID, row.MONTH, row.YEAR]
          );
          updatedCount++;
        } else if (duplicateAction === 'replace') {
          await pool.execute(
            `DELETE FROM target_shipok_test WHERE agent_id = ? AND month = ? AND year = ?`,
            [row.AGENT_ID, row.MONTH, row.YEAR]
          );

          await pool.execute(
            `INSERT INTO target_shipok_test (agent_id, month, year, date, target, ship_ok, market_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [row.AGENT_ID, row.MONTH, row.YEAR, currentDate, row.TARGET, row.SHIPOK, marketId]
          );
          replacedCount++;
        } else {
          duplicateSkippedCount++;
        }
      } else {
        await pool.execute(
          `INSERT INTO target_shipok_test (agent_id, month, year, date, target, ship_ok, market_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [row.AGENT_ID, row.MONTH, row.YEAR, currentDate, row.TARGET, row.SHIPOK, marketId]
        );
        insertedCount++;
      }

      const progress = Math.round(((i + 1) / totalRecords) * 100);
      io.emit("uploadProgress", {
        progress,
        insertedCount,
        updatedCount,
        replacedCount,
        duplicateSkippedCount,
        notRegisteredAgentCount,
        emptyValuesCount
      });
    }

    res.json({
      message: "Upload completed",
      insertedCount,
      updatedCount,
      replacedCount,
      duplicateSkippedCount,
      notRegisteredAgentCount,
      emptyValuesCount
    });

  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).send("Error processing file: " + err.message);
  }
};

