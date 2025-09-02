import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const generateID = () => ID.unique();
export const query = Query;
export const dbID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

export const moodsCollection =
  process.env.NEXT_PUBLIC_APPWRITE_MOODS_COLLECTION_ID;

export const dailyStatsCollection =
  process.env.NEXT_PUBLIC_APPWRITE_STATS_COLLECTION_ID;

export const userMoodsCollection =
  process.env.NEXT_PUBLIC_APPWRITE_USER_MOODS_COLLECTION_ID;
