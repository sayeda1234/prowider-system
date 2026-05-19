import { connectDB } from "../../../../lib/mongodb";

import Provider from "../../../../models/Provider";

import WebhookEvent from "../../../../models/WebhookEvent";

import { NextResponse } from "next/server";

export async function POST(req) {

  try {

    await connectDB();

    const body = await req.json();

    const eventId = body.eventId;

    // Check duplicate webhook
    const existingEvent =
      await WebhookEvent.findOne({
        eventId,
      });

    // Idempotency check
    if (existingEvent) {

      return NextResponse.json({
        success: true,
        message:
          "Webhook already processed",
      });
    }

    // Save webhook event
    await WebhookEvent.create({
      eventId,
    });

    // Reset quotas
    await Provider.updateMany(
      {},
      {
        usedQuota: 0,
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Provider quotas reset successfully",
    });

  } catch (error) {

    console.log(error);

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