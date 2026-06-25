<?php

namespace App\Http\Controllers\TenantAdmin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamQuestionController extends Controller
{
    public function index(Request $request, string $examId)
    {
        $schoolId = auth()->user()->school_id;

        // Pastikan ujian ini milik sekolah yang bersangkutan
        $exam = Exam::with(['subject', 'classroom'])->where('school_id', $schoolId)->findOrFail($examId);

        $questions = ExamQuestion::with('options')
            ->where('exam_id', $examId)
            ->oldest() // Urutkan dari yang pertama dibuat
            ->get();

        return Inertia::render('TenantAdmin/Exams/Questions', [
            'exam' => $exam,
            'questions' => $questions,
        ]);
    }

    public function store(Request $request, string $examId)
    {
        $request->validate([
            'question' => 'required|string',
            'options' => 'required|array|min:2', // Minimal ada 2 pilihan
            'options.*.option_text' => 'required|string|max:255',
            'options.*.is_correct' => 'required|boolean',
        ]);

        // Pastikan minimal ada 1 jawaban benar
        $hasCorrectAnswer = collect($request->options)->contains('is_correct', true);
        if (!$hasCorrectAnswer) {
            return redirect()->back()->withErrors(['options' => 'Minimal harus ada 1 pilihan yang disetel sebagai jawaban benar.']);
        }

        DB::transaction(function () use ($request, $examId) {
            $question = ExamQuestion::create([
                'exam_id' => $examId,
                'question' => $request->question,
            ]);

            foreach ($request->options as $option) {
                $question->options()->create([
                    'option_text' => $option['option_text'],
                    'is_correct' => $option['is_correct'],
                ]);
            }
        });

        return redirect()->back()->with('success', 'Soal berhasil ditambahkan.');
    }

    public function update(Request $request, string $examId, string $questionId)
    {
        $request->validate([
            'question' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*.option_text' => 'required|string|max:255',
            'options.*.is_correct' => 'required|boolean',
        ]);

        DB::transaction(function () use ($request, $questionId) {
            $question = ExamQuestion::findOrFail($questionId);
            $question->update(['question' => $request->question]);

            // Untuk kemudahan, kita hapus opsi lama dan buat opsi baru
            // (Aman jika belum ada siswa yang mengerjakan. Jika sudah mengerjakan, status ujian harus dilock)
            $question->options()->delete();

            foreach ($request->options as $option) {
                $question->options()->create([
                    'option_text' => $option['option_text'],
                    'is_correct' => $option['is_correct'],
                ]);
            }
        });

        return redirect()->back()->with('success', 'Soal berhasil diperbarui.');
    }

    public function destroy(string $examId, string $questionId)
    {
        $question = ExamQuestion::findOrFail($questionId);
        $question->delete();

        return redirect()->back()->with('success', 'Soal berhasil dihapus.');
    }
}
