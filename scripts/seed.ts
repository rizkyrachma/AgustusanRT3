import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User";
import Committee from "../models/Committee";
import Category from "../models/Category";
import Transaction from "../models/Transaction";
import Competition from "../models/Competition";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected successfully!");

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Committee.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    await Competition.deleteMany({});

    // 1. Create Admin User
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin",
      email: "admin123@gmail.com",
      password: hashedPassword,
    });

    // 2. Create Categories
    console.log("Creating categories...");
    const categories = await Category.insertMany([
      { name: "Konsumsi", type: "EXPENSE" },
      { name: "Dekorasi", type: "EXPENSE" },
      { name: "Perlengkapan", type: "EXPENSE" },
      { name: "Iuran Warga", type: "INCOME" },
      { name: "Donasi", type: "INCOME" },
    ]);

    const getCategoryId = (name: string) =>
      categories.find((c) => c.name === name)?._id;

    // 3. Create Committee
    console.log("Creating committee...");
    await Committee.insertMany([
      { name: "Budi Santoso", role: "Ketua" },
      { name: "Siti Rahayu", role: "Wakil Ketua" },
      { name: "Ahmad Fauzi", role: "Sekretaris" },
      { name: "Dewi Lestari", role: "Bendahara" },
      { name: "Rudi Hartono", role: "Anggota" },
      { name: "Nina Kusuma", role: "Anggota" },
    ]);

    // 4. Create Transactions
    console.log("Creating transactions...");
    const currentDate = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(currentDate.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

    await Transaction.insertMany([
      {
        title: "Iuran Warga RT3",
        amount: 5000000,
        type: "INCOME",
        date: currentDate,
        userId: admin._id,
        categoryId: getCategoryId("Iuran Warga"),
      },
      {
        title: "Donasi Bapak H. Somad",
        amount: 2000000,
        type: "INCOME",
        date: lastMonth,
        userId: admin._id,
        categoryId: getCategoryId("Donasi"),
      },
      {
        title: "Iuran Warga Tambahan",
        amount: 1500000,
        type: "INCOME",
        date: twoMonthsAgo,
        userId: admin._id,
        categoryId: getCategoryId("Iuran Warga"),
      },
      {
        title: "Beli Bendera & Umbul-umbul",
        amount: 500000,
        type: "EXPENSE",
        date: twoMonthsAgo,
        userId: admin._id,
        categoryId: getCategoryId("Dekorasi"),
      },
      {
        title: "Sewa Panggung",
        amount: 1500000,
        type: "EXPENSE",
        date: lastMonth,
        userId: admin._id,
        categoryId: getCategoryId("Perlengkapan"),
      },
      {
        title: "DP Konsumsi Rapat",
        amount: 300000,
        type: "EXPENSE",
        date: lastMonth,
        userId: admin._id,
        categoryId: getCategoryId("Konsumsi"),
      },
      {
        title: "Pelunasan Konsumsi Rapat",
        amount: 300000,
        type: "EXPENSE",
        date: currentDate,
        userId: admin._id,
        categoryId: getCategoryId("Konsumsi"),
      },
      {
        title: "Beli Cat Merah Putih",
        amount: 250000,
        type: "EXPENSE",
        date: currentDate,
        userId: admin._id,
        categoryId: getCategoryId("Dekorasi"),
      },
      {
        title: "Sound System",
        amount: 1000000,
        type: "EXPENSE",
        date: currentDate,
        userId: admin._id,
        categoryId: getCategoryId("Perlengkapan"),
      },
      {
        title: "Snack Lomba Anak",
        amount: 500000,
        type: "EXPENSE",
        date: currentDate,
        userId: admin._id,
        categoryId: getCategoryId("Konsumsi"),
      },
    ]);

    // 5. Create Competitions
    console.log("Creating competitions...");
    await Competition.insertMany([
      {
        name: "Lomba Balap Karung",
        description: "Lomba tradisional balap karung menggunakan helm. Khusus anak-anak RT3.",
        image: "",
      },
      {
        name: "Panjat Pinang",
        description: "Panjat pinang berhadiah utama sepeda gunung. Pendaftaran per tim (5 orang).",
        image: "",
      },
      {
        name: "Lomba Makan Kerupuk",
        description: "Peserta harus menghabiskan kerupuk yang digantung secepat mungkin tanpa menggunakan tangan.",
        image: "",
      }
    ]);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
