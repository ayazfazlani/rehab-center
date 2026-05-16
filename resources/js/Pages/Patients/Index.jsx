import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    UserPlus, 
    Phone, 
    Mail, 
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
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

export default function Index({ patients }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('patients.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg lg:text-2xl font-black text-slate-800 tracking-tight">Patient Registry</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mt-1">Medical Record Identification</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                    >
                        <UserPlus size={14} /> Register
                    </button>
                </div>
            }
        >
            <Head title="Patients" />

            <div className="bg-white rounded-2xl border border-[#dce3e8] overflow-hidden shadow-sm mb-8">
                <div className="p-4 bg-[#fcfcfd] border-b border-[#dce3e8]">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Identify by name or record ID..." 
                            className="w-full bg-white border-[#dce3e8] rounded-xl pl-10 pr-4 py-2 text-[13px] font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 lg:p-6 gap-4 lg:gap-6">
                    {patients.data.length > 0 ? (
                        patients.data.map((patient) => (
                            <div key={patient.id} className="bg-white border border-[#dce3e8] rounded-2xl p-5 hover:border-primary-500 transition-all group shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center font-black text-sm">
                                        {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-500 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                
                                <h3 className="text-[13px] font-black text-slate-800 mb-3 uppercase tracking-tight leading-tight">{patient.first_name} {patient.last_name}</h3>
                                
                                <div className="space-y-1.5 mb-5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <Mail size={14} className="text-primary-400" /> {patient.email || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <Phone size={14} className="text-emerald-400" /> {patient.phone || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 truncate italic">
                                        <MapPin size={14} className="text-rose-400" /> {patient.address || 'Locality not defined'}
                                    </div>
                                </div>

                                <Link 
                                    href={route('patients.show', patient.id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[9px] font-black uppercase text-slate-500 tracking-widest transition-colors border border-slate-200"
                                >
                                    Analyze History <ArrowUpRight size={12} />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400 text-xs font-black uppercase tracking-widest italic bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            No records identified within this scope.
                        </div>
                    )}
                </div>
            </div>

            {/* Create Patient Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                 <form onSubmit={submit} className="p-0 bg-white">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Register New Client</h2>
                        <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1">Medical Record Initialization</p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Given Name" />
                                <TextInput
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                />
                                {errors.first_name && <div className="text-rose-500 text-[10px] mt-1.5 font-bold">{errors.first_name}</div>}
                            </div>
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Surname" />
                                <TextInput
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                />
                                {errors.last_name && <div className="text-rose-500 text-[10px] mt-1.5 font-bold">{errors.last_name}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Email Address" />
                                <TextInput
                                    type="email"
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Phone Contact" />
                                <TextInput
                                    className="w-full bg-slate-50 border-slate-200 text-[13px] font-bold p-2.5 rounded-xl transition-all focus:bg-white"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-slate-400 font-bold uppercase text-[9px] mb-2 tracking-widest" value="Locality Details" />
                            <textarea
                                className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold p-3 transition-all focus:bg-white"
                                rows="2"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl px-6 py-2 text-[10px] font-black uppercase">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl px-8 py-2 bg-primary-600 text-[11px] font-black uppercase shadow-lg shadow-primary-100">
                            Register Patient
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
