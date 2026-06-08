const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { extractTextFromImage } = require("../services/ocrService");
const { simplifyPrescription, answerHealthQuestion } = require("../services/aiService");
const Prescription = require("../models/Prescription");
const { retrieveRelevantMedicines } = require("../services/ragService");

const router = express.Router();
const historyFilePath = path.join(__dirname, "../uploads/history.json");

const getLocalHistory = () => {
  if (!fs.existsSync(historyFilePath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(historyFilePath, "utf8"));
  } catch (e) {
    return [];
  }
};

const saveLocalHistory = (data) => {
  const dir = path.dirname(historyFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(historyFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route - Prescription Upload & Analysis
router.post("/upload", upload.single("prescription"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imagePath = req.file.path;
    const extractedText = await extractTextFromImage(imagePath);

    if (!extractedText) {
      return res.status(500).json({ success: false, message: "OCR failed to read text from image" });
    }

    const language = req.body.language || "English";

    // 🔍 RAG STEP
    const relevantMedicines = await retrieveRelevantMedicines(extractedText);

    let knowledge = "";
    if (relevantMedicines && relevantMedicines.length > 0) {
      knowledge = relevantMedicines.map(med => `
Medicine Name: ${med.name}
Uses: ${med.uses}
Dosage Guidelines: ${med.dosageGuidelines || "Not available"}
Common Side Effects: ${med.commonSideEffects?.join(", ") || "Not available"}
Warnings: ${med.warnings || "Not available"}
      `).join("\n\n");
    } else {
      knowledge = "No matching medicines found in knowledge base.";
    }

    // 🧠 Send to AI
    const simplifiedData = await simplifyPrescription(
      extractedText,
      language,
      knowledge
    );

    const relativeImagePath = `/uploads/${path.basename(imagePath)}`;
    const prescriptionData = {
      extractedText,
      simplifiedText: simplifiedData.simplifiedSummary, // For legacy compatibility
      simplifiedSummary: simplifiedData.simplifiedSummary,
      language,
      imagePath: relativeImagePath,
      medicines: simplifiedData.medicines || [],
      safetyAlerts: simplifiedData.safetyAlerts || []
    };

    let newPrescription;
    if (mongoose.connection.readyState !== 1) {
      const localHistory = getLocalHistory();
      newPrescription = {
        _id: Date.now().toString(),
        ...prescriptionData,
        createdAt: new Date().toISOString()
      };
      localHistory.unshift(newPrescription);
      saveLocalHistory(localHistory);
      console.log("Saved prescription locally (Local JSON Database mode)");
    } else {
      newPrescription = await Prescription.create(prescriptionData);
    }

    res.json({
      success: true,
      prescription: newPrescription,
      matchedMedicines: relevantMedicines.map(m => m.name) // optional debug info
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing prescription"
    });
  }
});

// Route - Health AI Assistant Chat
router.post("/chat", async (req, res) => {
  try {
    const { prescriptionId, message, chatHistory } = req.body;
    if (!prescriptionId || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    let prescription;
    if (mongoose.connection.readyState !== 1) {
      const localHistory = getLocalHistory();
      prescription = localHistory.find(item => item._id === prescriptionId);
    } else {
      prescription = await Prescription.findById(prescriptionId);
    }

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found." });
    }

    const contextText = `
Prescription Extracted Text: ${prescription.extractedText}
Simplified Summary: ${prescription.simplifiedSummary}
Medicines: ${JSON.stringify(prescription.medicines)}
Safety Alerts: ${JSON.stringify(prescription.safetyAlerts)}
`;

    const aiResponse = await answerHealthQuestion(
      contextText,
      prescription.language || "English",
      message,
      chatHistory || []
    );

    res.json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ success: false, message: "Error in AI Chat assistant." });
  }
});

// Route - Get history
router.get("/history", async (req, res) => {
  try {
    let history;
    if (mongoose.connection.readyState !== 1) {
      history = getLocalHistory();
    } else {
      history = await Prescription.find().sort({ createdAt: -1 });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// Route - Delete Single record
router.delete("/delete/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const localHistory = getLocalHistory();
      const updatedHistory = localHistory.filter(item => item._id !== req.params.id);
      saveLocalHistory(updatedHistory);
    } else {
      await Prescription.deleteOne({ _id: req.params.id });
    }
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// Route - Delete All records
router.delete("/delete-all", async (req, res) => {
  try {
    console.log("🔥 DELETE ALL API HIT");
    if (mongoose.connection.readyState !== 1) {
      saveLocalHistory([]);
    } else {
      const result = await Prescription.deleteMany({});
      console.log("Deleted Count:", result.deletedCount);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

module.exports = router;
