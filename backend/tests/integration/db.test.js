const pool = require('../../src/config/db');


let connected = false;

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ DB connected');
    connected = true;
    connection.release();
  } catch (err) {
    console.error('❌ Failed to connect:', err);
  }
};

describe('Database Connection', () => {
  beforeAll(async () => {
    await connectDB(); // call the function before running tests
  });

  afterAll(async () => {
    await pool.end()
  })

  it('should connect to the database', () => {
    expect(connected).toBe(true);
  });
});
