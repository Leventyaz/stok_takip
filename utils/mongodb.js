import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI ortam değişkeni tanımlanmamış');
}

if (!MONGODB_DB) {
    throw new Error('MONGODB_DB ortam değişkeni tanımlanmamış');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    // Önbellekte varsa onu kullan
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    // MongoDB bağlantısını oluştur
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = await client.db(MONGODB_DB);

    // Bağlantıyı önbelleğe al
    cachedClient = client;
    cachedDb = db;

    return { client, db };
} 