const axios = require("axios");
const fs = require("fs");
const Tesseract = require("tesseract.js");

const extractTextFromImage = async (imagePath) => {
  // First, check if VISION_API_KEY is available
  if (process.env.VISION_API_KEY) {
    try {
      console.log("Trying Google Vision OCR...");
      const imageFile = fs.readFileSync(imagePath);
      const base64Image = imageFile.toString("base64");

      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`,
        {
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: "TEXT_DETECTION",
                },
              ],
            },
          ],
        }
      );

      const text = response.data.responses[0].fullTextAnnotation?.text || "";
      if (text && text.trim()) {
        console.log("Google Vision OCR Succeeded");
        return text;
      }
      console.log("Google Vision OCR returned empty text. Falling back to Tesseract...");
    } catch (error) {
      console.error("Vision OCR Error, falling back to Tesseract:", error.response?.data || error.message);
    }
  } else {
    console.log("VISION_API_KEY is missing. Using Tesseract local OCR directly...");
  }

  // Tesseract.js Fallback
  try {
    console.log("Running Tesseract OCR on:", imagePath);
    const result = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: m => console.log(`[Tesseract]: ${m.status} - ${Math.round(m.progress * 100)}%`) }
    );
    console.log("Tesseract OCR completed successfully");
    return result.data.text;
  } catch (error) {
    console.error("Tesseract OCR Error:", error);
    return null;
  }
};

module.exports = { extractTextFromImage };