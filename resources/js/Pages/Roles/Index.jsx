import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    ShieldCheck, 
    Trash2, 
    Edit2,
    Lock,
    CheckCircle2,
    ShieldAlert,
    LayoutDashboard,
    Users,
    ReceiptText,
    Wallet,
    Building2,
    FileText
} from 'lucide-react';
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

const PermissionIcon = ({ name }) => {
    if (name.includes('dashboard')) return <LayoutDashboard size={14} />;
    if (name.includes('patients')) return <Users size={14} />;
    if (name.includes('invoices')) return <ReceiptText size={14} />;
    if (name.includes('expenses')) return <Wallet size={14} />;
    if (name.includes('branches')) return <Building2 size={14} />;
    if (name.includes('reports')) return <FileText size={14} />;
    return <ShieldCheck size={14} />;
};

export default function Index({ roles, permissions }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        permissions: []
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingRole) {
            patch(route('roles.update', editingRole.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setEditingRole(null);
                    reset();
                },
            });
        } else {
            post(route('roles.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const togglePermission = (permissionId) => {
        const newPermissions = data.permissions.includes(permissionId)
            ? data.permissions.filter(id => id !== permissionId)
            : [...data.permissions, permissionId];
        setData('permissions', newPermissions);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permissions: role.permissions.map(p => p.id)
        });
        setIsCreateModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-[#1c2b36]">Roles & Rules</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.15em] mt-1">Permission mapping and authority levels</p>
                    </div>
                    <button 
                        onClick={() => {
                            setEditingRole(null);
                            reset();
                            setIsCreateModalOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                    >
                        <ShieldCheck size={14} /> Define Role
                    </button>
                </div>
            }
        >
            <Head title="Roles & Permissions" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className="bg-white rounded-2xl border border-[#dce3e8] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-tight">{role.name}</h3>
                                <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{role.permissions.length} Auth Nodes Assigned</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(role)}
                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 bg-[#fcfcfd]/50">
                            <div className="flex flex-wrap gap-1.5">
                                {role.permissions.map(p => (
                                    <span key={p.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#eef1f4] text-[9px] font-black text-gray-500 uppercase tracking-tight">
                                        <PermissionIcon name={p.name} />
                                        {p.name.split('-').join(' ')}
                                    </span>
                                ))}
                                {role.permissions.length === 0 && <span className="text-[9px] text-gray-300 font-black uppercase">No permissions.</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submit} className="p-6 md:p-10 bg-white relative">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <ShieldAlert size={140} className="text-emerald-600" />
                    </div>

                    <div className="mb-10">
                        <h2 className="text-xl lg:text-2xl font-black text-[#1a1a1a] tracking-tight">
                            {editingRole ? 'Modify Authority' : 'Define Authority'}
                        </h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Map organizational functions to access levels</p>
                    </div>

                    <div className="space-y-10 relative z-10">
                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[10px] mb-3 tracking-[0.2em]" value="Authority Designation (Role Name)" />
                            <TextInput
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-xs font-black p-4 rounded-2xl focus:bg-white transition-all shadow-inner"
                                placeholder="e.g. Clinical Director"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-rose-500 text-[10px] mt-2 font-black tracking-tighter uppercase">{errors.name}</div>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <InputLabel className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]" value="Constraint Matrix (Permissions)" />
                                <div className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                    {data.permissions.length} Nodes Active
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {permissions.map(permission => (
                                    <button
                                        key={permission.id}
                                        type="button"
                                        onClick={() => togglePermission(permission.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left",
                                            data.permissions.includes(permission.id)
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                                                : "bg-[#fcfcfd] border-[#eef1f4] text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0",
                                            data.permissions.includes(permission.id) ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-gray-200"
                                        )}>
                                            {data.permissions.includes(permission.id) && <CheckCircle2 size={12} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-black uppercase tracking-tight truncate">
                                                {permission.name.split('-').join(' ')}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-gray-100 relative z-10">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-2xl font-black text-xs uppercase w-full sm:w-auto px-8 py-4 border-[#eef1f4] order-2 sm:order-1">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-2xl font-black text-xs uppercase w-full sm:w-auto px-12 py-4 bg-emerald-600 shadow-xl shadow-emerald-100 border-transparent order-1 sm:order-2">
                            {editingRole ? 'Update Strategy' : 'Initialize Authority'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
