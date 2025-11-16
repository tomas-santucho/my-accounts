import {ExpenseRepository} from "../../domain/expense/expenseRepository";

export const listExpenses =
    (repo: ExpenseRepository) =>
        async () => {
            return repo.findAll();
        };
