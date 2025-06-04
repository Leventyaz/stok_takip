import { MongoClient, Db } from 'mongodb';

// API base URL for all requests
const API_BASE_URL = 'https://stok-takip-hipd.vercel.app/api';

// Class to handle external API fetching
class ExternalApiClient {
  async fetchData(endpoint: string) {
    try {
      console.log(`Fetching data from: ${API_BASE_URL}/${endpoint}`);
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }
}

// Simplified ApiCollection to only forward requests to the API
class ApiCollection {
  private endpoint: string;
  private client: ExternalApiClient;

  constructor(collectionName: string, client: ExternalApiClient) {
    this.endpoint = collectionName;
    this.client = client;
  }

  // Any query will be ignored and we'll just fetch from the API
  async find() {
    return {
      limit: () => {
        return {
          toArray: async () => {
            return this.client.fetchData(this.endpoint);
          }
        };
      },
      sort: () => {
        return {
          limit: () => {
            return {
              toArray: async () => {
                return this.client.fetchData(this.endpoint);
              }
            };
          },
          toArray: async () => {
            return this.client.fetchData(this.endpoint);
          }
        };
      },
      toArray: async () => {
        return this.client.fetchData(this.endpoint);
      }
    };
  }

  async aggregate() {
    // For stats endpoint specifically
    if (this.endpoint === 'stoklar') {
      try {
        const statsData = await this.client.fetchData('stats');
        return {
          toArray: async () => [{ _id: null, totalValue: statsData.totalValue }]
        };
      } catch (error) {
        console.error('Error in aggregate:', error);
        return {
          toArray: async () => [{ _id: null, totalValue: 0 }]
        };
      }
    }
    
    return {
      toArray: async () => []
    };
  }

  async countDocuments() {
    try {
      if (this.endpoint === 'stoklar') {
        const data = await this.client.fetchData('stoklar');
        return data.length;
      }
      
      if (this.endpoint === 'hareketler') {
        const data = await this.client.fetchData('hareketler');
        return data.length;
      }
      
      const data = await this.client.fetchData(this.endpoint);
      return data.length;
    } catch (error) {
      console.error('Error in countDocuments:', error);
      return 0;
    }
  }
  
  async insertOne(document: any) {
    console.log('Insert operation not supported with external API');
    return { insertedId: 'not-supported' };
  }
}

// API DB implementation
class ApiDB {
  private client: ExternalApiClient;

  constructor(client: ExternalApiClient) {
    this.client = client;
  }

  collection(name: string) {
    return new ApiCollection(name, this.client);
  }
}

let cachedClient: ExternalApiClient | null = null;
let cachedDb: ApiDB | null = null;

export async function connectToDatabase() {
  // If we already have a connection, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Always use the API client, never try MongoDB
  cachedClient = new ExternalApiClient();
  cachedDb = new ApiDB(cachedClient);
  
  console.log('Using external API for data');
  return { client: cachedClient, db: cachedDb };
} 