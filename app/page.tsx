import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">SlotWise</span>
        </h1>
        <p className="text-gray-500 mb-8">
          An internal scheduling tool — staff add availability, guests book slots, admins manage everything.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/book"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Book a Slot
          </Link>
          <Link
            href="/slots"
            className="bg-white hover:bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-200 transition"
          >
            Add Availability
          </Link>
        </div>
      </div>
    </main>
  );
}