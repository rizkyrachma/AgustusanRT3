import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Category from "@/models/Category";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import AdminCharts from "@/components/AdminCharts";

// Server component
export const dynamic = "force-dynamic";

async function getDashboardData() {
  await dbConnect();
  Category.schema; // Prevent Next.js from tree-shaking this import

  // Summary logic
  const incomeResult = await Transaction.aggregate([
    { $match: { type: "INCOME" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expenseResult = await Transaction.aggregate([
    { $match: { type: "EXPENSE" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalIncome = incomeResult[0]?.total || 0;
  const totalExpense = expenseResult[0]?.total || 0;
  const balance = totalIncome - totalExpense;

  // Daily aggregations for charts
  const dailyIncome = await Transaction.aggregate([
    { $match: { type: "INCOME" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 14 }, // Last 14 active days
  ]);

  const dailyExpense = await Transaction.aggregate([
    { $match: { type: "EXPENSE" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 14 },
  ]);

  // Recent transactions
  const recentTransactions = await Transaction.find({})
    .populate("categoryId", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    totalIncome,
    totalExpense,
    balance,
    dailyIncome,
    dailyExpense,
    recentTransactions: JSON.parse(JSON.stringify(recentTransactions)),
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-[22px] font-playfair font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-[13px] text-[#4B5563]">Ringkasan kas kepanitiaan Agustusan RT3.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] p-6 border-t-[3px] border-t-[#16A34A] flex items-center gap-4">
          <div className="text-[#16A34A]">
            <ArrowDownCircle size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[12px] text-[#4B5563] uppercase tracking-[0.05em] mb-1">
              Pemasukan
            </p>
            <p className="text-[22px] font-semibold font-playfair text-gray-900">
              {formatCurrency(data.totalIncome).replace(/,/g, '.')}
            </p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] p-6 border-t-[3px] border-t-[#B91C1C] flex items-center gap-4">
          <div className="text-[#B91C1C]">
            <ArrowUpCircle size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[12px] text-[#4B5563] uppercase tracking-[0.05em] mb-1">
              Pengeluaran
            </p>
            <p className="text-[22px] font-semibold font-playfair text-gray-900">
              {formatCurrency(data.totalExpense).replace(/,/g, '.')}
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] p-6 border-t-[3px] border-t-[#B45309] flex items-center gap-4">
          <div className="text-[#B45309]">
            <Wallet size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[12px] text-[#4B5563] uppercase tracking-[0.05em] mb-1">
              Saldo
            </p>
            <p className="text-[22px] font-semibold font-playfair text-gray-900">
              {formatCurrency(data.balance).replace(/,/g, '.')}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Finance Charts (Side by Side) */}
      <AdminCharts dailyIncome={data.dailyIncome} dailyExpense={data.dailyExpense} />

      <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h2 className="text-[18px] font-playfair font-bold text-gray-900">Transaksi Terakhir</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F4F6] text-[#4B5563] text-[11px] uppercase tracking-[0.08em] font-medium border-b-[0.5px] border-[#E5E7EB]">
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Judul</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((trx: any) => (
                  <tr
                    key={trx._id}
                    className="border-t-[0.5px] border-[#E5E7EB] text-[13px] hover:bg-[#F3F4F6] transition-colors"
                  >
                    <td className="p-4 text-[#374151]">
                      {new Date(trx.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {trx.title}
                    </td>
                    <td className="p-4">
                      <span className="text-[#374151]">
                        {trx.categoryId?.name || "-"}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-right font-medium ${
                        trx.type === "INCOME" ? "text-[#16A34A]" : "text-[#B91C1C]"
                      }`}
                    >
                      {trx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(trx.amount).replace(/,/g, '.')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#4B5563] text-[13px]">
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
