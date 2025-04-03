import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }
  
  try {
    const { db } = await connectToDatabase();
    const data = req.body;
    
    // Add IP and headers info
    const enrichedData = {
      ...data,
      serverTimestamp: new Date(),
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer'] || null
    };
    
    // Handle batch events
    if (data.event === 'batch' && Array.isArray(data.events)) {
      // Enrich each event with IP and headers
      const enrichedEvents = data.events.map(event => ({
        ...event,
        serverTimestamp: new Date(),
        ipAddress: enrichedData.ipAddress,
        userAgent: enrichedData.userAgent,
        referer: enrichedData.referer,
        sessionId: data.sessionId,
        visitorId: data.visitorId
      }));
      
      // Insert all events as separate documents
      await db.collection('analytics').insertMany(enrichedEvents);
    } else {
      // Insert single event
      await db.collection('analytics').insertOne(enrichedData);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
} 