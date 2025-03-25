import React, { useState, useRef, useEffect } from "react";
import { Terminal } from "xterm";
import { WebContainer } from "@webcontainer/api";
import axios from "axios";
import "xterm/css/xterm.css";
import ExecutionPage from "./Components/ExecutionPage/ExecutionPage";
import "./App.css";

function App() {
  const [source, setSource] = useState(""); // State to hold the server URL
  const terminalRef = useRef(null); // Reference to the terminal container in the DOM
  const webContainerRef = useRef(null); // Reference to the WebContainer instance
  const inputWriterRef = useRef(null); // Reference to the shell's input writer
  const [code, setCode] = useState(null); // State to hold the code to be executed
  const editor = useRef(null);
  const [errors, setErrors] = useState("");
  
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const lastReload = localStorage.getItem("lastReload");
    const currentTime = Date.now();

    if (!lastReload) {
      localStorage.setItem("lastReload", currentTime);
    } else if (currentTime - lastReload > 5000) {
      // 5 seconds threshold
      localStorage.setItem("lastReload", currentTime);
      window.location.reload();
    }
  }, []);

  const indexHtml = {
    "index.html": {
      file: {
        contents: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vite + React</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.jsx"></script>
          </body>
        </html>
        `,
      },
    },
    "vite.config.js": {
      file: {
        contents: `
        import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Allow cross-origin requests for development
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },build: {
    // Ensure assets are served with correct headers in production
    assetsInlineLimit: 0, // Disable inlining assets to avoid issues
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
    },
  },
});

        
`,
      },
    },
    "tailwind.config.js": {
      file: {
        contents: `/** @type {import('tailwindcss').Config} */
        export default {
          content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
          theme: {
            extend: {},
          },
          plugins: [],
        };
        `,
      },
    },
    "postcss.config.cjs": {
      file: {
        contents: `
        module.exports = {
          plugins: {
            tailwindcss: {},
            autoprefixer: {},
          },
        };
        
        
        `,
      },
    },
    "eslintrc.js": {
      file: {
        contents: `module.exports = {
          extends: ["eslint:recommended", "plugin:import/errors", "plugin:import/warnings"],
          plugins: ["import"],
          rules: {
            "import/no-unresolved": "error", // ❌ Error when an import is missing or incorrect
            "import/no-extraneous-dependencies": "error" // ❌ Error when an import is missing from package.json
          },
          settings: {
            "import/resolver": {
              node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
                moduleDirectory: ["node_modules", "src"]
              }
            }
          }
        };
        
        `,
      },
    },
    "eslint.config.js": {
      file: {
        contents: `
        import js from '@eslint/js'
        import globals from 'globals'
        import react from 'eslint-plugin-react'
        import reactHooks from 'eslint-plugin-react-hooks'
        import reactRefresh from 'eslint-plugin-react-refresh'

        export default [
          { ignores: ['dist'] },
          {
            files: ['**/*.{js,jsx}'],
            languageOptions: {
              ecmaVersion: 2020,
              globals: globals.browser,
              parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
              },
            },
            settings: { react: { version: '18.3' } },
            plugins: {
              react,
              'react-hooks': reactHooks,
              'react-refresh': reactRefresh,
            },
            rules: {
              ...js.configs.recommended.rules,
              ...react.configs.recommended.rules,
              ...react.configs['jsx-runtime'].rules,
              ...reactHooks.configs.recommended.rules,
              'react/jsx-no-target-blank': 'off',
              'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
              ],
            },
          },
        ]
