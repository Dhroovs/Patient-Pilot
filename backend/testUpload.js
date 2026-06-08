const fs = require("fs");
const path = require("path");

async function testUpload() {
  try {
    const imagePath = path.join(__dirname, "uploads", "1780921729867.jpg");
    if (!fs.existsSync(imagePath)) {
      console.error("Test image not found:", imagePath);
      return;
    }
    const fileBuffer = fs.readFileSync(imagePath);
    const fileBlob = new Blob([fileBuffer], { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("prescription", fileBlob, "prescription.jpg");
    formData.append("language", "English");

    console.log("Sending POST request to http://localhost:5000/api/prescription/upload ...");
    const response = await fetch("http://localhost:5000/api/prescription/upload", {
      method: "POST",
      body: formData,
    });

    console.log("Response Status:", response.status);
    const data = await response.json();
    console.log("Response Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Request failed:", error);
  }
}

testUpload();
