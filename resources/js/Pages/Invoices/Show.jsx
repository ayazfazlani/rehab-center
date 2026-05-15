
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
    Plus
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
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
                className="bg-primary-600 h-full transition-all duration-500"
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
        pending: "bg-gray-50 text-gray-700 border-gray-100",
    };

    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
            styles[status] || styles.pending
        )}>
            {status.replace('_', ' ')}
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

    const submitUpdate = (id) => {
        post(route('invoices.installments.update', { invoice: invoice.id, installment: id }), {
            onSuccess: () => setEditingInstallment(null),
        });
    };

    const markAsPaid = (id, amount, date) => {
        post(route('invoices.installments.update', { invoice: invoice.id, installment: id }), {
            data: {
                amount,
                due_date: date,
                status: 'paid'
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('invoices.index')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <ChevronLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-[#1a1a1a]">Invoice Details</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-gray-400">REFERENCE:</span>
                                <span className="text-xs font-black text-primary-600">{invoice.invoice_number}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={invoice.status} />
                        <a
                            href={route('invoices.pdf', invoice.id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#eef1f4] rounded-xl text-xs font-black hover:bg-gray-50 transition-all"
                        >
                            <Download size={14} />
                            EXPORT PDF
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-[#eef1f4] p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
                                <FileText className="text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Financial Overview</h3>
                                <p className="text-xs font-bold text-gray-500 mt-1">Full statement of accounts</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient Associate</div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black text-primary-600">
                                        {invoice.patient.first_name[0]}
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-gray-900">{invoice.patient.first_name} {invoice.patient.last_name}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Record #{invoice.patient.id}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Amount</span>
                                    {isEditingPrice ? (
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-28">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                                <input
                                                    type="number"
                                                    value={priceData.total_amount}
                                                    onChange={e => setPriceData('total_amount', e.target.value)}
                                                    className="w-full pl-6 pr-2 py-1.5 bg-[#fcfcfd] border-[#eef1f4] rounded-lg text-sm font-black focus:ring-primary-500"
                                                />
                                            </div>
                                            <button
                                                onClick={submitPriceUpdate}
                                                disabled={updatingPrice}
                                                className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                            >
                                                <Save size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditingPrice(false);
                                                    setPriceData('total_amount', invoice.total_amount);
                                                }}
                                                className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-gray-900">${Number(invoice.total_amount).toLocaleString()}</span>
                                            {invoice.type === 'once' && (
                                                <button onClick={() => setIsEditingPrice(true)} className="text-gray-400 hover:text-primary-600 transition">
                                                    <Edit2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Amount Paid</span>
                                    <span className="text-lg font-black text-emerald-600">${Number(invoice.amount_paid).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Balance Due</span>
                                    <span className="text-2xl font-black text-rose-600">${Number(invoice.balance_due).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Progress</span>
                                    <span className="text-[10px] font-black text-primary-600">{Math.round((invoice.amount_paid / invoice.total_amount) * 100)}%</span>
                                </div>
                                <ProgressBar total={invoice.total_amount} paid={invoice.amount_paid} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-100">
                        <div className="relative z-10">
                            <Clock className="mb-4 opacity-50" />
                            <h4 className="text-sm font-black uppercase tracking-widest opacity-80 mb-1">Upcoming Due Date</h4>
                            <p className="text-2xl font-black tracking-tight underline underline-offset-4 decoration-white/30 truncate">
                                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    </div>
                </div>

                {/* Installments Management */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-[#eef1f4] shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-[#eef1f4] flex items-center justify-between bg-[#FCFCFD]">
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-[#1a1a1a]">Installment Lifecycle</h3>
                                <p className="text-xs font-bold text-gray-500">Flexible schedule management</p>
                            </div>
                            {invoice.type === 'installment' && (
                                <button
                                    onClick={() => setIsAddInstallmentOpen(true)}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary-100"
                                >
                                    <Plus size={14} /> Add Installment
                                </button>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Sequence</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Scheduled Date</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Commitment Amount</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Current Status</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Operational Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoice.installments.map((inst, index) => (
                                        <tr key={inst.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {editingInstallment === inst.id ? (
                                                    <input
                                                        type="date"
                                                        value={data.due_date}
                                                        onChange={e => setData('due_date', e.target.value)}
                                                        className="w-full bg-white border-gray-200 rounded-xl text-xs font-bold focus:ring-primary-500 focus:border-primary-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        <span className="text-xs font-black text-gray-700">
                                                            {new Date(inst.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {editingInstallment === inst.id ? (
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                                                        <input
                                                            type="number"
                                                            value={data.amount}
                                                            onChange={e => setData('amount', e.target.value)}
                                                            className="w-full pl-7 bg-white border-gray-200 rounded-xl text-xs font-black focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-xs font-black text-gray-900">${Number(inst.amount).toLocaleString()}</div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                {editingInstallment === inst.id ? (
                                                    <select
                                                        value={data.status}
                                                        onChange={e => setData('status', e.target.value)}
                                                        className="w-full bg-white border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-primary-500 focus:border-primary-500"
                                                    >
                                                        <option value="pending">Pending Audit</option>
                                                        <option value="paid">Finalized Payment</option>
                                                    </select>
                                                ) : (
                                                    <StatusBadge status={inst.status} />
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {editingInstallment === inst.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => submitUpdate(inst.id)}
                                                                disabled={processing}
                                                                className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                                                            >
                                                                <Save size={14} />
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <a
                                                                href={route('invoices.installments.pdf', { invoice: invoice.id, installment: inst.id })}
                                                                className="p-2.5 text-gray-300 hover:text-primary-600 transition-all inline-block"
                                                                title="Download Receipt"
                                                            >
                                                                <Download size={14} />
                                                            </a>
                                                            {inst.status === 'pending' && (
                                                                <button
                                                                    onClick={() => markAsPaid(inst.id, inst.amount, inst.due_date)}
                                                                    className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-black hover:bg-emerald-100 transition-all uppercase tracking-wider"
                                                                >
                                                                    <CheckCircle2 size={12} />
                                                                    RECORD PAYMENT
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => startEdit(inst)}
                                                                className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                                            >
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

                        <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                    <AlertCircle className="text-orange-500" size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Financial Policy Context</h4>
                                    <p className="text-[10px] font-bold text-gray-500 mt-1 leading-relaxed">
                                        Modifying scheduled installments will automatically recalculate the total balance of the master invoice.
                                        Ensure all commitments are verified before finalizing changes. Payment records are immutable once audited.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isAddInstallmentOpen} onClose={() => setIsAddInstallmentOpen(false)} maxWidth="md">
                <form onSubmit={submitAdd} className="p-6 bg-white">
                    <h2 className="text-lg font-black text-[#1a1a1a] mb-6 tracking-tight">Append Installment</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel className="text-[9px] font-black uppercase text-gray-400 tracking-widest" value="Valuation Amount (USD)" />
                            <TextInput
                                type="number"
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-xs font-black p-3.5 rounded-xl"
                                value={addData.amount}
                                onChange={e => setAddData('amount', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel className="text-[9px] font-black uppercase text-gray-400 tracking-widest" value="Settlement Target" />
                            <TextInput
                                type="date"
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-xs font-black p-3.5 rounded-xl"
                                value={addData.due_date}
                                onChange={e => setAddData('due_date', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsAddInstallmentOpen(false)} className="rounded-xl font-black text-[10px] uppercase">
                            Abort
                        </SecondaryButton>
                        <PrimaryButton disabled={addingInstallment} className="rounded-xl font-black text-[10px] uppercase shadow-lg shadow-primary-100">
                            Commit Addition
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

