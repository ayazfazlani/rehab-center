import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    ArrowDownRight, 
    Calendar, 
    Tag, 
    DollarSign,
    Layers,
    Filter,
    X,
    ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Index({ expenses, filters }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    const [filterData, setFilterData] = useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        router.get(route('expenses.index'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        const cleared = { start_date: '', end_date: '' };
        setFilterData(cleared);
        router.get(route('expenses.index'), cleared, {
            preserveState: true,
            replace: true,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('expenses.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const categories = ['Utilities', 'Rent', 'Salaries', 'Supplies', 'Maintenance', 'Other'];

    const totalExpenses = expenses.data.reduce((acc, exp) => acc + Number(exp.amount), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">Expenses</h2>
                        <p className="text-slate-500 text-[13px] font-medium mt-1">Track and manage your facility expenditures</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border",
                                showFilters ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <Filter size={16} />
                            Filters
                            {(filters.start_date || filters.end_date) && (
                                <span className="flex h-2 w-2 rounded-full bg-rose-500" />
                            )}
                        </button>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex-3 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                            <Plus size={18} /> Add Expense
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Expense Management" />

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <InputLabel className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider" value="From Date" />
                            <TextInput
                                type="date"
                                name="start_date"
                                className="w-full bg-slate-50 border-slate-200 rounded-xl"
                                value={filterData.start_date}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <InputLabel className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider" value="To Date" />
                            <TextInput
                                type="date"
                                name="end_date"
                                className="w-full bg-slate-50 border-slate-200 rounded-xl"
                                value={filterData.end_date}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <PrimaryButton onClick={applyFilters} className="bg-slate-800 hover:bg-slate-900 rounded-xl px-6">
                                Apply
                            </PrimaryButton>
                            <SecondaryButton onClick={clearFilters} className="border-slate-200 rounded-xl">
                                Reset
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
                <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Spending</p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                            ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="h-11 w-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                        <DollarSign size={20} />
                    </div>
                </div>
                <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Transaction Count</p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
                            {expenses.data.length}
                        </h3>
                    </div>
                    <div className="h-11 w-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <Layers size={20} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {expenses.data.length > 0 ? (
                                expenses.data.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px]">
                                                <Calendar size={12} className="text-slate-400" />
                                                {new Date(expense.date).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm max-w-md truncate">
                                            {expense.description || 'No description provided'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[13px] font-bold text-rose-600">
                                                -${Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                                <Layers size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-semibold">No expenses found</p>
                                            <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or add a new record.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Expense Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <form onSubmit={submit} className="p-6 bg-white overflow-hidden">
                    <div className="mb-6">
                        <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                            <ArrowDownRight size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Add New Expense</h2>
                        <p className="text-slate-500 text-[13px] mt-0.5">Record a new outgoing transaction</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <InputLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2.5" value="Category" />
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setData('category', cat)}
                                        className={cn(
                                            "px-2 py-2 rounded-xl text-[10px] font-bold uppercase border-2 transition-all",
                                            data.category === cat 
                                                ? "border-rose-500 bg-rose-50 text-rose-600" 
                                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2" value="Amount" />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm p-3"
                                    placeholder="0.00"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2" value="Date" />
                                <TextInput
                                    type="date"
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm p-3"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2" value="Description" />
                            <textarea
                                className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm p-4 min-h-[100px] focus:ring-rose-500 focus:border-rose-500 transition-all"
                                placeholder="What was this expense for?"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)} 
                            className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <PrimaryButton 
                            disabled={processing} 
                            className="bg-rose-600 hover:bg-rose-700 px-8 py-2.5 rounded-xl shadow-lg shadow-rose-100 text-sm"
                        >
                            Save Expense
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

