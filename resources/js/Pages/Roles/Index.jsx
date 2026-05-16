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
                        <h2 className="text-lg lg:text-2xl font-black text-slate-800 tracking-tight">Roles & Rules</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mt-1">Permission mapping and authority levels</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {roles.map((role) => (
                    <div key={role.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                            <div>
                                <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{role.name}</h3>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{role.permissions.length} Auth Nodes</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(role)}
                                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                >
                                    <Edit2 size={13} />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50/30">
                            <div className="flex flex-wrap gap-1.5">
                                {role.permissions.map(p => (
                                    <span key={p.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-tight">
                                        <PermissionIcon name={p.name} />
                                        {p.name.split('-').join(' ')}
                                    </span>
                                ))}
                                {role.permissions.length === 0 && <span className="text-[9px] text-slate-300 font-black uppercase italic">No permissions.</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="xl">
                <form onSubmit={submit} className="p-0 bg-white relative overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                            {editingRole ? 'Modify Authority' : 'Define Authority'}
                        </h2>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Map organizational functions to access levels</p>
                    </div>

                    <div className="p-6 space-y-6 relative z-10">
                        <div>
                            <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Authority Designation (Role Name)" />
                            <TextInput
                                className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl focus:bg-white transition-all shadow-inner"
                                placeholder="e.g. Clinical Director"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-rose-500 text-[10px] mt-2 font-bold tracking-tighter uppercase">{errors.name}</div>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] tracking-widest" value="Constraint Matrix (Permissions)" />
                                <div className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    {data.permissions.length} Active
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {permissions.map(permission => (
                                    <button
                                        key={permission.id}
                                        type="button"
                                        onClick={() => togglePermission(permission.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                                            data.permissions.includes(permission.id)
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                                                : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                                            data.permissions.includes(permission.id) ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-300"
                                        )}>
                                            {data.permissions.includes(permission.id) && <CheckCircle2 size={10} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-black uppercase tracking-tight truncate">
                                                {permission.name.split('-').join(' ')}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl px-6 py-2 text-[10px] font-black uppercase">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl px-8 py-2 bg-emerald-600 text-[11px] font-black uppercase shadow-lg shadow-emerald-100">
                            {editingRole ? 'Update Strategy' : 'Initialize Authority'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
