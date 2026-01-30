import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { FaTimes, FaCalendarAlt, FaTag, FaFileAlt } from 'react-icons/fa'; // Added icon imports
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AddTransactionModal = ({ isOpen, onClose, initialData = null, isEditMode = false }) => {
    const { addTransaction, updateTransaction } = useContext(GlobalContext);

    const [type, setType] = useState('income');
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().substring(0, 10),
        reference: '', // Description
        division: 'Personal'
    });

    useEffect(() => {
        if (initialData) {
            setType(initialData.type);
            setFormData({
                title: initialData.title || '',
                amount: initialData.amount,
                category: initialData.category,
                date: initialData.date ? new Date(initialData.date).toISOString().substring(0, 10) : '',
                reference: initialData.reference || '',
                division: initialData.division || 'Personal'
            });
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setType('income');
        setFormData({
            title: '',
            amount: '',
            category: '',
            date: new Date().toISOString().substring(0, 10),
            reference: '',
            division: 'Personal'
        });
    };

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const newTransaction = {
            ...formData,
            amount: +formData.amount,
            type
        };

        let result;
        if (isEditMode && initialData) {
            result = await updateTransaction(initialData._id, newTransaction);
            if (result.success) toast.success("Updated Successfully");
            else {
                const errorMsg = Array.isArray(result.error) ? result.error.join(', ') : result.error;
                toast.error(errorMsg);
            }
        } else {
            result = await addTransaction(newTransaction);
            if (result.success) toast.success("Added Successfully");
            else {
                const errorMsg = Array.isArray(result.error) ? result.error.join(', ') : result.error;
                toast.error(errorMsg);
            }
        }

        if (result.success) {
            onClose();
            if (!isEditMode) resetForm();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{isEditMode ? 'Edit Transaction' : 'New Entry'}</h2>
                            <p className="text-sm text-gray-500">Enter the details below</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 p-1 bg-surfaceHighlight mx-6 mt-6 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`py-2 rounded-lg text-sm font-bold transition-all ${type === 'income' ? 'bg-income text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`py-2 rounded-lg text-sm font-bold transition-all ${type === 'expense' ? 'bg-expense text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Expense
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="p-6 space-y-5">
                        {/* Title & Amount Row */}
                        <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-3 space-y-1">
                                <label className="text-xs text-gray-500 font-mono uppercase">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={onChange} className="input-field" placeholder="What is this for?" required />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs text-gray-500 font-mono uppercase">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                    <input type="number" name="amount" value={formData.amount} onChange={onChange} className="input-field pl-8 font-bold text-white" placeholder="00" required />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 font-mono uppercase flex items-center gap-1"><FaTag className="text-[10px]" /> Category</label>
                                <div className="relative">
                                    <select name="category" value={formData.category} onChange={onChange} className="input-field appearance-none cursor-pointer" required>
                                        <option value="" disabled>Select</option>
                                        {type === 'income' ? (
                                            <>
                                                <option value="Salary">Salary</option>
                                                <option value="Freelance">Freelance</option>
                                                <option value="Investments">Investments</option>
                                                <option value="Other">Other</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Food">Food</option>
                                                <option value="Fuel">Fuel</option>
                                                <option value="Movie">Movie</option>
                                                <option value="Loan">Loan</option>
                                                <option value="Medical">Medical</option>
                                                <option value="Shopping">Shopping</option>
                                                <option value="Other">Other</option>
                                            </>
                                        )}
                                    </select>
                                    <div className="absolute right-4 top-4 w-2 h-2 border-l border-b border-gray-400 -rotate-45 pointer-events-none"></div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 font-mono uppercase flex items-center gap-1"><FaCalendarAlt className="text-[10px]" /> Date</label>
                                <input type="date" name="date" value={formData.date} onChange={onChange} className="input-field" required />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-mono uppercase">Division</label>
                            <div className="flex gap-4 pt-1">
                                {['Personal', 'Office'].map((div) => (
                                    <label key={div} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center transition-all ${formData.division === div ? 'border-primary bg-primary' : 'group-hover:border-white'}`}>
                                            {formData.division === div && <div className="w-2 h-2 bg-black rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="division" value={div} checked={formData.division === div} onChange={onChange} className="hidden" />
                                        <span className={`text-sm ${formData.division === div ? 'text-white' : 'text-gray-400'}`}>{div}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-mono uppercase flex items-center gap-1"><FaFileAlt className="text-[10px]" /> Note (Optional)</label>
                            <textarea name="reference" value={formData.reference} onChange={onChange} className="input-field resize-none h-20" placeholder="Add extra details..."></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full btn-primary text-lg">
                                {isEditMode ? 'Update Entry' : 'Create Entry'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddTransactionModal;
