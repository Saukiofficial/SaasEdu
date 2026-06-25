<?php

namespace App\Http\Controllers\TenantStudent;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamAnswer;
use App\Models\ExamQuestion;
use App\Models\ExamOption;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CbtController extends Controller
{
    // Simulasi mendapatkan ID Siswa (Nantinya diganti dengan auth()->user()->student->id)
    private function getStudentId()
    {
        if (!auth()->check()) return null;
        
        $schoolId = auth()->user()->school_id;
        $student = Student::where('school_id', $schoolId)->first();
        return $student ? $student->id : null;
    }

    public function index()
    {
        $schoolId = auth()->user()->school_id;
        $studentId = $this->getStudentId();
        
        $student = Student::find($studentId);

        // Jika tidak ada data siswa untuk simulasi, arahkan ke dashboard dengan pesan yang jelas
        if (!$student) {
            return redirect('/dashboard')->with('error', 'Tidak dapat memulai CBT. Anda harus memiliki minimal 1 data siswa untuk menjalankan simulasi pengerjaan ujian.');
        }

        // Ambil ujian yang aktif dan sesuai dengan kelas siswa
        $exams = Exam::with('subject')
            ->where('school_id', $schoolId)
            ->where('classroom_id', $student->classroom_id)
            ->where('is_active', true)
            ->get();

        // Ambil riwayat pengerjaan
        $attempts = ExamAttempt::where('student_id', $studentId)
            ->get()
            ->keyBy('exam_id');

        return Inertia::render('TenantStudent/Cbt/Index', [
            'exams' => $exams,
            'attempts' => $attempts,
        ]);
    }

    public function play(string $examId)
    {
        $studentId = $this->getStudentId();
        $exam = Exam::with(['subject'])->findOrFail($examId);

        // Buat atau ambil sesi pengerjaan (Attempt)
        $attempt = ExamAttempt::firstOrCreate(
            ['exam_id' => $examId, 'student_id' => $studentId],
            ['status' => 'in_progress', 'started_at' => now()]
        );

        // Jika sudah selesai, kembalikan ke index CBT
        if ($attempt->status === 'completed') {
            return redirect('/student/cbt')->with('error', 'Ujian ini sudah Anda kerjakan.');
        }

        // Ambil soal beserta pilihan ganda
        $questions = ExamQuestion::with('options')->where('exam_id', $examId)->get();

        // PENTING: Sembunyikan 'is_correct' dari data opsi agar siswa tidak bisa curang via Inspect Element!
        $questions->transform(function ($q) {
            $q->options->transform(function ($opt) {
                unset($opt->is_correct);
                return $opt;
            });
            return $q;
        });

        // Ambil jawaban yang sudah pernah dipilih (jika siswa refresh halaman)
        $savedAnswers = ExamAnswer::where('exam_attempt_id', $attempt->id)
            ->pluck('exam_option_id', 'exam_question_id');

        // Hitung sisa waktu
        $timeLimit = $attempt->started_at->addMinutes($exam->duration);
        $timeRemainingMs = max(0, $timeLimit->timestamp - now()->timestamp) * 1000;

        return Inertia::render('TenantStudent/Cbt/Play', [
            'exam' => $exam,
            'attempt' => $attempt,
            'questions' => $questions,
            'savedAnswers' => $savedAnswers,
            'timeRemainingMs' => $timeRemainingMs,
        ]);
    }

    public function answer(Request $request, string $examId)
    {
        $studentId = $this->getStudentId();
        $attempt = ExamAttempt::where('exam_id', $examId)->where('student_id', $studentId)->firstOrFail();

        if ($attempt->status === 'completed') {
            return response()->json(['message' => 'Ujian sudah selesai.'], 403);
        }

        $request->validate([
            'question_id' => 'required|uuid|exists:exam_questions,id',
            'option_id' => 'required|uuid|exists:exam_options,id',
        ]);

        // Cek apakah jawaban benar
        $option = ExamOption::findOrFail($request->option_id);

        ExamAnswer::updateOrCreate(
            [
                'exam_attempt_id' => $attempt->id,
                'exam_question_id' => $request->question_id,
            ],
            [
                'exam_option_id' => $request->option_id,
                'is_correct' => $option->is_correct,
            ]
        );

        return response()->json(['message' => 'Jawaban disimpan.']);
    }

    public function finish(Request $request, string $examId)
    {
        $studentId = $this->getStudentId();
        $attempt = ExamAttempt::where('exam_id', $examId)->where('student_id', $studentId)->firstOrFail();

        // Hitung total nilai
        $totalQuestions = ExamQuestion::where('exam_id', $examId)->count();
        $correctAnswers = ExamAnswer::where('exam_attempt_id', $attempt->id)->where('is_correct', true)->count();
        
        $score = $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 100 : 0;

        $attempt->update([
            'status' => 'completed',
            'finished_at' => now(),
            'score' => $score,
        ]);

        return redirect('/student/cbt')->with('success', 'Ujian selesai. Nilai Anda telah direkam.');
    }
}