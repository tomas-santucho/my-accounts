import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name required"),
    icon: z.string().min(1, "Icon required"),
    type: z.enum(["income", "expense"]),
    color: z.string().optional(),
    isDefault: z.boolean().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const createCategory = (
    name: string,
    icon: string,
    type: "income" | "expense",
    color?: string,
    isDefault: boolean = false
): Category => {
    const category = {
        id: crypto.randomUUID(),
        name,
        icon,
        type,
        color,
        isDefault,
    };

    return CategorySchema.parse(category);
};
