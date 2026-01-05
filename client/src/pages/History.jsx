import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import ViewModal from "../components/ViewModal";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-hot-toast";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineHistory,
} from "react-icons/ai";
import { FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";

const History = () => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});

  // Debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchResponses = useCallback(
    async (currentPage, currentPerPage = perPage, search = "") => {
      setPending(true);
      try {
        const res = await axios.get(
          `/api/ai-responses?page=${currentPage}&limit=${currentPerPage}&search=${encodeURIComponent(
            search
          )}`,
          {
            withCredentials: true,
          }
        );
        setData(res.data.responses || []);
        setTotalRows(res.data.totalResults || 0);
        setError("");
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Fetch error:", err);
        setData([]);
        setTotalRows(0);
      } finally {
        setPending(false);
      }
    },
    [perPage]
  );

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      fetchResponses(1, perPage, debouncedSearchTerm);
      setPage(1);
    }
  }, [debouncedSearchTerm, fetchResponses, perPage]);

  // Effect for pagination
  useEffect(() => {
    if (page > 1) {
      fetchResponses(page, perPage, debouncedSearchTerm);
    }
  }, [page, perPage, debouncedSearchTerm, fetchResponses]);

  // Initial load
  useEffect(() => {
    fetchResponses(1, perPage, "");
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handlePerRowsChange = useCallback((newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  }, []);

  const handleViewClick = useCallback((row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  }, []);

  const openConfirm = useCallback((action) => {
    setConfirmAction(() => action);
    setConfirmOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      openConfirm(async () => {
        try {
          await axios.delete(`/api/ai-responses/${id}`, {
            withCredentials: true,
          });
          toast.success("Entry deleted successfully");
          fetchResponses(page, perPage, debouncedSearchTerm);
        } catch (err) {
          console.error("Delete error:", err);
          toast.error("Failed to delete entry");
        }
      });
    },
    [fetchResponses, page, perPage, debouncedSearchTerm, openConfirm]
  );

  const handleClearHistory = useCallback(() => {
    openConfirm(async () => {
      try {
        await axios.delete(`/api/responses/all`, {
          withCredentials: true,
        });
        toast.success("All history cleared successfully");
        setPage(1);
        fetchResponses(1, perPage, debouncedSearchTerm);
      } catch (err) {
        console.error("Clear history error:", err);
        toast.error("Failed to clear history");
      }
    });
  }, [fetchResponses, perPage, debouncedSearchTerm, openConfirm]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Text highlighting function
  const highlightText = useCallback((text, searchTerm) => {
    if (!text || !searchTerm || typeof text !== "string") {
      return text || "N/A";
    }

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded font-semibold"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, []);

  const truncateText = useCallback((text, maxLength = 60) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }, []);

  // Memoized columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      {
        name: "S.No.",
        cell: (row, index) => (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {(page - 1) * perPage + index + 1}
          </div>
        ),
        width: "80px",
        center: true,
        sortable: false,
      },
      {
        name: "Question",
        cell: (row) => {
          const truncated = truncateText(row.question, 70);
          const isSearchMatch =
            debouncedSearchTerm &&
            row.question
              ?.toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase());

          return (
            <div className="py-2">
              <div className="flex items-start gap-2">
                <HiOutlineDocumentText
                  className="text-gray-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">
                    {debouncedSearchTerm ? (
                      <span
                        className={
                          isSearchMatch ? "bg-yellow-50 px-1 rounded" : ""
                        }
                      >
                        {highlightText(truncated, debouncedSearchTerm)}
                      </span>
                    ) : (
                      truncated
                    )}
                  </p>
                  {row.question && row.question.length > 70 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Click view to see full question
                    </p>
                  )}
                  {isSearchMatch && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        <FiSearch size={10} className="mr-1" />
                        Match found
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        },
        sortable: true,
        grow: 3,
        wrap: true,
      },
      {
        name: "Subject",
        cell: (row) => {
          const isSearchMatch =
            debouncedSearchTerm &&
            row.subject
              ?.toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase());

          return (
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  row.subject
                    ? `${
                        isSearchMatch
                          ? "bg-yellow-100 text-yellow-800 ring-2 ring-yellow-200"
                          : "bg-green-100 text-green-700"
                      }`
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {debouncedSearchTerm && row.subject
                  ? highlightText(row.subject, debouncedSearchTerm)
                  : row.subject || "General"}
              </span>
            </div>
          );
        },
        sortable: true,
        width: "190px",
      },
      {
        name: "Date & Time",
        cell: (row) => (
          <div className="text-sm">
            {(() => {
              const dateTimeString = `${new Date(
                row.created_at
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })} ${new Date(row.created_at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}`;

              return (
                <div>{highlightText(dateTimeString, debouncedSearchTerm)}</div>
              );
            })()}
          </div>
        ),
        sortable: true,
        width: "180px",
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleViewClick(row)}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300"
              title="View Details"
            >
              <AiOutlineEye size={14} />
              <span className="hidden sm:inline">View</span>
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200 hover:border-red-300"
              title="Delete Entry"
            >
              <AiOutlineDelete size={14} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        ),
        ignoreRowClick: true,
        width: "250px",
        center: true,
      },
    ],
    [
      page,
      perPage,
      debouncedSearchTerm,
      highlightText,
      truncateText,
      handleViewClick,
      handleDelete,
    ]
  );

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#f8fafc",
        fontWeight: "600",
        fontSize: "13px",
        paddingTop: "16px",
        paddingBottom: "16px",
        borderBottom: "2px solid #e2e8f0",
        color: "#475569",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "70px",
        borderBottom: "1px solid #f1f5f9",
        "&:hover": {
          backgroundColor: "#f8fafc",
          transition: "background-color 0.2s ease",
        },
      },
    },
    pagination: {
      style: {
        justifyContent: "center",
        padding: "20px",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
      },
    },
    table: {
      style: {
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      },
    },
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-50 rounded-lg shadow p-6 sm:p-8 mb-6 border border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <AiOutlineHistory className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  History
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Manage your AI conversation history
                  {debouncedSearchTerm && (
                    <span className="ml-2 text-blue-600 font-medium">
                      • Searching: "{debouncedSearchTerm}"
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={pending}
            >
              <FiTrash2 size={16} />
              Clear History
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <FiSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search questions, subjects, dates or responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear search"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>

            {/* Search Status */}
            {debouncedSearchTerm && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>
                    {pending
                      ? "Searching..."
                      : `Found ${totalRows} result${
                          totalRows !== 1 ? "s" : ""
                        }`}
                  </span>
                </div>
                {!pending && totalRows > 0 && (
                  <span className="text-gray-500">
                    for "{debouncedSearchTerm}"
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-300">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            progressPending={pending}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            highlightOnHover
            noDataComponent={
              <div className="py-12 text-center">
                <AiOutlineHistory
                  size={48}
                  className="text-gray-300 mx-auto mb-4"
                />
                {debouncedSearchTerm ? (
                  <>
                    <p className="text-gray-500 text-lg">No results found</p>
                    <p className="text-gray-400 text-sm">
                      Try different search terms or{" "}
                      <button
                        onClick={clearSearch}
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        clear search
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg">No history found</p>
                    <p className="text-gray-400 text-sm">
                      Your conversation history will appear here
                    </p>
                  </>
                )}
              </div>
            }
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
            progressComponent={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }
          />
        </div>

        {/* Footer Stats */}
        {!pending && data.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing {Math.min((page - 1) * perPage + 1, totalRows)} to{" "}
                {Math.min(page * perPage, totalRows)} of {totalRows} entries
                {debouncedSearchTerm && (
                  <span className="text-blue-600 ml-2">
                    (filtered by "{debouncedSearchTerm}")
                  </span>
                )}
              </span>
              <span className="text-blue-600 font-medium">
                Page {page} of {Math.ceil(totalRows / perPage)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedRow}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default History;
