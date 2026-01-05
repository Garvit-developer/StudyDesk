import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FaQuestionCircle,
  FaCheckCircle,
  FaLightbulb,
  FaBook,
  FaCalendarAlt,
  FaListOl,
  FaTimes,
} from "react-icons/fa";
import rehypeRaw from "rehype-raw";

import formatResponse from "../utils/formattedAnswer";

const MarkdownContent = ({ markdown }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeRaw, rehypeKatex]}
    components={{
      table: ({ node, ...props }) => (
        <div className="overflow-x-auto my-4 ">
          <table
            className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm"
            {...props}
          />
        </div>
      ),
      thead: ({ node, ...props }) => (
        <thead className="bg-gray-100 text-gray-900 font-semibold" {...props} />
      ),
      th: ({ node, ...props }) => (
        <th
          className="border border-gray-300 px-4 py-2 text-left bg-gray-200"
          {...props}
        />
      ),
      td: ({ node, ...props }) => (
        <td className="border border-gray-300 px-4 py-2" {...props} />
      ),
      tr: ({ node, ...props }) => (
        <tr className="hover:bg-gray-50 transition-colors" {...props} />
      ),
       li: ({ node, ...props }) => <li className="mb-3" {...props} />,
      hr: () => <hr className="my-6" />,
      p: ({ node, ...props }) => <p className="mb-2" {...props} />,
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              padding: "1rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-gray-200 px-1 rounded" {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {markdown}
  </ReactMarkdown>
);

const ViewModal = ({ isOpen, onClose, data }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") onClose();
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/30 backdrop-blur-[4px] flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 lg:p-8"
    >
      <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90vw] relative shadow-2xl animate-fadeIn border border-gray-300 max-h-[95vh] overflow-y-auto hide-scrollbar" >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition z-10 bg-white rounded-full p-2 shadow-sm hover:shadow-md"
        >
          <FaTimes />
        </button>
        
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center border-b border-gray-300 pb-3 mb-6 pr-12">
          Details
        </h3>

        <div className="space-y-6 text-gray-800 text-sm sm:text-base leading-relaxed">
          <div className="flex items-start gap-3">
            <FaQuestionCircle className="text-indigo-500 mt-1 text-lg flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-base sm:text-lg mb-2">Question:</p>
              <p className="break-words">{data?.question}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-green-600 mt-1 text-lg flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-base sm:text-lg mb-3">Answer:</p>
              <div className="prose prose-sm sm:prose-base max-w-none bg-white border border-gray-200 p-4 sm:p-5 md:p-6 rounded-lg shadow-sm overflow-x-auto">
                <MarkdownContent
                  markdown={formatResponse(data?.answer || "N/A")}
                />
              </div>
            </div>
          </div>

          {data?.explanation && (
            <div className="flex items-start gap-3">
              <FaLightbulb className="text-yellow-500 mt-1 text-lg flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base sm:text-lg mb-3">Explanation:</p>
                <div className="prose prose-sm sm:prose-base max-w-none bg-white border border-gray-200 p-4 sm:p-5 md:p-6 rounded-lg shadow-sm overflow-x-auto">
                  <MarkdownContent
                    markdown={formatResponse(data?.explanation || "N/A")}
                  />
                </div>
              </div>
            </div>
          )}

          {data?.steps && (
            <div className="flex items-start gap-3">
              <FaListOl className="text-orange-500 mt-1 text-lg flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base sm:text-lg mb-3">Steps:</p>
                <div className="prose prose-sm sm:prose-base max-w-none bg-white border border-gray-200 p-4 sm:p-5 md:p-6 rounded-lg shadow-sm overflow-x-auto">
                  <MarkdownContent
                    markdown={formatResponse(data?.steps || "N/A")}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <FaBook className="text-blue-500 mt-1 text-lg flex-shrink-0" />
              <div>
                <span className="font-semibold text-base">Subject:</span>
                <p className="mt-1">{data?.subject || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaCalendarAlt className="text-purple-600 mt-1 text-lg flex-shrink-0" />
              <div>
                <span className="font-semibold text-base">Date:</span>
                <p className="mt-1 text-sm">
                  {new Date(data?.created_at).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;