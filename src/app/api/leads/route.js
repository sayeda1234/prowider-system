import mongoose from "mongoose";

import { connectDB } from "../../../lib/mongodb";

import Lead from "../../../models/Lead";

import { allocateLead } from "../../../lib/allocateLead";

import { NextResponse } from "next/server";

export async function POST(req) {

  let session;

  try {

    await connectDB();

    const body = await req.json();

    const {
      name,
      phone,
      city,
      service,
      description,
    } = body;

    // Start transaction
    session = await mongoose.startSession();

    session.startTransaction();

    // Create lead
    const lead = await Lead.create(
      [
        {
          name,
          phone,
          city,
          service,
          description,
        },
      ],
      { session }
    );

    // Allocate providers
    const assignedProviders =
      await allocateLead(
        lead[0],
        session
      );

    // Commit transaction
    await session.commitTransaction();

    session.endSession();

    return NextResponse.json({
      success: true,
      message: "Lead created successfully",
      lead: lead[0],
      assignedProviders:
        assignedProviders.map(
          (p) => p.name
        ),
    });

  } catch (error) {

    console.log(error);

    // Rollback transaction
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    // Duplicate lead error
    if (error.code === 11000) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Duplicate lead not allowed for same service",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}