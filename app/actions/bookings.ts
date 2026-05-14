"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAvailableSlots() {
  const slots = await prisma.slot.findMany({
    where: { isBooked: false },
    include: { staff: true },
    orderBy: { startTime: "asc" },
  });
  return slots;
}

export async function createBooking(formData: FormData) {
  const slotId = formData.get("slotId") as string;
  const guestName = formData.get("guestName") as string;
  const guestEmail = formData.get("guestEmail") as string;
  const reason = formData.get("reason") as string;

  if (!slotId || !guestName || !guestEmail) {
    return { error: "All fields are required" };
  }

  // Check slot is still available
  const slot = await prisma.slot.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBooked) {
    return { error: "This slot is no longer available" };
  }

  // Create booking and mark slot as booked
  await prisma.booking.create({
    data: { slotId, guestName, guestEmail, reason },
  });

  await prisma.slot.update({
    where: { id: slotId },
    data: { isBooked: true },
  });

  revalidatePath("/book");
  return { success: true };
}