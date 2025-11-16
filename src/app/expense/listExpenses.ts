import {TransactionRepository} from "../../domain/transaction/transactionRepository";

export const listExpenses =
    (repo: TransactionRepository) =>
        async () => {
            return repo.findAllForCurrentMonth();
        };
