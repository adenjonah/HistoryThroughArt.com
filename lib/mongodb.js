import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'analytics';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// The connection string format should be:
// mongodb+srv://<db_username>:<db_password>@hta-analytics.vu3uele.mongodb.net/?retryWrites=true&w=majority&appName=HTA-Analytics

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // If the connection exists, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create new connection
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB);

  // Cache the client and db connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
} 