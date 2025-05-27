

require('dotenv').config({ path: '../../.env.test' });
const jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
    return jwt.sign({ username: user.username, role: user.role, login_id: user.login_id, login_type: user.login_type,
        manager_id: user.manager_id, agent_type: user.agent_type, firstname: user.firstname, 
        lastname: user.lastname, db_name: user.db_name, market_id: user.market_id, image_link: user.image_link
    },
      process.env.JWT_SECRET,{ expiresIn: '1d'}
    )
}





const user = {
    username: process.env.STANDARD_USER_USERNAME,
    role: process.env.STANDARD_USER_ROLE,
    login_id: process.env.STANDARD_USER_LOGIN_ID,
    login_type: process.env.STANDARD_USER_LOGIN_TYPE,
    firstname: process.env.STANDARD_USER_FIRSTNAME,
    lastname: process.env.STANDARD_USER_LASTNAME,
    db_name: process.env.STANDARD_USER_DBNAME,
    manager_id: "",
    agent_type: "",
    market_id: "",
    image_link: ""
}



 exports.token = generateAccessToken(user)





