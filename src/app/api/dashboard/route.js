import { connectDB } from "../../../lib/mongodb";

import Provider from "../../../models/Provider";

import LeadAssignment from "../../../models/LeadAssignment";

import Lead from "../../../models/Lead";

import { NextResponse } from "next/server";

export async function GET() {

  try {

    await connectDB();

    const providers =
      await Provider.find();

    const dashboardData = [];

    for (const provider of providers) {

      // Get assignments
      const assignments =
        await LeadAssignment.find({
          providerId: provider._id,
        });

      // Get lead details
      const leads = [];

      for (const assignment of assignments) {

        const lead =
          await Lead.findById(
            assignment.leadId
          );

        if (lead) {
          leads.push(lead);
        }
      }

      dashboardData.push({
        providerName: provider.name,

        monthlyQuota:
          provider.monthlyQuota,

        usedQuota:
          provider.usedQuota,

        remainingQuota:
          provider.monthlyQuota -
          provider.usedQuota,

        leadsReceived:
          assignments.length,

        leads,
      });
    }

    return NextResponse.json({
      success: true,
      providers: dashboardData,
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