`,
      },
    },
  };

  async function runViteBuild(webContainer) {
    try {
      const process = await webContainer.spawn("npx", [
        "vite",
        "build",
        "--emptyOutDir",
      ]);

      let rawOutput = "";
      let errorLog = "";

      process.output.pipeTo(
        new WritableStream({
          write: (data) => (rawOutput += data),
        })
      );

      await process.exit;

      if (!rawOutput.trim()) {
        console.log("No Vite build output received.");
        return;
      }

      console.log("Vite Build Output:\n", rawOutput);

      if (rawOutput.includes("error") || rawOutput.includes("failed")) {
        errorLog = rawOutput;
      }

      if (errorLog !== "") {
        console.error("Vite Build Errors:\n", errorLog);
        fetchCodeForErrorCorrection(errorLog);
        console.log(errorLog);
      } else {
        console.log("Vite build completed successfully.");
      }
    } catch (e) {
      console.error("Error running Vite build:", e);
    }
  }

  async function runEslint(webContainer) {
    try {
      const process = await webContainer.spawn("npx", [
        "eslint",
        "--format",
        "json",
        "src/",
      ]);

      let rawOutput = "";
      let errorLog = "";

      // process.output.pipeTo(
      //   new WritableStream({
      //     write: (data) => (rawOutput += data),
      //   })
      // );

      await process.exit;

      if (!rawOutput.trim()) {
        console.log("No ESLint output received.");
        return;
      }

      console.log(rawOutput);

      const eslintErrors = JSON.parse(rawOutput);
      console.log(eslintErrors);


      eslintErrors.forEach((file) => {
        file.messages.forEach((msg) => {
          if (msg.ruleId !== "") {
            errorLog += `File: ${file.filePath}\nError: ${msg.message}\n\n`;
          }
        });
      });

      console.log("ESLint Errors:\n", errorLog || "No import errors found.");

      runEslintForImport();

      if (errorLog !== "") {
        fetchCodeForErrorCorrection(errorLog);
        inputWriterRef.current("Waiting for code correction...");
      }
    } catch (e) {
      console.error("Error running ESLint:", e);
    }
  }

  const executeCommand = (inputWriter, terminal, command, delay) => {
    return new Promise((resolve) => {
      if (!command) return resolve();
      setTimeout(() => {
        terminal.writeln(`Executing: ${command}`);
        inputWriter.write(`${command}\n`);
        resolve();
      }, delay);
    });
  };

  const checkDependenciesInstalled = async (inputWriter, terminal) => {
    return new Promise((resolve) => {
      terminal.writeln("Checking for dependency installation...");
      inputWriter.write(`npm install\n`);

      setTimeout(() => {
        terminal.writeln("Dependencies installed.");
        inputWriter.write(`npx vite\n`);
        resolve();
      }, 10000); // Allow time for installation
    });
  };

  const fetchCodeandRun = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const data = localStorage.getItem("code");

      if (data) {
        const parsedData = await JSON.parse(data);

        console.log("Fetched and parsed code structure:", parsedData);

        const mergedCode = {
          ...indexHtml,
          ...parsedData,
          src: parsedData.src || {
            "main.jsx": {
              file: {
                contents: `import React from 'react';
  import ReactDOM from 'react-dom';

  function App() {
    return <h1>Hello, World!</h1>;
  }

  ReactDOM.render(<App />, document.getElementById('root'));
  `,
              },
            },
          },
        };

        setCode(mergedCode);
        console.log("Code updated successfully.");
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      setErrors("Server is Busy, please try again");
      await fetchCodeForErrorCorrection(error.message);
      console.log(error.message);
      console.log("Error detected on parsed data, retrying...");
    }
  };

  const fetchCodeForErrorCorrection = async (errorCode = "") => {
    try {
      const codeResponse = localStorage.getItem("code");
      const dependencies = localStorage.getItem("dependencies");

      let errorFreeCode;

      console.log("code is getting error free");

      if (errorCode) {
        errorFreeCode = await axios.post(
          "https://webprompt-1.onrender.com/api/errorcorrection",
          {
            code: codeResponse,
            error: errorCode,
            dependencies: dependencies,
          }
        );

        console.log("might be error free code is generated");

        const data = errorFreeCode?.data?.cleancode;

        console.log(data);

        if (data) {
          const parseData = data;
          // console.log( parseData);

          if (!parseData) {
            console.log("No data received in fetchCodeForErrorCorrection");
            return;
          }

          console.log("error free code setting up in localStorage");

          localStorage.setItem("code", parseData);

          const fixedCode = localStorage.getItem("code");

          const mergedCode = {
            ...indexHtml,
            ...fixedCode,
            src: fixedCode.src || codeResponse,
          };

          await webContainerRef.current.mount(mergedCode);
          runEslint(webContainerRef.current);
          runViteBuild(webContainerRef.current);

        }

        const lastReload = localStorage.getItem("lastReload");
        const currentTime = Date.now();

        if (!lastReload) {
          localStorage.setItem("lastReload", currentTime);
        } else if (currentTime - lastReload > 5000) {
          // 5 seconds threshold
          localStorage.setItem("lastReload", currentTime);
          window.location.reload();
        }
      }
    } catch (error) {
      console.log("error in fetchCodeForErrorCorrection:", error.message);
      fetchCodeForErrorCorrection(errorCode);
    }
  };

  // Fetch code on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCodeandRun();
      } catch (error) {
        console.error("Error in fetchCodeandRun:", error);
      }
    };

    fetchData();
  }, []); 

  const fetchCommandAndRun = async (inputWriter, terminal) => {
    try {
      const dependencies = localStorage.getItem("dependencies");
      const response = await axios.get(
        "https://webprompt-1.onrender.com/api/get-command",
        { dependencies }
      );
      const {
        command,
        secondCommand,
        thirdCommand,
        fourthCommand,
        fifthCommand,
      } = response.data;

      if (command) {
        terminal.writeln(`Executing: ${command}`);
        await executeCommand(inputWriter, terminal, command, 2000); // Wait for execution
      } else {
        terminal.writeln("No command received from backend.");
      }

      if (dependencies) {
        terminal.writeln(`Executing: npm i ${dependencies}`);
        await executeCommand(
          inputWriter,
          terminal,
          `npm i ${dependencies}`,
          5000
        ); // Wait for execution
      } else {
        terminal.writeln("No dependencies found.");
      }

      // Sequential Execution with proper delays
      if (secondCommand)
        await executeCommand(inputWriter, terminal, secondCommand, 3000);
      if (thirdCommand)
        await executeCommand(inputWriter, terminal, thirdCommand, 3000);
      if (fourthCommand)
        await executeCommand(inputWriter, terminal, fourthCommand, 4000);
      if (fifthCommand)
        await executeCommand(inputWriter, terminal, fifthCommand, 4000);

      // Ensure dependencies are installed before running ESLint
      await checkDependenciesInstalled(inputWriter, terminal);

      terminal.writeln("Running ESLint...");
      runEslint(webContainerRef.current);

      terminal.writeln("Running ViteBuilder...");
      runViteBuild(webContainerRef.current);
    } catch (error) {
      terminal.writeln(`Error fetching command: ${error.message}`);
    }
  };

  // Initialize WebContainer only when code is available
  useEffect(() => {
    const boot = async () => {
      if (!code) return; // Ensure code is available

      const terminal = new Terminal({ convertEol: true, cursorBlink: true });
      terminal.open(terminalRef.current);
      terminal.writeln("Welcome to WebContainer Terminal!");

      const webContainer = await WebContainer.boot();
      webContainerRef.current = webContainer;

      await webContainerRef.current.mount(code); // Mount code after it's available

      const shellProcess = await webContainerRef.current.spawn("jsh", {
        terminal: { cols: terminal.cols, rows: terminal.rows },
      });

      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      const inputWriter = shellProcess.input.getWriter();
      inputWriterRef.current = inputWriter;

      terminal.onData((data) => {
        inputWriter.write(data);
      });

      await fetchCommandAndRun(inputWriter, terminal);

      await webContainer.fs.writeFile(
        "./eslint.config.js",
        `
          import js from '@eslint/js'
          import globals from 'globals'
          import react from 'eslint-plugin-react'
          import reactHooks from 'eslint-plugin-react-hooks'
          import reactRefresh from 'eslint-plugin-react-refresh'

          export default [
            { ignores: ['dist'] },
            {
              files: ['**/*.{js,jsx}'],
              languageOptions: {
                ecmaVersion: 2020,
                globals: globals.browser,
                parserOptions: {
                  ecmaVersion: 'latest',
                  ecmaFeatures: { jsx: true },
                  sourceType: 'module',
                },
              },
              settings: { react: { version: '18.3' } },
              plugins: {
                react,
                'react-hooks': reactHooks,
                'react-refresh': reactRefresh,
              },
              rules: {
                ...js.configs.recommended.rules,
                ...react.configs.recommended.rules,
                ...react.configs['jsx-runtime'].rules,
                ...reactHooks.configs.recommended.rules,
                'react/jsx-no-target-blank': 'off',
                'react-refresh/only-export-components': [
                  'warn',
                  { allowConstantExport: true },
                ],
              },
            },
          ]
  `
      );

      webContainerRef.current.on("server-ready", (port, url) => {
        const serverUrl = `http://${url}:${port}`;
        setSource(url);
        terminal.writeln(`Server running at ${serverUrl}`);
      });
    };

    boot();
  }, [code]);


  return (
    <div
      className="justify-center items-center flex gap-4 lg:p-3
    lg:w-[100vw] lg:h-[90vh] lg:flex-row flex-col-reverse w-screen "
    >
      <section className=" lg:w-[50%] w-screen flex flex-col gap-15 lg:h-full">
        <div className="w-full h-[70%] rounded-xl  order-2 border-[#2f2f36] ">
          <ExecutionPage ref={editor} codex={code ? code : indexHtml} />
        </div>
        <div
          ref={terminalRef}
          className="outputPanel lg:h-[250px] h-[150px] pl-3 pr-16 text-wrap w-full flex flex-col-reverse
          order-2 border-[#fff] rounded-xl overflow-y-scroll"
        />
      </section>

      {/* Preview iframe, shown only when the server is running  */}
      <section
        className=" lg:w-[50%] w-screen lg:h-full h-[700px] rounded-3xl order-2 border-[#2f2f36] 
        "
        // bg-gradient-to-tl from-[#e33cefe9] to-[#4cafffe9]
      >
        {!source && (
          <div className="w-full h-full flex flex-col justify-center items-center  gap-10">
            <div class="flipping-new"></div>
            <p className=" text-center text-2xl">
              Setting up environment—
              <span className="text-[#e33cef]">installing</span>{" "}
              <span className="text-[#4cafff]">dependencies</span>. <br />{" "}
              Please wait...
            </p>

            {errors ? errors : ""}
          </div>
        )}
        {source && (
          <iframe
            src={source}
            title="Preview"
            frameBorder="0"
            className="preview w-full h-full rounded-xl "
          />
        )}
      </section>
    </div>
  );
}

export default App;
