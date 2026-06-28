"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import ConfirmModal from "@/components/ConfirmModal";

type Member = {
  _id: string;
  name: string;
  role: string;
  photo?: string;
};

const ROLES = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"];

export default function PanitiaPage() {
  const [committee, setCommittee] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ _id: "", name: "", role: "Anggota", photo: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    isAlert: false,
    onConfirm: () => {},
  });

  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  const fetchCommittee = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/committee");
      const data = await res.json();
      setCommittee(data);
    } catch (error) {
      console.error("Failed to fetch committee", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setFormData({ _id: member._id, name: member.name, role: member.role, photo: member.photo || "" });
    } else {
      setFormData({ _id: "", name: "", role: "Anggota", photo: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ _id: "", name: "", role: "Anggota", photo: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData._id ? `/api/committee/${formData._id}` : "/api/committee";
      const method = formData._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, role: formData.role, photo: formData.photo }),
      });

      if (res.ok) {
        fetchCommittee();
        handleCloseModal();
      } else {
        setConfirmModal({
          isOpen: true,
          message: "Gagal menyimpan panitia.",
          isAlert: true,
          onConfirm: closeConfirmModal,
        });
      }
    } catch (error) {
      console.error("Error saving member", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus anggota ini?",
      isAlert: false,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          const res = await fetch(`/api/committee/${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchCommittee();
          } else {
            setConfirmModal({
              isOpen: true,
              message: "Gagal menghapus panitia.",
              isAlert: true,
              onConfirm: closeConfirmModal,
            });
          }
        } catch (error) {
          console.error("Error deleting member", error);
        }
      },
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        isAlert={confirmModal.isAlert}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-playfair font-bold text-gray-900 mb-1">Panitia</h1>
          <p className="text-[13px] text-[#4B5563]">Kelola daftar susunan panitia Agustusan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Tambah Panitia
        </button>
      </div>

      <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#4B5563] text-[13px]">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F3F4F6] text-[#4B5563] text-[11px] uppercase tracking-[0.08em] font-medium border-b-[0.5px] border-[#E5E7EB]">
                  <th className="p-4 font-medium">Nama</th>
                  <th className="p-4 font-medium">Jabatan</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {committee.length > 0 ? (
                  committee.map((member) => (
                    <tr key={member._id} className="border-t-[0.5px] border-[#E5E7EB] text-[13px] hover:bg-[#F3F4F6] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[32px] h-[32px] rounded-full bg-[#F3F4F6] overflow-hidden flex items-center justify-center text-[#374151] font-medium border border-[#E5E7EB]">
                            {member.photo ? (
                              <Image src={member.photo} alt={member.name} width={32} height={32} className="object-cover w-full h-full" />
                            ) : (
                              member.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] text-[11px] font-medium rounded-full border border-[#E5E7EB]">
                          {member.role}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenModal(member)}
                          className="p-1.5 text-[#374151] hover:text-gray-900 hover:bg-border-color/50 rounded-[6px] transition-colors inline-block"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="p-1.5 text-[#374151] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded-[6px] transition-colors inline-block"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-[#4B5563] text-[13px]">
                      Belum ada panitia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-[16px] w-full max-w-[420px] overflow-hidden border-t-[3px] border-t-[#B91C1C]">
            <div className="px-[1.5rem] py-[1.25rem] border-b border-[#E5E7EB] flex justify-between items-center">
              <h3 className="font-playfair font-bold text-[16px] text-gray-900">
                {formData._id ? "Edit Panitia" : "Tambah Panitia"}
              </h3>
              <button onClick={handleCloseModal} className="text-[#4B5563] hover:text-gray-900">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-[1.5rem] space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Jabatan (Role)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">URL Foto (Opsional)</label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] rounded-[8px] text-[13px] font-medium hover:bg-border-color/50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 bg-[#B91C1C] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#991B1B] transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
