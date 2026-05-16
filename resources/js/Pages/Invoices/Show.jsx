import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    Calendar,
    CreditCard,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Download,
    Edit2,
    Save,
    X,
    Plus,
    User,
    Eye,
    TrendingUp
} from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ProgressBar = ({ total, paid }) => {
    const percentage = Math.min(Math.round((paid / total) * 100), 100);
    return (
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
                className="bg-primary-600 h-full transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
        unpaid: "bg-rose-50 text-rose-700 border-rose-100",
        partially_paid: "bg-blue-50 text-blue-700 border-blue-100",
        pending: "bg-slate-50 text-slate-700 border-slate-100",
    };

    const labelMap = {
        paid: "Paid",
        unpaid: "Unpaid",
        partially_paid: "Partially Paid",
        pending: "Pending",
    };

    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap",
            styles[status] || styles.pending
        )}>
            {labelMap[status] || status.replace('_', ' ')}
        </span>
    );
};

export default function Show({ invoice }) {
    const [editingInstallment, setEditingInstallment] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        amount: 0,
        due_date: '',
        status: 'pending',
    });

    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const { data: priceData, setData: setPriceData, put: updatePrice, processing: updatingPrice } = useForm({
        total_amount: invoice.total_amount,
    });

    const submitPriceUpdate = () => {
        updatePrice(route('invoices.update', invoice.id), {
            onSuccess: () => setIsEditingPrice(false),
            preserveScroll: true
        });
    };

    const startEdit = (installment) => {
        setEditingInstallment(installment.id);
        setData({
            amount: installment.amount,
            due_date: new Date(installment.due_date).toISOString().split('T')[0],
            status: installment.status,
        });
    };

    const [isAddInstallmentOpen, setIsAddInstallmentOpen] = useState(false);
    const { data: addData, setData: setAddData, post: postInstallment, processing: addingInstallment, reset: resetAdd, errors: addErrors } = useForm({
        amount: '',
        due_date: '',
        status: 'pending',
    });

    const submitAdd = (e) => {
        e.preventDefault();
        postInstallment(route('invoices.installments.store', invoice.id), {
            onSuccess: () => {
                setIsAddInstallmentOpen(false);
                resetAdd();
            }
        });
    };

    const cancelEdit = () => {
        setEditingInstallment(null);
        reset();
    };

    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const { data: payData, setData: setPayData, post: postPayment, processing: payingInstallment } = useForm({
        amount: 0,
        due_date: '',
        status: 'paid',
        reference_slip: null,
    });

    const openPayModal = (installment) => {
        setSelectedInstallment(installment);
        setPayData({
            amount: installment.amount,
            due_date: new Date(installment.due_date).toISOString().split('T')[0],
            status: 'paid',
            reference_slip: null,
        });
        setIsPayModalOpen(true);
    };

    const submitPayment = (e) => {
        e.preventDefault();
        postPayment(route('invoices.installments.update', { invoice: invoice.id, installment: selectedInstallment.id }), {
            onSuccess: () => {
                setIsPayModalOpen(false);
                setSelectedInstallment(null);
            }
        });
    };

    const submitUpdate = (id) => {
        post(route('invoices.installments.update', { invoice: invoice.id, installment: id }), {
            onSuccess: () => setEditingInstallment(null),
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link href={route('invoices.index')} className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                            <ChevronLeft size={20} className="text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-800">Invoice #{invoice.invoice_number}</h2>
                            <p className="text-slate-500 text-[13px] font-medium">Billing details and payment schedule</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <StatusBadge status={invoice.status} />
                        <a
                            href={route('invoices.pdf', invoice.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Download size={14} />
                            Download PDF
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Information Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Billing Summary</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Status of current charges</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <InputLabel className="text-slate-400 text-[9px] font-black uppercase tracking-[0.1em] mb-2" value="Patient Identity" />
                                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-primary-600 shadow-sm text-xs">
                                        {invoice.patient.first_name[0]}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-black text-slate-800 leading-tight">{invoice.patient.first_name} {invoice.patient.last_name}</div>
                                        <div className="text-[9px] text-slate-400 font-black uppercase tracking-tight mt-0.5">ID: {invoice.patient.id}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">Total Billing</span>
                                    {isEditingPrice ? (
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-28">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                                                <input
                                                    type="number"
                                                    value={priceData.total_amount}
                                                    onChange={e => setPriceData('total_amount', e.target.value)}
                                                    className="w-full pl-6 pr-2 py-1.5 bg-white border-slate-200 rounded-lg text-xs font-black focus:ring-primary-500"
                                                />
                                            </div>
                                            <button onClick={submitPriceUpdate} disabled={updatingPrice} className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm">
                                                <Save size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-black text-slate-800">${Number(invoice.total_amount).toLocaleString()}</span>
                                            {invoice.type === 'once' && (
                                                <button onClick={() => setIsEditingPrice(true)} className="text-slate-300 hover:text-primary-600 transition p-1 hover:bg-slate-50 rounded-lg">
                                                    <Edit2 size={11} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">Total Paid</span>
                                    <span className="text-base font-black text-emerald-600">${Number(invoice.amount_paid).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">Balance Due</span>
                                    <span className="text-lg font-black text-rose-600">${Number(invoice.balance_due).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-2.5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                    <span className="text-[11px] font-black text-primary-600">{Math.round((invoice.amount_paid / invoice.total_amount) * 100)}%</span>
                                </div>
                                <ProgressBar total={invoice.total_amount} paid={invoice.amount_paid} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden shadow-lg border border-slate-800">
                        <div className="relative z-10">
                            <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center mb-4 border border-white/10">
                                <Clock className="text-white/80" size={16} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Invoice Date</h4>
                                    <p className="text-xs font-black tracking-tight leading-none text-white">
                                        {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Maturity</h4>
                                    <p className="text-xs font-black tracking-tight leading-none text-white">
                                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'PENDING'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Installments Management */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 tracking-tight">Payment Schedule</h3>
                                <p className="text-[13px] font-medium text-slate-500">Manage payment cycles and due dates</p>
                            </div>
                            {invoice.type === 'installment' && (
                                <button
                                    onClick={() => setIsAddInstallmentOpen(true)}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                                >
                                    <Plus size={16} /> Add 
                                </button>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[9px] font-black tracking-widest">
                                        <th className="px-5 py-3.5 text-left">#</th>
                                        <th className="px-5 py-3.5 text-left">Maturity</th>
                                        <th className="px-5 py-3.5 text-left">Quote</th>
                                        <th className="px-5 py-3.5 text-left">Status</th>
                                        <th className="px-5 py-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-[13px]">
                                    {invoice.installments.map((inst, index) => (
                                        <tr key={inst.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {editingInstallment === inst.id ? (
                                                    <input
                                                        type="date"
                                                        value={data.due_date}
                                                        onChange={e => setData('due_date', e.target.value)}
                                                        className="w-full bg-slate-50 border-slate-200 rounded-lg text-xs font-bold p-1.5 focus:bg-white"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                        {new Date(inst.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-slate-800">
                                                {editingInstallment === inst.id ? (
                                                    <div className="relative">
                                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                                        <input
                                                            type="number"
                                                            value={data.amount}
                                                            onChange={e => setData('amount', e.target.value)}
                                                            className="w-full pl-6 bg-slate-50 border-slate-200 rounded-lg text-xs font-bold p-1.5 focus:bg-white"
                                                        />
                                                    </div>
                                                ) : (
                                                    `$${Number(inst.amount).toLocaleString()}`
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {editingInstallment === inst.id ? (
                                                    <select
                                                        value={data.status}
                                                        onChange={e => setData('status', e.target.value)}
                                                        className="w-full bg-slate-50 border-slate-200 rounded-lg text-xs font-bold p-1.5"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="paid">Paid</option>
                                                    </select>
                                                ) : (
                                                    <StatusBadge status={inst.status} />
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {editingInstallment === inst.id ? (
                                                        <>
                                                            <button onClick={() => submitUpdate(inst.id)} disabled={processing} className="p-1.5 bg-primary-600 text-white rounded-lg transition-all scale-90 hover:scale-100">
                                                                <Save size={14} />
                                                            </button>
                                                            <button onClick={cancelEdit} className="p-1.5 bg-slate-100 text-slate-400 rounded-lg transition-all scale-90 hover:scale-100">
                                                                <X size={14} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <a href={route('invoices.installments.pdf', { invoice: invoice.id, installment: inst.id })} target="_blank" className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="View Installment">
                                                                <Eye size={14} />
                                                            </a>
                                                            {inst.status === 'pending' && (
                                                                <button onClick={() => openPayModal(inst)} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">
                                                                    Collect
                                                                </button>
                                                            )}
                                                            {inst.reference_slip && (
                                                                <a href={`/storage/${inst.reference_slip}`} target="_blank" className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Slip">
                                                                    <FileText size={14} />
                                                                </a>
                                                            )}
                                                            <button onClick={() => startEdit(inst)} className="p-1.5 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                                                                <Edit2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                    <AlertCircle className="text-amber-500" size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payment Policy</h4>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1.5 leading-relaxed">
                                        Modifying scheduled installments will automatically recalculate the remaining balance of the master invoice.
                                        Ensure all adjustments are reviewed before saving. Payment records are locked once marked as paid.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isAddInstallmentOpen} onClose={() => setIsAddInstallmentOpen(false)} maxWidth="md">
                <form onSubmit={submitAdd} className="p-0 bg-white overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Add Payment Cycle</h2>
                        <p className="text-slate-500 text-[13px] mt-1">Insert a new installment into the schedule</p>
                    </div>
                    
                    <div className="p-6 space-y-5">
                        <div>
                            <InputLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2" value="Amount (USD)" />
                            <TextInput
                                type="number"
                                className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm font-bold p-3 focus:bg-white"
                                value={addData.amount}
                                onChange={e => setAddData('amount', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2" value="Due Date" />
                            <TextInput
                                type="date"
                                className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm font-bold p-3 focus:bg-white"
                                value={addData.due_date}
                                onChange={e => setAddData('due_date', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30">
                        <button 
                            type="button"
                            onClick={() => setIsAddInstallmentOpen(false)} 
                            className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
                        >
                            Cancel
                        </button>
                        <PrimaryButton disabled={addingInstallment} className="bg-primary-600 hover:bg-primary-700 px-8 py-2.5 rounded-xl shadow-lg shadow-primary-100 text-sm">
                            Add Installment
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Pay Installment Modal */}
            <Modal show={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} maxWidth="md">
                <form onSubmit={submitPayment} className="p-0 bg-white overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Collect Payment</h2>
                        <p className="text-slate-500 text-[13px] mt-1 uppercase font-black tracking-widest">Mark Installment as Liquidated</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Amount Due</div>
                                <div className="text-xl font-black text-slate-800">${Number(payData.amount).toLocaleString()}</div>
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2" value="Reference Paid Slip (Optional)" />
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={e => setPayData('reference_slip', e.target.files[0])}
                                    className="w-full text-[11px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer opacity-0 absolute inset-0 z-10"
                                />
                                <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center group-hover:border-indigo-300 transition-all">
                                    <FileText className="mx-auto text-slate-300 mb-2" size={24} />
                                    <div className="text-[11px] font-bold text-slate-500">
                                        {payData.reference_slip ? payData.reference_slip.name : 'Click or drop to upload reference slip'}
                                    </div>
                                    <div className="text-[9px] text-slate-400 mt-1 uppercase font-black">Support JPG, PNG, PDF (Max 2MB)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30">
                        <button type="button" onClick={() => setIsPayModalOpen(false)} className="px-5 py-2 text-[11px] font-black text-slate-400 hover:text-slate-600 transition uppercase tracking-widest">
                            Cancel
                        </button>
                        <PrimaryButton disabled={payingInstallment} className="bg-emerald-600 hover:bg-emerald-700 px-8 py-2.5 rounded-xl shadow-lg shadow-emerald-100 text-[11px] font-black uppercase tracking-widest">
                            Confirm Collection
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}


