import { Client, Account, TablesDB, Storage, ID, Avatars } from "appwrite";

export const config = {
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  projectId: "693de5b200399881a9bc",
  databaseId: "693def5500321182fc67",
  usersTableId: "users",
  storageId: "693df3630001a4c807f8", // Update this with your actual storage bucket ID
};

export const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId); // Replace with your project ID

export const account = new Account(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);
export { ID } from "appwrite";
