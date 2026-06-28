import TransactionManager from "@/components/TransactionManager";

export default function PemasukanPage() {
  return (
    <TransactionManager
      type="INCOME"
      title="Pemasukan"
      description="Kelola pencatatan uang masuk kas Agustusan."
      rekapHref="/admin/pemasukan/rekap"
    />
  );
}
