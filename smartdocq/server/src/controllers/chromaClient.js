// // // chromaClient.js
// // import { ChromaClient } from "chromadb"; // Chroma DB client
// // import OpenAI from "openai";

// // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // // Step 2: Initialize Chroma client
// // export const chroma = new ChromaClient({
// //   path: "./chroma-data" // folder to store Chroma DB locally
// // });

// // // Step 3: Create or get collection
// // export async function getCollection() {
// //   try {
// //     // Try to get existing collection
// //     return await chroma.getCollection({ name: "documents" });
// //   } catch {
// //     // If not exist, create it
// //     return await chroma.createCollection({ name: "documents" });
// //   }
// // }

// // // Step 4: Generate embeddings for text
// // export async function generateEmbedding(text) {
// //   const response = await openai.embeddings.create({
// //     model: "text-embedding-3-small",
// //     input: text
// //   });
// //   return response.data[0].embedding;
// // }

// // // Step 5: Add documents to Chroma
// // export async function addDocument(id, text) {
// //   const collection = await getCollection();
// //   const embedding = await generateEmbedding(text);
// //   await collection.add({
// //     ids: [id],
// //     embeddings: [embedding],
// //     documents: [text]
// //   });
// // }

// // // Step 6: Query for similar documents
// // export async function querySimilar(text, topK = 3) {
// //   const collection = await getCollection();
// //   const embedding = await generateEmbedding(text);
// //   const result = await collection.query({
// //     queryEmbeddings: [embedding],
// //     nResults: topK
// //   });
// //   return result;
// // }

// // // Step 7 will be handled in your Q&A controller
// // // You can feed `querySimilar` results to Gemini API or OpenAI for answering
// // chromaClient.js
// import { ChromaClient } from "chromadb";
// //import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { OpenAIEmbeddings } from "langchain/embeddings";


// // Initialize Chroma client with local persistence
// export const chroma = new ChromaClient({
//   persistDirectory: "./chroma-data" // Local folder to store vectors
// });

// // Function to create a collection
// export async function createCollection(name = "documents") {
//   const collection = await chroma.createCollection({ name });
//   console.log("Collection created:", collection.name);
//   return collection;
// }

// // Function to add a document to a collection
// export async function addDocument(id, text, collectionName = "documents") {
//   const collection = await chroma.getCollection({ name: collectionName });
//   const embeddingModel = new OpenAIEmbeddings(); // You can change model here if needed
//   const vector = await embeddingModel.embedQuery(text);

//   await collection.add({
//     ids: [id],
//     metadatas: [{ text }],
//     embeddings: [vector],
//   });
//   console.log(`Document ${id} added to collection ${collectionName}`);
// }

// // Function to query similar documents
// export async function querySimilar(queryText, collectionName = "documents", k = 3) {
//   const collection = await chroma.getCollection({ name: collectionName });
//   const embeddingModel = new OpenAIEmbeddings();
//   const queryVector = await embeddingModel.embedQuery(queryText);

//   const results = await collection.query({
//     queryEmbeddings: [queryVector],
//     nResults: k,
//   });

//   return results;
// }
