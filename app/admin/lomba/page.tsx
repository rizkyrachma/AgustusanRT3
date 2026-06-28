"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import ConfirmModal from "@/components/ConfirmModal";

type Competition = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
};

export default function LombaPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ _id: "", name: "", description: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    isAlert: false,
    onConfirm: () => {},
  });

  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/competitions");
      const data = await res.json();
      setCompetitions(data);
    } catch (error) {
      console.error("Failed to fetch competitions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleOpenModal = (comp?: Competition) => {
    if (comp) {
      setFormData({ 
        _id: comp._id, 
        name: comp.name, 
        description: comp.description || "", 
        image: comp.image || "" 
      });
      setPreviewImage(comp.image || "");
    } else {
      setFormData({ _id: "", name: "", description: "", image: "" });
      setPreviewImage("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ _id: "", name: "", description: "", image: "" });
    setPreviewImage("");
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Fill background with white in case of transparent PNG
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }
          resolve(canvas.toDataURL("image/jpeg", 0.7)); 
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan!");
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      setPreviewImage(compressedBase64);
      setFormData((prev) => ({ ...prev, image: compressedBase64 }));
    } catch (error) {
      console.error("Failed to compress image", error);
      alert("Gagal memproses gambar.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData._id ? `/api/competitions/${formData._id}` : "/api/competitions";
      const method = formData._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name, 
          description: formData.description, 
          image: formData.image 
        }),
      });

      if (res.ok) {
        fetchCompetitions();
        handleCloseModal();
      } else {
        setConfirmModal({
          isOpen: true,
          message: "Gagal menyimpan lomba.",
          isAlert: true,
          onConfirm: closeConfirmModal,
        });
      }
    } catch (error) {
      console.error("Error saving competition", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus lomba ini?",
      isAlert: false,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          const res = await fetch(`/api/competitions/${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchCompetitions();
          } else {
            setConfirmModal({
              isOpen: true,
              message: "Gagal menghapus lomba.",
              isAlert: true,
              onConfirm: closeConfirmModal,
            });
          }
        } catch (error) {
          console.error("Error deleting competition", error);
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
          <h1 className="text-[22px] font-playfair font-bold text-gray-900 mb-1">Daftar Lomba</h1>
          <p className="text-[13px] text-[#4B5563]">Kelola perlombaan yang akan diadakan.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Tambah Lomba
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-[#4B5563] text-[13px]">Memuat data...</div>
        ) : competitions.length > 0 ? (
          competitions.map((comp) => (
            <div key={comp._id} className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] overflow-hidden flex flex-col transition-shadow hover:shadow-md">
              <div className="h-[180px] w-full bg-[#F3F4F6] relative border-b border-[#E5E7EB] flex items-center justify-center">
                {comp.image ? (
                  <Image src={comp.image} alt={comp.name} fill className="object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-[#9CA3AF] opacity-50" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-playfair font-bold text-[16px] text-gray-900 mb-1">{comp.name}</h3>
                <p className="text-[13px] text-[#4B5563] flex-1 line-clamp-3">
                  {comp.description || "Tidak ada deskripsi."}
                </p>
                <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => handleOpenModal(comp)}
                    className="p-1.5 text-[#374151] hover:text-gray-900 hover:bg-[#F3F4F6] rounded-[6px] transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(comp._id)}
                    className="p-1.5 text-[#374151] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded-[6px] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-[#4B5563] text-[13px] bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB]">
            Belum ada daftar lomba.
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-[16px] w-full max-w-[420px] overflow-hidden border-t-[3px] border-t-[#B91C1C]">
            <div className="px-[1.5rem] py-[1.25rem] border-b border-[#E5E7EB] flex justify-between items-center">
              <h3 className="font-playfair font-bold text-[16px] text-gray-900">
                {formData._id ? "Edit Lomba" : "Tambah Lomba"}
              </h3>
              <button onClick={handleCloseModal} className="text-[#4B5563] hover:text-gray-900">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-[1.5rem] space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Nama Lomba</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  placeholder="Contoh: Balap Karung"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Gambar Lomba</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                
                {previewImage ? (
                  <div className="relative w-full h-[140px] rounded-[8px] border border-[#E5E7EB] overflow-hidden mb-2 group">
                    <Image src={previewImage} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-gray-900 px-3 py-1.5 rounded-[6px] text-[12px] font-medium"
                      >
                        Ganti Gambar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-[100px] border-2 border-dashed border-[#E5E7EB] rounded-[8px] flex flex-col items-center justify-center text-[#4B5563] hover:border-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <ImageIcon size={24} className="mb-2 text-[#9CA3AF]" />
                    <span className="text-[12px] font-medium">Klik untuk upload gambar</span>
                  </button>
                )}
                <p className="text-[11px] text-[#9CA3AF] mt-1.5">Maksimal ukuran bebas (akan dikompres otomatis).</p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Deskripsi (Opsional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-[14px] text-gray-900 bg-white rounded-[8px] border border-[#E5E7EB] focus:outline-none focus:border-[#B91C1C] focus:ring-[3px] focus:ring-[#FEF2F2] transition-colors placeholder-gray-400"
                  rows={3}
                  placeholder="Aturan lomba atau detail lainnya..."
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] rounded-[8px] text-[13px] font-medium hover:bg-gray-100 transition-colors"
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
