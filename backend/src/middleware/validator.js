const { check, param } = require('express-validator')

const validator = { }

validator.validateMemo = [
    param('agent_id').trim().notEmpty().withMessage('Agent ID is required'),
    check('memo_date').trim().notEmpty().withMessage('Date for Memo is required'),
    check('memo_description').notEmpty().withMessage('A Description for Memo is required'),
    check('memo_date').trim().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
]



validator.validateAbsence = [
    check('absent_date').trim().notEmpty().withMessage('Date For Absence is required'),
    check('absent_date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
    check('absent_description').trim().notEmpty().withMessage('A Description for Absence is required')
]


validator.validateNewDeposit = [
    check('new_deposit').trim().notEmpty().withMessage('New Deposit is required')
    .isDecimal().withMessage('Must be valid number')
    .custom(value => {
        if (parseFloat(value) <= 0) {
          throw new Error('Deposit must be a positive amount');
        }
        return true;
      }), // Second check: ensure it's a positive number)
    check('deposit_date').trim().notEmpty().withMessage('Deposit Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
]

validator.validateFeedback = [
    check('feedback_date').trim().notEmpty().withMessage('Feedback is Date is required')
    .isDate().withMessage('Invalid Date format').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
    .custom(value => {

        const timestamp = Date.now(); // Get the current timestamp in milliseconds

        const date = new Date(timestamp); // Convert timestamp to a Date object
        
        // Extract year, month, and day
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
        
        // Format as "YYYY-MM-DD"
        const formattedDate = `${year}-${month}-${day}`;
        
        let today = new Date(formattedDate)

        let givenDate = new Date(value)
        

        if (givenDate > today){
            throw new Error('Cannot do feedback on the future date')
        }
        return true
    }),
    check('feedback').trim().notEmpty().withMessage('Feedback Score is required.')
    .isDecimal().withMessage('Must be a valid number')
    .custom(value => {
        if(parseFloat(value) <= 0){
            throw new Error('Feedback score must be positive number')
        }
        return true
    })
]

validator.validateTardiness = [
    check('tardiness_date').trim().notEmpty().withMessage('Tardiness Date is required')
    .isDate().withMessage('Invalid Date format').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
    .custom(value => {

        const timestamp = Date.now(); // Get the current timestamp in milliseconds

        const date = new Date(timestamp); // Convert timestamp to a Date object
        
        // Extract year, month, and day
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
        
        // Format as "YYYY-MM-DD"
        const formattedDate = `${year}-${month}-${day}`;
        
        let today = new Date(formattedDate)

        let givenDate = new Date(value)
        

        if (givenDate > today){
            throw new Error('Cannot give tardiness on the future date')
        }
        return true
    }),
    check('tardiness_description').trim().notEmpty().withMessage('Tardiness Description is required')
]

validator.validateTarget = [
    check('target_date').trim().notEmpty().withMessage('Target Date is required')
    .isDate().withMessage('Invalid Date format').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
    .custom(value => {

        const timestamp = Date.now(); // Get the current timestamp in milliseconds

        const date = new Date(timestamp); // Convert timestamp to a Date object
        
        // Extract year, month, and day
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
        
       
        //current month and year timestamp
        const currentMonthYearTimestamp = new Date(`${year}-${month}`).getTime()


        const givenMonthYear = value.slice(0,7 ) // Extracts "YYYY-MM"
        
        const givenMonthYearTimestamp = new Date(givenMonthYear).getTime() 
        
        console.log(`givenMonthYearTimestamp: ${givenMonthYearTimestamp}`)
        console.log(`currentMonthYearTimestamp: ${currentMonthYearTimestamp}`)
        if (currentMonthYearTimestamp > givenMonthYearTimestamp){
            throw new Error('Cannot Set Target on the Previous Year-Month')
        }
        return true
    }),
    check('target').trim().notEmpty().withMessage('target is required.')
    .isInt({min:1}).withMessage('Only positive Whole numbers are allowed'),
    
    check('shipok').trim().notEmpty().withMessage('shipok is Required')
    .isInt({min:0}).withMessage('Only positive Whole Number are allowed')
]



validator.validateNewAndUpdateAgent = [

    check('agent_id').trim().notEmpty().withMessage('Agent Id is Required')
    .isInt().withMessage('Numbers are only allowed in Agent ID')
    .isLength({min:4}).withMessage('Agent ID must atleast 4 digits'),

    check('manager_id').trim().notEmpty().withMessage('Manager Id is Required')
    .isInt().withMessage('Numbers are only allowed in Manager ID')
    .isLength({min:4}).withMessage('Manger ID must atleast 4 digits'),

    check('agent_type').trim().notEmpty().withMessage('Agent Type is Required')
    .isIn([0,1,2,"0","1","2"]).withMessage('Agent Type must be 0, 1, 2'),

    check('agent_firstname').trim().notEmpty().withMessage('Agent Firstname is Required'),

    check('agent_lastname').trim().notEmpty().withMessage('Agent Lastname is Required'),

    check('agent_dbname').trim().notEmpty().withMessage('Agent DB Name is Required')


]

validator.validateMonthYear = [
    check('month').optional().isString().withMessage('Invalid Months, Or month must be a string...').custom((value, {req})=>{
        
        const validMonths = [
         'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
        ]

        //If the month is missing or empty , set it  to the current month
        if(!value){
            const currentMonth = new Date().toLocaleString('default', {month: 'long'})
            value = currentMonth //set the value of the current month
        }
        
        //check if valid month

        if (!validMonths.includes(value)){
            throw new Error('Invalid month')

        }

        //Validate the month against the current month

        const  currentDate = new Date()
        const currentYear = currentDate.getFullYear()

        const  currentMonthIndex = currentDate.getMonth() // return 0 = January, 1 = February ... soon 
        const inputMonthIndex = validMonths.indexOf(value) // get the index of the given month

        //get the input year from the query string (default to currentyear if it is empty)
        const inputYear = parseInt(req.query.year || currentYear, 10)
       
        if(inputYear > currentYear || (inputYear === currentYear  &&  inputMonthIndex > currentMonthIndex)){
            throw new Error("No Sales Leaderboard for the given date and year..")
        }
          
        return true

    }),

    check('year').optional().isInt({min:1900, max: new Date().getFullYear()})
    .custom((value, {req})=>{
        //If the value is missing or empty , set it to the current year
        if(!value){
            value = new Date().getFullYear()
        }

        const currentYear = new Date().getFullYear()
        const inputYear = parseInt(value, 10)

        // The entered year is greater than the current year , throw an error

        if (inputYear > currentYear){
            throw new Error('Year cannot be in the future')
        }

        return true
    })


]

validator.validateYear = [
    check('year').optional().isInt({min:1900, max: new Date().getFullYear()})
    .custom((value, {req})=>{
        //If the value is missing or empty , set it to the current year
        if(!value){
            value = new Date().getFullYear()
        }

        const currentYear = new Date().getFullYear()
        const inputYear = parseInt(value, 10)

        // The entered year is greater than the current year , throw an error

        if (inputYear > currentYear){
            throw new Error('Year cannot be in the future')
        }

        return true
    })
]



module.exports = validator