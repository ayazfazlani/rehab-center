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
                        <h2 className="text-xl lg:text-2xl font-black text-[#1c2b36]">Patient Registry</h2>
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.15em] mt-1">Medical Record Identification</p>
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
                            className="w-full bg-white border-[#dce3e8] rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
                    {patients.data.length > 0 ? (
                        patients.data.map((patient) => (
                            <div key={patient.id} className="bg-white border border-[#dce3e8] rounded-2xl p-6 hover:border-primary-500 transition-all group shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center font-black text-sm">
                                        {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-500 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                
                                <h3 className="text-sm font-black text-[#1c2b36] mb-4 uppercase tracking-tight">{patient.first_name} {patient.last_name}</h3>
                                
                                <div className="space-y-2 mb-6">
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
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-widest transition-colors border border-[#dce3e8]"
                                >
                                    Analyze History <ArrowUpRight size={14} />
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
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="xl">
                 <form onSubmit={submit} className="p-5 md:p-8 bg-white">
                    <h2 className="text-xl lg:text-2xl font-black mb-6 text-[#1c2b36]">Register New Client</h2>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel className="text-gray-400 font-bold uppercase text-[9px] mb-1 tracking-widest" value="Given Name" />
                                <TextInput
                                    className="mt-1 block w-full bg-[#fcfcfd] border-[#eef1f4] text-[11px] font-bold p-3.5 rounded-xl"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                />
                                {errors.first_name && <div className="text-rose-500 text-[10px] mt-1 font-bold">{errors.first_name}</div>}
                            </div>
                            <div>
                                <InputLabel className="text-gray-400 font-bold uppercase text-[9px] mb-1 tracking-widest" value="Surname" />
                                <TextInput
                                    className="mt-1 block w-full bg-[#fcfcfd] border-[#eef1f4] text-[11px] font-bold p-3.5 rounded-xl"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                />
                                {errors.last_name && <div className="text-rose-500 text-[10px] mt-1 font-bold">{errors.last_name}</div>}
                            </div>
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-bold uppercase text-[9px] mb-1 tracking-widest" value="Primary Communication (Email)" />
                            <TextInput
                                type="email"
                                className="mt-1 block w-full bg-[#fcfcfd] border-[#eef1f4] text-[11px] font-bold p-3.5 rounded-xl"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-bold uppercase text-[9px] mb-1 tracking-widest" value="Direct Contact (Phone)" />
                            <TextInput
                                className="mt-1 block w-full bg-[#fcfcfd] border-[#eef1f4] text-[11px] font-bold p-3.5 rounded-xl"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel className="text-gray-400 font-bold uppercase text-[9px] mb-1 tracking-widest" value="Locality Details" />
                            <textarea
                                className="mt-1 block w-full bg-[#fcfcfd] border-[#eef1f4] rounded-xl text-[11px] font-bold p-3.5"
                                rows="3"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto order-2 sm:order-1">
                            Abort
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl font-black text-[10px] uppercase w-full sm:w-auto px-10 shadow-lg order-1 sm:order-2">
                            Commit Record
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
