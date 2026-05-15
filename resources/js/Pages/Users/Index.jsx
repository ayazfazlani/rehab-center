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
                        <h2 className="text-xl lg:text-2xl font-black text-[#1c2b36]">Access Control</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.15em] mt-1">Management of institutional human assets</p>
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
                <div className="p-5 bg-[#fcfcfd] border-b border-[#dce3e8] flex justify-between items-center px-8">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Personnel Directory</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#fcfcfd] border-b border-[#eef1f4]">
                                <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Identity / Auth</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Auth Privilege</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Operational Scopes</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Audit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f4f7]">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-all group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-[#eef1f4] flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-all">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-[#1a1a1a] font-black text-[13px]">{user.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-0.5">
                                                    <Mail size={10} /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <div className="flex flex-wrap justify-center gap-1.5">
                                            {user.roles.map(role => (
                                                <span key={role.id} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-widest">
                                                    {role.name}
                                                </span>
                                            ))}
                                            {user.roles.length === 0 && <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">No Privileges</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.branches.map(branch => (
                                                <span key={branch.id} className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 border border-primary-100 text-[8px] font-black uppercase tracking-widest">
                                                    {branch.name}
                                                </span>
                                            ))}
                                            {user.branches.length === 0 && <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Unassigned</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="xl">
                <form onSubmit={submit} className="p-6 md:p-8 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Lock size={120} className="text-primary-600" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl lg:text-2xl font-black text-[#1a1a1a] tracking-tight">Provision Identity</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-1">Initialize a new authenticated institutional node</p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Identity Name" />
                                <TextInput
                                    className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-black p-3.5 rounded-xl transition-all shadow-inner focus:bg-white"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-rose-500 text-[10px] mt-2 font-black">{errors.name}</div>}
                            </div>
                            <div>
                                <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Auth Email" />
                                <TextInput
                                    type="email"
                                    className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-black p-3.5 rounded-xl transition-all shadow-inner focus:bg-white"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-rose-500 text-[10px] mt-2 font-black">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Password Phrase" />
                                <TextInput
                                    type="password"
                                    className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-black p-3.5 rounded-xl transition-all shadow-inner focus:bg-white"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Verify Phrase" />
                                <TextInput
                                    type="password"
                                    className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-black p-3.5 rounded-xl transition-all shadow-inner focus:bg-white"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-4 tracking-[0.2em]" value="Institutional Privileges" />
                            <div className="flex flex-wrap gap-2">
                                {roles.map(role => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => toggleRole(role.name)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                                            data.roles.includes(role.name)
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                                : "bg-white border-[#eef1f4] text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        {role.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-4 tracking-[0.2em]" value="Assigned Scopes (Branches)" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {branches.map(branch => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => toggleBranch(branch.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left",
                                            data.branches.includes(branch.id)
                                                ? "bg-primary-50 border-primary-500 text-primary-700"
                                                : "bg-[#fcfcfd] border-[#eef1f4] text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                            data.branches.includes(branch.id) ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-gray-200"
                                        )}>
                                            {data.branches.includes(branch.id) && <CheckCircle2 size={12} />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{branch.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 relative z-10">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto px-8 py-3.5 order-2 sm:order-1">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto px-10 py-3.5 shadow-lg shadow-primary-100 bg-primary-600 border-transparent order-1 sm:order-2">
                            Initialize Auth Node
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
