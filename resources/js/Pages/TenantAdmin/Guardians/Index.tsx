import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, Users } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    nis: string | null;
    pivot?: {
        relationship: string;
    };
}

interface Guardian {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    job: string | null;
    address: string | null;
    students: Student[];
}

interface Props {
    guardians: {
        data: Guardian[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    students: Student[];
    filters: {
        search?: string;
    };
}

export default function Index({ guardians, students, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Guardian | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<Guardian | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        job: '',
        address: '',
        students: [] as { id: string; relationship: string }[],
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/guardians', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record: Guardian) => {
        clearErrors();
        setEditingRecord(record);
        
        // Map relasi existing ke format form
        const mappedStudents = record.students.map(s => ({
            id: s.id,
            relationship: s.pivot?.relationship || 'Wali'
        }));

        setData({
            name: record.name,
            email: record.email || '',
            phone: record.phone || '',
            job: record.job || '',
            address: record.address || '',
            students: mappedStudents,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRecord) {
            put(`/guardians/${editingRecord.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/guardians', { onSuccess: () => closeModal() });
        }
    };

    const confirmDelete = (record: Guardian) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        if (recordToDelete) {
            destroy(`/guardians/${recordToDelete.id}`, { onSuccess: () => setIsDeleteModalOpen(false) });
        }
    };

    // Fungsi tambahan untuk Form Pivot Siswa
    const addStudentRow = () => {
        setData('students', [...data.students, { id: '', relationship: 'Wali' }]);
    };

    const removeStudentRow = (index: number) => {
        const newStudents = [...data.students];
        newStudents.splice(index, 1);
        setData('students', newStudents);
    };

    const handleStudentChange = (index: number, field: string, value: string) => {
        const newStudents = [...data.students];
        newStudents[index] = { ...newStudents[index], [field]: value };
        setData('students', newStudents);
    };

    return (
        <AuthenticatedLayout header="Data Orang Tua / Wali">
            <Head title="Data Orang Tua" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                <div className="p-5 border-b border-[#E2DDD0] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A296]" />
                        <input
                            type="text"
                            placeholder="Cari nama atau telepon..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none transition-all"
                        />
                    </form>

                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-[#16213E] hover:bg-[#1C2A4F] text-[#D4AF7A] px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Orang Tua
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#5B5648]">
                        <thead className="bg-[#FAF8F3] text-[#16213E] font-semibold border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4">Nama Lengkap</th>
                                <th className="px-6 py-4">Kontak</th>
                                <th className="px-6 py-4">Pekerjaan</th>
                                <th className="px-6 py-4">Anak (Siswa)</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD0]">
                            {guardians.data.length > 0 ? (
                                guardians.data.map((record) => (
                                    <tr key={record.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-[#16213E]">{record.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span>{record.phone || '-'}</span>
                                                <span className="text-xs text-[#A8A296]">{record.email || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{record.job || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {record.students.map(s => (
                                                    <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        {s.name} ({s.pivot?.relationship})
                                                    </span>
                                                ))}
                                                {record.students.length === 0 && <span className="text-xs text-gray-400 italic">Belum dihubungkan</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(record)} className="p-1.5 text-[#8B93A8] hover:text-[#B8935F] hover:bg-[#FAF8F3] rounded-md transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => confirmDelete(record)} className="p-1.5 text-[#8B93A8] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <Users className="w-12 h-12 mx-auto text-[#E2DDD0] mb-3" />
                                        Belum ada data orang tua atau wali.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {guardians.links && guardians.links.length > 3 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-end">
                        <div className="flex gap-1">
                            {guardians.links.map((link, k) => (
                                <button
                                    key={k}
                                    disabled={link.url === null}
                                    onClick={() => router.get(link.url)}
                                    className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-[#16213E] text-[#D4AF7A]' : 'text-[#5B5648] hover:bg-[#FAF8F3]'} disabled:opacity-50`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden my-auto">
                        <div className="px-6 py-4 border-b border-[#E2DDD0] flex justify-between items-center bg-[#FAF8F3] sticky top-0 z-10">
                            <h3 className="font-serif font-semibold text-[#16213E]">
                                {editingRecord ? 'Edit Data Orang Tua' : 'Tambah Orang Tua'}
                            </h3>
                            <button onClick={closeModal} className="text-[#8B93A8] hover:text-[#16213E]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Nama Lengkap Orang Tua <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" required />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">No. Handphone / WhatsApp</label>
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Email (Opsional)</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Pekerjaan</label>
                                    <input type="text" value={data.job} onChange={e => setData('job', e.target.value)} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#5B5648] mb-1">Alamat Rumah</label>
                                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="w-full px-4 py-2 bg-[#FAF8F3] border border-[#E2DDD0] rounded-lg text-sm focus:border-[#B8935F] outline-none resize-none"></textarea>
                                </div>

                                {/* Bagian Relasi Anak (Pivot) */}
                                <div className="md:col-span-2 mt-4 pt-4 border-t border-[#E2DDD0]">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-sm font-semibold text-[#16213E]">Hubungkan dengan Siswa (Anak)</label>
                                        <button type="button" onClick={addStudentRow} className="text-xs font-semibold text-[#B8935F] hover:text-[#9A7A4E] bg-[#FAF8F3] px-2 py-1 rounded border border-[#E2DDD0]">
                                            + Tambah Siswa
                                        </button>
                                    </div>
                                    
                                    {data.students.length === 0 && (
                                        <p className="text-xs text-[#8B93A8] italic">Belum ada siswa yang dihubungkan.</p>
                                    )}

                                    {data.students.map((studentRow, idx) => (
                                        <div key={idx} className="flex gap-3 mb-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                            <div className="flex-1">
                                                <select 
                                                    value={studentRow.id} 
                                                    onChange={e => handleStudentChange(idx, 'id', e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#E2DDD0] rounded text-sm focus:border-[#B8935F] outline-none"
                                                >
                                                    <option value="">-- Pilih Anak (Siswa) --</option>
                                                    {students.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name} {s.nis ? `(${s.nis})` : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-32">
                                                <select 
                                                    value={studentRow.relationship} 
                                                    onChange={e => handleStudentChange(idx, 'relationship', e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-white border border-[#E2DDD0] rounded text-sm focus:border-[#B8935F] outline-none"
                                                >
                                                    <option value="Ayah">Ayah</option>
                                                    <option value="Ibu">Ibu</option>
                                                    <option value="Wali">Wali</option>
                                                </select>
                                            </div>
                                            <button type="button" onClick={() => removeStudentRow(idx)} className="text-red-400 hover:text-red-600 p-1">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-[#5B5648] hover:bg-[#FAF8F3] rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#B8935F] hover:bg-[#A37F4B] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-serif font-semibold text-lg text-[#16213E] mb-2">Hapus Data?</h3>
                        <p className="text-sm text-[#8B93A8] mb-6">
                            Yakin ingin menghapus <span className="font-semibold text-[#16213E]">{recordToDelete?.name}</span>? Data yang dihapus tidak dapat dikembalikan.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#5B5648] bg-[#FAF8F3] hover:bg-[#E2DDD0] rounded-lg transition-colors">
                                Batal
                            </button>
                            <button onClick={executeDelete} disabled={processing} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
