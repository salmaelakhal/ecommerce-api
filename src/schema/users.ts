import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export const AddressSchema = z.object({
  lineOne: z.string().min(3).max(255),
  lineTwo: z.string().min(3).max(255).optional(),
  pincode: z.string().min(6).max(6),
  country: z.string().min(3).max(255),
  city: z.string().min(3).max(255),
  userId: z.number(),
});

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6).max(255),
// });

