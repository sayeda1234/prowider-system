import { connectDB } from "../../../lib/mongodb";
import Provider from "../../../models/Provider";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  await Provider.deleteMany();

  const providers = [];

  for (let i = 1; i <= 8; i++) {
    providers.push({
      name: `Provider ${i}`,
      monthlyQuota: 10,
      usedQuota: 0,
    });
  }

  await Provider.insertMany(providers);
  return NextResponse.json({
    message: "Providers seeded",
  });
}