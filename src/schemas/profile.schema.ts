import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  image: z.string().url().optional(),
  phone: z.string().min(10, "Invalid phone number"),
  role: z.string().min(2),
  status: z.enum(["Active", "Inactive"]),
});

export type ProfileFormType = z.infer<typeof profileSchema>;
