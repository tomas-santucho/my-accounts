import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().nonempty().nonoptional(),
    email: z.email(),
    pass: z.string(),
    createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
