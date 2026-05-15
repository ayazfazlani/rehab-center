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
    ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, icon: Icon, trend, trendType, color }) => (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-[#eef1f4] shadow-sm group hover:border-primary-500 transition-all relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div className={StatCard.iconStyles[color || 'blue']}>
                <Icon size={20} />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider",
                    trendType === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                )}>
                    {trend}
                </div>
            )}
        </div>
        <div className="text-2xl lg:text-3xl font-black mb-1 tracking-tight text-[#1a1a1a]">{value}</div>
        <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.1em]">{title}</div>
    </div>
);

StatCard.iconStyles = {
    blue: "w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center border border-primary-100 group-hover:scale-110 transition-transform",
    emerald: "w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform",
    rose: "w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform",
    amber: "w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform",
};

export default function Dashboard({ stats, recentInvoices }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-[#1a1a1a] tracking-tight">Executive Dashboard</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.15em] mt-1">Institution Performance & Audit Logs</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="hidden sm:flex items-center gap-2 bg-white border border-[#eef1f4] px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={12} /> Filter Scope
                        </button>
                        <Link href={route('invoices.index')} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary-100 transition-all active:scale-95">
                            <Plus size={14} /> New Transaction
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Institutional Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <StatCard 
                    title="Verified Patients" 
                    value={stats.total_patients} 
                    icon={Users} 
                    trend="+12%" 
                    trendType="positive"
                    color="blue"
                />
                <StatCard 
                    title="Audit Pending" 
                    value={stats.pending_invoices} 
                    icon={ReceiptText} 
                    trend="-5%" 
                    trendType="negative"
                    color="amber"
                />
                <StatCard 
                    title="Fiscal Inflow" 
                    value={`$${Number(stats.revenue_this_month).toLocaleString()}`} 
                    icon={TrendingUp} 
                    trend="+24%" 
                    trendType="positive"
                    color="emerald"
                />
                <StatCard 
                    title="Operational Outflow" 
                    value={`$${Number(stats.expenses_this_month).toLocaleString()}`} 
                    icon={TrendingDown} 
                    trend="+8%" 
                    trendType="negative"
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                {/* Recent Invoices Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eef1f4] overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-[#eef1f4] flex items-center justify-between">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]">Institutional Ledger Feed</h3>
                        <Link href={route('invoices.index')} className="text-primary-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-all">
                            Detailed Audit <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfcfd] text-gray-400 uppercase text-[9px] font-black tracking-[0.2em] border-b border-[#eef1f4]">
                                <tr>
                                    <th className="px-8 py-5">Audit Ref</th>
                                    <th className="px-8 py-5">Institutional Client</th>
                                    <th className="px-8 py-5 text-right">Valuation</th>
                                    <th className="px-8 py-5 text-center">Protocol Status</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eef1f4] text-xs font-bold">
                                {recentInvoices && recentInvoices.length > 0 ? (
                                    recentInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-4 text-gray-400">#{invoice.invoice_number}</td>
                                            <td className="px-8 py-4">
                                                <div className="text-[#1a1a1a] font-black">{invoice.patient.first_name} {invoice.patient.last_name}</div>
                                                <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{invoice.type} plan</div>
                                            </td>
                                            <td className="px-8 py-4 text-right font-black text-[#1a1a1a] tracking-tight text-sm">
                                                ${Number(invoice.total_amount).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border",
                                                    invoice.status === 'paid' 
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                        : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <Link href={route('invoices.index')} className="text-gray-300 hover:text-primary-500 transition-colors">
                                                    <ArrowUpRight size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-24 text-center text-gray-400 font-black uppercase tracking-widest italic bg-gray-50">
                                            No recent transactions detected in current scope.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Shortcuts */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl border border-[#eef1f4] p-8">
                        <h3 className="font-black text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a] mb-8">Node Terminal</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <Link href={route('patients.index')} className="flex items-center gap-5 p-5 rounded-2xl bg-[#f8fafc] border border-transparent hover:border-primary-200 transition-all text-left group">
                                <div className="p-3 bg-white border border-[#eef1f4] text-primary-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <Users size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-black text-xs text-[#1a1a1a] uppercase tracking-tight">Register Client</div>
                                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">Initialize a new record</div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-primary-500" />
                            </Link>

                            <Link href={route('invoices.index')} className="flex items-center gap-5 p-5 rounded-2xl bg-[#f8fafc] border border-transparent hover:border-emerald-200 transition-all text-left group">
                                <div className="p-3 bg-white border border-[#eef1f4] text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <ReceiptText size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-black text-xs text-[#1a1a1a] uppercase tracking-tight">Execute Billing</div>
                                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">Provision a new invoice</div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500" />
                            </Link>

                            <Link href={route('expenses.index')} className="flex items-center gap-5 p-5 rounded-2xl bg-[#f8fafc] border border-transparent hover:border-rose-200 transition-all text-left group">
                                <div className="p-3 bg-white border border-[#eef1f4] text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all">
                                    <TrendingDown size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-black text-xs text-[#1a1a1a] uppercase tracking-tight">Log Outflow</div>
                                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">Record operational expenditure</div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-rose-500" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-3xl p-10 relative overflow-hidden group shadow-2xl">
                         <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                                <Building2 className="text-primary-400" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-white mb-3">Institutional Scaling</h3>
                            <p className="text-gray-400 text-xs font-bold leading-relaxed mb-10">Expand your clinical network by provisioning additional branches instantly.</p>
                            <Link href={route('branches.index')} className="w-full bg-white text-[#1a1a1a] px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-all">
                                Manage Network Scope
                            </Link>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-primary-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
