const request = require('supertest')

const app  = require('../../src/app')


describe('App Routes', () => {
  it('should return 200 for /api/ping', async () => {
    const res = await request(app).get('/api/ping')
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('pong')
  })
})