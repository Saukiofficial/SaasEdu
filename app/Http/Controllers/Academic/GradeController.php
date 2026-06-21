<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Services\GradeService;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    protected GradeService $gradeService;

    public function __construct(GradeService $gradeService)
    {
        $this->gradeService = $gradeService;
    }

    public function index(Request $request)
    {
        $classroomId = $request->query('classroom_id');
        $subjectId = $request->query('subject_id');
        $type = $request->query('type');

        $classrooms = Classroom::all();
        $subjects = Subject::where('is_active', true)->get();
        
        $data = $this->gradeService->getGradeDataForm($classroomId, $subjectId, $type);

        return Inertia::render('Academic/Grades/Index', [
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'students' => $data['students'],
            'existing_grades' => $data['existing_grades'],
            'active_year' => $data['active_year'],
            'filters' => [
                'classroom_id' => $classroomId,
                'subject_id' => $subjectId,
                'type' => $type,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'type' => 'required|string',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.score' => 'required|numeric|min:0|max:100',
            'grades.*.description' => 'nullable|string|max:500',
        ]);

        try {
            $this->gradeService->saveBulkGrades($validated);
            return redirect()->back()->with('message', 'Nilai berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}