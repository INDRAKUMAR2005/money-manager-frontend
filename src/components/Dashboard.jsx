import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, CartesianGrid } from 'recharts';
import { FaArrowUp, FaArrowDown, FaWallet, FaExchangeAlt, FaBriefcase, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format, isSameMonth, isSameWeek, isSameYear, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import TransactionList from './TransactionList';

const Dashboard = () => {
    const { transactions, getTransactions } = useContext(GlobalContext);
    const [filterType, setFilterType] = useState('Month');

    useEffect(() => {
        getTransactions();
        // eslint-disable-next-line
    }, []);

    // Filter Logic
    const now = new Date();
    const filtered = transactions.filter(t => {
        const d = new Date(t.date);
        if (filterType === 'Month') return isSameMonth(d, now) && isSameYear(d, now);
        if (filterType === 'Week') return isSameWeek(d, now);
        if (filterType === 'Year') return isSameYear(d, now);
        return true;
    });

    const income = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const totalBalance = (income - expense).toFixed(2);

    // Chart Data: Spending by Category
    const categoryDataDisplay = {};
    filtered.filter(t => t.type === 'expense').forEach(t => {
        categoryDataDisplay[t.category] = (categoryDataDisplay[t.category] || 0) + t.amount;
    });
    const pieData = Object.keys(categoryDataDisplay).map(key => ({ name: key, value: categoryDataDisplay[key] }));
    const COLORS = ['#CCFF00', '#7C3AED', '#06b6d4', '#FF3366', '#F59E0B', '#10B981'];

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-6"
        >
            {/* 1. Header & Controls Section */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Financial Overview</h2>
                    <p className="text-gray-400">Welcome back, here's your money stats.</p>
                </div>

                <div className="bg-surfaceHighlight p-1.5 rounded-2xl inline-flex">
                    {['Week', 'Month', 'Year'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filterType === type
                                    ? 'bg-white text-black shadow-lg scale-105'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* 2. Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {/* Main Balance Card - Spans 2 cols */}
                <motion.div variants={item} className="md:col-span-2 bento-card bg-gradient-to-br from-surface to-surfaceHighlight relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/5 rounded-full border border-white/10">
                                <FaWallet className="text-primary text-xl" />
                            </div>
                            <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">Total Balance</span>
                        </div>
                        <div>
                            <h3 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tighter">
                                <span className="text-gray-500 text-3xl align-top mr-2">₹</span>{totalBalance}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs font-bold">+2.4%</span>
                                <span>vs last {filterType.toLowerCase()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Income Card */}
                <motion.div variants={item} className="bento-card group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-400 font-medium">Income</span>
                        <div className="w-8 h-8 rounded-full bg-income/10 flex items-center justify-center border border-income/20 group-hover:scale-110 transition-transform">
                            <FaArrowUp className="text-income text-sm" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-white mb-1">₹{income.toFixed(2)}</h4>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="h-full bg-income shadow-[0_0_10px_#00FFA3]"
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Expense Card */}
                <motion.div variants={item} className="bento-card group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-400 font-medium">Expense</span>
                        <div className="w-8 h-8 rounded-full bg-expense/10 flex items-center justify-center border border-expense/20 group-hover:scale-110 transition-transform">
                            <FaArrowDown className="text-expense text-sm" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-white mb-1">₹{expense.toFixed(2)}</h4>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${income > 0 ? (expense / income) * 100 : 100}%` }}
                                className="h-full bg-expense shadow-[0_0_10px_#FF3366]"
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Spending Analysis (Donut Chart) - Spans 2 cols */}
                <motion.div variants={item} className="md:col-span-2 lg:col-span-2 bento-card">
                    <h3 className="font-bold text-lg text-white mb-4">Spending Distribution</h3>
                    <div className="h-[250px] w-full flex items-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background stroke-2" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#121212', borderRadius: '12px', border: '1px solid #333', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700"></div>
                                <span>No expenses yet</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Transactions List - Spans 2 cols */}
                <motion.div variants={item} className="md:col-span-2 md:row-span-2 lg:col-span-2 bento-card flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-white">Recent Transactions</h3>
                        <button className="text-xs text-primary hover:text-white transition-colors">View All</button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <TransactionList limit={5} />
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Dashboard;
