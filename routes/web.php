<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\TenantAdmin\AcademicYearController;
use App\Http\Controllers\TenantAdmin\SubjectController;
use App\Http\Controllers\TenantAdmin\ClassroomController;
use App\Http\Controllers\Public\PPDBController;
use App\Http\Controllers\Admin\PPDBAdminController;
use App\Http\Controllers\TenantAdmin\StudentController;
use App\Http\Controllers\TenantAdmin\GuardianController;
use App\Http\Controllers\TenantAdmin\MutationController;
use App\Http\Controllers\TenantAdmin\AlumniController;
use App\Http\Controllers\TenantAdmin\TeacherController;
use App\Http\Controllers\TenantAdmin\EmployeeController;
use App\Http\Controllers\TenantAdmin\StudentAttendanceController;
use App\Http\Controllers\TenantAdmin\TeacherAttendanceController;
use App\Http\Controllers\TenantAdmin\ScheduleController;
use App\Http\Controllers\Academic\AttendanceController;
use App\Http\Controllers\TenantAdmin\GradeController;
use App\Http\Controllers\TenantAdmin\ReportCardController;
use App\Http\Controllers\Finance\InvoiceController;
use App\Http\Controllers\Finance\PaymentController;
use App\Http\Controllers\TenantAdmin\StudyMaterialController;
use App\Http\Controllers\TenantAdmin\ExamController;
use App\Http\Controllers\TenantAdmin\ExamQuestionController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\LanguageSwitchController;
use App\Http\Controllers\TenantAdmin\MajorController;
use App\Http\Controllers\TenantAdmin\SchoolProfileController;
use App\Http\Controllers\TenantStudent\CbtController;
use App\Http\Controllers\Frontend\SourceCodeCheckoutController;
use App\Http\Controllers\Customer\CustomerDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FrontendController::class, 'welcome'])->name('home');
Route::get('/product/{slug}', [FrontendController::class, 'productDetail'])->name('product.detail');

// --- PUBLIC ROUTES ---
Route::get('/ppdb/{school}', [PPDBController::class, 'showLanding'])->name('ppdb.landing');
Route::post('/ppdb/{school}', [PPDBController::class, 'store'])->name('ppdb.store');
Route::post('/language/switch', [LanguageSwitchController::class, 'switch'])->name('language.switch');

