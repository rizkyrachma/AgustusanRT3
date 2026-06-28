"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";

type Category = { _id: string; name: string };
type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
  note?: string;
  categoryId: Category;
};

export default function TransactionManager({
  type,
  title,
  description,
  rekapHref,
}: {
  type: "INCOME" | "EXPENSE";
  title: string;
  description: string;
  rekapHref: string;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    isAlert: false,
    onConfirm: () => {},
  });

  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, catRes] = await Promise.all([
        fetch(`/api/transactions?type=${type}`),
        fetch(`/api/categories?type=${type}`),
      ]);
      const [txData, catData] = await Promise.all([txRes.json(), catRes.json()]);
      setTransactions(txData);
      setCategories(catData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (trx?: Transaction) => {
    if (trx) {
      setFormData({
        _id: trx._id,
        title: trx.title,
        amount: trx.amount.toString(),
        date: new Date(trx.date).toISOString().split("T")[0],
        categoryId: trx.categoryId?._id || "",
        note: trx.note || "",
      });
    } else {
      setFormData({
        _id: "",
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        categoryId: categories[0]?._id || "",
        note: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData._id ? `/api/transactions/${formData._id}` : "/api/transactions";
      const method = formData._id ? "PUT" : "POST";
      
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        type,
        date: new Date(formData.date).toISOString(),
        categoryId: formData.categoryId,
        note: formData.note,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchData();
        handleCloseModal();
      } else {
        setConfirmModal({
          isOpen: true,
          message: "Gagal menyimpan transaksi.",
          isAlert: true,
          onConfirm: closeConfirmModal,
        });
      }
    } catch (error) {
      console.error("Error saving transaction", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus transaksi ini?",
      isAlert: false,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchData();
          } else {
            setConfirmModal({
              isOpen: true,
              message: "Gagal menghapus transaksi.",
              isAlert: true,
              onConfirm: closeConfirmModal,
            });
          }
        } catch (error) {
          console.error("Error deleting transaction", error);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-playfair font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-[13px] text-[#4B5563]">{description}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={rekapHref}
            className="bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors flex items-center gap-1.5"
          >
            <FileText size={16} />
            Rekap Bulanan
          </Link>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#4B5563] text-[13px]">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F3F4F6] text-[#4B5563] text-[11px] uppercase tracking-[0.08em] font-medium border-b-[0.5px] border-[#E5E7EB]">
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Judul</th>
                  <th className="p-4 font-medium">Kategori</th>
                  <th className="p-4 font-medium text-right">Jumlah</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((trx) => (
                    <tr key={trx._id} className="border-t-[0.5px] border-[#E5E7EB] text-[13px] hover:bg-[#F3F4F6] transition-colors">
                      <td className="p-4 text-[#374151] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#4B5563]" />
                          {new Date(trx.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{trx.title}</p>
                        {trx.note && <p className="text-[12px] text-[#4B5563] mt-0.5">{trx.note}</p>}
                      </td>
                      <td className="p-4">
                        <span className="text-[#374151]">
                          {trx.categoryId?.name || "-"}
                        </span>
                      </td>
                      <td className={`p-4 font-medium text-right whitespace-nowrap ${type === "INCOME" ? "text-[#16A34A]" : "text-[#B91C1C]"}`}>
                        {formatCurrency(trx.amount).replace(/,/g, '.')}
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(trx)}
                          className="p-1.5 text-[#374151] hover:text-gray-900 hover:bg-border-color/50 rounded-[6px] transition-colors inline-block"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(trx._id)}
                          className="p-1.5 text-[#374151] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded-[6px] transition-colors inline-block"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#4B5563] text-[13px]">
                      Belum ada transaksi.
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
                {formData._id ? `Edit ${title}` : `Tambah ${title}`}
              </h3>
              <button onClick={handleCloseModal} className="text-[#4B5563] hover:text-gray-900">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-[1.5rem] space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Judul / Keterangan</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  placeholder="Contoh: Beli Kertas"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Jumlah (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Kategori</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Catatan Tambahan (Opsional)</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  rows={2}
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
