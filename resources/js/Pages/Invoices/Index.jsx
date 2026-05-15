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
    Download
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
        installment_count: 3,
        description: '',
        due_date: '',
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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-[#1a1a1a]">Billing Ledger</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.15em] mt-1">Financial Operations Audit</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary-100 transition-all"
                    >
                        <Plus size={14} /> New Invoice
                    </button>
                </div>
            }
        >
            <Head title="Billing Ledger" />

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="bg-white p-8 rounded-3xl border border-[#eef1f4] shadow-sm">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3">Accounts Receivable</div>
                    <div className="text-4xl font-black text-rose-600 tracking-tighter">
                        ${invoices.data.reduce((acc, inv) => acc + Number(inv.balance_due), 0).toLocaleString()}
                    </div>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border border-[#eef1f4] shadow-sm">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3">Liquidated Today</div>
                    <div className="text-4xl font-black text-emerald-600 tracking-tighter">$0.00</div>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border border-[#eef1f4] shadow-sm">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3">Active Milestone Plans</div>
                    <div className="text-4xl font-black text-primary-600 tracking-tighter">
                        {invoices.data.filter(inv => inv.type === 'installment').length}
                    </div>
                 </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-3xl border border-[#eef1f4] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#eef1f4] flex flex-col md:flex-row gap-4 justify-between bg-[#fcfcfd]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find by ID or Client name..." 
                            className="w-full bg-white border-[#eef1f4] rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <button className="bg-white border border-[#eef1f4] px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Filter size={14} /> Refine Audit
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fcfcfd] text-gray-400 uppercase text-[9px] font-black tracking-[0.2em] border-b border-[#eef1f4]">
                            <tr>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Audit Ref</th>
                                <th className="px-8 py-5">Institutional Client</th>
                                <th className="px-8 py-5 text-right">Valuation</th>
                                <th className="px-8 py-5 text-center">Settlement Date</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eef1f4] text-xs font-bold">
                            {invoices.data.length > 0 ? (
                                invoices.data.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-4 text-center">
                                            {invoice.status === 'paid' ? (
                                                <CheckCircle2 className="text-emerald-500 mx-auto" size={18} />
                                            ) : (
                                                <CircleDashed className="text-amber-500 animate-spin-slow mx-auto" size={18} />
                                            )}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-[#1a1a1a] font-black">#{invoice.invoice_number}</div>
                                            <div className={cn(
                                                "text-[8px] font-black uppercase px-2 py-0.5 rounded-md inline-block mt-0.5 tracking-widest",
                                                invoice.type === 'installment' ? "bg-primary-50 text-primary-600 border border-primary-100" : "bg-gray-50 text-gray-400 border border-gray-100"
                                            )}>
                                                {invoice.type === 'installment' ? 'Milestone' : 'Universal'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-[#1a1a1a] font-black">
                                            {invoice.patient.first_name} {invoice.patient.last_name}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="text-[#1a1a1a] font-black">${Number(invoice.total_amount).toLocaleString()}</div>
                                            <div className="text-[9px] text-rose-500 font-black uppercase tracking-tighter mt-0.5">
                                                ${Number(invoice.balance_due).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center text-gray-400 font-black">
                                            {invoice.due_date || 'N/A'}
                                        </td>
                                        <td className="px-8 py-3 text-right">
                                            <a 
                                                href={route('invoices.pdf', invoice.id)} 
                                                className="p-2 mr-2 rounded-xl hover:bg-white border border-transparent hover:border-[#eef1f4] text-gray-300 hover:text-primary-600 transition-all inline-block shadow-sm"
                                                title="Download PDF"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <Link 
                                                href={route('invoices.show', invoice.id)} 
                                                className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#eef1f4] text-gray-300 hover:text-primary-600 transition-all inline-block shadow-sm"
                                                title="View Details"
                                            >
                                                <ArrowRight size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center text-gray-400 font-black uppercase tracking-[0.2em] italic bg-[#fcfcfd]">
                                        No financial data detected in current scope.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="xl">
                <form onSubmit={submit} className="p-5 md:p-8 bg-white">
                    <div className="mb-6">
                        <h2 className="text-xl lg:text-2xl font-black text-[#1a1a1a] tracking-tight">Generate Invoice</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-1">Provision a new financial transaction node</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" htmlFor="patient_id" value="Institutional Client Retrieval" />
                            <select
                                id="patient_id"
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] rounded-xl text-[11px] font-black p-3.5 focus:bg-white focus:ring-0 focus:border-primary-500 transition-all"
                                value={data.patient_id}
                                onChange={(e) => setData('patient_id', e.target.value)}
                                required
                            >
                                <option value="">Identify client record...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div>
                                <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Aggregate Valuation (USD)" />
                                <TextInput
                                    type="number"
                                    className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-black p-3.5 rounded-xl focus:bg-white"
                                    value={data.total_amount}
                                    placeholder="0.00"
                                    onChange={(e) => setData('total_amount', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Settlement Target" />
                                <TextInput
                                    type="date"
                                    className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-black p-3.5 rounded-xl focus:bg-white"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-4 tracking-[0.2em]" value="Transactional Strategy" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'once')}
                                    className={cn(
                                        "flex flex-col p-5 md:p-8 rounded-2xl md:rounded-3xl border-2 transition-all text-left relative overflow-hidden group",
                                        data.type === 'once' ? "border-primary-500 bg-primary-50/30" : "border-[#eef1f4] bg-[#fcfcfd] hover:border-gray-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3 md:mb-4">
                                        <div className={cn("p-2 md:p-3 rounded-lg md:rounded-xl", data.type === 'once' ? "bg-primary-600 text-white" : "bg-white text-gray-400 border border-[#eef1f4]")}>
                                            <CheckCircle2 size={20} />
                                        </div>
                                    </div>
                                    <div className="font-black text-xs md:text-sm text-[#1a1a1a] mb-1 md:mb-2 uppercase tracking-tight">Universal Settlement</div>
                                    <div className="text-[9px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">Single cycle liquidation.</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'installment')}
                                    className={cn(
                                        "flex flex-col p-5 md:p-8 rounded-2xl md:rounded-3xl border-2 transition-all text-left relative overflow-hidden group",
                                        data.type === 'installment' ? "border-primary-500 bg-primary-50/30" : "border-[#eef1f4] bg-[#fcfcfd] hover:border-gray-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3 md:mb-4">
                                        <div className={cn("p-2 md:p-3 rounded-lg md:rounded-xl", data.type === 'installment' ? "bg-primary-600 text-white" : "bg-white text-gray-400 border border-[#eef1f4]")}>
                                            <CircleDashed size={20} />
                                        </div>
                                    </div>
                                    <div className="font-black text-xs md:text-sm text-[#1a1a1a] mb-1 md:mb-2 uppercase tracking-tight">Milestone Plan</div>
                                    <div className="text-[9px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">Multi-cycle distribution.</div>
                                </button>
                            </div>
                        </div>

                        {data.type === 'installment' && (
                            <div className="bg-[#fcfcfd] p-10 rounded-3xl border-2 border-primary-50 shadow-inner">
                                <div className="flex justify-between items-center mb-8">
                                    <InputLabel className="text-primary-600 font-black uppercase text-[10px] tracking-[0.2em]" value="Plan Duration (Cycles)" />
                                    <span className="bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{data.installment_count} Months</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="2" 
                                    max="12" 
                                    step="1"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    value={data.installment_count}
                                    onChange={(e) => setData('installment_count', e.target.value)}
                                />
                                {data.total_amount > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Periodic Obligation:</div>
                                        <div className="text-2xl font-black text-[#1a1a1a] tracking-tighter decoration-primary-300 decoration-3 underline underline-offset-4">
                                            ${(data.total_amount / data.installment_count).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Audit Context (Optional)" />
                            <textarea
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] rounded-xl text-[11px] font-black p-3.5 focus:bg-white transition-all outline-none min-h-[80px]"
                                placeholder="Add notes or references..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto px-6 py-3.5 order-2 sm:order-1">
                            Abort
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto px-10 py-3.5 shadow-lg shadow-primary-100 bg-primary-600 border-transparent order-1 sm:order-2">
                            Commit Funds
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
