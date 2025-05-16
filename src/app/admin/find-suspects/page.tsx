"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FindSuspect() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [suspectFromImage, setSuspectFromImage] = useState<any>(null);
  const [suspectFromCase, setSuspectFromCase] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/cases").then((res) => setCases(res.data.cases));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image || !selectedCase)
      return alert("Please select a case and upload an image.");

    setLoading(true);
    setSuspectFromImage(null);
    setSuspectFromCase(null);

    try {
      const res = axios.postForm("/api/find-suspect", {
        caseId: selectedCase,
        image,
      });

      toast.promise(res, {
        loading: "Identifying suspect...",
        success: (data) => {
          const { suspect, suspectByCase } = data.data;
          setSuspectFromImage(suspect || null);
          setSuspectFromCase(suspectByCase || null);

          if (suspect || suspectByCase) {
            return "Suspect(s) identified";
          } else {
            return "No suspects found";
          }
        },
        error: (err) => {
          console.error(err);
          return "Failed to identify suspect";
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to identify suspect");
    }

    setLoading(false);
  };

  const renderSuspectCard = (suspect: any, title: string) => {
    if (!suspect) {
      return (
        <div className="bg-base-200 p-4 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-error">{title}</h2>
          <p className="mt-2">No matching suspect found.</p>
        </div>
      );
    }

    return (
      <div className="bg-base-200 p-4 rounded-xl">
        <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
        <p>
          <strong>Name:</strong> {suspect.name}
        </p>
        <p>
          <strong>Email:</strong> {suspect.email}
        </p>
        <p>
          <strong>Contact:</strong> {suspect.contact}
        </p>
        <p>
          <strong>Age:</strong> {suspect.age}
        </p>
        <p>
          <strong>Affiliations:</strong>{" "}
          {suspect.knownAffiliations?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Last Known Location:</strong>{" "}
          {suspect.lastKnownLocation?.address || "Unknown"}
        </p>
        {suspect.profileImage && (
          <img
            src={suspect.profileImage}
            alt="Suspect"
            className="mt-4 w-48 rounded-xl shadow"
          />
        )}
      </div>
    );
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Find Suspect
      </h1>

      <div className="bg-base-300 p-6 rounded-box space-y-6">
        <div>
          <label className="block mb-2 font-medium">Select Case</label>
          <select
            className="select select-bordered w-full"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
          >
            <option value="">-- Choose Case --</option>
            {cases.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.caseId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Upload Suspect Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <button
          className="btn btn-primary w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Find Suspect"}
        </button>

        {(suspectFromImage || suspectFromCase) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {renderSuspectCard(suspectFromImage, "Suspect From Image Match")}
            {renderSuspectCard(suspectFromCase, "Suspect From Case Analysis")}
          </div>
        )}
      </div>
    </>
  );
}
