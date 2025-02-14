
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Khoirul78:Khoirul78@cluster0.zhnha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "DBIzumii";

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function getComments() {
  const db = await connectToDatabase();
  const comments = await db.collection('comments').find({}).toArray();
  return comments;
}

export async function addComment(comment) {
  const db = await connectToDatabase();
  const result = await db.collection('comments').insertOne(comment);
  return result;
}
