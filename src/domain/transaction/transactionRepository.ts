import { Transaction } from "./transaction";

export interface TransactionRepository {
    save(transaction: Transaction): Promise<void>;
    findAll(): Promise<Transaction[]>;
    findById(id: string): Promise<Transaction | null>;
    findAllForCurrentMonth(): Promise<Transaction[]>;
    update(transaction: Transaction): Promise<void>;
    delete(id: string): Promise<void>;
    deleteByInstallmentGroupId(installmentGroupId: string): Promise<void>;
}
