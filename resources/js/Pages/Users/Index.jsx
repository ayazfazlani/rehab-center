import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    UserPlus, 
    MoreHorizontal, 
    Mail, 
    Shield, 
    Building,
    Trash2,
    CheckCircle2,
    CircleDashed,
    X,
    Lock
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

export default function Index({ users, roles, branches }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
        branches: []
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const toggleRole = (roleName) => {
        const newRoles = data.roles.includes(roleName)
            ? data.roles.filter(r => r !== roleName)
            : [...data.roles, roleName];
        setData('roles', newRoles);
    };

    const toggleBranch = (branchId) => {
        const newBranches = data.branches.includes(branchId)
            ? data.branches.filter(id => id !== branchId)
            : [...data.branches, branchId];
        setData('branches', newBranches);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg lg:text-2xl font-black text-slate-800 tracking-tight">Access Control</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mt-1">Management of institutional human assets</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                    >
                        <UserPlus size={14} /> Provision User
                    </button>
                </div>
            }
        >
            <Head title="Users Management" />

            <div className="bg-white rounded-2xl border border-[#dce3e8] overflow-hidden shadow-sm border-b-4 border-b-primary-500">
                <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center lg:px-8">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Personnel Directory</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 lg:px-8 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity / Auth</th>
                                <th className="px-6 lg:px-8 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Auth Privilege</th>
                                <th className="px-6 lg:px-8 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Scopes</th>
                                <th className="px-6 lg:px-8 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Audit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/30 transition-all group">
                                    <td className="px-6 lg:px-8 py-3.5">
                                        <div className="flex items-center gap-3 text-[13px]">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[11px] font-black text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-slate-900 font-bold leading-tight">{user.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                                                    <Mail size={10} className="text-slate-300" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 lg:px-8 py-3.5 text-center">
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {user.roles.map(role => (
                                                <span key={role.id} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-widest">
                                                    {role.name}
                                                </span>
                                            ))}
                                            {user.roles.length === 0 && <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">No Privileges</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 lg:px-8 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {user.branches.map(branch => (
                                                <span key={branch.id} className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 border border-primary-100 text-[8px] font-black uppercase tracking-widest">
                                                    {branch.name}
                                                </span>
                                            ))}
                                            {user.branches.length === 0 && <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Unassigned</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 lg:px-8 py-3.5 text-right">
                                        <button className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-0 bg-white">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Provision Identity</h2>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Institutional auth node initialization</p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Account Name" />
                                <TextInput
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-rose-500 text-[10px] mt-1.5 font-bold">{errors.name}</div>}
                            </div>
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Email Access" />
                                <TextInput
                                    type="email"
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-rose-500 text-[10px] mt-1.5 font-bold">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Set Password" />
                                <TextInput
                                    type="password"
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Confirm Phrase" />
                                <TextInput
                                    type="password"
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-slate-500 font-black uppercase text-[9px] mb-3 tracking-widest" value="Institutional Privileges" />
                            <div className="flex flex-wrap gap-2">
                                {roles.map(role => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => toggleRole(role.name)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                                            data.roles.includes(role.name)
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                        )}
                                    >
                                        {role.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-slate-500 font-black uppercase text-[9px] mb-3 tracking-widest" value="Scope Assignment" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {branches.map(branch => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => toggleBranch(branch.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                                            data.branches.includes(branch.id)
                                                ? "bg-primary-50 border-primary-500 text-primary-700"
                                                : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                                            data.branches.includes(branch.id) ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-slate-300"
                                        )}>
                                            {data.branches.includes(branch.id) && <CheckCircle2 size={10} />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{branch.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl px-6 py-2 text-[10px] font-black uppercase">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl px-8 py-2 bg-primary-600 text-[11px] font-black uppercase shadow-lg shadow-primary-100">
                            Provision User
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
