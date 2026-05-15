import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Building2, 
    MapPin, 
    Phone, 
    MoreVertical,
    CheckCircle2,
    Shield
} from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ branches }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        location: '',
        contact_phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('branches.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-[#1a1a1a] tracking-tight">Institutional Scopes</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.15em] mt-1">Scale and manage your medical centers</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary-100 transition-all active:scale-95"
                    >
                        <Plus size={16} /> Add Hospital
                    </button>
                </div>
            }
        >
            <Head title="Manage Branches" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {branches.map((branch) => (
                    <div key={branch.id} className="bg-white rounded-3xl p-8 border border-[#eef1f4] shadow-sm hover:border-primary-500 transition-all group relative overflow-hidden">
                        {/* Decorative background icon */}
                        <Building2 className="absolute -right-4 -bottom-4 text-gray-50 opacity-[0.05]" size={160} />
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                                <Building2 className="text-gray-400 group-hover:text-primary-600 transition-colors" size={28} />
                            </div>
                            <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        
                        <div className="mb-8 relative z-10">
                            <h3 className="text-xl font-black text-[#1a1a1a] mb-2">{branch.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <MapPin size={14} className="text-primary-400" /> {branch.location || 'Location Pending'}
                            </div>
                        </div>

                        <div className="space-y-3 mb-8 relative z-10">
                            <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl border border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Status</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                    <CheckCircle2 size={12} /> Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl border border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Protocol</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-primary-500 uppercase tracking-widest">
                                    <Shield size={12} /> RBAC Active
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-black text-[#1a1a1a] relative z-10 p-2 bg-gray-50 rounded-xl border border-gray-100">
                             <Phone size={14} className="text-gray-400" />
                             {branch.contact_phone || 'Emergency line required'}
                        </div>
                    </div>
                ))}

                {/* Placeholder Card */}
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#f8fafc] rounded-3xl p-8 border-2 border-dashed border-[#eef1f4] flex flex-col items-center justify-center text-center group hover:border-primary-500 transition-all hover:bg-white"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#eef1f4] mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="text-primary-600" size={32} />
                    </div>
                    <span className="text-sm font-black text-[#1a1a1a] uppercase tracking-widest">Expansion Capacity Available</span>
                    <span className="text-xs font-bold text-gray-400 mt-2">Initialize a new medical center node</span>
                </button>
            </div>

            {/* Create Branch Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="xl">
                <form onSubmit={submit} className="p-6 md:p-8 bg-white">
                    <div className="mb-6">
                        <h2 className="text-xl lg:text-2xl font-black text-[#1a1a1a] tracking-tight">Expand Institutional Scope</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-1">Provision a new hospital or rehabilitation node</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Operational Title" />
                            <TextInput
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-bold p-3.5 rounded-xl focus:bg-white transition-all shadow-inner"
                                placeholder="e.g. Wellness Center North"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-rose-500 text-[10px] mt-2 font-black uppercase tracking-tighter">{errors.name}</div>}
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Geographic Identification" />
                            <TextInput
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-bold p-3.5 rounded-xl focus:bg-white transition-all shadow-inner"
                                placeholder="Street address or locality..."
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-black uppercase text-[9px] mb-2 tracking-[0.2em]" value="Critical Contact Line" />
                            <TextInput
                                className="mt-1 block w-full bg-[#f8fafc] border-[#eef1f4] text-[11px] font-bold p-3.5 rounded-xl focus:bg-white transition-all shadow-inner"
                                placeholder="+1 (000) 000-0000"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto px-6 py-3.5 order-2 sm:order-1">
                            Cancel Process
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto px-10 py-3.5 bg-primary-600 shadow-lg shadow-primary-100 border-transparent order-1 sm:order-2">
                            Initialize Node
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
