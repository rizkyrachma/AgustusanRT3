import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

async function getRekapPemasukan() {
  await dbConnect();
  
  const rekap = await Transaction.aggregate([
    { $match: { type: "INCOME" } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        totalAmount: { $sum: "$amount" },
        jumlahTransaksi: { $sum: 1 } // equivalent to $count
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  return rekap;
}

export default async function RekapPemasukanPage() {
  const data = await getRekapPemasukan();
  const grandTotal = data.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/pemasukan" className="p-2 bg-white border border-[#E5E7EB] rounded-[8px] text-[#374151] hover:bg-[#F3F4F6] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-[22px] font-playfair font-bold text-gray-900 mb-1">Rekap Pemasukan</h1>
          <p className="text-[13px] text-[#4B5563]">Ringkasan bulanan untuk uang masuk kas.</p>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F4F6] text-[#4B5563] text-[11px] uppercase tracking-[0.08em] font-medium border-b-[0.5px] border-[#E5E7EB]">
                <th className="p-4 font-medium">Bulan / Tahun</th>
                <th className="p-4 font-medium text-center">Jumlah Transaksi</th>
                <th className="p-4 font-medium text-right">Total Pemasukan</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => {
                  const date = new Date(item._id.year, item._id.month - 1);
                  const monthName = date.toLocaleDateString("id-ID", { month: "long" });
                  return (
                    <tr key={index} className="border-t-[0.5px] border-[#E5E7EB] text-[13px] hover:bg-[#F3F4F6] transition-colors">
                      <td className="p-4 font-medium text-gray-900">
                        {monthName} {item._id.year}
                      </td>
                      <td className="p-4 text-center text-[#374151]">
                        {item.jumlahTransaksi}
                      </td>
                      <td className="p-4 font-medium text-[#16A34A] text-right">
                        {formatCurrency(item.totalAmount).replace(/,/g, '.')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-[#4B5563] text-[13px]">
                    Belum ada data rekap.
                  </td>
                </tr>
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot>
                <tr className="bg-[#F3F4F6] border-t-[0.5px] border-[#E5E7EB] text-[13px]">
                  <td className="p-4 font-bold text-gray-900 text-right" colSpan={2}>
                    GRAND TOTAL
                  </td>
                  <td className="p-4 font-bold text-[#16A34A] text-right text-[15px]">
                    {formatCurrency(grandTotal).replace(/,/g, '.')}
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
