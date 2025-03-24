export default function codeGenerationPrompt(
  userInput = "",
  dependencies = ""
) {
  return `React Vite Project Generation Prompt
  Task:
  **"First, analyze and generate the necessary dependencies. Use only these dependencies to build the ${userInput} website—do not include or import any other libraries or dependencies that are not listed in dependeccies->${dependencies}.

Now, create a fully functional ${userInput} website using only the given dependencies: ${dependencies}. Ensure the website has a modern UI/UX, clean architecture, and a high level of functionality while strictly adhering to the provided dependencies."**

**Strictly always make website with background color white like different shades of white  **
**Strictly Do not make website with background color black  **

  
  Requirements & Conditions:
  Keep the code minimal yet visually appealing.
  You have to generate altest 3000 tokens in output
  import React only in main.jsx "import React from 'react' it is complosury 
  Implement only one or two core functionalities.
  Ensure an elegant, modern UI following web design principles.
  Use only Tailwind CSS for styling.
  use react-router-dom if possible
  Strictly avoid unnecessary imports or unused packages.
  File Structure (Compulsory):
  css
  Copy
  Edit
  src/
  ├── App.jsx
  ├── App.css
  ├── main.jsx
  ├── index.css
  ├── components/
      ├── (relevant component files)
  Import Rules:
  General Import Rules:
  
  Every import must match an existing file.
  In main.jsx, import only index.css.
  Do not import main.css anywhere.
  Do not import missing or non-existent files.
  Third-Party Library Import Rules:
  
  Do not import packages without installing them in package.json.
  Do not import @heroicons/react/solid or any other non-installed library directly.
  If using icons, ensure the package is included in dependencies.
  Image Handling Rules:
  Do not import images from the public folder.
  Do not try to download image files in the code.
  Do not import "next/image" in any file.
  Do not  import "@heroicons/react/solid" from "src/components/.... in any of the files in jsx formate 
  Do not create this type of files -> {anyFileName.module.css} in the code
  Do not use the libraries which is not mentioned in the dependencies-> ${dependencies}
  Use ont these libraries -> ${dependencies} to create website and basic react app

  Use direct image URLs instead of local file imports.
  Example image URL: 1) "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
  2) "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80" 
  3) "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800
  4) "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800

  UI/UX & Styling:
  100vh and 100vw for all pages to prevent footer/header overlap.
  Use only Tailwind CSS for styling—no raw CSS or component-specific CSS files.
  Ensure a modern, engaging, and mobile-responsive design.
  Center the body with balanced whitespace and typography.
  Add meaningful micro-interactions like hover effects on buttons/cards.
  Essential Features:
  Home, About, and other relevant minor components.
  For an e-commerce website:
  Add a cart, product card, and banner section.
  Ensure all sections look professional while remaining minimal.
  Make very **Beautiful and engaging** website with multiple sections,colors and images.
  Make sure to use Tailwind CSS for styling.
  Do not write any CSS or component-specific CSS files.
  Write very very simple code without any complex logic.
  make minimum features but make them look beautiful you promary focus is to make website look beautiful.
  you have to make header and footer it is compulsory for you.
  **you have to use Flex box for layout and different colors for different sections and use this like to apply image on the website -> 
  1) "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
  2) "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80" 
  3) "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800
  4) "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800
  5) "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9
  and many more images 
  it is compulsory for you. except for todo website ** 


                        
  

  Example File Structure & Output Format:
  json
  Copy
  Edit
  {
    "src": {
      "directory": {
        "App.jsx": {
          "file": {
            "contents": "all the code here inside backticks"
          }
        },
        "App.css": {
          "file": {
            "contents": "all the code here inside backticks"
          }
        },
        "components": {
          "directory": {
            "Header.jsx": {
              "file": {
                "contents": "all the code here inside backticks"
              }
            },
            "Footer.jsx": {
              "file": {
                "contents": "all the code here inside backticks"
              }
            }
          }
        },
        "index.css": {
          "file": {
            "contents": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"
          }
        },
        "main.jsx": {
          "file": {
            "contents": "import \"./index.css\";\nimport React from \"react\";\nimport ReactDOM from \"react-dom/client\";\nimport App from \"./App.jsx\";\n\nconst root = ReactDOM.createRoot(document.getElementById(\"root\"));\nroot.render(<App />);"
          }
        }
      }
    }
  }
  Fixes in This Version:
  ✔ Fixed import issues related to react-router-dom, incorrect file paths, and missing exports.
  ✔ Ensured all images load correctly within components using direct URLs.
  ✔ Prevented the error "import '@heroicons/react/solid' from 'src/App.jsx'. Does the file exist?" by enforcing strict import rules.
  ✔ Properly structured "main.jsx" to use "createRoot" instead of "ReactDOM.render" (React 18 compliance).
  ✔ Escaped all newlines ("\n") correctly in JSON output.
  ✔ No trailing commas (",").
  ✔ Ensured all import statements match the generated file structure.
  
  Final Checks Before Submission:
  ✔ Zero syntax errors and no missing imports.
  ✔ UI elements load properly with no broken styles or navigation issues.
  ✔ "index.css" is imported in "main.jsx", and no other CSS files are imported.
  ✔ No unnecessary or missing files in the output.
  ✔ Code follows a clean, component-based architecture.
  ✔ Modern, responsive design using only Tailwind CSS.
  
  
  
  `;
}
