"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import "./style.css";

export default function RequestServicePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    service: "Service 1",
    description: "",
  });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await fetch(
        "/api/leads",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
  await response.json();

if (data.success) {

  setMessage(
    "Lead submitted successfully!"
  );

  setFormData({
    name: "",
    phone: "",
    city: "",
    service: "Service 1",
    description: "",
  });

  // Redirect after 1 second
  setTimeout(() => {
    router.push("/dashboard");
  }, 1000);

} else {

  setMessage(
    data.message
  );
}
    } catch (error) {

      console.log(error);

      setMessage(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="container">

      <div className="card">

        <h1>
          Request Service
        </h1>

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
          >
            <option>
              Service 1
            </option>

            <option>
              Service 2
            </option>

            <option>
              Service 3
            </option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={handleChange}
            required
          />

          <button
            type="submit"
          >

            {loading
              ? "Submitting..."
              : "Submit Lead"}

          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}