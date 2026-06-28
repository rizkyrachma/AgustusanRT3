"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DailyData = {
  _id: string; // Date string "YYYY-MM-DD"
  total: number;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function AdminCharts({
  dailyIncome,
  dailyExpense,
}: {
  dailyIncome: DailyData[];
  dailyExpense: DailyData[];
}) {
  // Generate the last 7 days including today
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Format as YYYY-MM-DD in local time to match DB grouping
      const localDateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      days.push(localDateStr);
    }
    return days;
  };

  const fillMissingDays = (data: DailyData[]) => {
    const last7Days = getLast7Days();
    return last7Days.map((dateStr) => {
      const found = data.find((d) => d._id === dateStr);
      return {
        _id: dateStr,
        total: found ? found.total : 0,
      };
    });
  };

  // Format dates for display
  const formatData = (data: DailyData[]) => {
    const filled = fillMissingDays(data);
    return filled.map((item) => ({
      ...item,
      displayDate: new Date(item._id).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
    }));
  };

  const incomeData = formatData(dailyIncome);
  const expenseData = formatData(dailyExpense);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5E7EB] p-3 rounded-[8px] shadow-lg">
          <p className="text-[12px] text-[#4B5563] mb-1">{label}</p>
          <p className="text-[14px] font-bold text-gray-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income Chart */}
      <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h2 className="text-[16px] font-playfair font-bold text-gray-900">
            Pemasukan Harian
          </h2>
        </div>
        <div className="p-5 h-[300px]">
          {incomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  tickFormatter={(value) => `Rp${value / 1000}k`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
                <Bar dataKey="total" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#4B5563] text-[13px]">
              Belum ada data pemasukan
            </div>
          )}
        </div>
      </div>

      {/* Expense Chart */}
      <div className="bg-white rounded-[12px] border-[0.5px] border-[#E5E7EB] overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h2 className="text-[16px] font-playfair font-bold text-gray-900">
            Pengeluaran Harian
          </h2>
        </div>
        <div className="p-5 h-[300px]">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  tickFormatter={(value) => `Rp${value / 1000}k`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
                <Bar dataKey="total" fill="#B91C1C" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#4B5563] text-[13px]">
              Belum ada data pengeluaran
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
