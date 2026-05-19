"use client";

import { useEffect, useState } from "react";

import "./dashboard.css";

export default function DashboardPage() {

  const [providers, setProviders] =
    useState([]);

  const fetchDashboard =
    async () => {

      try {

        const response =
          await fetch(
            "/api/dashboard"
          );

        const data =
          await response.json();

        if (data.success) {

          setProviders(
            data.providers
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchDashboard();

    // Auto refresh every 3 seconds
    const interval =
      setInterval(() => {

        fetchDashboard();

      }, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="dashboard-container">

      <h1>
        Provider Dashboard
      </h1>

      <div className="provider-grid">

        {providers.map(
          (provider, index) => (

            <div
              className="provider-card"
              key={index}
            >

              <h2>
                {
                  provider.providerName
                }
              </h2>

              <p>
                <strong>
                  Monthly Quota:
                </strong>{" "}
                {
                  provider.monthlyQuota
                }
              </p>

              <p>
                <strong>
                  Used Quota:
                </strong>{" "}
                {
                  provider.usedQuota
                }
              </p>

              <p>
                <strong>
                  Remaining Quota:
                </strong>{" "}
                {
                  provider.remainingQuota
                }
              </p>

              <p>
                <strong>
                  Leads Received:
                </strong>{" "}
                {
                  provider.leadsReceived
                }
              </p>

              <h3>
                Assigned Leads
              </h3>

              {provider.leads.length ===
              0 ? (

                <p>
                  No leads assigned
                </p>

              ) : (

                provider.leads.map(
                  (lead) => (

                    <div
                      key={lead._id}
                      className="lead-box"
                    >

                      <p>
                        <strong>
                          Name:
                        </strong>{" "}
                        {lead.name}
                      </p>

                      <p>
                        <strong>
                          Service:
                        </strong>{" "}
                        {lead.service}
                      </p>

                      <p>
                        <strong>
                          City:
                        </strong>{" "}
                        {lead.city}
                      </p>

                    </div>
                  )
                )
              )}

            </div>
          )
        )}

      </div>

    </div>
  );
}