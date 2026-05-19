"use client";

import { useState } from "react";

export default function TestToolsPage() {

  const [message, setMessage] =
    useState("");

  // Reset quota webhook
  const resetQuota =
    async () => {

      const response =
        await fetch(
          "/api/webhook/reset-quota",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              eventId:
                "payment_" +
                Date.now(),
            }),
          }
        );

      const data =
        await response.json();

      setMessage(data.message);
    };

  // Generate 10 leads instantly
  const generateLeads =
    async () => {

      try {

        const requests = [];

        for (
          let i = 0;
          i < 10;
          i++
        ) {

          requests.push(
            fetch("/api/leads", {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name:
                  "Test User " + i,

                phone:
                  "90000000" + i,

                city:
                  "Bangalore",

                service:
                  i % 3 === 0
                    ? "Service 1"
                    : i % 3 === 1
                    ? "Service 2"
                    : "Service 3",

                description:
                  "Concurrency Test",
              }),
            })
          );
        }

        await Promise.all(
          requests
        );

        setMessage(
          "10 leads generated successfully"
        );

      } catch (error) {

        console.log(error);

        setMessage(
          "Error generating leads"
        );
      }
    };

  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <h1>
        Test Tools Panel
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        <button
          onClick={resetQuota}
          style={{
            padding: "14px 20px",
            cursor: "pointer",
          }}
        >

          Reset Provider Quota

        </button>

        <button
          onClick={generateLeads}
          style={{
            padding: "14px 20px",
            cursor: "pointer",
          }}
        >

          Generate 10 Leads

        </button>

      </div>

      {message && (

        <p
          style={{
            marginTop: "30px",
            fontWeight: "bold",
          }}
        >

          {message}

        </p>
      )}

    </div>
  );
}