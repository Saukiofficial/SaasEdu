<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class LandingPageSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Hero
            ['key' => 'hero_title', 'value' => 'Platform all-in-one untuk menjalankan dan mengembangkan akademi Anda.', 'group' => 'landing_page'],
            ['key' => 'hero_subtitle', 'value' => 'AkademiaOS membantu institusi pendidikan mengelola semuanya di satu tempat — siswa, kelas, nilai, keuangan, dan banyak lagi.', 'group' => 'landing_page'],
            
            // Partners
            ['key' => 'partner_1_name', 'value' => 'Universitas Indonesia', 'group' => 'landing_page'],
            ['key' => 'partner_2_name', 'value' => 'Kementerian Pendidikan', 'group' => 'landing_page'],
            ['key' => 'partner_3_name', 'value' => 'SMA Nusantara', 'group' => 'landing_page'],
            ['key' => 'partner_4_name', 'value' => 'Global EduTech', 'group' => 'landing_page'],
            ['key' => 'partner_5_name', 'value' => 'Eduspace Academy', 'group' => 'landing_page'],
            
            // Features
            ['key' => 'feature_1_title', 'value' => 'Manajemen Siswa', 'group' => 'landing_page'],
            ['key' => 'feature_1_desc', 'value' => 'Kelola data siswa, pendaftaran, kehadiran, dan komunikasi dengan mudah.', 'group' => 'landing_page'],
            ['key' => 'feature_2_title', 'value' => 'Manajemen Kelas', 'group' => 'landing_page'],
            ['key' => 'feature_2_desc', 'value' => 'Buat, atur, dan kelola kelas, jurusan, serta program akademik.', 'group' => 'landing_page'],
            ['key' => 'feature_3_title', 'value' => 'Ujian & Tugas', 'group' => 'landing_page'],
            ['key' => 'feature_3_desc', 'value' => 'Berikan tugas, pantau pengumpulan, dan lakukan ujian (CBT) di satu tempat.', 'group' => 'landing_page'],
            ['key' => 'feature_4_title', 'value' => 'Keuangan & SPP', 'group' => 'landing_page'],
            ['key' => 'feature_4_desc', 'value' => 'Otomatisasi penagihan SPP, lacak pembayaran, dan kelola operasional finansial.', 'group' => 'landing_page'],
            ['key' => 'feature_5_title', 'value' => 'Laporan Analitik', 'group' => 'landing_page'],
            ['key' => 'feature_5_desc', 'value' => 'Dapatkan wawasan real-time dengan laporan kuat dan dasbor interaktif.', 'group' => 'landing_page'],
            ['key' => 'feature_6_title', 'value' => 'Kalender & Event', 'group' => 'landing_page'],
            ['key' => 'feature_6_desc', 'value' => 'Atur kalender akademik, kelola acara, dan kirimkan notifikasi penting.', 'group' => 'landing_page'],
            
            // Stats
            ['key' => 'stat_1_value', 'value' => '500+', 'group' => 'landing_page'],
            ['key' => 'stat_1_label', 'value' => 'Institusi Terdaftar', 'group' => 'landing_page'],
            ['key' => 'stat_2_value', 'value' => '200K+', 'group' => 'landing_page'],
            ['key' => 'stat_2_label', 'value' => 'Siswa Aktif', 'group' => 'landing_page'],
            ['key' => 'stat_3_value', 'value' => '10M+', 'group' => 'landing_page'],
            ['key' => 'stat_3_label', 'value' => 'Transaksi Sukses', 'group' => 'landing_page'],
            ['key' => 'stat_4_value', 'value' => '98%', 'group' => 'landing_page'],
            ['key' => 'stat_4_label', 'value' => 'Kepuasan Pengguna', 'group' => 'landing_page'],

            // Testimonials
            ['key' => 'testi_1_text', 'value' => 'AkademiaOS mengubah cara kami mengelola institusi. Semuanya sekarang efisien dan terpadu. Proses onboardingnya juga sangat mulus.', 'group' => 'landing_page'],
            ['key' => 'testi_1_author', 'value' => 'Dr. Emily Carter', 'group' => 'landing_page'],
            ['key' => 'testi_1_role', 'value' => 'Kepala Sekolah, Westbridge', 'group' => 'landing_page'],
            ['key' => 'testi_2_text', 'value' => 'Fiturnya sangat kuat, namun sangat mudah digunakan. Staf dan siswa kami menyukai pengalaman modern ini. Sangat direkomendasikan.', 'group' => 'landing_page'],
            ['key' => 'testi_2_author', 'value' => 'Prof. Michael Lee', 'group' => 'landing_page'],
            ['key' => 'testi_2_role', 'value' => 'Dekan, Northfield College', 'group' => 'landing_page'],
            ['key' => 'testi_3_text', 'value' => 'Dukungan yang sangat baik, pembaruan rutin, dan platform yang benar-benar memahami kebutuhan operasional harian kami.', 'group' => 'landing_page'],
            ['key' => 'testi_3_author', 'value' => 'Sarah Johnson', 'group' => 'landing_page'],
            ['key' => 'testi_3_role', 'value' => 'Administrator, Lakeside', 'group' => 'landing_page'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
