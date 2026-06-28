import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Committee from "@/models/Committee";
import Transaction from "@/models/Transaction";
import { formatCurrency } from "@/lib/utils";
import FadeIn from "@/components/FadeIn";
import FinanceChart from "@/components/FinanceChart";

// Make sure to configure the Next.js cache properly for this route
export const revalidate = 60; // Revalidate every 60 seconds

async function getHomePageData() {
  try {
    await dbConnect();

    // Fetch committee
    const committee = await Committee.find({}).sort({ createdAt: 1 }).lean();

    // Calculate Ringkasan Kas
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

    return {
      committee: JSON.parse(JSON.stringify(committee)),
      totalIncome,
      totalExpense,
      balance,
    };
  } catch (error) {
    console.warn("Database connection skipped or failed:", error);
    return {
      committee: [],
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    };
  }
}

export default async function Home() {
  const { committee, totalIncome, totalExpense, balance } =
    await getHomePageData();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* 1. Flag bar */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#B91C1C] from-50% to-white to-50%" />

      {/* 2. Top navigation bar */}
      <header className="bg-[#B91C1C] border-b-[3px] border-[#FFD700] h-[60px] px-8 flex items-center justify-between sticky top-0 z-50">
        <span className="font-playfair font-bold text-[17px] text-white">
          Kas Agustusan RT3
        </span>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[13px] text-[#FFD700] font-medium hover:text-yellow-200 transition-colors">
            Beranda
          </Link>
          <Link href="#rekap" className="text-[13px] text-[#FFD700] font-medium hover:text-yellow-200 transition-colors">
            Rekap Kas
          </Link>
          <Link href="#panitia" className="text-[13px] text-[#FFD700] font-medium hover:text-yellow-200 transition-colors">
            Panitia
          </Link>
          <Link href="/login" className="text-[13px] text-[#FFD700] font-medium hover:text-yellow-200 transition-colors">
            Masuk
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {/* 3. Hero section */}
        <section className="bg-[#7F1D1D] min-h-[calc(100vh-64px)] flex flex-col items-center px-8 text-center pt-16 pb-12">
          {/* Flexible spacer to center the text visually but prevent overlap */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <FadeIn delay={100} direction="up">
              <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
                {/* Ornamental divider */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-[60px] h-[1px] bg-[#FFD700]" />
                  <div className="w-[8px] h-[8px] bg-[#FFD700] rotate-45 mx-3" />
                  <div className="w-[60px] h-[1px] bg-[#FFD700]" />
                </div>

                {/* Eyebrow */}
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#FFD700] font-medium mb-[1rem]">
                  Peringatan Hari Kemerdekaan Republik Indonesia
                </p>

                {/* Main title */}
                <h1 className="font-playfair text-[50px] md:text-[64px] font-bold text-white leading-[1.1] mb-4">
                  Agustusan <span className="text-[#FFD700]">RT 3</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[14px] md:text-[16px] text-white/70 font-medium tracking-[0.05em] mb-8">
                  HUT RI Ke-80 &middot; 17 Agustus 2025
                </p>
              </div>
            </FadeIn>
          </div>
          
          <div className="mt-auto pt-8">
            <FadeIn delay={500} direction="up">
              <Link href="#rekap" className="flex flex-col items-center group cursor-pointer">
                <span className="text-[11px] text-white/60 mb-2 group-hover:text-[#FFD700] transition-colors uppercase tracking-widest">Laporan Keuangan</span>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FFD700] transition-all animate-bounce">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-[#FFD700]">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* 4. Rekap Kas Section */}
        <section id="rekap" className="w-full bg-[#FAFAFA] px-6 py-20 border-b border-[#E5E7EB]">
          <div className="max-w-[800px] mx-auto">
            <FadeIn>
              {/* Section header */}
              <div className="flex items-center gap-4 mb-12">
                <div className="w-[6px] h-[6px] rounded-full bg-[#B91C1C]" />
                <h2 className="font-playfair text-[24px] font-bold text-gray-900 whitespace-nowrap">
                  Rekapitulasi Kas
                </h2>
                <div className="flex-1 h-[1px] bg-[#E5E7EB]" />
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-white p-6 rounded-[12px] border-[0.5px] border-[#E5E7EB] shadow-sm text-center">
                  <div className="text-[11px] uppercase tracking-[0.1em] text-[#9CA3AF] font-medium mb-2">Total Pemasukan</div>
                  <div className="text-[24px] font-bold text-[#16A34A]">{formatCurrency(totalIncome).replace(/,/g, '.')}</div>
                </div>
                <div className="bg-white p-6 rounded-[12px] border-[0.5px] border-[#E5E7EB] shadow-sm text-center">
                  <div className="text-[11px] uppercase tracking-[0.1em] text-[#9CA3AF] font-medium mb-2">Total Pengeluaran</div>
                  <div className="text-[24px] font-bold text-[#DC2626]">{formatCurrency(totalExpense).replace(/,/g, '.')}</div>
                </div>
                <div className="bg-white p-6 rounded-[12px] border-[0.5px] border-[#FFD700] shadow-sm text-center ring-1 ring-[#FFD700]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD700]/10 rounded-bl-full -z-10" />
                  <div className="text-[11px] uppercase tracking-[0.1em] text-[#9CA3AF] font-medium mb-2">Saldo Saat Ini</div>
                  <div className="text-[24px] font-bold text-gray-900">{formatCurrency(balance).replace(/,/g, '.')}</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[12px] p-6 shadow-sm">
                <h3 className="text-[13px] font-medium text-gray-900 mb-6 text-center">Proporsi Keuangan</h3>
                {totalIncome === 0 && totalExpense === 0 ? (
                  <div className="text-center text-[#9CA3AF] text-[13px] py-12">Belum ada data transaksi.</div>
                ) : (
                  <FinanceChart income={totalIncome} expense={totalExpense} />
                )}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 5. Panitia section */}
        <section id="panitia" className="w-full bg-white px-6 py-20">
          <div className="max-w-[800px] mx-auto">
            <FadeIn>
              {/* Section header */}
              <div className="flex items-center gap-4 mb-12">
                <div className="w-[6px] h-[6px] rounded-full bg-[#B91C1C]" />
                <h2 className="font-playfair text-[24px] font-bold text-gray-900 whitespace-nowrap">
                  Susunan Panitia
                </h2>
                <div className="flex-1 h-[1px] bg-[#E5E7EB]" />
              </div>
            </FadeIn>

            {committee.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {committee.map((member: any, idx: number) => (
                  <FadeIn key={member._id} delay={100 + (idx % 3) * 150} direction="up">
                    <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-[12px] p-6 flex flex-col items-center text-center hover:border-[#B91C1C] transition-all hover:-translate-y-1 shadow-sm cursor-default h-full">
                      {/* Initials avatar */}
                      <div className="w-[64px] h-[64px] rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#B91C1C] font-bold text-[18px] mb-4 overflow-hidden ring-4 ring-white shadow-sm">
                        {member.photo ? (
                          <Image src={member.photo} alt={member.name} width={64} height={64} className="object-cover w-full h-full" />
                        ) : (
                          member.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                        )}
                      </div>
                      {/* Name */}
                      <h3 className="text-[14px] font-[600] text-gray-900 mb-3">
                        {member.name}
                      </h3>
                      {/* Role badge */}
                      <span className="mt-auto bg-[#FEF2F2] text-[#B91C1C] border-[0.5px] border-[#FECACA] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {member.role}
                      </span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <FadeIn delay={200}>
                <div className="text-center text-[#9CA3AF] py-10 text-[13px]">
                  Belum ada data panitia.
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="w-full bg-white pb-10">
        <div className="h-[1px] w-full bg-[#E5E7EB] mb-8" />
        <FadeIn delay={100} direction="none">
          <div className="text-center flex justify-center items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#9CA3AF] font-medium">HUT RI Ke-80</span>
            <span className="text-[#B91C1C] text-[11px]">&bull;</span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#9CA3AF] font-medium">RT 3</span>
            <span className="text-[#B91C1C] text-[11px]">&bull;</span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#9CA3AF] font-medium">2025</span>
          </div>
        </FadeIn>
      </footer>
    </div>
  );
}
