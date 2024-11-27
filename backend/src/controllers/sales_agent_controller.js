const pool = require('../config/db')

exports.fetchSalesAgents = async (req,res, next ) => {
    const connection =  await pool.getConnection()

    const [rows, fields] = await connection.execute(
        'SELECT * FROM  `sales_agents`'  
    )
    connection.release()
    res.json(rows)
}
