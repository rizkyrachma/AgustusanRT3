import React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ConfirmModalProps = {
  isOpen: boolean;
  message: string;
  isAlert?: boolean; // If true, only shows OK button
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ isOpen, message, isAlert = false, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className={`bg-white rounded-[16px] w-full max-w-[400px] overflow-hidden border-t-[4px] shadow-xl transform transition-all ${isAlert ? 'border-t-[#FFD700]' : 'border-t-[#B91C1C]'}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 p-2 rounded-full ${isAlert ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[#FEF2F2] text-[#B91C1C]'}`}>
              {isAlert ? <Info size={24} className="text-[#FFD700]" /> : <AlertCircle size={24} />}
            </div>
            <div className="flex-1 mt-1">
              <h3 className="text-[16px] font-bold text-gray-900 font-playfair mb-2">
                {isAlert ? "Pemberitahuan" : "Konfirmasi"}
              </h3>
              <p className="text-[13px] text-[#4B5563] leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F3F4F6] border-t border-[#E5E7EB] flex gap-3 justify-end">
          {!isAlert && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#4B5563] rounded-[8px] text-[13px] font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-[8px] text-[13px] font-medium transition-colors ${
              isAlert 
                ? 'bg-[#B91C1C] hover:bg-[#991B1B]' 
                : 'bg-[#B91C1C] hover:bg-[#991B1B]'
            }`}
          >
            {isAlert ? "Tutup" : "Ya, Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
