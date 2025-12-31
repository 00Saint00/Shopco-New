import { Client, Account, TablesDB, Storage, ID, Avatars } from "appwrite";

export const config = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  usersTableId: import.meta.env.VITE_APPWRITE_USERS_TABLE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
};

export const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId); // Replace with your project ID

export const account = new Account(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);
export { ID } from "appwrite";
