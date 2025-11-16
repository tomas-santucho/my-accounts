import {ExpenseRepository} from "../../domain/expense/expenseRepository";
import {createExpense} from "../../domain/expense/expense";

export const addExpense =
    (repo: ExpenseRepository) =>
        async (dto: { description: string; amount: number; category: string, date: Date }) => {
            const expense = createExpense(dto.description, dto.amount, dto.category, dto.date);
            await repo.save(expense);
            return expense;
        };