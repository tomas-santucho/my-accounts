import { Db } from "mongodb";
import { Category } from "../../domain/category/category";
import { CategoryRepository } from "../../domain/category/categoryRepository";

const COLLECTION_NAME = "categories";

export const mongoCategoryRepo = (db: Db): CategoryRepository => {
    const collection = db.collection<Category>(COLLECTION_NAME);

    return {
        async findAll(): Promise<Category[]> {
            return await collection.find({}).toArray();
        },

        async findById(id: string): Promise<Category | null> {
            return await collection.findOne({ id });
        },

        async save(category: Category): Promise<void> {
            await collection.insertOne(category);
        },

        async update(category: Category): Promise<void> {
            const { id, ...rest } = category;
            await collection.updateOne({ id }, { $set: rest });
        },

        async delete(id: string): Promise<void> {
            await collection.deleteOne({ id });
        },
    };
};
