require("dotenv").config();
const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");
const { generateEmbedding } = require("../services/embeddingService");

async function updateEmbeddings() {
  await mongoose.connect(process.env.MONGO_URI);

  const medicines = await Medicine.find();

  for (let med of medicines) {
    const textToEmbed = `${med.name}. ${med.uses}. ${med.dosageGuidelines}.`;

    const embedding = await generateEmbedding(textToEmbed);

    med.embedding = embedding;
    await med.save();

    console.log("Updated:", med.name);
  }

  console.log("All medicines updated with embeddings.");
  process.exit();
}

updateEmbeddings();