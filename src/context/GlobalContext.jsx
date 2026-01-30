import React, { createContext, useReducer } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
    transactions: [],
    error: null,
    loading: true
};

// Create context
export const GlobalContext = createContext(initialState);

// Define API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Reducer
const AppReducer = (state, action) => {
    switch (action.type) {
        case 'GET_TRANSACTIONS':
            return {
                ...state,
                loading: false,
                transactions: action.payload
            }
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(transaction => transaction._id !== action.payload)
            }
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [...state.transactions, action.payload]
            }
        case 'UPDATE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(t => t._id === action.payload._id ? action.payload : t)
            }
        case 'TRANSACTION_ERROR':
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    // Actions
    async function getTransactions(params = {}) {
        try {
            // Updated to use dynamic API_URL
            const response = await axios.get(`${API_URL}/transactions`, { params });

            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: response.data.data
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Server Error'
            });
        }
    }

    async function deleteTransaction(id) {
        try {
            await axios.delete(`${API_URL}/transactions/${id}`);

            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Server Error'
            });
        }
    }

    async function addTransaction(transaction) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            await axios.post(`${API_URL}/transactions`, transaction, config);
            // Re-fetch to ensure sync with backend date/ID logic
            // But for optimization we use the response date from backend usually.
            // Sticking to original logic but fixing the URL
            const response = await axios.get(`${API_URL}/transactions`);
            // Ideally we just push the response data, but to keep sorting consistent/simple:
            // Actually original logic was: dispatch ADD with response data.
            // Let's stick to that but ensure we use the response.

            // Re-reading original code logic:
            // const response = await axios.post(..., transaction);
            // dispatch(..., payload: response.data.data);

            // Re-implementing correctly:
            const postResponse = await axios.post(`${API_URL}/transactions`, transaction, config);

            dispatch({
                type: 'ADD_TRANSACTION',
                payload: postResponse.data.data
            });
            return { success: true };
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Server Error'
            });
            return { success: false, error: err.response?.data?.error };
        }
    }

    async function updateTransaction(id, updatedTransaction) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await axios.put(`${API_URL}/transactions/${id}`, updatedTransaction, config);
            dispatch({
                type: 'UPDATE_TRANSACTION',
                payload: response.data.data
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Update Failed' };
        }
    }

    return (<GlobalContext.Provider value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction,
        updateTransaction
    }}>
        {children}
    </GlobalContext.Provider>);
}
