import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

// Fix for Windows DNS resolution of MongoDB SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if not permitted
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const PRIMARY_URI = process.env.MONGODB_URI || 'mongodb+srv://aimanyousuf78_db_user:RP1ejc8Hy54nJ7Mg@cluster0.llqvcmf.mongodb.net/aiman_collection?retryWrites=true&w=majority&appName=Cluster0';
const LOCAL_URI = 'mongodb://127.0.0.1:27017/aiman_collection';

let isConnected = false;
let activeUriType = 'None';

export async function connectMongoDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // First attempt: Connect to User's MongoDB Atlas URI
  if (PRIMARY_URI) {
    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');
      const conn = await mongoose.connect(PRIMARY_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      isConnected = true;
      activeUriType = 'MongoDB Atlas Cloud';
      console.log(`✨ [MongoDB] Successfully connected to Atlas Cloud: ${conn.connection.name} @ ${conn.connection.host}`);
      setupEventHandlers();
      return conn;
    } catch (atlasErr) {
      console.warn(`⚠️ [MongoDB] Atlas Cloud connection failed (${atlasErr.message}). Attempting local MongoDB service fallback...`);
    }
  }

  // Second attempt: Fallback to local MongoDB service (which is running on localhost:27017)
  try {
    console.log('[MongoDB] Connecting to Local MongoDB service (localhost:27017)...');
    const localConn = await mongoose.connect(LOCAL_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    activeUriType = 'Local MongoDB (localhost:27017)';
    console.log(`✨ [MongoDB] Successfully connected to Local MongoDB: ${localConn.connection.name}`);
    setupEventHandlers();
    return localConn;
  } catch (localErr) {
    console.error('❌ [MongoDB] Local connection also failed:', localErr.message);
    throw localErr;
  }
}

function setupEventHandlers() {
  mongoose.connection.on('error', (err) => {
    console.error('❌ [MongoDB] Runtime error:', err.message);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [MongoDB] Disconnected from MongoDB. Reconnecting...');
    isConnected = false;
  });
}

export function getMongoStatus() {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    stateCode,
    statusText: states[stateCode] || 'Unknown',
    isConnected: stateCode === 1,
    type: activeUriType,
    database: mongoose.connection.name || 'aiman_collection',
    host: mongoose.connection.host || 'unknown'
  };
}
