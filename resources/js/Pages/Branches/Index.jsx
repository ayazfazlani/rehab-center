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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        location: '',
        contact_phone: '',
        logo: null,
        _method: 'POST',
    });

    const openModal = (branch = null) => {
        setEditingBranch(branch);
        if (branch) {
            setData({
                name: branch.name,
                location: branch.location || '',
                contact_phone: branch.contact_phone || '',
                logo: null,
                _method: 'PUT',
            });
        } else {
            setData({
                name: '',
                location: '',
                contact_phone: '',
                logo: null,
                _method: 'POST',
            });
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editingBranch ? route('branches.update', editingBranch.id) : route('branches.store');
        
        post(url, {
            onSuccess: () => {
                setIsModalOpen(false);
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
                        onClick={() => openModal()}
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
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all overflow-hidden">
                                {branch.logo ? (
                                    <img src={`/storage/${branch.logo}`} alt={branch.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="text-gray-400 group-hover:text-primary-600 transition-colors" size={28} />
                                )}
                            </div>
                            <button onClick={() => openModal(branch)} className="p-2 text-gray-300 hover:text-primary-600 transition-colors bg-gray-50 rounded-lg hover:bg-primary-50">
                                <MoreVertical size={18} />
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
                    onClick={() => openModal()}
                    className="bg-[#f8fafc] rounded-3xl p-8 border-2 border-dashed border-[#eef1f4] flex flex-col items-center justify-center text-center group hover:border-primary-500 transition-all hover:bg-white min-h-[350px]"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#eef1f4] mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="text-primary-600" size={32} />
                    </div>
                    <span className="text-sm font-black text-[#1a1a1a] uppercase tracking-widest">Expansion Capacity Available</span>
                    <span className="text-xs font-bold text-gray-400 mt-2">Initialize a new medical center node</span>
                </button>
            </div>

            {/* Create/Update Branch Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                <form onSubmit={submit} className="p-0 bg-white overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                            {editingBranch ? 'Modify Scope' : 'Expand Institutional Scope'}
                        </h2>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">
                            {editingBranch ? 'Update operational details and visual identity' : 'Provision a new hospital or rehabilitation node'}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex justify-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-primary-400 transition-all">
                                    {data.logo ? (
                                        <img src={URL.createObjectURL(data.logo)} className="w-full h-full object-cover" />
                                    ) : editingBranch?.logo ? (
                                        <img src={`/storage/${editingBranch.logo}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={32} className="text-slate-300" />
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    onChange={(e) => setData('logo', e.target.files[0])}
                                />
                                <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-1.5 rounded-lg shadow-lg">
                                    <Plus size={14} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-[0.1em]" value="Operational Title" />
                            <TextInput
                                className="w-full bg-[#f8fafc] border-[#eef1f4] text-xs font-bold p-3 rounded-xl focus:bg-white transition-all shadow-inner"
                                placeholder="e.g. Wellness Center North"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-rose-500 text-[10px] mt-2 font-bold uppercase tracking-tighter">{errors.name}</div>}
                        </div>

                        <div>
                            <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-[0.1em]" value="Geographic Identification" />
                            <TextInput
                                className="w-full bg-[#f8fafc] border-[#eef1f4] text-xs font-bold p-3 rounded-xl focus:bg-white transition-all shadow-inner"
                                placeholder="Street address or locality..."
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-[0.1em]" value="Critical Contact Line" />
                            <TextInput
                                className="w-full bg-[#f8fafc] border-[#eef1f4] text-xs font-bold p-3 rounded-xl focus:bg-white transition-all shadow-inner"
                                placeholder="+1 (000) 000-0000"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold text-[10px] uppercase w-full sm:w-auto px-6 py-3 order-2 sm:order-1">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl font-bold text-xs w-full sm:w-auto px-10 py-3 bg-primary-600 shadow-lg shadow-primary-100 border-transparent order-1 sm:order-2">
                            {editingBranch ? 'Update Node' : 'Initialize Node'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
