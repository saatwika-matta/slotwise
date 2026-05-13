"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSlot(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  if (!name || !email || !startTime || !endTime) {
    return { error: "All fields are required" };
  }

  // Find or create the user
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { name, email, role: "staff" },
    });
  }

  // Create the slot
  await prisma.slot.create({
    data: {
      staffId: user.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });

  revalidatePath("/slots");
  return { success: true };
}