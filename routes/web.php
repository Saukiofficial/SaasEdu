<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\MasterData\AcademicYearController;
use App\Http\Controllers\MasterData\SubjectController;
use App\Http\Controllers\MasterData\ClassroomController;
use App\Http\Controllers\Public\PPDBController;
use App\Http\Controllers\Admin\PPDBAdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\Academic\ScheduleController;
use App\Http\Controllers\Academic\AttendanceController;
use App\Http\Controllers\Academic\GradeController;
use App\Http\Controllers\Academic\ReportCardController;
use App\Http\Controllers\Finance\InvoiceController;
use App\Http\Controllers\Finance\PaymentController;
use App\Http\Controllers\Lms\StudyMaterialController;
use App\Http\Controllers\Lms\ExamController;
use App\Http\Controllers\SuperAdmin\TenantController; // Import Controller Super Admin
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { return Inertia::render('Welcome'); });

// --- PUBLIC ROUTES ---
Route::get('/ppdb/{school}', [PPDBController::class, 'showLanding'])->name('ppdb.landing');
Route::post('/ppdb/{school}', [PPDBController::class, 'store'])->name('ppdb.store');

// --- GUEST ROUTES ---
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// --- AUTH ROUTES ---
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', function () { return Inertia::render('Dashboard'); })->name('dashboard');

    // --- SUPER ADMIN ROUTES ---
    Route::prefix('super-admin')->name('super-admin.')->group(function () {
        Route::get('/tenants', [TenantController::class, 'index'])->name('tenants.index');
    });

    // --- TENANT (SCHOOL) ROUTES ---
    // Group Master Data
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::resource('academic-years', AcademicYearController::class)->except(['create', 'show', 'edit']);
        Route::resource('subjects', SubjectController::class)->except(['create', 'show', 'edit']);
        Route::resource('classrooms', ClassroomController::class)->except(['create', 'show', 'edit']);
    });

    // Group Admin PPDB
    Route::prefix('admin/ppdb')->name('admin.ppdb.')->group(function () {
        Route::get('/', [PPDBAdminController::class, 'index'])->name('index');
        Route::put('/{admission}/status', [PPDBAdminController::class, 'updateStatus'])->name('update-status');
    });

    // Modul Siswa & Guru
    Route::resource('students', StudentController::class)->except(['create', 'show', 'edit']);
    Route::resource('teachers', TeacherController::class)->except(['create', 'show', 'edit']);

    // Modul Akademik & Rapor
    Route::resource('schedules', ScheduleController::class)->except(['create', 'show', 'edit']);
    Route::get('/attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::post('/attendances', [AttendanceController::class, 'store'])->name('attendances.store');
    Route::get('/grades', [GradeController::class, 'index'])->name('grades.index');
    Route::post('/grades', [GradeController::class, 'store'])->name('grades.store');
    Route::get('/report-cards', [ReportCardController::class, 'index'])->name('report-cards.index');
    Route::get('/report-cards/{student}/print', [ReportCardController::class, 'printPdf'])->name('report-cards.print');

    // Modul Keuangan
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');

    // Modul LMS (E-Learning)
    Route::resource('study-materials', StudyMaterialController::class)->except(['create', 'show', 'edit']); 
    Route::resource('exams', ExamController::class)->except(['create', 'show', 'edit']);
});