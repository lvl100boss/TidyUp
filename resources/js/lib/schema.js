import * as z from "zod";

export const shopProfileSchema = z.object({
    shop_name: z.string().min(1, "Shop name is required"),
    bio: z.string().optional(),
});

// Add more schemas as needed
