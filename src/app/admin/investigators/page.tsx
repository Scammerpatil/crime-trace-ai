"use client";

import { useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";

interface Investigator {
  _id?: string;
  name: string;
  email: string;
  profileImage: string;
  contact: string;
  desigination: string;
}

export default function ManageInvestigators() {
  const [investigators, setInvestigators] = useState<Investigator[]>([]);
  const [formData, setFormData] = useState<Investigator>({
    name: "",
    email: "",
    profileImage: "",
    contact: "",
    desigination: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchInvestigators = async () => {
    const response = await axios.get("/api/investigators");
    setInvestigators(response.data.investigators);
  };

  const handleEdit = (investigator: Investigator) => {
    setFormData(investigator);
    setEditingId(investigator._id || null);
    (
      document.getElementById("investigator_modal") as HTMLDialogElement
    )?.showModal();
  };

  const handleDelete = async (id: string) => {
    await toast.promise(axios.delete(`/api/investigators/delete?id=${id}`), {
      loading: "Deleting...",
      success: "Investigator deleted",
      error: "Failed to delete",
    });
    fetchInvestigators();
  };

  const handleSubmit = async () => {
    const method = editingId ? "put" : "post";
    const url = editingId
      ? `/api/investigators/edit?id=${editingId}`
      : "/api/investigators/add";

    const res = axios[method](url, { formData });
    toast.promise(res, {
      loading: editingId ? "Updating..." : "Adding...",
      success: () => {
        setFormData({
          name: "",
          email: "",
          profileImage: "",
          contact: "",
          desigination: "",
        });
        (
          document.getElementById("investigator_modal") as HTMLDialogElement
        )?.close();
        if (editingId) {
          return "Investigator updated successfully";
        } else {
          return "Investigator added successfully";
        }
      },
      error: (err: any) => `Error: ${err.response?.data.message}`,
    });

    setEditingId(null);
    fetchInvestigators();
  };

  useEffect(() => {
    fetchInvestigators();
  }, []);

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
        folderName: "profileImages",
      });
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setFormData({
            ...formData,
            profileImage: data.data.path,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Manage Investigators
      </h1>
      <div className="overflow-x-auto bg-base-300 rounded-box">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investigators.length > 0 ? (
              investigators.map((inv, index) => (
                <tr key={inv._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={inv.profileImage} alt={inv.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{inv.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{inv.email}</td>
                  <td>{inv.contact}</td>
                  <td>{inv.desigination}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(inv)}
                    >
                      <IconEdit size={18} />
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(inv._id!)}
                    >
                      <IconTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No Investigators Found
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
              document.getElementById("investigator_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          Add Investigator
        </button>
      </div>

      <dialog id="investigator_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-xl mb-4 uppercase text-center">
            {editingId ? "Edit Investigator" : "Add Investigator"}
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
              type="text"
              placeholder="Designation"
              className="input input-bordered w-full"
              value={formData.desigination}
              list="profileImageList"
              onChange={(e) =>
                setFormData({ ...formData, desigination: e.target.value })
              }
            />
            <datalist id="profileImageList">
              <option value="Detective Inspector" />
              <option value="Detective" />
              <option value="Forensic Expert" />
              <option value="Cyber Crime Specialist" />
              <option value="Crime Scene Investigator" />
              <option value="Investigation Officer" />
            </datalist>
          </div>
          <input
            type="file"
            className="file file-input w-full mt-4"
            accept="image/*"
            onChange={handleUploadImage}
          />
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
    </div>
  );
}
