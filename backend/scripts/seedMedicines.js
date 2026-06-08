require("dotenv").config();
const mongoose = require("mongoose");
const { generateEmbedding } = require("../services/embeddingService");
const Medicine = require("../models/Medicine");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const medicines = [
    {
      name: "Metformin",
      uses: "Helps control blood sugar levels in people with diabetes.",
      dosageGuidelines: "Usually taken once or twice daily with meals.",
      commonSideEffects: ["Nausea", "Diarrhea", "Stomach upset"],
      warnings: ["Avoid excessive alcohol", "Inform doctor if kidney problems"]
    }
  ];

  for (let med of medicines) {
    const textToEmbed = `${med.name}. ${med.uses}. ${med.dosageGuidelines}.`;
    const embedding = await generateEmbedding(textToEmbed);

    await Medicine.create({
      ...med,
      embedding
    });

    console.log("Inserted:", med.name);
  }

  process.exit();
}

seed();