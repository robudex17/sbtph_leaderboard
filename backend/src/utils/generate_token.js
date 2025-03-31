const jwt = require('jsonwebtoken')
// const { refreshToken } = require('../controllers/sales_login_controller')

exports.generateAccessToken = (user) => {
    return jwt.sign({ username: user.username, role: user.role, login_id: user.login_id, login_type: user.login_type,
        manager_id: user.manager_id, agent_type: user.agent_type, firstname: user.firstname, 
        lastname: user.lastname, db_name: user.db_name, market_id: user.market_id, image_link: user.image_link
    },
      process.env.JWT_SECRET,{ expiresIn: '1d'}
    )
}


// exports.generateRefreshToken = (user) => {
//     return jwt.sign(
//         { username: user.username, role: user.role, login_id: user.login_id, 
//             manager_id: user.manager_id, agent_type: user.agent_type, firstname: user.firstname, 
//             lastname: user.lastname, db_name: user.db_name, market_id: user.market_id
//         }, 
//         process.env.JWT_REFRESH_SECRET, { expiresIn: '7d'}

//     )
// }

exports.decodedToken = (refreshToken) => {
    return  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
}