const pool =  require('../config/db')


exports.fetchAgentMarket = async (req, res, next) => {


    // const connection =  await pool.getConnection()

    const [result] = await pool.execute(
        'SELECT id,market_name FROM `market`'  
    )
    // connection.release()
    res.json(result)
}




