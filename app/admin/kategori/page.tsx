"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

type Category = {
  _id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

export default function KategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ _id: "", name: "", type: "INCOME" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    isAlert: false,
    onConfirm: () => {},
  });

  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setFormData({ _id: category._id, name: category.name, type: category.type });
    } else {
      setFormData({ _id: "", name: "", type: "INCOME" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ _id: "", name: "", type: "INCOME" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData._id ? `/api/categories/${formData._id}` : "/api/categories";
      const method = formData._id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, type: formData.type }),
      });

      if (res.ok) {
        fetchCategories();
        handleCloseModal();
      } else {
        setConfirmModal({
          isOpen: true,
          message: "Gagal menyimpan kategori.",
          isAlert: true,
          onConfirm: closeConfirmModal,
        });
      }
    } catch (error) {
      console.error("Error saving category", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus kategori ini?",
      isAlert: false,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchCategories();
          } else {
            setConfirmModal({
              isOpen: true,
              message: "Gagal menghapus kategori.",
              isAlert: true,
              onConfirm: closeConfirmModal,
            });
          }
        } catch (error) {
          console.error("Error deleting category", error);
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
          <h1 className="text-[22px] font-playfair font-bold text-gray-900 mb-1">Kategori</h1>
          <p className="text-[13px] text-[#4B5563]">Kelola kategori pemasukan dan pengeluaran.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Tambah Kategori
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
                  <th className="p-4 font-medium">Nama Kategori</th>
                  <th className="p-4 font-medium">Tipe</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat._id} className="border-t-[0.5px] border-[#E5E7EB] text-[13px] hover:bg-[#F3F4F6] transition-colors">
                      <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full ${
                          cat.type === "INCOME" ? "bg-green-50 text-[#16A34A]" : "bg-[#FEF2F2] text-[#B91C1C]"
                        }`}>
                          {cat.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-1.5 text-[#374151] hover:text-gray-900 hover:bg-border-color/50 rounded-[6px] transition-colors inline-block"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
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
                      Belum ada kategori.
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
                {formData._id ? "Edit Kategori" : "Tambah Kategori"}
              </h3>
              <button onClick={handleCloseModal} className="text-[#4B5563] hover:text-gray-900">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-[1.5rem] space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  placeholder="Contoh: Konsumsi"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Tipe</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "INCOME" | "EXPENSE" })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                >
                  <option value="INCOME">Pemasukan</option>
                  <option value="EXPENSE">Pengeluaran</option>
                </select>
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
