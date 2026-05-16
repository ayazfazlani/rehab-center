import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Filter, 
    ArrowRight, 
    Calendar,
    CircleDashed,
    CheckCircle2,
    Download,
    CreditCard,
    ClipboardList,
    TrendingUp,
    Users
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

export default function Index({ invoices, patients }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: '',
        total_amount: '',
        type: 'once',
        initial_payment: '',
        installment_count: 3,
        description: '',
        due_date: '',
        invoice_date: new Date().toISOString().split('T')[0],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('invoices.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">Billing & Invoices</h2>
                        <p className="text-slate-500 text-[13px] font-medium mt-1">Manage patient billing and payment plans</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                        <Plus size={18} /> Create New Invoice
                    </button>
                </div>
            }
        >
            <Head title="Billing & Invoices" />

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
                 <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Outstanding</p>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
                            ${invoices.data.reduce((acc, inv) => acc + Number(inv.balance_due), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                 </div>
                 <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Collected Today</p>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-800">$0.00</h3>
                    </div>
                 </div>
                 <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-11 w-11 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Active Plans</p>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
                            {invoices.data.filter(inv => inv.type === 'installment').length}
                        </h3>
                    </div>
                 </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find by ID or Patient name..." 
                            className="w-full bg-white border-slate-200 rounded-xl pl-11 pr-4 py-2 text-[13px] focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter size={14} /> Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4 text-right">Amount Due</th>
                                <th className="px-6 py-4 text-center">Inv. Date</th>
                                <th className="px-6 py-4 text-center">Due Date</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.data.length > 0 ? (
                                invoices.data.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50/30 transition-colors group text-[13px]">
                                        <td className="px-6 py-4 text-center">
                                            {invoice.status === 'paid' ? (
                                                <div className="bg-emerald-50 text-emerald-600 p-1 rounded-full inline-flex">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            ) : (
                                                <div className="bg-amber-50 text-amber-600 p-1 rounded-full inline-flex">
                                                    <CircleDashed className="animate-spin-slow" size={14} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900 font-bold">#{invoice.invoice_number}</div>
                                            <div className={cn(
                                                "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md inline-block mt-1 tracking-tight",
                                                invoice.type === 'installment' ? "bg-primary-50 text-primary-600 border border-primary-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                                            )}>
                                                {invoice.type === 'installment' ? 'Payment Plan' : 'Standard'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium">
                                            {invoice.patient.first_name} {invoice.patient.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-slate-900 font-bold text-sm">${Number(invoice.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                            <div className="text-[10px] text-rose-500 font-bold mt-0.5">
                                                ${Number(invoice.balance_due).toLocaleString(undefined, { minimumFractionDigits: 2 })} pending
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-500 font-medium whitespace-nowrap">
                                            {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-500 font-medium whitespace-nowrap">
                                            {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a 
                                                    href={route('invoices.pdf', invoice.id)} 
                                                    className="p-1.5 rounded-lg text-slate-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
                                                    title="Download PDF"
                                                >
                                                    <Download size={16} />
                                                </a>
                                                <Link 
                                                    href={route('invoices.show', invoice.id)} 
                                                    className="p-1.5 rounded-lg text-slate-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
                                                    title="View Details"
                                                >
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center text-slate-400 font-medium bg-slate-50/50">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-0 bg-white overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Generate New Invoice</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Patient billing setup</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <InputLabel className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="patient_id" value="Select Patient" />
                            <select
                                id="patient_id"
                                className="mt-1 block w-full bg-slate-50 border-slate-200 rounded-xl text-sm p-3.5 focus:bg-white focus:ring-primary-500 focus:border-primary-500 transition-all"
                                value={data.patient_id}
                                onChange={(e) => setData('patient_id', e.target.value)}
                                required
                            >
                                <option value="">Search patient records...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2" value="Invoice Total (USD)" />
                                <TextInput
                                    type="number"
                                    className="mt-1 block w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl focus:bg-white transition-all"
                                    value={data.total_amount}
                                    placeholder="0.00"
                                    onChange={(e) => setData('total_amount', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2" value="Invoice Date" />
                                    <TextInput
                                        type="date"
                                        className="mt-1 block w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl focus:bg-white transition-all"
                                        value={data.invoice_date}
                                        onChange={(e) => setData('invoice_date', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2" value="Initial Due Date" />
                                    <TextInput
                                        type="date"
                                        className="mt-1 block w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl focus:bg-white transition-all"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3" value="Payment Mode" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'once')}
                                    className={cn(
                                        "flex flex-col p-4 rounded-2xl border-2 transition-all text-left group",
                                        data.type === 'once' ? "border-primary-500 bg-primary-50/30" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={cn("p-2 rounded-lg", data.type === 'once' ? "bg-primary-600 text-white" : "bg-white text-slate-400 border border-slate-200")}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 mb-0.5">Full Payment</h4>
                                    <p className="text-[10px] text-slate-500 font-medium tracking-tight">Standard one-time billing.</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'installment')}
                                    className={cn(
                                        "flex flex-col p-4 rounded-2xl border-2 transition-all text-left group",
                                        data.type === 'installment' ? "border-primary-500 bg-primary-50/30" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={cn("p-2 rounded-lg", data.type === 'installment' ? "bg-primary-600 text-white" : "bg-white text-slate-400 border border-slate-200")}>
                                            <CircleDashed size={16} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 mb-0.5">Installment Plan</h4>
                                    <p className="text-[10px] text-slate-500 font-medium tracking-tight">Split balance into monthly parts.</p>
                                </button>
                            </div>
                        </div>

                        {data.type === 'installment' && (
                            <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100 animate-in fade-in zoom-in-95">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <InputLabel className="text-primary-700 text-[9px] font-black uppercase tracking-widest mb-2" value="Plan Duration" />
                                        <div className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-black text-center">{data.installment_count} Months</div>
                                    </div>
                                    <div>
                                        <InputLabel className="text-primary-700 text-[9px] font-black uppercase tracking-widest mb-2" value="Initial Deposit" />
                                        <TextInput 
                                            type="number"
                                            placeholder="Advance"
                                            className="w-full bg-white border-primary-200 rounded-lg text-xs font-black p-1.5 focus:ring-primary-500"
                                            value={data.initial_payment}
                                            onChange={e => setData('initial_payment', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <input 
                                    type="range" 
                                    min="2" 
                                    max="24" 
                                    step="1"
                                    className="w-full h-1 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    value={data.installment_count}
                                    onChange={(e) => setData('installment_count', e.target.value)}
                                />
                                {data.total_amount > 0 && (
                                    <div className="mt-6 pt-4 border-t border-primary-100 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Scheduled Monthly Payment:</span>
                                        <span className="text-xl font-black text-slate-800">
                                            ${(() => {
                                                const total = parseFloat(data.total_amount) || 0;
                                                const initial = parseFloat(data.initial_payment) || 0;
                                                const count = parseInt(data.installment_count) || 1;
                                                const balance = Math.max(0, total - initial);
                                                const remCount = initial > 0 ? Math.max(1, count - 1) : count;
                                                return (balance / remCount).toLocaleString(undefined, { minimumFractionDigits: 2 });
                                            })()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <InputLabel className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2" value="Invoice Notes (Optional)" />
                            <textarea
                                className="mt-1 block w-full bg-slate-50 border-slate-200 rounded-xl text-[12px] font-medium p-3 h-20 focus:bg-white transition-all outline-none"
                                placeholder="Add billing references..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                        <button 
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)} 
                            className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <PrimaryButton 
                            disabled={processing} 
                            className="bg-primary-600 hover:bg-primary-700 px-8 py-2.5 rounded-xl shadow-lg shadow-primary-100 text-sm"
                        >
                            Create Invoice
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

