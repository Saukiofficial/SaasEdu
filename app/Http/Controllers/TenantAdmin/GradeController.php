<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Services\GradeService;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function __construct(
        protected GradeService $gradeService
    ) {}

    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        
        // Ambil filter dari URL query
        $filters = $request->only(['academic_year_id', 'classroom_id', 'subject_id', 'teacher_id', 'type']);
        
        // Data referensi untuk dropdown filter
        $academicYears = AcademicYear::where('school_id', $schoolId)->orderByDesc('start_date')->get(['id', 'name', 'is_active']);
        $classrooms = Classroom::where('school_id', $schoolId)->orderBy('level')->orderBy('name')->get(['id', 'name', 'level']);
        $subjects = Subject::where('school_id', $schoolId)->where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $teachers = Teacher::where('school_id', $schoolId)->where('status', 'active')->orderBy('name')->get(['id', 'name']);
        
        // Opsi Tipe Penilaian
        $types = ['Tugas 1', 'Tugas 2', 'Tugas 3', 'Tugas 4', 'Ulangan Harian 1', 'Ulangan Harian 2', 'UTS', 'UAS'];

        // Jika semua filter esensial terisi, ambil data siswa untuk diinput nilainya
        $studentsForm = $this->gradeService->getGradeForm($schoolId, $filters);

        return Inertia::render('TenantAdmin/Grades/Index', [
            'academicYears' => $academicYears,
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'types' => $types,
            'studentsForm' => $studentsForm,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = auth()->user()->school_id;

        $validated = $request->validate([
            'academic_year_id' => 'required|uuid|exists:academic_years,id',
            'classroom_id' => 'required|uuid|exists:classrooms,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'teacher_id' => 'required|uuid|exists:teachers,id',
            'type' => 'required|string|max:50',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|uuid|exists:students,id',
            'grades.*.score' => 'required|numeric|min:0|max:100',
            'grades.*.description' => 'nullable|string|max:255',
        ]);

        $this->gradeService->saveBulkGrades($schoolId, $validated);

        return redirect()->back()->with('success', 'Data nilai kelas berhasil disimpan.');
    }
}
