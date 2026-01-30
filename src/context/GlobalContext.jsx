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
// Define API URL
const isLocal = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.');

const API_URL = isLocal
    ? 'http://localhost:5000/api/v1'
    : 'https://money-manager-backend-woad.vercel.app/api/v1';

console.log('Environment:', isLocal ? 'Local' : 'Production');
console.log('API URL:', API_URL);

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
                error: action.payload,
                loading: false
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
            console.log('Sending transaction to backend:', transaction);
            const response = await axios.post(`${API_URL}/transactions`, transaction, config);
            console.log('Backend response:', response.data);

            dispatch({
                type: 'ADD_TRANSACTION',
                payload: response.data.data
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
