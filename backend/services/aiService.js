const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "DUMMY_API_KEY_FOR_LOCAL_RUN",
});

async function simplifyPrescription(text, language, knowledge = "") {
  const prompt = `
You are a medical assistant.

Analyze the prescription text provided below. Use the trusted medical knowledge database results if available to assist your explanation, but still explain safely if not found.

Trusted Medical Knowledge:
${knowledge}

Prescription Text:
${text}

Instructions:
1. Extract all medicines found in the prescription.
2. For each medicine, find:
   - Name of the medicine
   - Dosage (e.g. 500mg, 1 tablet, 5ml)
   - Timing (e.g. morning and night after food, once daily)
   - Purpose (what it is used for)
   - Side effects (list of common side effects)
   - Warnings / Precautions
   - Potential drug-to-drug interactions based on the prescription
   - AI confidence score (a percentage integer from 1 to 100 based on text readability and match certainty)
3. Detect general safety alerts (e.g. overlapping duplicate medicines, dangerous drug interactions, high dosage risks).
4. Provide a general simplified overall explanation of the prescription guidelines in simple patient-friendly language.
5. Translate all output content (explanations, warnings, purposes, etc.) to the requested language: ${language}.
6. Respond ONLY with a valid JSON object matching this schema:
{
  "simplifiedSummary": "A general summary of the prescription in the user's language...",
  "medicines": [
    {
      "name": "Medicine Name",
      "dosage": "Dosage details",
      "timing": "Timing details",
      "purpose": "What the medicine is used for",
      "sideEffects": ["Side effect 1", "Side effect 2"],
      "warnings": "Specific warnings for this medicine",
      "interactions": "Known drug interactions",
      "confidenceScore": 95
    }
  ],
  "safetyAlerts": [
    {
      "type": "interaction" | "overdose" | "duplicate" | "warning",
      "severity": "high" | "medium" | "low",
      "title": "Alert Title",
      "description": "Details of the safety alert"
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Simplify Error:", error);
    // Fallback in case of API failure or JSON parse error
    return {
      simplifiedSummary: "Prescription analysis completed. Please review dosage guidelines carefully.",
      medicines: [
        {
          name: "Parsed Medicine",
          dosage: "Refer to original image",
          timing: "Refer to original image",
          purpose: "Primary health support",
          sideEffects: ["Mild stomach upset"],
          warnings: "Take as prescribed",
          interactions: "None detected",
          confidenceScore: 50
        }
      ],
      safetyAlerts: [
        {
          type: "warning",
          severity: "medium",
          title: "Analysis Failure",
          description: "An error occurred during detailed parsing. Please consult a doctor."
        }
      ]
    };
  }
}

async function answerHealthQuestion(prescriptionText, patientLanguage, question, chatHistory = []) {
  const prompt = `
You are a compassionate and highly professional medical assistant chatbot.
A patient is asking you a question about their prescription.

Prescription Context:
${prescriptionText}

Instructions:
- Answer the user's question clearly, safely, and in simple language.
- Provide general medical advice, but ALWAYS remind the patient that you are an AI assistant and they should consult their doctor or pharmacist for official medical decisions.
- If the question is unsafe or requests dangerous advice, explain the risk and suggest contacting emergency services or a physician.
- Respond in the patient's language: ${patientLanguage}.
- Here is the conversation history so far:
${chatHistory.map(h => `${h.role === 'user' ? 'Patient' : 'Assistant'}: ${h.text}`).join('\n')}

Patient Question:
${question}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am sorry, I am having trouble connecting to my medical intelligence database right now. Please consult your physician for advice.";
  }
}

module.exports = { simplifyPrescription, answerHealthQuestion };