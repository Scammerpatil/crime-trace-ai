"use client";

import { useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import MapPicker from "@/components/MapPicker";

interface CrimeRecord {
  crimeType: string;
  location: string;
  date: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface LastKnownLocation {
  coordinates: Coordinates;
  address: string;
}

interface Suspect {
  _id?: string;
  name: string;
  email: string;
  contact: string;
  age: number;
  profileImage: string;
  criminalRecord: CrimeRecord[];
  lastKnownLocation: LastKnownLocation;
  knownAffiliations: string[];
  description: string;
}

export default function ManageSuspects() {
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [formData, setFormData] = useState<Suspect>({
    name: "",
    email: "",
    contact: "",
    age: 0,
    profileImage: "",
    criminalRecord: [],
    lastKnownLocation: {
      coordinates: { lat: 0, lng: 0 },
      address: "",
    },
    knownAffiliations: [],
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchSuspects = async () => {
    const response = await axios.get("/api/suspects");
    setSuspects(response.data.suspects);
  };

  const handleEdit = (suspect: Suspect) => {
    setFormData(suspect);
    setEditingId(suspect._id || null);
    (
      document.getElementById("suspect_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleDelete = async (id: string) => {
    await toast.promise(axios.delete(`/api/suspects/delete?id=${id}`), {
      loading: "Deleting...",
      success: "Suspect deleted",
      error: "Failed to delete",
    });
    fetchSuspects();
  };

  const handleSubmit = async () => {
    const method = editingId ? "put" : "post";
    const url = editingId
      ? `/api/suspects/edit?id=${editingId}`
      : "/api/suspects/add";

    const res = axios[method](url, { formData });
    toast.promise(res, {
      loading: editingId ? "Updating..." : "Adding...",
      success: () => {
        setFormData({
          name: "",
          email: "",
          contact: "",
          age: 0,
          profileImage: "",
          criminalRecord: [],
          lastKnownLocation: {
            coordinates: { lat: 0, lng: 0 },
            address: "",
          },
          knownAffiliations: [],
          description: "",
        });
        (
          document.getElementById("suspect_modal") as HTMLDialogElement
        )?.close();
        return editingId
          ? "Suspect updated successfully"
          : "Suspect added successfully";
      },
      error: (err: any) => `Error: ${err.response?.data.message}`,
    });

    setEditingId(null);
    fetchSuspects();
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData.name) {
      toast.error("Name is required for images");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", {
        file,
        name: formData.name,
        folderName: "suspectImages",
      });
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setFormData({ ...formData, profileImage: data.data.path });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };

  useEffect(() => {
    fetchSuspects();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Manage Suspects
      </h1>
      <div className="overflow-x-auto bg-base-300 rounded-box">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suspects.length > 0 ? (
              suspects.map((s, i) => (
                <tr key={s._id}>
                  <th>{i + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={s.profileImage} alt={s.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{s.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{s.email}</td>
                  <td>{s.contact}</td>
                  <td>{s.age}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(s)}
                    >
                      <IconEdit size={18} />
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(s._id!)}
                    >
                      <IconTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No Suspects Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 w-full">
        <button
          className="btn btn-primary mx-auto block"
          onClick={() =>
            (
              document.getElementById("suspect_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          Add Suspect
        </button>
      </div>

      <dialog id="suspect_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-xl mb-4 uppercase text-center">
            {editingId ? "Edit Suspect" : "Add Suspect"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Contact"
              className="input input-bordered w-full"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Age"
              className="input input-bordered w-full"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: parseInt(e.target.value) })
              }
            />
            <input
              type="text"
              placeholder="Description"
              className="input input-bordered w-full md:col-span-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              placeholder="Latitude"
              className="input input-bordered w-full"
              value={formData.lastKnownLocation?.coordinates.lat || ""}
              readOnly
            />
            <input
              type="text"
              placeholder="Longitude"
              className="input input-bordered w-full"
              value={formData.lastKnownLocation?.coordinates.lng || ""}
              readOnly
            />
          </div>
          <div className="mt-4">
            <label className="block font-bold mb-2">Last Known Location</label>
            <MapPicker
              value={formData.lastKnownLocation.coordinates}
              onChange={(coords) =>
                setFormData({
                  ...formData,
                  lastKnownLocation: {
                    ...formData.lastKnownLocation,
                    coordinates: coords,
                  },
                })
              }
            />
          </div>

          <input
            type="text"
            placeholder="Address"
            className="input input-bordered w-full mt-4"
            value={formData.lastKnownLocation?.address || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                lastKnownLocation: {
                  ...formData.lastKnownLocation,
                  address: e.target.value,
                  coordinates: formData.lastKnownLocation?.coordinates || {
                    lat: 0,
                    lng: 0,
                  },
                },
              })
            }
          />

          <div className="mt-4">
            <input
              type="file"
              className="file file-input w-full"
              accept="image/*"
              onChange={handleUploadImage}
            />
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Affiliations (comma separated)"
              className="input input-bordered w-full"
              value={formData.knownAffiliations?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  knownAffiliations: e.target.value
                    .split(",")
                    .map((s) => s.trim()),
                })
              }
            />
          </div>

          <div className="mt-4">
            <label className="block font-bold mb-1">Criminal Record(s)</label>
            {formData.criminalRecord?.map((rec, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Crime Type"
                  className="input input-bordered"
                  value={rec.crimeType}
                  list="crimeTypeList"
                  onChange={(e) => {
                    const updated = [...formData.criminalRecord];
                    updated[i].crimeType = e.target.value;
                    setFormData({ ...formData, criminalRecord: updated });
                  }}
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
                  type="text"
                  placeholder="Location"
                  className="input input-bordered"
                  value={rec.location}
                  onChange={(e) => {
                    const updated = [...formData.criminalRecord];
                    updated[i].location = e.target.value;
                    setFormData({ ...formData, criminalRecord: updated });
                  }}
                />
                <input
                  type="date"
                  className="input input-bordered"
                  value={new Date(rec.date).toISOString().split("T")[0]}
                  onChange={(e) => {
                    const updated = [...formData.criminalRecord];
                    updated[i].date = new Date(e.target.value);
                    setFormData({ ...formData, criminalRecord: updated });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm mt-2 btn-outline"
              onClick={() =>
                setFormData({
                  ...formData,
                  criminalRecord: [
                    ...(formData.criminalRecord || []),
                    { crimeType: "", location: "", date: new Date() },
                  ],
                })
              }
            >
              + Add Record
            </button>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex items-center gap-4">
              <button className="btn btn-secondary">Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingId ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
