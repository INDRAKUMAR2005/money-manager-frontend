import React from 'react';
import { FaFingerprint, FaPlus } from 'react-icons/fa';

const Header = ({ onAddClick }) => {
    return (
        <nav className="w-full py-6">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo Area */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <FaFingerprint className="text-black text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white tracking-tighter leading-none">MONEY<br /><span className="text-primary">MANAGER</span></h1>
                    </div>
                </div>

                {/* Actions */}
                <button
                    onClick={onAddClick}
                    className="btn-primary"
                >
                    <FaPlus className="text-sm" />
                    <span>New Transaction</span>
                </button>
            </div>
        </nav>
    );
};

export default Header;
