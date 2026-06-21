<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rapor Siswa - {{ $student->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .header p { margin: 2px 0; font-size: 12px; }
        
        .student-info { width: 100%; margin-bottom: 20px; }
        .student-info td { padding: 3px; }
        .student-info .label { width: 120px; font-weight: bold; }
        
        .table-grades { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table-grades th, .table-grades td { border: 1px solid #999; padding: 8px; text-align: center; }
        .table-grades th { background-color: #f0f0f0; }
        .table-grades td.subject-name { text-align: left; font-weight: bold; }
        
        .footer { width: 100%; margin-top: 50px; }
        .footer td { width: 33%; text-align: center; vertical-align: bottom; height: 100px; }
        .signature-line { border-bottom: 1px solid #333; width: 80%; margin: 0 auto; display: inline-block; margin-bottom: 5px; }
    </style>
</head>
<body>

    <div class="header">
        <h1>LAPORAN HASIL BELAJAR SISWA</h1>
        <p>Tahun Ajaran: {{ $academic_year->name }}</p>
    </div>

    <table class="student-info">
        <tr>
            <td class="label">Nama Siswa</td>
            <td>: {{ $student->name }}</td>
            <td class="label">Kelas</td>
            <td>: {{ $student->classroom ? $student->classroom->name : '-' }}</td>
        </tr>
        <tr>
            <td class="label">NIS / NISN</td>
            <td>: {{ $student->nis ?? '-' }} / {{ $student->nisn ?? '-' }}</td>
            <td class="label">Semester</td>
            <td>: Aktif</td>
        </tr>
    </table>

    <table class="table-grades">
        <thead>
            <tr>
                <th rowspan="2">No</th>
                <th rowspan="2">Mata Pelajaran</th>
                <th colspan="5">Nilai Akademik</th>
            </tr>
            <tr>
                <th>Tugas 1</th>
                <th>Tugas 2</th>
                <th>Tugas 3</th>
                <th>UTS</th>
                <th>UAS</th>
            </tr>
        </thead>
        <tbody>
            @php $no = 1; @endphp
            @forelse($grades as $subject => $scores)
                <tr>
                    <td>{{ $no++ }}</td>
                    <td class="subject-name">{{ $subject }}</td>
                    <td>{{ isset($scores['Tugas 1']) ? number_format($scores['Tugas 1'], 0) : '-' }}</td>
                    <td>{{ isset($scores['Tugas 2']) ? number_format($scores['Tugas 2'], 0) : '-' }}</td>
                    <td>{{ isset($scores['Tugas 3']) ? number_format($scores['Tugas 3'], 0) : '-' }}</td>
                    <td>{{ isset($scores['UTS']) ? number_format($scores['UTS'], 0) : '-' }}</td>
                    <td>{{ isset($scores['UAS']) ? number_format($scores['UAS'], 0) : '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7">Belum ada data nilai pada semester ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="footer">
        <tr>
            <td>
                Mengetahui,<br>
                <strong>Orang Tua / Wali</strong>
                <br><br><br><br>
                <span class="signature-line"></span>
            </td>
            <td></td>
            <td>
                Diberikan di: .......................<br>
                Tanggal: {{ date('d F Y') }}<br>
                <strong>Wali Kelas</strong>
                <br><br><br><br>
                <span class="signature-line"></span>
            </td>
        </tr>
    </table>

</body>
</html>
