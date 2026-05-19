import Provider from "../models/Provider";
import LeadAssignment from "../models/LeadAssignment";
import AllocationState from "../models/AllocationState";

export async function allocateLead(lead, session) {

  const assignedProviders = [];

  // Mandatory providers
  const mandatoryMap = {
    "Service 1": ["Provider 1"],
    "Service 2": ["Provider 5"],
    "Service 3": ["Provider 1", "Provider 4"],
  };

  // Fair distribution pools
  const poolMap = {
    "Service 1": ["Provider 2", "Provider 3", "Provider 4"],
    "Service 2": ["Provider 6", "Provider 7", "Provider 8"],
    "Service 3": [
      "Provider 2",
      "Provider 3",
      "Provider 5",
      "Provider 6",
      "Provider 7",
      "Provider 8",
    ],
  };

  const mandatoryProviders =
    mandatoryMap[lead.service] || [];

  // STEP 1 — Assign mandatory providers
  for (const providerName of mandatoryProviders) {

    const provider = await Provider.findOne({
      name: providerName,
    }).session(session);

    // Skip if quota full
    if (
      provider &&
      provider.usedQuota < provider.monthlyQuota
    ) {

      assignedProviders.push(provider);

      provider.usedQuota += 1;

      await provider.save({ session });

      await LeadAssignment.create(
        [
          {
            leadId: lead._id,
            providerId: provider._id,
          },
        ],
        { session }
      );
    }
  }

  // STEP 2 — Fair allocation
  const remainingSlots =
    3 - assignedProviders.length;

  const pool =
    poolMap[lead.service] || [];

  // Get allocation state
  let allocationState =
    await AllocationState.findOne({
      service: lead.service,
    }).session(session);

  // Create if not exists
  if (!allocationState) {

    allocationState =
      await AllocationState.create(
        [
          {
            service: lead.service,
            currentIndex: 0,
          },
        ],
        { session }
      );

    allocationState = allocationState[0];
  }

  let currentIndex =
    allocationState.currentIndex;

  let checked = 0;

  while (
    assignedProviders.length < 3 &&
    checked < pool.length
  ) {

    const providerName =
      pool[currentIndex % pool.length];

    const provider =
      await Provider.findOne({
        name: providerName,
      }).session(session);

    const alreadyAssigned =
      assignedProviders.find(
        (p) =>
          p._id.toString() ===
          provider._id.toString()
      );

    // Assign only if:
    // not already assigned
    // quota available
    if (
      provider &&
      !alreadyAssigned &&
      provider.usedQuota <
        provider.monthlyQuota
    ) {

      assignedProviders.push(provider);

      provider.usedQuota += 1;

      await provider.save({ session });

      await LeadAssignment.create(
        [
          {
            leadId: lead._id,
            providerId: provider._id,
          },
        ],
        { session }
      );
    }

    currentIndex++;
    checked++;
  }

  // Save updated rotation index
  allocationState.currentIndex =
    currentIndex % pool.length;

  await allocationState.save({ session });

  return assignedProviders;
}