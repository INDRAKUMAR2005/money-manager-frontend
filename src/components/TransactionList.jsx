import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { FaTrash, FaEdit, FaBriefcase, FaUser, FaRegClock } from 'react-icons/fa';
import { differenceInHours, format } from 'date-fns';
import AddTransactionModal from './AddTransactionModal';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionList = ({ limit }) => {
    const { transactions, deleteTransaction } = useContext(GlobalContext);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const displayTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;

    const handleEdit = (transaction) => {
        const hoursDiff = differenceInHours(new Date(), new Date(transaction.createdAt));
        if (hoursDiff > 12) {
            toast.error("Locked: Cannot edit after 12 hours");
            return;
        }
        setEditingTransaction(transaction);
    };

    return (
        <>
            <ul className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                <AnimatePresence>
                    {displayTransactions.length === 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-600 py-10 font-mono text-sm">
                            NO TRANSACTIONS FOUND
                        </motion.p>
                    )}

                    {displayTransactions.map((transaction, index) => {
                        const isExpense = transaction.type === 'expense';
                        const hoursDiff = differenceInHours(new Date(), new Date(transaction.createdAt));
                        const isEditable = hoursDiff <= 12;

                        return (
                            <motion.li
                                key={transaction._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex items-center justify-between p-4 rounded-2xl bg-surfaceHighlight hover:bg-[#252525] border border-transparent hover:border-white/5 transition-all cursor-default"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icon Box */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${isExpense
                                        ? 'bg-gradient-to-br from-expense/20 to-transparent text-expense shadow-expense/10'
                                        : 'bg-gradient-to-br from-income/20 to-transparent text-income shadow-income/10'
                                        }`}>
                                        {isExpense ? '↓' : '↑'}
                                    </div>

                                    {/* Details */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-white text-sm tracking-wide">{transaction.category}</h4>
                                            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${transaction.division === 'Office'
                                                ? 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                                                : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                                }`}>
                                                {transaction.division === 'Office' ? <FaBriefcase className="inline mr-1 text-[8px]" /> : <FaUser className="inline mr-1 text-[8px]" />}
                                                {transaction.division}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                            <span className="truncate max-w-[100px]">{transaction.title}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <span className={`font-bold font-mono text-lg ${isExpense ? 'text-white' : 'text-income'}`}>
                                        {isExpense ? '- ' : '+ '}₹{Math.abs(transaction.amount)}
                                    </span>

                                    {/* Actions - Slide in on hover */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        {isEditable && (
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteTransaction(transaction._id)}
                                            className="p-2 text-gray-400 rounded-lg hover:bg-expense hover:text-white transition-all"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>
            {editingTransaction && (
                <AddTransactionModal
                    isOpen={!!editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    initialData={editingTransaction}
                    isEditMode={true}
                />
            )}
        </>
    );
};

export default TransactionList;
