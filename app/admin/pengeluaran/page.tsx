import TransactionManager from "@/components/TransactionManager";

export default function PengeluaranPage() {
  return (
    <TransactionManager
      type="EXPENSE"
      title="Pengeluaran"
      description="Kelola pencatatan uang keluar kas Agustusan."
      rekapHref="/admin/pengeluaran/rekap"
    />
  );
}
