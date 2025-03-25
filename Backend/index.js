import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import codeGenerationPrompt from "./src/codeGenerationPrompt.js";
import depGenerationPrompt from "./src/depGenerationPrompt.js";
import codeErrorreductionPrompt from "./src/codeErrorreductionPrompt.js";
import codeFixPrompt from "./src/codeFixPrompt.js";
import { ESLint } from "eslint";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      
       "https://webprompt-xi.vercel.app"
    ], // Allow only your frontend domain
    credentials: true, // Allow sending cookies/auth headers
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json());
dotenv.config();

// import session from "express-session";

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "default_secret", // Replace with a secure secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false, // Set to `true` if using HTTPS
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours
//     },
//   })
// );

// Store generated data in variables
let currentDependencies = "";
let currentCleanedCode = "";
let currentCommand = "echo 'No command set'";
let userData = {};

// ------------------> Eslint Configuration ------------------>
async function lintCode(code) {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintText(code);
  return results[0].output || code; // Return fixed code or original
}

// ------------------> Gemini Configuration ------------------ //
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ------------------> Fixed Routes ------------------ //

app.post("/api/set-command", (req, res) => {
  const { command } = req.body;
  if (command) {
    currentCommand = command;
    res.json({ success: true, message: "Command updated successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid command" });
  }
});

app.post("/api/get-user-prompt", async (req, res) => {
  try {
    const { userPrompt, userId } = req.body;

    console.log(userId, userPrompt);

    // Generate dependencies and code
    const depGenerationPromptText = depGenerationPrompt(userPrompt);
    const depGenerationPromptResult = await model.generateContent(
      depGenerationPromptText
    );
    const currentDependenciesRaw =
      await depGenerationPromptResult.response.text();

    console.log(currentDependenciesRaw);

    const currentDependencies = await lintCode(currentDependenciesRaw);

    const codeGenerationPromptText = codeGenerationPrompt(
      userPrompt,
      currentDependencies
    );

    const generatedCode = await model.generateContent(codeGenerationPromptText);

    const errorFreeGeneratePrompt = await codeErrorreductionPrompt(
      generatedCode.response.text()
    );

    const generation_config = {
      temperature: 0.7,
      top_p: 0.9,
      max_output_tokens: 7000,
    };

    const errorFreeCode = await model.generateContent(errorFreeGeneratePrompt, {
      generationConfig: generation_config,
    });

    const cleanedRawCode = await cleanJSONCode(errorFreeCode.response.text());

    const cleanedCode = await lintCode(cleanedRawCode);

    console.log(cleanedCode);

    userData = {
      ...userData,
      [userId]: {
        code: cleanedCode,
        dependencies: currentDependencies,
      },
    };

    console.log("Saved UserData ---> ", userData);

    const acctualData = Object.entries(userData).find(([id, usersData]) => {
      if (id === userId) {
        return usersData;
      }
    });

    console.log("acctualData ---> ", acctualData[0]);

    // console.log(req.session.currentCleanedCode);
    res.json({ code: acctualData[1], dependencies: acctualData[2] });
  } catch (error) {
    console.error("Error in processing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-command", async (req, res) => {
  const { dependencies } = req.body;

  res.json({
    command: `npm install vite react@18 react-dom@18 @vitejs/plugin-react postcss@^8.4.35 tailwindcss@^3.4.1 --save-dev autoprefixer eslint react-router-dom react-icons globals@^15.0.0 ${dependencies} `,
    secondCommand: `npm install eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals@^15.0.0 --save-dev`,
    thirdCommand: `npm pkg set type=module`,
    fourthCommand: `npx eslint src/**/*.{js,jsx} --format json`,
    fifthCommand: `npx vite build --emptyOutDir`,
  });
});

// // ------------------> Utility Functions ------------------ //
function cleanJSONCode(inputCode) {
  return inputCode
    .replace(/^```(json|javascript|js)?[\r\n]*/gm, "")
    .replace(/```$/gm, "")
    .replace(/^""[\r\n]*/gm, "")
    .replace(/^`[\r\n]*/gm, "")
    .trim();
}

const takeInput = async (error, code, dependencies) => {
  try {
    const codeFixPrompts = codeFixPrompt(error, code, dependencies);
    const someErrorFreeCode = await model.generateContent(codeFixPrompts);

    const errorFreeCode = cleanJSONCode(someErrorFreeCode.response.text());

    const secondVerification = await model.generateContent(
      codeErrorreductionPrompt(errorFreeCode, error)
    );

    return cleanJSONCode(secondVerification.response.text());
  } catch (err) {
    console.error("Error generating content:", err);
    return "";
  }
};

app.post("/api/errorcorrection", async (req, res) => {
  try {
    const { code, error, dependencies } = req.body;
    if (code && error) {
      const errorFreeCode = await takeInput(error, code, dependencies);
      const clearedCode = cleanJSONCode(errorFreeCode);
      return res.json({ cleancode: clearedCode || "" });
    }
    return res.json({ cleancode: "Nothing" });
  } catch (err) {
    console.error("Error processing request:", err);
    return res.status(500).json({ error: "Error processing request" });
  }
});

// ------------------> Server Start ------------------ //
const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
