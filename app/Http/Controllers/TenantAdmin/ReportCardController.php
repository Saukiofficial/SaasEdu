<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\ReportCardService;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportCardController extends Controller
{
    public function __construct(
        protected ReportCardService $reportCardService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        $filters = $request->only(['academic_year_id', 'classroom_id']);
        
        $academicYears = AcademicYear::where('school_id', $schoolId)->orderByDesc('start_date')->get(['id', 'name', 'is_active']);
        $classrooms = Classroom::where('school_id', $schoolId)->orderBy('level')->orderBy('name')->get(['id', 'name', 'level']);

        $students = [];
        if (!empty($filters['academic_year_id']) && !empty($filters['classroom_id'])) {
            $students = $this->reportCardService->getStudentListWithAverages($schoolId, $filters['academic_year_id'], $filters['classroom_id']);
        }

        return Inertia::render('TenantAdmin/ReportCards/Index', [
            'academicYears' => $academicYears,
            'classrooms' => $classrooms,
            'students' => $students,
            'filters' => $filters,
        ]);
    }

    public function show(Request $request, string $studentId)
    {
        $schoolId = auth()->user()->school_id;
        $academicYearId = $request->query('academic_year_id');

        if (!$academicYearId) {
            return redirect()->route('report-cards.index')->with('error', 'Tahun ajaran tidak valid.');
        }

        $academicYear = AcademicYear::findOrFail($academicYearId);
        $schoolProfile = SchoolProfile::where('school_id', $schoolId)->first();
        
        $reportData = $this->reportCardService->getStudentReportCard($studentId, $schoolId, $academicYearId);

        return Inertia::render('TenantAdmin/ReportCards/Show', [
            'academicYear' => $academicYear,
            'schoolProfile' => $schoolProfile,
            'reportData' => $reportData,
        ]);
    }
}