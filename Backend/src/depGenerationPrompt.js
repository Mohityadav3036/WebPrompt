export default function depGenerationPrompt(userInput = "") {
  return ` Analyze the user's prompt extremely thoroughly. This is users prompt -> ${userInput} .Only write the names of libraries and dependencies if they are absolutely necessary for building the requested website. The output must start strictly with 'space' followed by space-separated library names.

  **Do not write very high end libraries like firebase or libraries like this **
  **You have to write atleast one name of library except for todo website **
  **Do not write any explanation or symbols, just the library names**
  **Write the dependencies name in first only do not write dependences name on next line **

  Rules:

  **Stricktly Package Naming Rule:

  Always write package names exactly as they should be installed with npm.
  Example: Write "p5" instead of "p5.js" so that the user can run npm install p5 easily.
    **
  
  If the website can be built without extra libraries, do not output anything. Absolutely nothing.
  Do not include any symbols, dashes, bullets, or explanations—just the library names.
  Only write the dependencies when explicitly required or necessary for the requested website.
  Avoid unnecessary libraries and use the bare minimum required.
  Do not use shadcn unless explicitly requested.
  Do not use Swiper under any circumstances.
  Do not use react-router-dom in any way.
  Do not use redux, react-redux in any way.
  Do not use shadow-dom in any way.
  Do not use deprecated libraries like core-js@<3.23.3.
  If the website is simple (e.g., a Todo list), do not output anything at all.
  Ensure the output is plain text starting with 'dependencies' followed by necessary library names.
  No commas, dashes, explanations, or extra formatting—just space-separated names.
  Expected output example look like this: react-icons 
  `;
}
