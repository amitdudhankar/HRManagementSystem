import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import { getCandidates, uploadExcel } from "../services/api";
import { candidateStatusUpdate } from "../services/api"; // Add this
import toast from "react-hot-toast";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  const noteUpdateTimeouts = useRef({});
  const fileInputRef = useRef(null);

  const limit = 10;
const user = JSON.parse(localStorage.getItem("user"));
const userRole = user?.role;


  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await getCandidates(search, page, limit);
      setCandidates(response.data.data);
      const total = response.data.total || 0;
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, page]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setSelectedFile(file); // save file to state
    } else {
      alert("Please upload a valid .xlsx Excel file.");
      setSelectedFile(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // const handleUploadSubmit = async () => {
  //   if (!selectedFile) return;

  //   const formData = new FormData();
  //   formData.append("file", selectedFile);

  //   try {
  //     const res = await uploadExcel(formData);
  //     toast.success(
  //       `${res.data.message || "Upload successful"} (${
  //         res.data.count || 0
  //       } candidates)`
  //     );
  //     setSelectedFile(null);
  //     fetchCandidates(); 
  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //     toast.error("Upload failed. Please try again.");
  //   }
  // };

  const handleUploadSubmit = async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const res = await uploadExcel(formData);
    toast.success(
      `${res.data.message || "Upload successful"} (${res.data.count || 0} candidates)`
    );
    setSelectedFile(null);
    fetchCandidates();
  } catch (err) {
    console.error("Upload failed:", err);

    // Check for duplicate emails in error response
    if (
      err.response &&
      err.response.data &&
      err.response.data.message === "Duplicate emails found" &&
      Array.isArray(err.response.data.duplicates)
    ) {
      const duplicates = err.response.data.duplicates.slice(0, 5).join(", ");
      toast.error(
        `Duplicate emails found: ${duplicates} ${
          err.response.data.duplicates.length > 5 ? "...and more" : ""
        }`
      );
    } else {
      toast.error("Upload failed. Please try again.");
    }
  }
};


  const handleStatusChange = async (id, newStatus) => {
    try {
      await candidateStatusUpdate(id, { status: newStatus });
      setCandidates((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      toast.success("Status updated");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Status update failed.");
    }
  };

  const handleNoteChange = (id, newNote) => {
    setCandidates((prev) =>
      prev.map((c) => (c._id === id ? { ...c, notes: newNote } : c))
    );

    if (noteUpdateTimeouts.current[id]) {
      clearTimeout(noteUpdateTimeouts.current[id]);
    }

    noteUpdateTimeouts.current[id] = setTimeout(async () => {
      try {
        await candidateStatusUpdate(id, { notes: newNote });
        toast.success("Note updated");
      } catch (err) {
        console.error("Failed to update note:", err);
        toast.error("Note update failed.");
      }
    }, 1000);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on search
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="pt-20 px-6">
          <h1 className="text-2xl font-bold">Candidate Management</h1>
          <p className="mt-2 text-gray-700 mb-6">
            Welcome to the Candidates Section. Here you can manage candidates
            and view reports.
          </p>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={handleSearch}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72 transition duration-200"
              />
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept=".xlsx"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {userRole !== "hr" && (
  <div className="flex items-center gap-3">
    {selectedFile ? (
      <>
        <span className="text-sm text-gray-700 font-medium truncate max-w-[160px]">
          {selectedFile.name}
        </span>
        <button
          onClick={handleUploadSubmit}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          Submit
        </button>
      </>
    ) : (
      <button
        onClick={handleUploadClick}
        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
      >
        Upload Excel
      </button>
    )}
  </div>
)}

          </div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">Sr No</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">
                    Experience <br />
                    (in years)
                  </th>
                  <th className="py-3 px-4">Skills</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied On</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="py-4 px-4" colSpan="8">
                      Loading...
                    </td>
                  </tr>
                ) : candidates.length > 0 ? (
                  candidates.map((c, i) => (
                    <tr key={c._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {(page - 1) * limit + i + 1}
                      </td>
                      <td className="py-3 px-4">{c.name}</td>
                      <td className="py-3 px-4">{c.email}</td>
                      <td className="py-3 px-4">{c.phone || "—"}</td>
                      <td className="py-3 px-4">{c.experience || "—"}</td>
                      <td className="py-3 px-4">
                        {Array.isArray(c.skills)
                          ? c.skills.join(", ")
                          : typeof c.skills === "string"
                          ? c.skills
                          : "—"}
                      </td>
                      <td className="py-3 px-4">{c.location || "—"}</td>
                      <td className="py-3 px-4">
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleStatusChange(c._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 bg-white"
                        >
                          <option value="Not Connected">Not Connected</option>
                          <option value="Connected">Connected</option>
                          <option value="Interested">Interested</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        <textarea
                          value={c.notes || ""}
                          onChange={(e) =>
                            handleNoteChange(c._id, e.target.value)
                          }
                          placeholder="Add note..."
                          className="block mt-2 w-full border px-2 py-1 text-xs rounded"
                          rows="2"
                        />
                      </td>
                      <td className="py-3 px-4">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-4 px-4" colSpan="8">
                      No candidates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
