import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    ReceiptText, 
    TrendingUp, 
    TrendingDown,
    Plus,
    ArrowRight,
    ArrowUpRight,
    Filter,
    Building2,
    Calendar,
    ChevronRight,
    Search,
    CreditCard,
    Briefcase,
    AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, icon: Icon, trend, trendType, color }) => (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-primary-200 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
            <div className={StatCard.iconStyles[color || 'blue']}>
                <Icon size={20} />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                    trendType === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                )}>
                    {trend}
                </div>
            )}
        </div>
        <div className="text-2xl font-bold mb-1 tracking-tight text-slate-900 leading-tight">{value}</div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{title}</div>
    </div>
);

StatCard.iconStyles = {
    blue: "w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform",
    emerald: "w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform",
    rose: "w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform",
    amber: "w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform",
};

export default function Dashboard({ stats, recentInvoices, patients = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        patient_id: '',
        total_amount: '',
        type: 'once',
        initial_payment: '',
        installment_count: 3,
        invoice_date: new Date().toISOString().split('T')[0],
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl lg:text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
                        <p className="text-slate-500 text-[13px] mt-1 font-medium">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-[11px] text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <Filter size={14} /> Filters
                        </button>
                        <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-[11px] shadow-lg shadow-primary-100 transition-all active:scale-95">
                            <Plus size={16} /> New Transaction
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Total Patients" 
                    value={stats.total_patients} 
                    icon={Users} 
                    trend="+12% growth" 
                    trendType="positive"
                    color="blue"
                />
                <StatCard 
                    title="Pending Invoices" 
                    value={stats.pending_invoices} 
                    icon={ReceiptText} 
                    trend="-5% reduction" 
                    trendType="negative"
                    color="amber"
                />
                <StatCard 
                    title="Monthly Revenue" 
                    value={`$${Number(stats.revenue_this_month).toLocaleString()}`} 
                    icon={TrendingUp} 
                    trend="+24% vs last" 
                    trendType="positive"
                    color="emerald"
                />
                <StatCard 
                    title="Monthly Expenses" 
                    value={`$${Number(stats.expenses_this_month).toLocaleString()}`} 
                    icon={TrendingDown} 
                    trend="+8% change" 
                    trendType="negative"
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Invoices Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div>
                            <h3 className="font-bold text-md text-slate-900 tracking-tight">Recent Transactions</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Latest billing activity at this branch</p>
                        </div>
                        <Link href={route('invoices.index')} className="text-primary-600 text-[11px] font-bold flex items-center gap-2 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-all">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Invoice #</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {recentInvoices && recentInvoices.length > 0 ? (
                                    recentInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-500 font-medium">#{invoice.invoice_number}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-900 font-bold text-[13px]">{invoice.patient.first_name} {invoice.patient.last_name}</div>
                                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{invoice.type === 'once' ? 'Full Payment' : 'Installment Plan'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                                                ${Number(invoice.total_amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border whitespace-nowrap",
                                                    invoice.status === 'paid' 
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                                        : "bg-slate-50 text-slate-600 border-slate-200"
                                                )}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('invoices.show', invoice.id)} className="text-slate-300 hover:text-primary-600 transition-colors p-1.5 hover:bg-primary-50 rounded-lg inline-block">
                                                    <ArrowUpRight size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-24 text-center text-slate-400 font-medium italic">
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Shortcuts */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-sm text-slate-900 mb-6 border-b border-slate-100 pb-3 uppercase tracking-wider">Quick Actions</h3>
                        <div className="space-y-4">
                            <Link href={route('patients.index')} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary-200 hover:shadow-md transition-all text-left group">
                                <div className="w-10 h-10 bg-white border border-slate-200 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <Users size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[13px] text-slate-900 mb-0.5">Manage Patients</div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate">View and register center residents</div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
                            </Link>

                            <Link href={route('invoices.index')} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all text-left group">
                                <div className="w-10 h-10 bg-white border border-slate-200 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                    <ReceiptText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[13px] text-slate-900 mb-0.5">Billing & Invoices</div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate">Generate and manage payments</div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500" />
                            </Link>

                            <Link href={route('expenses.index')} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-rose-200 hover:shadow-md transition-all text-left group">
                                <div className="w-10 h-10 bg-white border border-slate-200 text-rose-600 rounded-lg flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                                    <Briefcase size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[13px] text-slate-900 mb-0.5">Track Expenses</div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate">Record daily operational costs</div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-rose-500" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 relative overflow-hidden group shadow-xl">
                         <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                                <Building2 className="text-primary-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Facility Network</h3>
                            <p className="text-slate-400 text-[13px] font-medium leading-relaxed mb-6">Manage and coordinate across your multiple clinical facility locations.</p>
                            <Link href={route('branches.index')} className="w-full bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-xl hover:bg-primary-50 active:scale-95 transition-all">
                                Manage Branches
                            </Link>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary-600/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                    </div>
                </div>
            </div>

            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-0 bg-white">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Create Invoice</h2>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Patient billing record</p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Patient Selection" />
                                <select
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-2.5 focus:bg-white transition-all"
                                    value={data.patient_id}
                                    onChange={e => setData('patient_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Invoice Strategy" />
                                <select
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-2.5 focus:bg-white transition-all"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    required
                                >
                                    <option value="once">One-time Payment</option>
                                    <option value="installment">Installment Plan</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Total Billing" />
                                <TextInput
                                    type="number"
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-2.5 focus:bg-white"
                                    value={data.total_amount}
                                    onChange={e => setData('total_amount', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Invoice Date" />
                                <TextInput
                                    type="date"
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-2.5 focus:bg-white"
                                    value={data.invoice_date}
                                    onChange={e => setData('invoice_date', e.target.value)}
                                />
                            </div>
                            <div className="col-span-1">
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Start Date" />
                                <TextInput
                                    type="date"
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-2.5 focus:bg-white"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                />
                            </div>
                        </div>

                        {data.type === 'installment' && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Plan Duration (Months)" />
                                        <TextInput
                                            type="number"
                                            min="1"
                                            max="24"
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-2.5"
                                            value={data.installment_count}
                                            onChange={e => setData('installment_count', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Advance Deposit" />
                                        <TextInput
                                            type="number"
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-2.5"
                                            placeholder="Initial Amount"
                                            value={data.initial_payment}
                                            onChange={e => setData('initial_payment', e.target.value)}
                                        />
                                    </div>
                                </div>
                                {data.total_amount > 0 && (
                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between transition-all">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Scheduled Monthly Payment:</span>
                                        <span className="text-lg font-black text-emerald-900">
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
                    </div>

                    <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl px-6 py-2 text-[10px] font-black uppercase">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl px-8 py-2 bg-primary-600 text-[11px] font-black uppercase shadow-lg shadow-primary-100">
                            Create Invoice
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
