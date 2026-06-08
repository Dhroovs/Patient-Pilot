require("dotenv").config();
const { generateEmbedding } = require("./services/embeddingService");

async function test() {
  const emb = await generateEmbedding("Metformin for diabetes");
  console.log("Vector size:", emb.length);
}

test();