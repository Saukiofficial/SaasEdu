<?php

namespace App\Services;

use App\Repositories\Contracts\InvoiceRepositoryInterface;
use App\Models\Student;
use App\Models\AcademicYear;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InvoiceService extends BaseService
{
    protected InvoiceRepositoryInterface $invoiceRepository;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository)
    {
        $this->invoiceRepository = $invoiceRepository;
    }

    public function getInvoices(array $filters = [])
    {
        return $this->invoiceRepository->getPaginatedInvoices(15, $filters);
    }

    public function generateBulkInvoices(array $data)
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            throw new \Exception('Tidak ada Tahun Ajaran aktif. Harap atur di Master Data.');
        }

        $schoolId = Auth::user()->school_id;

        // Ambil semua siswa aktif di kelas tersebut
        $students = Student::where('classroom_id', $data['classroom_id'])
                           ->where('status', 'active')
                           ->get();

        if ($students->isEmpty()) {
            throw new \Exception('Tidak ada siswa aktif di kelas yang dipilih.');
        }

        DB::beginTransaction();
        try {
            foreach ($students as $student) {
                $this->invoiceRepository->create([
                    'school_id' => $schoolId,
                    'student_id' => $student->id,
                    'academic_year_id' => $activeYear->id,
                    'invoice_number' => $this->invoiceRepository->generateInvoiceNumber($schoolId),
                    'title' => $data['title'],
                    'amount' => $data['amount'],
                    'status' => 'unpaid',
                    'due_date' => $data['due_date'],
                    'notes' => $data['notes'] ?? null,
                ]);
            }
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    public function deleteInvoice(string $id)
    {
        return $this->invoiceRepository->delete($id);
    }
}