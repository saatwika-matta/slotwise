"use client";

import { useEffect, useState } from "react";
import { getAvailableSlots, createBooking } from "@/app/actions/bookings";

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  staff: { name: string };
};

export default function BookPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSlots() {
      const data = await getAvailableSlots();
      setSlots(data as Slot[]);
    }
    fetchSlots();
  }, []);

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const result = await createBooking(formData);

    if (result?.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Your slot is booked! You'll hear from us soon.");
      setSelectedSlot("");
      const data = await getAvailableSlots();
      setSlots(data as Slot[]);
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Book a Slot</h1>
        <p className="text-gray-500 text-sm mb-6">Pick an available time and fill in your details.</p>

        {/* Slot Picker */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Available Slots</h2>
          {slots.length === 0 ? (
            <p className="text-gray-400 text-sm">No slots available right now.</p>
          ) : (
            <div className="grid gap-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`text-left p-4 rounded-xl border-2 transition ${
                    selectedSlot === slot.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <p className="font-semibold text-gray-800">{slot.staff.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatTime(slot.startTime)} → {formatTime(slot.endTime)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form */}
        {selectedSlot && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

            <input type="hidden" name="slotId" value={selectedSlot} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                name="guestName"
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                name="guestEmail"
                type="email"
                placeholder="john@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
              <textarea
                name="reason"
                placeholder="What's this meeting about?"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {status === "loading" ? "Booking..." : "Confirm Booking"}
            </button>

            {status === "success" && (
              <p className="text-green-600 text-sm text-center">{message}</p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm text-center">{message}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}