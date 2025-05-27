const request = require('supertest')
const app  = require('../../src/app')
require('dotenv').config({ path: '../../.env.test' });
const jwt = require('jsonwebtoken')
const { token }  = require('./genarate_token')



describe('Has Token', () => {
    it('Toke should not the be blank or undefined', () => {
        expect(token).toBeDefined()
    })
})
describe("Check Token", () => {
    it('should be a valid JWT token and decoded properly', () => {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        expect(decoded).toBeDefined();
        expect(decoded.username).toBe(process.env.STANDARD_USER_USERNAME);
        expect(decoded.role).toBe(process.env.STANDARD_USER_ROLE);
        expect(decoded.login_id).toBe(process.env.STANDARD_USER_LOGIN_ID);
    }) 
    
})