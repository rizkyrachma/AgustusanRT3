"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface FinanceChartProps {
  income: number;
  expense: number;
}

export default function FinanceChart({ income, expense }: FinanceChartProps) {
  const data = [
    { name: "Pemasukan", value: income, color: "#86EFAC" }, // green
    { name: "Pengeluaran", value: expense, color: "#FCA5A5" } // red
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={"cell-" + index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => formatCurrency(Number(value)).replace(/,/g, '.')}
            contentStyle={{ borderRadius: '8px', border: '0.5px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
