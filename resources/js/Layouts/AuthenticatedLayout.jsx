import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    LayoutGrid, 
    Users, 
    ReceiptText, 
    Wallet, 
    MapPin, 
    Settings, 
    LogOut, 
    Menu, 
    X, 
    ChevronDown,
    Building2,
    Bell,
    ChevronRight,
    Search,
    ShieldCheck,
    UserCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SidebarLink = ({ href, active, icon: Icon, children }) => (
    <Link
        href={href}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active 
                ? "bg-primary-50 text-primary-600 border border-primary-100 shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
        )}
    >
        <Icon size={18} className={cn(active ? "text-primary-600" : "text-gray-400 group-hover:text-primary-500")} />
        <span className="font-bold text-[11px] uppercase tracking-wider">{children}</span>
    </Link>
);

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const hasPermission = (perm) => user.permissions?.includes(perm);

    const navigation = [
        { name: 'Control Panel', href: route('dashboard'), icon: LayoutGrid, active: route().current('dashboard'), show: true },
        { name: 'Hospitals / Branches', href: route('branches.index'), icon: Building2, active: route().current('branches.*'), show: hasPermission('manage-branches') },
        { name: 'Patient Registry', href: route('patients.index'), icon: Users, active: route().current('patients.*'), show: hasPermission('manage-patients') },
        { name: 'Billing Audit', href: route('invoices.index'), icon: ReceiptText, active: route().current('invoices.*'), show: hasPermission('manage-invoices') },
        { name: 'Operational Expenses', href: route('expenses.index'), icon: Wallet, active: route().current('expenses.*'), show: hasPermission('manage-expenses') },
        { name: 'User Access', href: route('users.index'), icon: UserCircle, active: route().current('users.*'), show: hasPermission('manage-users') },
        { name: 'Roles & Rules', href: route('roles.index'), icon: ShieldCheck, active: route().current('roles.*'), show: hasPermission('manage-roles') },
        { name: 'Center Settings', href: '#', icon: Settings, active: false, show: hasPermission('view-reports') },
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfd] text-[#1a1a1a] font-sans antialiased flex flex-col lg:flex-row overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#eef1f4] p-5 sticky top-0 h-screen overflow-y-auto">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-200">
                        <Building2 className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="text-lg font-black tracking-tighter text-[#1a1a1a] block leading-none underline decoration-primary-500 decoration-3 underline-offset-4">HMS CORE</span>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mt-0.5 block">Institutional OS</span>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Location Context</div>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#f8fafc] border border-[#eef1f4] text-left hover:border-primary-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#eef1f4] group-hover:scale-110 transition-transform">
                                        <MapPin size={16} className="text-primary-500" />
                                    </div>
                                    <span className="text-xs font-black text-gray-700 truncate max-w-[120px]">
                                        {user.branches?.find(b => b.id === user.current_branch_id)?.name || 'Select Branch'}
                                    </span>
                                </div>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="left" width="60" className="bg-white border-[#eef1f4] shadow-2xl p-2 rounded-2xl">
                             <div className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">Switch Active Branch</div>
                            {user.branches?.map(branch => (
                                <Link 
                                    key={branch.id} 
                                    href={route('branches.switch')} 
                                    method="post" 
                                    data={{ branch_id: branch.id }} 
                                    as="button"
                                    className={cn(
                                        "w-full text-left px-4 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-between mb-1",
                                        branch.id === user.current_branch_id ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    {branch.name}
                                    {branch.id === user.current_branch_id && <ChevronRight size={14} />}
                                </Link>
                            ))}
                        </Dropdown.Content>
                    </Dropdown>
                </div>

                <nav className="flex-1 space-y-2">
                    <div className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Functional Modules</div>
                    {navigation.filter(item => item.show).map((item) => (
                        <SidebarLink key={item.name} href={item.href} icon={item.icon} active={item.active}>
                            {item.name}
                        </SidebarLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-[#eef1f4]">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-[#eef1f4] group">
                                <div className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#eef1f4] flex items-center justify-center text-xs font-black text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-xs font-black text-[#1a1a1a]">{user.name}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">{user.email}</div>
                                </div>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48" className="bg-white border-[#eef1f4] shadow-2xl p-2 rounded-2xl">
                            <Dropdown.Link href={route('profile.edit')} className="text-xs font-black text-gray-500 hover:bg-gray-50 rounded-xl px-4 py-3">Profile Identity</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-xs font-black text-rose-500 hover:bg-rose-50 rounded-xl px-4 py-3 w-full text-left">Terminate Auth</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 lg:h-18 bg-white border-b border-[#eef1f4] flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="lg:hidden p-2 -ml-2 bg-gray-50 rounded-lg text-gray-500" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="relative hidden md:flex items-center flex-1 max-w-md">
                            <Search className="absolute left-4 text-gray-300" size={18} />
                            <input 
                                type="text" 
                                placeholder="Universal Command Search (Ctrl + K)" 
                                className="w-full bg-[#f8fafc] border-transparent rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:bg-white focus:border-primary-200 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-3">
                            <button className="w-10 h-10 bg-[#f8fafc] border border-[#eef1f4] rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-500 transition-all relative group">
                                <Bell size={18} />
                                <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-100 group-hover:scale-110 transition-transform"></span>
                            </button>
                        </div>
                        <div className="h-8 w-[1px] bg-[#eef1f4] hidden lg:block"></div>
                        <div className="flex items-center gap-3">
                             <div className="text-right hidden sm:block">
                                <div className="text-xs font-black text-[#1a1a1a] tracking-tight">{user.name}</div>
                                <div className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mt-0.5 underline decoration-2 underline-offset-2">
                                    {user.roles?.[0] || 'Member'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative bg-[#fcfcfd]">
                     {/* Background Pattern */}
                    <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none overflow-hidden" 
                         style={{ backgroundImage: 'radial-gradient(#2d8cf0 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
                        {header && (
                            <div className="mb-2">
                                {header}
                            </div>
                        )}
                        <div className="animate-in fade-in duration-500">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Drawer */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-8 shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-12">
                             <span className="font-black text-2xl tracking-tighter text-primary-600 underline">HMS CORE</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-gray-50 rounded-xl text-gray-400"><X size={24} /></button>
                        </div>
                        <nav className="space-y-4">
                             {navigation.filter(item => item.show).map((item) => (
                                <SidebarLink key={item.name} href={item.href} icon={item.icon} active={item.active}>
                                    {item.name}
                                </SidebarLink>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
