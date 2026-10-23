import { z } from "zod";

export const destinationSearchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(2, { message: "search.tooShort" })
    .max(80, { message: "search.tooLong" }),
});

export type DestinationSearchInput = z.infer<typeof destinationSearchSchema>;
