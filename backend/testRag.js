require("dotenv").config();
const mongoose = require("mongoose");
const { retrieveRelevantMedicines } = require("./services/ragService");

async function test() {
  await mongoose.connect(process.env.MONGO_URI);

  const results = await retrieveRelevantMedicines("tablet for blood sugar control");

  console.log(results.map(r => r.name));

  process.exit();
}

test();