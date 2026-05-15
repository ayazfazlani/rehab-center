import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    ArrowDownRight, 
    Calendar, 
    Tag, 
    DollarSign,
    Layers
} from 'lucide-react';
import { useState } from 'react';
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

export default function Index({ expenses }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-[#1c2b36]">Operational Expenses</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.15em] mt-1">Institutional Expenditure Audit</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                    >
                        <Plus size={14} /> Log Expense
                    </button>
                </div>
            }
        >
            <Head title="Expenses" />

            <div className="bg-white rounded-2xl border border-[#dce3e8] overflow-hidden shadow-sm mb-8">
                <div className="p-4 bg-[#fcfcfd] border-b border-[#dce3e8] flex justify-between items-center px-6">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expense Audit Log</div>
                    <div className="text-lg font-black text-[#1c2b36]">
                        Aggregate: <span className="text-rose-600">${expenses.data.reduce((acc, exp) => acc + Number(exp.amount), 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fcfcfd] text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-[#dce3e8]">
                            <tr>
                                <th className="px-6 py-4">Transaction Date</th>
                                <th className="px-6 py-4">Categorization</th>
                                <th className="px-6 py-4">Expenditure Details</th>
                                <th className="px-6 py-4 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dce3e8] text-xs font-bold">
                            {expenses.data.length > 0 ? (
                                expenses.data.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-rose-50/30 transition-colors">
                                        <td className="px-6 py-5 flex items-center gap-2 text-gray-400">
                                            <Calendar size={14} className="text-rose-400" /> {expense.date}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border border-gray-200">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-gray-400 italic font-medium">
                                            {expense.description || 'No detailed log provided'}
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-rose-600 text-sm">
                                            -${Number(expense.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic bg-gray-50 border-2 border-dashed border-gray-200 rounded-b-2xl">
                                        No disbursements detected within the current scope.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Expense Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-8 bg-white">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-rose-600">
                        <ArrowDownRight size={28} /> Log Expense Record
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <InputLabel className="text-gray-400 font-bold uppercase text-[10px]" value="Expenditure Category" />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setData('category', cat)}
                                        className={cn(
                                            "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border-2 transition-all",
                                            data.category === cat ? "border-rose-500 bg-rose-50 text-rose-600" : "border-[#dce3e8] bg-[#fcfcfd] text-gray-400"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-gray-400 font-bold uppercase text-[10px]" value="Value (USD)" />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full bg-[#fcfcfd] border-[#dce3e8] text-xs font-bold"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel className="text-gray-400 font-bold uppercase text-[10px]" value="Timestamp" />
                                <TextInput
                                    type="date"
                                    className="mt-1 block w-full bg-[#fcfcfd] border-[#dce3e8] text-xs font-bold"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-bold uppercase text-[10px]" value="Transaction Narrative" />
                            <textarea
                                className="mt-1 block w-full bg-[#fcfcfd] border-[#dce3e8] rounded-xl text-xs font-bold p-3"
                                rows="3"
                                placeholder="Describe the purpose of this disbursement..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl font-black text-xs uppercase">
                            Abort
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl font-black text-xs uppercase px-8 bg-rose-600 hover:bg-rose-700 shadow-lg text-white border-transparent">
                            Commit Funds
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
