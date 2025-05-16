"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MapPicker from "@/components/MapPicker";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface Evidence {
  type: "image" | "video" | "document";
  url: string;
  uploadedBy?: string;
  uploadedAt?: Date;
}

interface Witness {
  name: string;
  statement: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export interface Case {
  _id?: string;
  caseId: string;
  name: string;
  description: string;
  investigator: string;
  typeOfCrime: string;
  dateOfCrime: string;
  location: {
    address: string;
    coordinates: Coordinates;
  };
  evidence: Evidence[];
  witnesses: Witness[];
  suspect?: string;
  tags: string[];
  status: "open" | "closed" | "in-progress";
}

export default function ManageCases() {
  const [investigators, setInvestigators] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [formData, setFormData] = useState<Case>({
    caseId: "",
    name: "",
    description: "",
    investigator: "",
    typeOfCrime: "",
    dateOfCrime: new Date().toISOString().split("T")[0],
    location: { address: "", coordinates: { lat: 0, lng: 0 } },
    evidence: [],
    witnesses: [],
    suspect: "",
    tags: [],
    status: "open",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchInvestigators = async () => {
    const res = await axios.get("/api/investigators");
    setInvestigators(res.data.investigators);
  };

  const fetchSuspects = async () => {
    const res = await axios.get("/api/suspects");
    setSuspects(res.data.suspects);
  };

  const fetchCases = async () => {
    const res = await axios.get("/api/cases");
    setCases(res.data.cases);
  };

  const handleEdit = (data: Case) => {
    setFormData({
      ...data,
      dateOfCrime: new Date(data.dateOfCrime).toISOString().split("T")[0],
    });
    setEditingId(data._id!);
    (document.getElementById("case_modal") as HTMLDialogElement)?.showModal();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case?")) return;
    await toast.promise(axios.delete(`/api/cases/delete?id=${id}`), {
      loading: "Deleting...",
      success: "Deleted",
      error: "Failed",
    });
    fetchCases();
  };

  const handleSubmit = async () => {
    const url = editingId
      ? `/api/cases/edit?id=${editingId}`
      : "/api/cases/add";
    const method = editingId ? "put" : "post";
    const res = axios[method](url, { formData });
    toast.promise(res, {
      loading: editingId ? "Updating..." : "Creating...",
      success: () => {
        (document.getElementById("case_modal") as HTMLDialogElement).close();
        setFormData({
          caseId: "",
          name: "",
          description: "",
          investigator: "",
          typeOfCrime: "",
          dateOfCrime: new Date().toISOString().split("T")[0],
          location: { address: "", coordinates: { lat: 0, lng: 0 } },
          evidence: [],
          witnesses: [],
          suspect: "",
          tags: [],
          status: "open",
        });
        setEditingId(null);
        fetchCases();
        return editingId ? "Case updated" : "Case created";
      },
      error: "Error saving case",
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      caseId: `C-${Math.floor(Math.random() * 10000)}`,
    });
    fetchCases();
    fetchInvestigators();
    fetchSuspects();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6 uppercase">
        Manage Cases
      </h1>

      <div className="overflow-x-auto bg-base-200 p-4 rounded-box">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Case ID</th>
              <th>Name</th>
              <th>Crime Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>{c.caseId}</td>
                <td>{c.name}</td>
                <td>{c.typeOfCrime}</td>
                <td>
                  <div className="badge badge-outline">{c.status}</div>
                </td>
                <td>{new Date(c.dateOfCrime).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(c)}
                  >
                    <IconEdit size={16} />
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(c._id!)}
                  >
                    <IconTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {cases.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No Cases Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary mt-4 block mx-auto"
        onClick={() =>
          (
            document.getElementById("case_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        Add Case
      </button>

      <dialog id="case_modal" className="modal">
        <div className="modal-box w-full max-w-5xl overflow-y-auto max-h-[90vh]">
          <h3 className="text-2xl font-semibold text-center mb-6 uppercase">
            {editingId ? "Edit Case" : "Add Case"}
          </h3>

          {/* Case Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input input-bordered w-full"
              placeholder="Case ID"
              value={formData.caseId}
              onChange={(e) =>
                setFormData({ ...formData, caseId: e.target.value })
              }
            />
            <input
              className="input input-bordered w-full"
              placeholder="Case Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <select
              className="select select-bordered w-full"
              value={formData.investigator}
              onChange={(e) =>
                setFormData({ ...formData, investigator: e.target.value })
              }
            >
              <option value="" disabled>
                Select Investigator
              </option>
              {investigators.map((inv: any) => (
                <option key={inv._id} value={inv._id}>
                  {inv.name}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered w-full"
              value={formData.suspect}
              onChange={(e) =>
                setFormData({ ...formData, suspect: e.target.value })
              }
            >
              <option value="" disabled>
                Select Suspect
              </option>
              {suspects.map((sus: any) => (
                <option key={sus._id} value={sus._id}>
                  {sus.name}
                </option>
              ))}
            </select>
            <input
              className="input input-bordered w-full"
              placeholder="Type of Crime"
              value={formData.typeOfCrime}
              list="crimeTypeList"
              onChange={(e) =>
                setFormData({ ...formData, typeOfCrime: e.target.value })
              }
            />
            <datalist id="crimeTypeList">
              <option value="Theft" />
              <option value="Assault" />
              <option value="Fraud" />
              <option value="Burglary" />
              <option value="Vandalism" />
              <option value="Drug Offense" />
              <option value="Homicide" />
              <option value="Robbery" />
              <option value="Kidnapping" />
              <option value="Sexual Offense" />
              <option value="Cyber Crime" />
              <option value="Domestic Violence" />
              <option value="Terrorism" />
              <option value="Public Disorder" />
            </datalist>
            <input
              type="date"
              className="input input-bordered w-full"
              value={formData.dateOfCrime}
              onChange={(e) =>
                setFormData({ ...formData, dateOfCrime: e.target.value })
              }
            />
            <textarea
              className="textarea textarea-bordered md:col-span-2 w-full"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Location */}
          <input
            className="input input-bordered w-full mt-6"
            placeholder="Address"
            value={formData.location.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: { ...formData.location, address: e.target.value },
              })
            }
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Latitude"
              className="input input-bordered w-full"
              value={formData.location.coordinates.lat || ""}
              readOnly
            />
            <input
              type="text"
              placeholder="Longitude"
              className="input input-bordered w-full"
              value={formData.location.coordinates.lng || ""}
              readOnly
            />
            <MapPicker
              value={formData.location.coordinates}
              onChange={(coords) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, coordinates: coords },
                })
              }
            />
          </div>

          {/* Tags */}
          <div className="mt-6">
            <label className="font-semibold">Tags (comma separated)</label>
            <input
              className="input input-bordered w-full mt-1"
              placeholder="e.g. violent, gang-related"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(",").map((t) => t.trim()),
                })
              }
            />
          </div>

          {/* Witnesses */}
          <div className="mt-6">
            <label className="font-semibold">Witnesses</label>
            <br />
            {formData.witnesses.map((w, i) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                key={i}
              >
                <input
                  className="input input-bordered w-full"
                  placeholder="Name"
                  value={w.name}
                  onChange={(e) => {
                    const updated = [...formData.witnesses];
                    updated[i].name = e.target.value;
                    setFormData({ ...formData, witnesses: updated });
                  }}
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Statement"
                  value={w.statement}
                  onChange={(e) => {
                    const updated = [...formData.witnesses];
                    updated[i].statement = e.target.value;
                    setFormData({ ...formData, witnesses: updated });
                  }}
                />
              </div>
            ))}
            <button
              className="btn btn-outline btn-sm mt-3"
              onClick={() =>
                setFormData({
                  ...formData,
                  witnesses: [
                    ...formData.witnesses,
                    { name: "", statement: "" },
                  ],
                })
              }
            >
              + Add Witness
            </button>
          </div>

          {/* Evidence */}
          <div className="mt-6">
            <label className="font-semibold">Evidence</label>
            <br />
            {formData.evidence.map((e, i) => (
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                key={i}
              >
                <select
                  className="select select-bordered"
                  value={e.type}
                  onChange={(ev) => {
                    const updated = [...formData.evidence];
                    updated[i].type = ev.target.value as Evidence["type"];
                    setFormData({ ...formData, evidence: updated });
                  }}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
                <input
                  className="input input-bordered"
                  placeholder="URL"
                  value={e.url}
                  onChange={(ev) => {
                    const updated = [...formData.evidence];
                    updated[i].url = ev.target.value;
                    setFormData({ ...formData, evidence: updated });
                  }}
                />
                <input
                  className="input input-bordered"
                  placeholder="Uploaded By"
                  value={e.uploadedBy || ""}
                  onChange={(ev) => {
                    const updated = [...formData.evidence];
                    updated[i].uploadedBy = ev.target.value;
                    setFormData({ ...formData, evidence: updated });
                  }}
                />
              </div>
            ))}
            <button
              className="btn btn-outline btn-sm mt-3"
              onClick={() =>
                setFormData({
                  ...formData,
                  evidence: [
                    ...formData.evidence,
                    { type: "image", url: "", uploadedBy: "" },
                  ],
                })
              }
            >
              + Add Evidence
            </button>
          </div>

          {/* Modal Actions */}
          <div className="modal-action mt-8">
            <form method="dialog" className="flex gap-4">
              <button className="btn btn-secondary">Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingId ? "Update Case" : "Add Case"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
