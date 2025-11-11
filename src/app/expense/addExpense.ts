import {ExpenseRepository} from "../../domain/expense/expenseRepository";
import {createExpense} from "../../domain/expense/expense";

export const addExpense =
    (repo: ExpenseRepository) =>
        async (dto: { description: string; amount: number; category: string }) => {
            const expense = createExpense(dto.description, dto.amount, dto.category);
            await repo.save(expense);
            return expense;
        };