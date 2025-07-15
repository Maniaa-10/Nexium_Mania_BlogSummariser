// src/lib/mongodb.ts
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) 
{
  throw new Error('MongoDB URI not found in .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global 
{
  var _mongoClientPromise: Promise<MongoClient>
}

if (!global._mongoClientPromise) 
{
  client = new MongoClient(uri!, options)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise
export default clientPromise
