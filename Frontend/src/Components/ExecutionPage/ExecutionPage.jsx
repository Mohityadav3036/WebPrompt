import React, { useState, forwardRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import githubDarkTheme from "monaco-themes/themes/krTheme.json";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import { BsFolder2, BsFolder2Open } from "react-icons/bs";
import { CiFileOn } from "react-icons/ci";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "../UserPromptPage/UserPromptPage.css";

const ExecutionPage = ({ codex }, ref) => {
  const extractFiles = (obj, path = "") => {
    let files = {};
    for (const key in obj) {
      if (obj[key].file) {
        files[`${path}${key}`] = obj[key].file.contents;
      } else if (obj[key].directory) {
        Object.assign(
          files,
          extractFiles(obj[key].directory, `${path}${key}/`)
        );
      }
    }
    return files;
  };

  const files = extractFiles(codex);
  const filePaths = Object.keys(files);
  const [selectedFile, setSelectedFile] = useState(filePaths[0] || "");
  const [openFiles, setOpenFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [code, setCode] = useState(files[selectedFile] || "");

  useEffect(() => {
    if (selectedFile) {
      setCode(files[selectedFile]);
      if (!openFiles.includes(selectedFile)) {
        setOpenFiles([...openFiles, selectedFile]);
      }
    }
  }, [selectedFile]);

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("github-dark", githubDarkTheme);
      monaco.editor.setTheme("github-dark");
    }
  }, [monaco]);

  const toggleFolder = (folder) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const renderTree = (obj, path = "") => {
    return Object.entries(obj).map(([key, item]) => {
      const fullPath = `${path}${key}`;

      if (item.directory) {
        return (
          <div key={fullPath}>
            <p
              onClick={() => toggleFolder(fullPath)}
              className="cursor-pointer flex items-center gap-2 text-white"
            >
              {expandedFolders[fullPath] ? (
                <BsFolder2Open className="text-[#e33cef] size-5 shrink-0 " />
              ) : (
                <BsFolder2 className="text-[#e33cef]  size-5 shrink-0" />
              )}
              {key}
            </p>
            <div
              className={expandedFolders[fullPath] ? "block pl-4" : "hidden"}
            >
              {renderTree(item.directory, `${fullPath}/`)}
            </div>
          </div>
        );
      }

      if (item.file) {
        return (
          <p
            key={fullPath}
            className="cursor-pointer text-white flex items-center text-left gap-2"
            onClick={() => setSelectedFile(fullPath)}
          >
            <CiFileOn className=" size-5 shrink-0 text-[#4cafff] " />
            {key}
          </p>
        );
      }

      return (
        <p key={fullPath} className="text-red-500">
          ⚠️ Unhandled Item: {key}
        </p>
      );
    });
  };

  const downloadProject = () => {
    const zip = new JSZip();
    Object.keys(files).forEach((path) => zip.file(path, files[path]));
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, "project.zip"));
  };

  return (
    <>
      <div
        ref={ref}
        className="lg:h-full h-[600px] lg:w-full w-screen flex text-white p-2  rounded-xl lg:p-1"
      >
        <div className="w-1/4 p-3 overflow-auto rounded-l-xl  border-r-2 border-[#2f2f36] ">
          <h2 className="text-lg font-bold mb-2 text-white">Files</h2>
          {renderTree(codex)}
        </div>

        <div className="w-3/4 flex flex-col  rounded-r-2xl overflow-hidden">
          <div className="w-full">
            <div className=" text-gray-300 px-2 py-1 flex space-x-3 overflow-auto">
              {openFiles.map((file) => (
                <div
                  key={file}
                  className={`cursor-pointer px-3 py-1 rounded-t-md ${
                    file === selectedFile
                      ? "bg-black  border-2 border-[#2f2f36]  text-white font-bold"
                      : "hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  {file.split("/").pop()}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full  max-w-[100vw] rounded-xl overflow-hidden">
            <Editor
              key={selectedFile}
              language="javascript"
              theme="github-dark"
              className="lg:w-full lg:h-full h-[600px]  rounded-2xl"
              value={code}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: true,
                },
                folding: true, // Enable folding
                foldingStrategy: "auto", // Auto fold based on indentation
                wordWrap: "on",
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: "always",
                readOnly: false,
                fontSize: 13,
                readOnly: true,
              }}
            />
          </div>
        </div>
      </div>
      <button
        onClick={downloadProject}
        className="mt-2 p-2 bg-gradient-to-tl from-[#e33cefe9] transition duration-300 ease-out hover:from-[#000] border-[0.5px] text-black hover:text-white 
        rounded to-[#4cafffe9] cursor-pointer "
      >
        Download Code as ZIP
      </button>
    </>
  );
};

export default forwardRef(ExecutionPage);
