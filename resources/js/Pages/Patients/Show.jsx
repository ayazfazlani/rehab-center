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
                            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">{patient.first_name} {patient.last_name}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Patient Profile & Clinical History</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Patient: ${patient.first_name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-[#eef1f4] p-8 shadow-sm">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-24 h-24 rounded-[2rem] bg-primary-50 flex items-center justify-center mb-4 border border-primary-100">
                                <User className="text-primary-600" size={40} />
                            </div>
                            <h3 className="text-lg font-black text-[#1a1a1a]">{patient.first_name} {patient.last_name}</h3>
                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">ID: #{patient.id}</span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <Phone size={14} className="text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Contact</div>
                                    <div className="text-xs font-bold text-gray-700 mt-0.5">{patient.phone || 'Not provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <Mail size={14} className="text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</div>
                                    <div className="text-xs font-bold text-gray-700 mt-0.5 truncate max-w-[150px]">{patient.email || 'Not provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <MapPin size={14} className="text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Residency</div>
                                    <div className="text-xs font-bold text-gray-700 mt-0.5 leading-relaxed">{patient.address || 'Address unknown'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-100">
                            <button className="w-full bg-primary-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-50">
                                Edit Identity
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content: Tabs/Invoices */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-[#eef1f4] shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                                <CreditCard className="text-rose-600" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Outstanding Balance</div>
                                <div className="text-3xl font-black text-rose-600 tracking-tighter">
                                    ${invoices.reduce((acc, inv) => acc + Number(inv.balance_due), 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-[#eef1f4] shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Liquidated</div>
                                <div className="text-3xl font-black text-emerald-600 tracking-tighter">
                                    ${invoices.reduce((acc, inv) => acc + Number(inv.amount_paid), 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#eef1f4] shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-[#eef1f4] flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-[#1a1a1a]">Billing History</h3>
                                <p className="text-xs font-bold text-gray-500">Record of all financial transactions</p>
                            </div>
                            <Link 
                                href={route('invoices.index')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                <Plus size={14} /> New Invoice
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Reference</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Strategy</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Balance</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="text-xs font-black text-gray-900">#{invoice.invoice_number}</div>
                                                <div className="text-[9px] font-bold text-gray-400 mt-0.5">{new Date(invoice.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest border",
                                                    invoice.type === 'installment' ? "bg-primary-50 text-primary-600 border-primary-100" : "bg-gray-50 text-gray-400 border-gray-100"
                                                )}>
                                                    {invoice.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-black text-gray-900">${Number(invoice.total_amount).toLocaleString()}</td>
                                            <td className="px-8 py-5 text-xs font-black text-rose-500">${Number(invoice.balance_due).toLocaleString()}</td>
                                            <td className="px-8 py-5">
                                                <StatusBadge status={invoice.status} />
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link 
                                                    href={route('invoices.show', invoice.id)}
                                                    className="p-2 text-gray-300 hover:text-primary-600 transition-colors inline-block"
                                                >
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-black uppercase tracking-widest text-[10px] italic">
                                                No financial records detected for this patient.
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
