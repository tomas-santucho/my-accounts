import {Expense} from "./expense";

export interface ExpenseRepository {
    save(expense: Expense): Promise<void>;
    findAll(): Promise<Expense[]>;
    findById(id: string): Promise<Expense | null>;
}