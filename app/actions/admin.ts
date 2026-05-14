"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllBookings() {
  const bookings = await prisma.booking.findMany({
    include: {
      slot: {
        include: { staff: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return bookings;
}

export async function cancelBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) return { error: "Booking not found" };

  // Delete booking and free up the slot
  await prisma.booking.delete({ where: { id: bookingId } });
  await prisma.slot.update({
    where: { id: booking.slotId },
    data: { isBooked: false },
  });

  revalidatePath("/admin");
  return { success: true };
}