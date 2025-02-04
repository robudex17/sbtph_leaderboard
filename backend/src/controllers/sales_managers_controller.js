const pool =  require('../config/db')


exports.fetchManager = async (req, res, next) => {


    const connection =  await pool.getConnection()

    const [result] = await connection.execute(
        'SELECT * FROM `managers`'  
    )
    connection.release()
    res.json(result)
}


