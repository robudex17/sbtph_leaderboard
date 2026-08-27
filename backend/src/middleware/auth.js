const jwt = require('jsonwebtoken')

exports.authenticateToken = async (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token){
        return res.status(401). json({message: 'Access Denied: No Token Provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err){
            return res.status(403).json({message: 'Invalid Access Token'})

        }
        // console.log(user)
        req.user = user
        next()
    })
}

exports.authorizeRoles = (...allowedRoles ) => {
    return (req,res, next) => {
        if(!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({message: 'Access Denied: Insufficient Permission'})
        }
        next()
    }
}

exports.allowedAdmins = async (req, res, next) => {
    const employeeId = req.user.login_id
    const [result] = await pool.execute(
        'SELECT employee_id  FROM `allowed_admins` WHERE employee_id = ?',
        [employeeId]
    )

    if (result.length === 0) {
        return res.status(403).json({ message: 'Access Denied: You are not allowed to perform this action' })
    }
    next()
}   
