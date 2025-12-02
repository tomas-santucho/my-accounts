import { Db } from "mongodb";
import { Category, CategorySchema } from "../../domain/category/category";
import { CategoryRepository } from "../../domain/category/categoryRepository";

const COLLECTION_NAME = "categories";

const toDate = (value: any): Date => {
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        // Check if the date is valid
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return new Date();
};

export const mongoCategoryRepo = (db: Db): CategoryRepository & {
    findChanges: (since: Date) => Promise<Category[]>;
    batchUpsert: (categories: Category[]) => Promise<void>;
} => {
    const collection = db.collection<Category>(COLLECTION_NAME);

    return {
        async findAll(): Promise<Category[]> {
            const docs = await collection.find({ deletedAt: { $eq: null } }).toArray();
            return docs.map(d => CategorySchema.parse({
                ...d,
                updatedAt: toDate(d["updatedAt"]),
                deletedAt: d["deletedAt"] ? toDate(d["deletedAt"]) : null
            }));
        },

        async findById(id: string): Promise<Category | null> {
            const doc = await collection.findOne({ id, deletedAt: { $eq: null } });
            return doc ? CategorySchema.parse({
                ...doc,
                updatedAt: toDate(doc["updatedAt"]),
                deletedAt: doc["deletedAt"] ? toDate(doc["deletedAt"]) : null
            }) : null;
        },

        async save(category: Category): Promise<void> {
            await collection.insertOne(category);
        },

        async update(category: Category): Promise<void> {
            const toUpdate = { ...category, updatedAt: new Date() };
            const { id, ...rest } = toUpdate;
            await collection.updateOne({ id }, { $set: rest });
        },

        async delete(id: string): Promise<void> {
            await collection.updateOne(
                { id },
                { $set: { deletedAt: new Date(), updatedAt: new Date() } }
            );
        },

        async findChanges(since: Date): Promise<Category[]> {
            const docs = await collection.find({
                updatedAt: { $gt: since }
            }).toArray();
            return docs.map(d => CategorySchema.parse({
                ...d,
                updatedAt: toDate(d["updatedAt"]),
                deletedAt: d["deletedAt"] ? toDate(d["deletedAt"]) : null
            }));
        },

        async batchUpsert(categories: Category[]) {
            if (categories.length === 0) return;

            // 1. Fetch existing categories to compare timestamps
            const ids = categories.map(c => c.id);
            const existingDocs = await collection.find({ id: { $in: ids } }).toArray();
            const existingMap = new Map(existingDocs.map(d => [d["id"], d]));

            // 2. Filter categories that are newer than what we have
            const categoriesToWrite = categories.filter(c => {
                const existing = existingMap.get(c.id);
                if (!existing) return true; // New category

                if (!existing["updatedAt"]) return true;

                const existingUpdatedAt = new Date(existing["updatedAt"]);
                const incomingUpdatedAt = new Date(c.updatedAt);

                return incomingUpdatedAt > existingUpdatedAt;
            });

            if (categoriesToWrite.length === 0) return;

            const operations = categoriesToWrite.map(c => ({
                updateOne: {
                    filter: { id: c.id },
                    update: { $set: c },
                    upsert: true
                }
            }));
            await collection.bulkWrite(operations);
        }
    };
};
