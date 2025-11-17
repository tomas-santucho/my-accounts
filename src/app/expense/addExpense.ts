import {TransactionRepository} from "../../domain/transaction/transactionRepository";
import {createTransaction} from "../../domain/transaction/transaction";

export const addExpense =
    (repo: TransactionRepository) =>
        async (userId: string, dto: { description: string; amount: number; category: string, date: Date }) => {
            const expense = createTransaction(userId, "expense", dto.description, dto.amount, dto.category, dto.date);
            await repo.save(expense);
            return expense;
        };