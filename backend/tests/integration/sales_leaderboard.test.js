const request = require('supertest')
const app  = require('../../src/app')
const { token }  = require('./genarate_token')
const pool = require('../../src/config/db');


describe("Sales Leaderboard Query Without Year And Parameter", () => {
    it('I should return the current month and year data', async() => {
        const res = await request(app)
        
        .get('/api/sales_leaderboard')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body).toEqual(expect.any(Array)); // Adjust to your actual return shape

   
    }) 

    // afterAll(async () => {
    //       await pool.end()
    // })
})


describe('Sales Leaderboard of specific agent_id with date and year', () => {
    it('It should return data array with one object', async () => {
        const res = await request(app)
            .get('/api/sales_leaderboard')
            .set('Authorization', `Bearer ${token}`)
            .query({ month: 'March', year: 2024, agent_id: 7870 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1); // ✅ This checks the array has one element
        expect(res.body[0]).toEqual(expect.any(Object)); // ✅ This ensures that one element is an object
    });

    // afterAll(async () => {
    //     await pool.end();
    // });
});


describe('Sales Leaderboard full year metrics of specific agent', () => {
    it('It should return an object with agentMetricsFullYear and yearAverage', async () => {
        const res = await request(app)
            .get('/api/sales_leaderboard')
            .set('Authorization', `Bearer ${token}`)
            .query({ fullyear: 'true', year: 2024, agent_id: 7870 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        expect(typeof res.body).toBe('object');
        expect(res.body).toHaveProperty('agentMetircsFullYear');
        expect(res.body).toHaveProperty('yearAverage');

        expect(Array.isArray(res.body.agentMetircsFullYear)).toBe(true); // ✅ should be an array
        expect(res.body.yearAverage).toEqual(expect.any(Object)); // ✅ should be an object
    });

    afterAll(async () => {
        await pool.end();
    });
});

