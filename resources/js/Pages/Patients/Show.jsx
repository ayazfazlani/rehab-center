import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar,
    FileText,
    ArrowRight,
    CreditCard,
    Plus,
    CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const StatusBadge = ({ status }) => {
    const styles = {
        paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
        unpaid: "bg-rose-50 text-rose-700 border-rose-100",
        partially_paid: "bg-blue-50 text-blue-700 border-blue-100",
    };

    return (
        <span className={cn(
            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
            styles[status]
        )}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default function Show({ patient, invoices }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('patients.index')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <ChevronLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">{patient.first_name} {patient.last_name}</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Patient Profile & Clinical History</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Patient: ${patient.first_name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                {/* Sidebar: Profile Summary */}
                <div className="lg:col-span-1 space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
                                <User className="text-indigo-600" size={28} />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 leading-tight">{patient.first_name} {patient.last_name}</h3>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: #{patient.id}</span>
                        </div>

                        <div className="space-y-3.5">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                    <Phone size={12} className="text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone</div>
                                    <div className="text-[11px] font-bold text-slate-700 mt-0.5 truncate">{patient.phone || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                    <Mail size={12} className="text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</div>
                                    <div className="text-[11px] font-bold text-slate-700 mt-0.5 truncate">{patient.email || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                    <MapPin size={12} className="text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Residency</div>
                                    <div className="text-[11px] font-bold text-slate-700 mt-0.5 leading-tight">{patient.address || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-slate-100">
                            <button className="w-full bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg shadow-indigo-100">
                                Edit Identity
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content: Tabs/Invoices */}
                <div className="lg:col-span-3 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-rose-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100/50">
                                <CreditCard className="text-rose-500" size={18} />
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Outstanding</div>
                                <div className="text-xl font-black text-rose-500 tracking-tight">
                                    ${invoices.reduce((acc, inv) => acc + Number(inv.balance_due), 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
                                <CheckCircle2 className="text-emerald-500" size={18} />
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Liquidated</div>
                                <div className="text-xl font-black text-emerald-500 tracking-tight">
                                    ${invoices.reduce((acc, inv) => acc + Number(inv.amount_paid), 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 tracking-tight">Billing History</h3>
                            </div>
                            <Link href={route('invoices.index')} className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50/80 rounded-lg border border-slate-200 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <Plus size={12} /> Register Invoice
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                        <th className="px-5 py-3.5 text-left">Reference</th>
                                        <th className="px-5 py-3.5 text-left">Strategy</th>
                                        <th className="px-5 py-3.5 text-left">Amount</th>
                                        <th className="px-5 py-3.5 text-left">Balance</th>
                                        <th className="px-5 py-3.5 text-left">Status</th>
                                        <th className="px-5 py-3.5 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-[12px]">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-5 py-3.5">
                                                <div className="font-black text-slate-800">#{invoice.invoice_number}</div>
                                                <div className="text-[9px] font-bold text-slate-400 mt-0.5">{new Date(invoice.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest border",
                                                    invoice.type === 'installment' ? "bg-primary-50 text-primary-600 border-primary-100" : "bg-slate-50 text-slate-400 border-slate-200"
                                                )}>
                                                    {invoice.type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-slate-800">${Number(invoice.total_amount).toLocaleString()}</td>
                                            <td className="px-5 py-3.5 font-black text-rose-500">${Number(invoice.balance_due).toLocaleString()}</td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge status={invoice.status} />
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <Link href={route('invoices.show', invoice.id)} className="p-1 px-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all text-[9px] font-black uppercase border border-transparent hover:border-primary-100">
                                                    Analyze
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px] italic">
                                                No financial records identified.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