Route::get('/product/{slug}/checkout', [SourceCodeCheckoutController::class, 'show'])->name('source-code.checkout');
Route::post('/product/{slug}/checkout', [SourceCodeCheckoutController::class, 'process']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/customer/dashboard', [CustomerDashboardController::class, 'index'])->name('customer.dashboard');
    Route::get('/customer/orders/{order}/download', [CustomerDashboardController::class, 'download'])->name('customer.download');
});

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
        Route::get('/tenants', [\App\Http\Controllers\SuperAdmin\TenantController::class, 'index'])->name('tenants.index');
        Route::put('/tenants/{tenant}/status', [\App\Http\Controllers\SuperAdmin\TenantController::class, 'updateStatus'])->name('tenants.update-status');
        
        Route::resource('packages', \App\Http\Controllers\SuperAdmin\PackageController::class)->except(['create', 'show', 'edit']);
        Route::resource('users', \App\Http\Controllers\SuperAdmin\UserController::class)->only(['index', 'destroy']);
        Route::resource('roles', \App\Http\Controllers\SuperAdmin\RoleController::class)->except(['create', 'show', 'edit']);
        Route::resource('staff', \App\Http\Controllers\SuperAdmin\StaffController::class)->except(['create', 'show', 'edit']);
        
        
        Route::get('/finance', [\App\Http\Controllers\SuperAdmin\FinanceController::class, 'index'])->name('finance.index');
        Route::put('/finance/{subscription}/status', [\App\Http\Controllers\SuperAdmin\FinanceController::class, 'updateStatus'])->name('finance.update-status');
        
        // Tambahkan baris ini untuk Modul Laporan & Analitik SaaS
        Route::get('/reports', [\App\Http\Controllers\SuperAdmin\ReportController::class, 'index'])->name('reports.index');

        // --- SETTINGS & BRANDING ---
        Route::get('/settings', [\App\Http\Controllers\SuperAdmin\SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\SuperAdmin\SettingController::class, 'update'])->name('settings.update');
        Route::get('branding', [\App\Http\Controllers\SuperAdmin\BrandingController::class, 'index'])->name('branding.index');
        Route::post('branding', [\App\Http\Controllers\SuperAdmin\BrandingController::class, 'update'])->name('branding.update');
        Route::get('localization', [\App\Http\Controllers\SuperAdmin\LocalizationController::class, 'index'])->name('localization.index');
        Route::post('localization', [\App\Http\Controllers\SuperAdmin\LocalizationController::class, 'store'])->name('localization.store');
        Route::put('localization/{language}', [\App\Http\Controllers\SuperAdmin\LocalizationController::class, 'update'])->name('localization.update');
        Route::put('localization/{language}/default', [\App\Http\Controllers\SuperAdmin\LocalizationController::class, 'setAsDefault'])->name('localization.default');
        Route::delete('localization/{language}', [\App\Http\Controllers\SuperAdmin\LocalizationController::class, 'destroy'])->name('localization.destroy');


        Route::resource('tickets', \App\Http\Controllers\SuperAdmin\TicketController::class)->only(['index', 'update', 'destroy']);
            
        // --- CRM & SALES ---
        Route::resource('leads', \App\Http\Controllers\SuperAdmin\LeadController::class)->only(['index', 'store', 'destroy']);
        Route::put('leads/{lead}/status', [\App\Http\Controllers\SuperAdmin\LeadController::class, 'updateStatus'])->name('leads.update-status');
        Route::get('demo-requests', [\App\Http\Controllers\SuperAdmin\DemoRequestController::class, 'index'])->name('demo-requests.index');
        Route::put('demo-requests/{demoRequest}/status', [\App\Http\Controllers\SuperAdmin\DemoRequestController::class, 'updateStatus'])->name('demo-requests.update-status');
        Route::delete('demo-requests/{demoRequest}', [\App\Http\Controllers\SuperAdmin\DemoRequestController::class, 'destroy'])->name('demo-requests.destroy');
        Route::get('prospects', [\App\Http\Controllers\SuperAdmin\ProspectController::class, 'index'])->name('prospects.index');
        Route::put('prospects/{prospect}/status', [\App\Http\Controllers\SuperAdmin\ProspectController::class, 'updateStatus'])->name('prospects.update-status');
        Route::delete('prospects/{prospect}', [\App\Http\Controllers\SuperAdmin\ProspectController::class, 'destroy'])->name('prospects.destroy');

        // --- SUBSCRIPTION & BILLING Module ---
        Route::resource('trials', \App\Http\Controllers\SuperAdmin\TrialController::class)->only(['index', 'store', 'destroy']);
        Route::put('trials/{trial}/status', [\App\Http\Controllers\SuperAdmin\TrialController::class, 'updateStatus'])->name('trials.update-status');
        Route::resource('packages', \App\Http\Controllers\SuperAdmin\PackageController::class)->except(['create', 'show', 'edit']);
        Route::resource('addons', \App\Http\Controllers\SuperAdmin\AddonController::class)->except(['create', 'show', 'edit']);
        Route::resource('subscription-invoices', \App\Http\Controllers\SuperAdmin\SubscriptionInvoiceController::class)->only(['index', 'store', 'destroy']);
        Route::put('subscription-invoices/{invoice}/pay', [\App\Http\Controllers\SuperAdmin\SubscriptionInvoiceController::class, 'markAsPaid'])->name('subscription-invoices.pay');
        Route::put('subscription-invoices/{invoice}/cancel', [\App\Http\Controllers\SuperAdmin\SubscriptionInvoiceController::class, 'cancel'])->name('subscription-invoices.cancel');
        Route::get('refunds', [\App\Http\Controllers\SuperAdmin\RefundController::class, 'index'])->name('refunds.index');
        Route::put('refunds/{refund}/status', [\App\Http\Controllers\SuperAdmin\RefundController::class, 'updateStatus'])->name('refunds.update-status');
        Route::delete('refunds/{refund}', [\App\Http\Controllers\SuperAdmin\RefundController::class, 'destroy'])->name('refunds.destroy');

        // --- TENANT MANAGEMENT Module ---
        Route::get('tenant-settings', [\App\Http\Controllers\SuperAdmin\TenantSettingController::class, 'index'])->name('tenant-settings.index');
        Route::put('tenant-settings/{schoolId}', [\App\Http\Controllers\SuperAdmin\TenantSettingController::class, 'update'])->name('tenant-settings.update');
        Route::get('domains', [\App\Http\Controllers\SuperAdmin\DomainController::class, 'index'])->name('domains.index');
        Route::put('domains/{schoolId}', [\App\Http\Controllers\SuperAdmin\DomainController::class, 'update'])->name('domains.update');

        // --- CONTENT & SUPPORT Module ---
        Route::resource('knowledge-bases', \App\Http\Controllers\SuperAdmin\KnowledgeBaseController::class)->except(['create', 'show', 'edit']);

        // --- CONTENT MANAGEMENT Module ---
        Route::resource('faqs', \App\Http\Controllers\SuperAdmin\FaqController::class)->except(['create', 'show', 'edit']);
        Route::resource('announcements', \App\Http\Controllers\SuperAdmin\AnnouncementController::class)->except(['create', 'show', 'edit']);
        Route::get('/landing-page', [\App\Http\Controllers\SuperAdmin\LandingPageController::class, 'index'])->name('landing-page.index');
        Route::post('/landing-page', [\App\Http\Controllers\SuperAdmin\LandingPageController::class, 'update'])->name('landing-page.update');
        Route::get('blogs', [\App\Http\Controllers\SuperAdmin\BlogController::class, 'index'])->name('blogs.index');
        Route::post('blogs', [\App\Http\Controllers\SuperAdmin\BlogController::class, 'store'])->name('blogs.store');
        Route::put('blogs/{blog}', [\App\Http\Controllers\SuperAdmin\BlogController::class, 'update'])->name('blogs.update');
        Route::delete('blogs/{blog}', [\App\Http\Controllers\SuperAdmin\BlogController::class, 'destroy'])->name('blogs.destroy');
        Route::get('landing-products', [\App\Http\Controllers\SuperAdmin\LandingProductController::class, 'index'])->name('landing-products.index');
        Route::post('landing-products', [\App\Http\Controllers\SuperAdmin\LandingProductController::class, 'store'])->name('landing-products.store');
        Route::put('landing-products/{landingProduct}', [\App\Http\Controllers\SuperAdmin\LandingProductController::class, 'update'])->name('landing-products.update');
        Route::delete('landing-products/{landingProduct}', [\App\Http\Controllers\SuperAdmin\LandingProductController::class, 'destroy'])->name('landing-products.destroy');

        //-- E-COMMERCE / DIGITAL PRODUCTS ---
        Route::get('source-codes', [\App\Http\Controllers\SuperAdmin\SourceCodeController::class, 'index'])->name('source-codes.index');
        Route::post('source-codes', [\App\Http\Controllers\SuperAdmin\SourceCodeController::class, 'store'])->name('source-codes.store');
        Route::post('source-codes/{sourceCode}', [\App\Http\Controllers\SuperAdmin\SourceCodeController::class, 'update'])->name('source-codes.update'); // POST for File Upload spoofing
        Route::delete('source-codes/{sourceCode}', [\App\Http\Controllers\SuperAdmin\SourceCodeController::class, 'destroy'])->name('source-codes.destroy');

        Route::get('source-code-orders', [\App\Http\Controllers\SuperAdmin\SourceCodeOrderController::class, 'index'])->name('source-code-orders.index');
        Route::put('source-code-orders/{order}/status', [\App\Http\Controllers\SuperAdmin\SourceCodeOrderController::class, 'updateStatus'])->name('source-code-orders.update-status');
        Route::delete('source-code-orders/{order}', [\App\Http\Controllers\SuperAdmin\SourceCodeOrderController::class, 'destroy'])->name('source-code-orders.destroy');


        // --- SECURITY CENTER Module ---
        Route::get('audit-logs', [\App\Http\Controllers\SuperAdmin\AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('login-activities', [\App\Http\Controllers\SuperAdmin\LoginActivityController::class, 'index'])->name('login-activities.index');
        Route::delete('login-activities/clear', [\App\Http\Controllers\SuperAdmin\LoginActivityController::class, 'destroy'])->name('login-activities.clear');
        Route::get('ip-accesses', [\App\Http\Controllers\SuperAdmin\IpAccessController::class, 'index'])->name('ip-accesses.index');
        Route::post('ip-accesses', [\App\Http\Controllers\SuperAdmin\IpAccessController::class, 'store'])->name('ip-accesses.store');
        Route::put('ip-accesses/{ipAccess}', [\App\Http\Controllers\SuperAdmin\IpAccessController::class, 'update'])->name('ip-accesses.update');
        Route::put('ip-accesses/{ipAccess}/toggle-status', [\App\Http\Controllers\SuperAdmin\IpAccessController::class, 'toggleStatus'])->name('ip-accesses.toggle-status');
        Route::delete('ip-accesses/{ipAccess}', [\App\Http\Controllers\SuperAdmin\IpAccessController::class, 'destroy'])->name('ip-accesses.destroy');


    });

    // Group Master Data
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::get('school-profile', [SchoolProfileController::class, 'index'])->name('school-profile.index');
        Route::post('school-profile', [SchoolProfileController::class, 'update'])->name('school-profile.update');
        Route::resource('academic-years', AcademicYearController::class)->except(['create', 'show', 'edit']);
        Route::resource('subjects', SubjectController::class)->except(['create', 'show', 'edit']);
        Route::resource('classrooms', ClassroomController::class)->except(['create', 'show', 'edit']);
        Route::resource('majors', MajorController::class)->except(['create', 'show', 'edit']);
    });

    // Group Admin PPDB
    Route::prefix('admin/ppdb')->name('admin.ppdb.')->group(function () {
        Route::get('/', [PPDBAdminController::class, 'index'])->name('index');
        Route::put('/{admission}/status', [PPDBAdminController::class, 'updateStatus'])->name('update-status');
    });

    // Modul Siswa
    Route::resource('students', StudentController::class)->except(['create', 'show', 'edit']);
    Route::resource('guardians', GuardianController::class)->except(['create', 'show', 'edit']);
    Route::resource('mutations', MutationController::class)->except(['create', 'show', 'edit']);
    Route::resource('alumnis', AlumniController::class)->except(['create', 'show', 'edit']);
     Route::get('student-attendances', [StudentAttendanceController::class, 'index'])->name('student-attendances.index');
    Route::post('student-attendances', [StudentAttendanceController::class, 'store'])->name('student-attendances.store');


    // Modul Guru & Pegawai
    Route::resource('teachers', TeacherController::class)->except(['create', 'show', 'edit']);
    Route::resource('employees', EmployeeController::class)->except(['create', 'show', 'edit']);
    Route::get('teacher-attendances', [TeacherAttendanceController::class, 'index'])->name('teacher-attendances.index');
    Route::post('teacher-attendances', [TeacherAttendanceController::class, 'store'])->name('teacher-attendances.store');
    // ...


    // Modul Akademik & Rapor
    Route::resource('schedules', ScheduleController::class)->except(['create', 'show', 'edit']);
    Route::resource('study-materials', StudyMaterialController::class)->except(['create', 'show', 'edit']);
    Route::resource('exams', ExamController::class)->except(['create', 'show', 'edit']);
    Route::get('exams/{exam}/questions', [ExamQuestionController::class, 'index'])->name('exams.questions.index');
    Route::post('exams/{exam}/questions', [ExamQuestionController::class, 'store'])->name('exams.questions.store');
    Route::put('exams/{exam}/questions/{question}', [ExamQuestionController::class, 'update'])->name('exams.questions.update');
    Route::delete('exams/{exam}/questions/{question}', [ExamQuestionController::class, 'destroy'])->name('exams.questions.destroy');

    Route::get('grades', [GradeController::class, 'index'])->name('grades.index');
    Route::post('grades', [GradeController::class, 'store'])->name('grades.store');
    Route::get('report-cards', [ReportCardController::class, 'index'])->name('report-cards.index');
    Route::get('report-cards/{student}', [ReportCardController::class, 'show'])->name('report-cards.show');


    // Modul Keuangan
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');

    // Modul LMS (E-Learning)
    Route::resource('study-materials', StudyMaterialController::class)->except(['create', 'show', 'edit']); 
    Route::resource('exams', ExamController::class)->except(['create', 'show', 'edit']);

        // Modul CBT Siswa (PENTING: Dibungkus auth agar redirect ke login jika belum masuk)
    Route::middleware(['auth'])->prefix('student/cbt')->name('student.cbt.')->group(function () {
        Route::get('/', [CbtController::class, 'index'])->name('index');
        Route::get('/{exam}/play', [CbtController::class, 'play'])->name('play');
        Route::post('/{exam}/answer', [CbtController::class, 'answer'])->name('answer');
        Route::post('/{exam}/finish', [CbtController::class, 'finish'])->name('finish');
    });
});
