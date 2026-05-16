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
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutGrid, active: route().current('dashboard'), show: true },
        { name: 'Branches', href: route('branches.index'), icon: Building2, active: route().current('branches.*'), show: hasPermission('manage-branches') },
        { name: 'Patients', href: route('patients.index'), icon: Users, active: route().current('patients.*'), show: hasPermission('manage-patients') },
        { name: 'Invoices', href: route('invoices.index'), icon: ReceiptText, active: route().current('invoices.*'), show: hasPermission('manage-invoices') },
        { name: 'Expenses', href: route('expenses.index'), icon: Wallet, active: route().current('expenses.*'), show: hasPermission('manage-expenses') },
        { name: 'Users', href: route('users.index'), icon: UserCircle, active: route().current('users.*'), show: hasPermission('manage-users') },
        { name: 'Roles', href: route('roles.index'), icon: ShieldCheck, active: route().current('roles.*'), show: hasPermission('manage-roles') },
        { name: 'Settings', href: '#', icon: Settings, active: false, show: hasPermission('view-reports') },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased flex flex-col lg:flex-row overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-4 sticky top-0 h-screen overflow-y-auto shadow-sm">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 shrink-0">
                        <Building2 className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">HMS CORE</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">Management System</span>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your Location</div>
                    {hasPermission('manage-branches') ? (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-left hover:border-primary-300 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform shadow-sm">
                                            <MapPin size={16} className="text-primary-500" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                                            {user.branches?.find(b => b.id === user.current_branch_id)?.name || 'Select Branch'}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="left" width="60" className="bg-white border-slate-200 shadow-2xl p-2 rounded-2xl">
                                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-2">Switch Active Branch</div>
                                {user.branches?.map(branch => (
                                    <Link 
                                        key={branch.id} 
                                        href={route('branches.switch')} 
                                        method="post" 
                                        data={{ branch_id: branch.id }} 
                                        as="button"
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between mb-1",
                                            branch.id === user.current_branch_id ? "bg-primary-50 text-primary-600" : "text-slate-500 hover:bg-slate-50"
                                        )}
                                    >
                                        {branch.name}
                                        {branch.id === user.current_branch_id && <ChevronRight size={14} />}
                                    </Link>
                                ))}
                            </Dropdown.Content>
                        </Dropdown>
                    ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                                <MapPin size={16} className="text-slate-400" />
                            </div>
                            <span className="text-xs font-bold text-slate-700 truncate">
                                {user.branches?.find(b => b.id === user.current_branch_id)?.name || 'Default Branch'}
                            </span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 space-y-2">
                    <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Management</div>
                    {navigation.filter(item => item.show).map((item) => (
                        <SidebarLink key={item.name} href={item.href} icon={item.icon} active={item.active}>
                            {item.name}
                        </SidebarLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 text-left truncate">
                                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                                    <div className="text-[10px] text-slate-400 font-medium truncate">{user.email}</div>
                                </div>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48" className="bg-white border-slate-200 shadow-2xl p-2 rounded-2xl">
                            <Dropdown.Link href={route('profile.edit')} className="text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl px-4 py-3">My Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl px-4 py-3 w-full text-left">Sign Out</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="lg:hidden p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 shadow-sm" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="relative hidden md:flex items-center flex-1 max-w-sm">
                            <Search className="absolute left-4 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Global search... (Ctrl + K)" 
                                className="w-full bg-slate-50 border-slate-100 rounded-xl pl-11 pr-4 py-2 text-sm font-medium focus:bg-white focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-3">
                            <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-200 transition-all relative group shadow-sm">
                                <Bell size={18} />
                                <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-100 group-hover:scale-110 transition-transform"></span>
                            </button>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-200 hidden lg:block"></div>
                        <div className="flex items-center gap-2.5 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-sm">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-primary-600 shadow-sm">
                                {user.name.charAt(0)}
                             </div>
                             <div className="text-right hidden sm:block pr-2">
                                <div className="text-[11px] font-bold text-slate-900 tracking-tight leading-none">{user.name}</div>
                                <div className="text-[9px] text-primary-600 font-bold uppercase tracking-wider mt-0.5 leading-none">
                                    {user.roles?.[0] || 'Member'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative bg-slate-50/50">
                    <div className="max-w-[1600px] mx-auto space-y-6 lg:space-y-8 relative z-10">
                        {header && (
                            <div className="mb-4">
                                {header}
                            </div>
                        )}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Drawer */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white p-8 shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 shrink-0">
                                    <Building2 className="text-white" size={24} />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-slate-900">HMS CORE</span>
                             </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400"><X size={24} /></button>
                        </div>
                        <nav className="space-y-3 flex-1">
                             <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Management</div>
                             {navigation.filter(item => item.show).map((item) => (
                                <SidebarLink key={item.name} href={item.href} icon={item.icon} active={item.active}>
                                    {item.name}
                                </SidebarLink>
                            ))}
                        </nav>
                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-primary-600 shadow-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 text-left truncate">
                                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                                    <div className="text-[10px] text-slate-400 font-medium truncate">{user.email}</div>
                                </div>
                                <Link href={route('logout')} method="post" as="button" className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                    <LogOut size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
