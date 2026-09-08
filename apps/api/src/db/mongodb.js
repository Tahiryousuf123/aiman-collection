import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

// Configure DNS resolvers for systems where local DNS blocks MongoDB SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Direct standard connection string using Atlas replica-set shards (bypasses SRV DNS failures)
const DIRECT_REPLICA_URI = 'mongodb://aimanyousuf78_db_user:RP1ejc8Hy54nJ7Mg@ac-bwhgkdi-shard-00-00.llqvcmf.mongodb.net:27017,ac-bwhgkdi-shard-00-01.llqvcmf.mongodb.net:27017,ac-bwhgkdi-shard-00-02.llqvcmf.mongodb.net:27017/aiman_collection?ssl=true&replicaSet=atlas-skaacz-shard-0&authSource=admin&retryWrites=true&w=majority';
const SRV_URI = 'mongodb+srv://aimanyousuf78_db_user:RP1ejc8Hy54nJ7Mg@cluster0.llqvcmf.mongodb.net/aiman_collection?retryWrites=true&w=majority&appName=Cluster0';
const PRIMARY_URI = process.env.MONGODB_URI || DIRECT_REPLICA_URI;
const LOCAL_URI = 'mongodb://127.0.0.1:27017/aiman_collection';

// Global cache for Serverless environments (Vercel Lambdas)
let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null, type: 'None' };
}

export async function connectMongoDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    return cached.promise;
  }

  const connectOptions = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 6000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10
  };

  cached.promise = (async () => {
    // 1. Try Primary / Direct Replica URI
    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');
      const conn = await mongoose.connect(PRIMARY_URI, connectOptions);
      cached.conn = conn;
      cached.type = 'MongoDB Atlas Cloud (Direct Replica)';
      console.log(`✨ [MongoDB] Connected to Atlas Cloud: ${conn.connection.name} @ ${conn.connection.host}`);
      setupEventHandlers();
      return conn;
    } catch (primaryErr) {
      console.warn(`⚠️ [MongoDB] Primary connection attempt failed (${primaryErr.message}). Trying SRV fallback...`);
    }

    // 2. Fallback to SRV URI if primary was different
    if (PRIMARY_URI !== SRV_URI) {
      try {
        const conn = await mongoose.connect(SRV_URI, connectOptions);
        cached.conn = conn;
        cached.type = 'MongoDB Atlas Cloud (SRV)';
        console.log(`✨ [MongoDB] Connected via SRV: ${conn.connection.name}`);
        setupEventHandlers();
        return conn;
      } catch (srvErr) {
        console.warn(`⚠️ [MongoDB] SRV fallback failed: ${srvErr.message}`);
      }
    }

    // 3. Fallback to local MongoDB if available (development)
    try {
      console.log('[MongoDB] Trying local MongoDB service fallback...');
      const localConn = await mongoose.connect(LOCAL_URI, { ...connectOptions, serverSelectionTimeoutMS: 3000 });
      cached.conn = localConn;
      cached.type = 'Local MongoDB (localhost:27017)';
      console.log(`✨ [MongoDB] Connected to Local MongoDB`);
      setupEventHandlers();
      return localConn;
    } catch (localErr) {
      cached.promise = null;
      console.warn('⚠️ [MongoDB] All MongoDB connections failed, using in-memory/disk fallback:', localErr.message);
      throw localErr;
    }
  })();

  try {
    const conn = await cached.promise;
    return conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}

function setupEventHandlers() {
  mongoose.connection.on('error', (err) => {
    console.error('❌ [MongoDB] Runtime connection error:', err.message);
    if (cached) cached.conn = null;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [MongoDB] Connection disconnected');
    if (cached) cached.conn = null;
  });
}

export function getMongoStatus() {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    stateCode,
    statusText: states[stateCode] || 'Unknown',
    isConnected: stateCode === 1,
    type: cached.type || 'None',
    database: mongoose.connection.name || 'aiman_collection',
    host: mongoose.connection.host || 'unknown'
  };
}
