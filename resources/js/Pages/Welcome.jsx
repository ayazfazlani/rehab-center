import { Head, Link } from '@inertiajs/react';
import { 
    Activity, 
    Building2, 
    Users, 
    ShieldCheck, 
    LayoutGrid, 
    ChevronRight,
    ArrowRightCircle,
    Globe,
    Lock
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="bg-white text-[#1a1a1a] font-sans selection:bg-primary-100 selection:text-primary-700">
            <Head title="Premium Hospital Management" />
            
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#eef1f4]">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Activity className="text-white" size={16} />
                        </div>
                        <span className="font-black text-lg tracking-tighter decoration-primary-500 decoration-2 underline underline-offset-4">CORE HMS</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <a href="#features" className="hover:text-primary-600 transition-colors">Infrastructure</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Audit</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-100 hover:scale-105 transition-all"
                            >
                                Enter Node
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] hover:text-primary-600 transition-colors px-2">Access</Link>
                                <Link
                                    href={route('register')}
                                    className="bg-primary-600 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-100 hover:scale-105 transition-all"
                                >
                                    Initialize
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#2d8cf0 1.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full border border-primary-100 font-black text-[9px] uppercase tracking-[0.2em] mb-8">
                        <Globe size={12} /> Distributed Institutional Layer
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#1a1a1a] tracking-tight mb-8 max-w-5xl mx-auto leading-[0.95]">
                        The Institutional OS for <span className="text-primary-600">Enterprise</span> Medical Groups.
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg font-bold max-w-2xl mx-auto mb-10">
                        Provision clinics, manage billing cycles, and secure medical records on a unified medical protocol.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href={route('register')} className="w-full sm:w-auto bg-[#1a1a1a] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3">
                            Initialize Node <ChevronRight size={18} />
                        </Link>
                        <button className="w-full sm:w-auto bg-white border border-[#eef1f4] text-gray-500 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                            Review Protocol
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-[#fcfcfd] border-y border-[#eef1f4]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tight mb-6 underline decoration-primary-500 decoration-4 underline-offset-8">Institutional Infrastructure.</h2>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Everything your network needs to maintain clinical excellence.</p>
                        </div>
                        <div className="text-right">
                           <div className="text-3xl font-black text-primary-600 mb-1">99.9%</div>
                           <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Uptime Guarantee</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-3xl border border-[#eef1f4] shadow-sm hover:shadow-xl hover:shadow-primary-50 transition-all group">
                            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 border border-primary-100 group-hover:scale-110 transition-transform">
                                <Building2 className="text-primary-600" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-[#1a1a1a] mb-4">Multi-Branch Scoping</h3>
                            <p className="text-gray-400 text-sm font-bold leading-relaxed">
                                Manage unlimited medical centers under a single verified tenant. Isolated data, unified governance.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl border border-[#eef1f4] shadow-sm hover:shadow-xl hover:shadow-primary-50 transition-all group">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100 group-hover:scale-110 transition-transform">
                                <LayoutGrid className="text-emerald-600" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-[#1a1a1a] mb-4">Milestone Billing</h3>
                            <p className="text-gray-400 text-sm font-bold leading-relaxed">
                                Deploy dynamic installment cycles for high-value rehabilitation programs with automated audit logs.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl border border-[#eef1f4] shadow-sm hover:shadow-xl hover:shadow-primary-50 transition-all group">
                            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 border border-rose-100 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="text-rose-600" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-[#1a1a1a] mb-4">Audited Security</h3>
                            <p className="text-gray-400 text-sm font-bold leading-relaxed">
                                Role-based access control (RBAC) ensures only verified medical personnel access sensitive records.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-40">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-[#fcfcfd] rounded-3xl border border-[#eef1f4] flex items-center justify-center mx-auto mb-12 shadow-inner">
                        <ArrowRightCircle className="text-primary-600" size={40} />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-[#1a1a1a] tracking-tighter mb-10">
                        Provision your institutional node today.
                    </h2>
                    <Link href={route('register')} className="inline-flex items-center gap-4 bg-primary-600 text-white px-12 py-6 rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary-200 hover:scale-105 transition-all">
                        Initialize Register <ChevronRight size={24} />
                    </Link>
                    <div className="flex items-center justify-center gap-8 mt-16 text-gray-300 font-black text-[10px] uppercase tracking-[0.3em]">
                        <span className="flex items-center gap-2 underline decoration-primary-300"> <Lock size={12} /> SSL Secure</span>
                        <span className="flex items-center gap-2 underline decoration-emerald-300"> <ShieldCheck size={12} /> HIPAA Compliant</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-[#eef1f4] bg-white text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-2 mb-8 grayscale opacity-50">
                        <Activity className="text-primary-600" size={24} />
                        <span className="font-black text-2xl tracking-tighter">CORE HMS</span>
                    </div>
                    <p className="text-gray-300 text-xs font-black uppercase tracking-widest">&copy; 2026 Institutional Systems Inc. All Protocol Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
