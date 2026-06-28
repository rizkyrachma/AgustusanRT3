import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

async function getRekapPengeluaran() {
  await dbConnect();
  
  const rekap = await Transaction.aggregate([
    { $match: { type: "EXPENSE" } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        totalAmount: { $sum: "$amount" },
        jumlahTransaksi: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  return rekap;
}

export default async function RekapPengeluaranPage() {
  const data = await getRekapPengeluaran();
  const grandTotal = data.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/pengeluaran" className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rekap Pengeluaran</h1>
          <p className="text-gray-500">Ringkasan bulanan untuk uang keluar kas.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-merah text-putih text-sm">
                <th className="p-4 font-semibold rounded-tl-xl">Bulan / Tahun</th>
                <th className="p-4 font-semibold text-center">Jumlah Transaksi</th>
                <th className="p-4 font-semibold text-right rounded-tr-xl">Total Pengeluaran</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => {
                  const date = new Date(item._id.year, item._id.month - 1);
                  const monthName = date.toLocaleDateString("id-ID", { month: "long" });
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">
                        {monthName} {item._id.year}
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        {item.jumlahTransaksi}
                      </td>
                      <td className="p-4 font-bold text-merah text-right">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    Belum ada data rekap.
                  </td>
                </tr>
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td className="p-4 font-bold text-gray-900 text-right" colSpan={2}>
                    GRAND TOTAL
                  </td>
                  <td className="p-4 font-bold text-red-800 text-right text-lg">
                    {formatCurrency(grandTotal)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
