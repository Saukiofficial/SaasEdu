import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { LayoutDashboard, Download, Clock, CheckCircle2, ShieldAlert, FileText, Code } from 'lucide-react';

interface SourceCode {
    id: string;
    title: string;
    thumbnail: string | null;
}

interface Order {
    id: string;
    order_number: string;
    amount: string;
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    created_at: string;
    sourceCode: SourceCode;
}

interface Props {
    orders: Order[];
}

export default function CustomerDashboard({ orders }: Props) {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount));
    };

    return (
        <AuthenticatedLayout header="Dashboard Pembelian">
            <Head title="Customer Portal - AkademiaOS" />

            {/* Banner Penyambutan */}
            <div className="bg-[#1C2333] rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#B8935F]/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-2">Selamat Datang di Customer Portal</h2>
                        <p className="text-[#A9B2C7] text-sm max-w-xl leading-relaxed">Ini adalah ruang khusus Anda untuk memantau status pesanan, riwayat transaksi, serta mengunduh seluruh source code dan produk digital yang telah Anda beli.</p>
                    </div>
                    <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-xl backdrop-blur-sm text-center min-w-[200px]">
                        <p className="text-xs text-[#D4AF7A] font-semibold uppercase tracking-wider mb-1">Total Produk</p>
                        <p className="text-3xl font-bold font-mono">{orders.filter(o => o.status === 'paid').length}</p>
                    </div>
                </div>
            </div>

            {/* Daftar Produk yang Dibeli */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E2DDD0] overflow-hidden">
                <div className="p-6 border-b border-[#E2DDD0] flex items-center gap-3 bg-[#FAF8F3]">
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E2DDD0] flex items-center justify-center">
                        <Code className="w-5 h-5 text-[#B8935F]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-serif font-semibold text-[#1C2333]">Riwayat Pembelian & Download</h3>
                        <p className="text-xs text-[#8B93A8]">Produk yang Anda beli akan muncul di sini</p>
                    </div>
                </div>

                <div className="p-6">
                    {orders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-[#E2DDD0] rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                                    <div className="h-40 bg-gray-100 relative">
                                        {order.sourceCode?.thumbnail ? (
                                            <img src={order.sourceCode.thumbnail} alt={order.sourceCode.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">No Image</div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            {order.status === 'paid' ? (
                                                <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> LUNAS</span>
                                            ) : (
                                                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1"><Clock className="w-3 h-3"/> MENUNGGU PEMBAYARAN</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h4 className="font-bold text-[#1C2333] text-lg mb-2 line-clamp-2">{order.sourceCode?.title || 'Produk Tidak Diketahui'}</h4>
                                        <div className="text-xs text-[#8B93A8] mb-4 space-y-1.5 flex-1">
                                            <p className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Order ID: {order.order_number}</p>
                                            <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Dibeli pada: {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                                            <p className="font-semibold text-[#B8935F] mt-2 text-sm">{formatCurrency(order.amount)}</p>
                                        </div>
                                        
                                        {order.status === 'paid' ? (
                                            <a 
                                                href={`/customer/orders/${order.id}/download`}
                                                className="w-full bg-[#1C2333] hover:bg-[#2A344A] text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Download className="w-4 h-4" /> Unduh Source Code
                                            </a>
                                        ) : (
                                            <div className="w-full bg-gray-100 text-gray-500 border border-gray-200 font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                                <ShieldAlert className="w-4 h-4" /> File Dikunci
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-[#E2DDD0] rounded-xl">
                            <LayoutDashboard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-[#1C2333] mb-1">Belum Ada Transaksi</h3>
                            <p className="text-sm text-[#8B93A8]">Anda belum memiliki riwayat pembelian produk digital kami.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
