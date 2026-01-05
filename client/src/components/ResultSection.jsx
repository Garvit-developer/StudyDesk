import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRegCommentDots, FaRegEdit, FaRegListAlt, FaSpinner } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa6";
import rehypeRaw from "rehype-raw";
import formatResponse from "../utils/formattedAnswer";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

//Reusable Markdown block
const CopyableMarkdownBlock = ({ label, icon, value, placeholder }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 font-semibold text-sm text-gray-800">
          {icon}
          {label}
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-800 transition flex gap-2 items-center"
          title="Copy to clipboard"
        >
          {copied && <div className="text-xs text-green-600 mt-1">Copied!</div>}
          <FiCopy />
        </button>
      </div>

      {/* Markdown render */}
      <div className="w-full p-3 border border-gray-300 rounded-md text-sm leading-relaxed bg-gray-50 prose prose-sm max-w-none overflow-x-auto">
        {value ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={{
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table
                    className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                    {...props}
                  />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead
                  className="bg-gray-100 text-gray-900 font-semibold"
                  {...props}
                />
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
              hr: () => <hr className="my-6" />,
              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="mb-3" {...props} />,
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
            {value}
          </ReactMarkdown>
        ) : (
          <em>{placeholder}</em>
        )}
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 "
      onClick={handleBackdropClick}
    >
      <div className="max-h-full overflow-y-auto w-full px-4  md:max-h-none md:overflow-visible md:px-10 hide-scrollbar">
        <div
          className="bg-white rounded-lg shadow-lg  w-full  p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
          >
            ✖
          </button>
          <div className="md:max-h-[80vh] h-[90vh] overflow-y-auto hide-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultSection = ({ aiResult, loading }) => {
  const { answer, explanation, steps, success } = aiResult;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative bg-white p-6 rounded-lg shadow border w-full md:w-1/2">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10">
          <div className="text-lg font-semibold animate-pulse text-gray-700 flex items-center gap-2">
            <FaSpinner className="animate-spin"/> Loading AI Response...
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Result</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1  transition cursor-pointer relative group"
        >
          <FaRegEye size={25} />
          <div className="absolute top-[-25px] mb-3 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            <div className="relative bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
              view Response
              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        </button>
      </div>

      {/* Error case */}
      {success === false ? (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-4 text-sm">
          ⚠️ {answer}
        </div>
      ) : (
        <>
          <CopyableMarkdownBlock
            label="The answer to your question"
            icon={<FaRegCommentDots />}
            value={formatResponse(answer)}
            placeholder="Ask away!"
          />

          <CopyableMarkdownBlock
            label="The explanation to your question"
            icon={<FaRegEdit />}
            value={formatResponse(explanation)}
            placeholder="You can enable explanations in 'Advanced Options' under the question box"
          />

          <CopyableMarkdownBlock
            label="The steps to your question"
            icon={<FaRegListAlt />}
            value={formatResponse(steps)}
            placeholder="You can enable steps in 'Advanced Options' under the question box"
          />
        </>
      )}

      {/* Modal Open */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Result</h2>
        <CopyableMarkdownBlock
          label="Answer"
          icon={<FaRegCommentDots />}
          value={formatResponse(answer)}
          placeholder="Ask away!"
        />
        <CopyableMarkdownBlock
          label="Explanation"
          icon={<FaRegEdit />}
          value={formatResponse(explanation)}
          placeholder="You can enable explanations in 'Advanced Options' under the question box"
        />
        <CopyableMarkdownBlock
          label="Steps"
          icon={<FaRegListAlt />}
          value={formatResponse(steps)}
          placeholder="You can enable steps in 'Advanced Options' under the question box"
        />
      </Modal>
    </div>
  );
};

export default ResultSection;
