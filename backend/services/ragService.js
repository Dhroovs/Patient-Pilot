const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");
const { generateEmbedding } = require("./embeddingService");

async function retrieveRelevantMedicines(text) {
  // Check if database is connected before querying to avoid Mongoose buffering timeouts
  if (mongoose.connection.readyState !== 1) {
    console.log("⚠️ Database not connected. Skipping RAG medicine retrieval.");
    return [];
  }

  try {
    const embedding = await generateEmbedding(text);

    const medicines = await Medicine.aggregate([
      {
        $vectorSearch: {
          index: "medicine_vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 50,
          limit: 50
        }
      }
    ]);

    return medicines;
  } catch (error) {
    console.error("Error retrieving relevant medicines from database:", error);
    return [];
  }
}

module.exports = { retrieveRelevantMedicines };