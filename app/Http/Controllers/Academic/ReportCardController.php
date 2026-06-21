<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Services\ReportCardService;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportCardController extends Controller
{
    protected ReportCardService $reportCardService;

    public function __construct(ReportCardService $reportCardService)
    {
        $this->reportCardService = $reportCardService;
    }

    public function index(Request $request)
    {
        $classroomId = $request->query('classroom_id');
        $studentId = $request->query('student_id');

        $classrooms = Classroom::all();
        $students = [];
        $reportData = null;

        if ($classroomId) {
            $students = Student::where('classroom_id', $classroomId)
                               ->where('status', 'active')
                               ->orderBy('name')
                               ->get();
        }

        if ($studentId) {
            try {
                $reportData = $this->reportCardService->getStudentReportData($studentId);
            } catch (\Exception $e) {
                return redirect()->back()->withErrors(['error' => $e->getMessage()]);
            }
        }

        return Inertia::render('Academic/ReportCards/Index', [
            'classrooms' => $classrooms,
            'students' => $students,
            'reportData' => $reportData,
            'filters' => [
                'classroom_id' => $classroomId,
                'student_id' => $studentId,
            ]
        ]);
    }

    public function printPdf(string $studentId)
    {
        try {
            $data = $this->reportCardService->getStudentReportData($studentId);
            
            // Generate PDF menggunakan view Blade
            $pdf = Pdf::loadView('pdf.rapor', $data);
            
            // Nama file PDF
            $fileName = 'Rapor_' . str_replace(' ', '_', $data['student']->name) . '.pdf';
            
            // Download file
            return $pdf->download($fileName);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal mencetak rapor: ' . $e->getMessage()]);
        }
    }
}
