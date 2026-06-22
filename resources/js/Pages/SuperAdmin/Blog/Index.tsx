import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FileEdit, Search, Filter, Trash2, Edit, Plus, X, Image as ImageIcon } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    status: 'draft' | 'published';
    created_at: string;
}

interface Props {
    blogs: {
        data: Blog[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function BlogIndex({ blogs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data, setData, post, delete: destroy, reset, errors, clearErrors } = useForm({
        _method: 'post', // Default method untuk handle form multi-part
        title: '',
        content: '',
        thumbnail: null as File | string | null,
        status: 'draft',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/super-admin/blogs', { search, status: statusFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setData('_method', 'post');
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (blog: Blog) => {
        clearErrors();
        setData({
            _method: 'put', // Method spoofing Laravel karena upload file via form
            title: blog.title,
            content: blog.content,
            thumbnail: null, // Kita set null agar input file di UI ter-reset
            status: blog.status,
        });
        setEditingId(blog.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            // Kita menggunakan 'post' karena HTML form tidak mendukung file upload via PUT
            // _method='put' yang ada di state akan memberi tahu Laravel untuk men-treatnya sebagai PUT
            post(`/super-admin/blogs/${editingId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/super-admin/blogs', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            destroy(`/super-admin/blogs/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Blog">
            <Head title="Blogs - Super Admin" />

            <div className="bg-white rounded-xl shadow-sm border border-[#E2DDD0] overflow-hidden relative">
                {/* Header Section */}
                <div className="p-6 border-b border-[#E2DDD0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#E2DDD0] flex items-center justify-center">
                            <FileEdit className="w-5 h-5 text-[#B8935F]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-[#1C2333]">Artikel Blog</h2>
                            <p className="text-xs text-[#8B93A8]">Kelola konten artikel dan pengumuman untuk Landing Page</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                            <div className="relative">
                                <Search className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                                <input
                                    type="text"
                                    placeholder="Cari judul artikel..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm w-full sm:w-48"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="h-4 w-4 text-gray-400 absolute inset-y-0 my-auto left-3" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 py-2 text-sm border-[#E2DDD0] focus:border-[#B8935F] focus:ring-[#B8935F] rounded-md shadow-sm"
                                >
                                    <option value="">Semua</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-[#FAF8F3] border border-[#E2DDD0] text-[#1C2333] hover:bg-[#E2DDD0] px-3 py-2 rounded-md text-sm transition-colors">
                                Filter
                            </button>
                        </form>
                        <button onClick={openCreateModal} className="bg-[#1C2333] hover:bg-[#2A344A] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                            <Plus className="w-4 h-4" /> Tambah Artikel
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#5B5648] uppercase bg-[#FAF8F3] border-b border-[#E2DDD0]">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-16">Image</th>
                                <th className="px-6 py-4 font-semibold">Judul & Slug</th>
                                <th className="px-6 py-4 font-semibold">Tanggal Dibuat</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.data.length > 0 ? (
                                blogs.data.map((blog) => (
                                    <tr key={blog.id} className="border-b border-[#E2DDD0] hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {blog.thumbnail ? (
                                                <img src={blog.thumbnail} alt={blog.title} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-[#1C2333]">{blog.title}</p>
                                            <p className="text-[10px] text-[#8B93A8] mt-0.5">/{blog.slug}</p>
                                        </td>
                                        <td className="px-6 py-4 text-[#5B5648]">
                                            {new Date(blog.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {blog.status === 'published' ? (
                                                <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md border border-green-200">Published</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border border-gray-200">Draft</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(blog)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#8B93A8]">
                                        <FileEdit className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Belum ada data artikel blog.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {blogs.last_page > 1 && (
                    <div className="p-4 border-t border-[#E2DDD0] flex justify-center">
                        <div className="flex gap-1">
                            {blogs.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 text-sm border rounded-md ${
                                        link.active ? 'bg-[#1C2333] text-white border-[#1C2333]' : 'bg-white text-[#5B5648] border-[#E2DDD0] hover:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[95vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-[#E2DDD0]">
                            <h3 className="text-lg font-serif font-semibold text-[#1C2333]">
                                {editingId ? 'Edit Artikel' : 'Tambah Artikel Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            <form id="blogForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#1C2333] mb-1">Judul Artikel</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        required
                                    />
                                    {errors.title && <span className="text-xs text-red-500 mt-1">{errors.title}</span>}
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-[#1C2333]">Konten Artikel</label>
                                    <div className="border border-[#E2DDD0] rounded-md overflow-hidden bg-white text-sm">
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={data.content}
                                            onChange={(event, editor) => {
                                                const contentData = editor.getData();
                                                setData('content', contentData);
                                            }}
                                            config={{
                                                toolbar: [
                                                    'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo'
                                                ]
                                            }}
                                        />
                                    </div>
                                    {errors.content && <span className="text-xs text-red-500 mt-1">{errors.content}</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1C2333] mb-1">Upload Thumbnail Gambar</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('thumbnail', e.target.files ? e.target.files[0] : null)}
                                            className="w-full text-sm rounded-md border border-[#E2DDD0] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#FAF8F3] file:text-[#1C2333] hover:file:bg-[#E2DDD0] transition-colors bg-white"
                                        />
                                        {editingId && (
                                            <p className="text-[10px] text-gray-500 mt-1 italic">
                                                * Biarkan kosong jika tidak ingin mengubah thumbnail saat ini.
                                            </p>
                                        )}
                                        {errors.thumbnail && <span className="text-xs text-red-500 mt-1">{errors.thumbnail}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1C2333] mb-1">Status Publikasi</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as 'draft' | 'published')}
                                            className="w-full rounded-md border-[#E2DDD0] shadow-sm focus:border-[#B8935F] focus:ring-[#B8935F] text-sm"
                                        >
                                            <option value="draft">Draft (Simpan sementara)</option>
                                            <option value="published">Published (Tayangkan)</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-[#E2DDD0] flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                            <button onClick={closeModal} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button form="blogForm" type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1C2333] rounded-md hover:bg-[#2A344A] transition-colors">
                                Simpan Artikel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}