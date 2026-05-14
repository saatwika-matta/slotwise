"use client";

import { useEffect, useState } from "react";
import { getAllBookings, cancelBooking } from "@/app/actions/admin";

type Booking = {
    id: string;
    guestName: string;
    guestEmail: string;
    reason: string | null;
    createdAt: Date;
    slot: {
      startTime: Date;
      endTime: Date;
      staff: { name: string };
    };
  };

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function fetchBookings() {
    const data = await getAllBookings();
    setBookings(data as unknown as Booking[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleCancel(bookingId: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(bookingId);
    await cancelBooking(bookingId);
    await fetchBookings();
    setCancelling(null);
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">All bookings across the system</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {bookings.filter(b => new Date(b.slot.startTime) > new Date()).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Past</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">
              {bookings.filter(b => new Date(b.slot.startTime) <= new Date()).length}
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">All Bookings</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No bookings yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Guest</th>
                  <th className="px-6 py-3 text-left">Staff</th>
                  <th className="px-6 py-3 text-left">Time Slot</th>
                  <th className="px-6 py-3 text-left">Reason</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{booking.guestName}</p>
                      <p className="text-gray-400 text-xs">{booking.guestEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {booking.slot.staff.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p>{formatTime(booking.slot.startTime)}</p>
                      <p className="text-gray-400 text-xs">→ {formatTime(booking.slot.endTime)}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {booking.reason || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancelling === booking.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 transition"
                      >
                        {cancelling === booking.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}