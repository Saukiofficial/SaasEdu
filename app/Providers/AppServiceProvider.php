<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\AcademicYearRepositoryInterface;
use App\Repositories\AcademicYearRepository;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use App\Repositories\SubjectRepository;
use App\Repositories\Contracts\ClassroomRepositoryInterface;
use App\Repositories\ClassroomRepository;
use App\Repositories\Contracts\AdmissionRepositoryInterface;
use App\Repositories\AdmissionRepository;
use App\Repositories\Contracts\StudentRepositoryInterface;
use App\Repositories\StudentRepository;
use App\Repositories\Contracts\TeacherRepositoryInterface;
use App\Repositories\TeacherRepository;
use App\Repositories\Contracts\ScheduleRepositoryInterface;
use App\Repositories\ScheduleRepository;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Repositories\AttendanceRepository;
use App\Repositories\Contracts\GradeRepositoryInterface;
use App\Repositories\GradeRepository;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use App\Repositories\InvoiceRepository;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\PaymentRepository;
use App\Repositories\Contracts\StudyMaterialRepositoryInterface;
use App\Repositories\StudyMaterialRepository;
use App\Repositories\Contracts\ExamRepositoryInterface;
use App\Repositories\ExamRepository;
use App\Repositories\Contracts\PackageRepositoryInterface;
use App\Repositories\PackageRepository; 
use App\Repositories\Contracts\AnnouncementRepositoryInterface;
use App\Repositories\AnnouncementRepository;
use App\Repositories\Contracts\TicketRepositoryInterface;
use App\Repositories\TicketRepository;
use App\Repositories\Contracts\LeadRepositoryInterface;
use App\Repositories\LeadRepository;
use App\Repositories\Contracts\TrialRepositoryInterface;
use App\Repositories\TrialRepository;
use App\Repositories\Contracts\TenantSettingRepositoryInterface;
use App\Repositories\TenantSettingRepository;
use App\Repositories\Contracts\KnowledgeBaseRepositoryInterface;
use App\Repositories\KnowledgeBaseRepository;
use App\Repositories\Contracts\FaqRepositoryInterface;
use App\Repositories\FaqRepository;
use App\Repositories\Contracts\SettingRepositoryInterface;
use App\Repositories\SettingRepository;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Repositories\Contracts\TenantRepositoryInterface;
use App\Repositories\TenantRepository;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\RoleRepository;
use App\Repositories\Contracts\DomainRepositoryInterface;
use App\Repositories\DomainRepository;
use App\Repositories\Contracts\StaffRepositoryInterface;
use App\Repositories\StaffRepository;
use App\Repositories\Contracts\AddonRepositoryInterface;
use App\Repositories\AddonRepository;
use App\Repositories\Contracts\SubscriptionInvoiceRepositoryInterface;
use App\Repositories\SubscriptionInvoiceRepository;
use App\Repositories\Contracts\AuditLogRepositoryInterface;
use App\Repositories\AuditLogRepository;
use App\Repositories\Contracts\DemoRequestRepositoryInterface;
use App\Repositories\DemoRequestRepository;
use App\Repositories\Contracts\ProspectRepositoryInterface;
use App\Repositories\ProspectRepository;
use App\Repositories\Contracts\RefundRepositoryInterface;
use App\Repositories\RefundRepository;
use App\Repositories\Contracts\BlogRepositoryInterface;
use App\Repositories\BlogRepository;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Failed;
use App\Listeners\RecordLoginActivity;
use App\Repositories\Contracts\LoginActivityRepositoryInterface;
use App\Repositories\LoginActivityRepository;
use App\Repositories\Contracts\IpAccessRepositoryInterface;
use App\Repositories\IpAccessRepository;
use App\Repositories\Contracts\BrandingRepositoryInterface;
use App\Repositories\BrandingRepository;
use App\Repositories\Contracts\LanguageRepositoryInterface;
use App\Repositories\LanguageRepository;
use App\Repositories\Contracts\LandingProductRepositoryInterface;
use App\Repositories\LandingProductRepository;
use App\Repositories\Contracts\MajorRepositoryInterface;
use App\Repositories\MajorRepository;
use App\Repositories\Contracts\SchoolProfileRepositoryInterface;
use App\Repositories\SchoolProfileRepository;
use App\Repositories\Contracts\GuardianRepositoryInterface;
use App\Repositories\GuardianRepository;
use App\Repositories\Contracts\StudentMutationRepositoryInterface;
use App\Repositories\StudentMutationRepository;
use App\Repositories\Contracts\AlumniRepositoryInterface;
use App\Repositories\AlumniRepository;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Repositories\EmployeeRepository;
use App\Repositories\Contracts\StudentAttendanceRepositoryInterface;
use App\Repositories\StudentAttendanceRepository;
use App\Repositories\Contracts\TeacherAttendanceRepositoryInterface;
use App\Repositories\TeacherAttendanceRepository;



class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AcademicYearRepositoryInterface::class, AcademicYearRepository::class);
        $this->app->bind(SubjectRepositoryInterface::class, SubjectRepository::class);
        $this->app->bind(ClassroomRepositoryInterface::class, ClassroomRepository::class);
        $this->app->bind(AdmissionRepositoryInterface::class, AdmissionRepository::class);
        $this->app->bind(StudentRepositoryInterface::class, StudentRepository::class);
        $this->app->bind(TeacherRepositoryInterface::class, TeacherRepository::class);
        $this->app->bind(ScheduleRepositoryInterface::class, ScheduleRepository::class);
        $this->app->bind(AttendanceRepositoryInterface::class, AttendanceRepository::class);
        $this->app->bind(GradeRepositoryInterface::class, GradeRepository::class);
        $this->app->bind(InvoiceRepositoryInterface::class, InvoiceRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
        $this->app->bind(StudyMaterialRepositoryInterface::class, StudyMaterialRepository::class);
        $this->app->bind(ExamRepositoryInterface::class, ExamRepository::class);
        $this->app->bind(PackageRepositoryInterface::class, PackageRepository::class);
        $this->app->bind(AnnouncementRepositoryInterface::class, AnnouncementRepository::class);
        $this->app->bind(TicketRepositoryInterface::class, TicketRepository::class);
        $this->app->bind(LeadRepositoryInterface::class, LeadRepository::class);
        $this->app->bind(TrialRepositoryInterface::class, TrialRepository::class);
        $this->app->bind(TenantSettingRepositoryInterface::class, TenantSettingRepository::class);
        $this->app->bind(KnowledgeBaseRepositoryInterface::class, KnowledgeBaseRepository::class);
        $this->app->bind(FaqRepositoryInterface::class, FaqRepository::class);
        $this->app->bind(SettingRepositoryInterface::class, SettingRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(TenantRepositoryInterface::class, TenantRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);
        $this->app->bind(DomainRepositoryInterface::class, DomainRepository::class);
        $this->app->bind(StaffRepositoryInterface::class, StaffRepository::class);
        $this->app->bind(AddonRepositoryInterface::class, AddonRepository::class);
        $this->app->bind(SubscriptionInvoiceRepositoryInterface::class, SubscriptionInvoiceRepository::class);
        $this->app->bind(AuditLogRepositoryInterface::class, AuditLogRepository::class);
        $this->app->bind(DemoRequestRepositoryInterface::class, DemoRequestRepository::class);
        $this->app->bind(ProspectRepositoryInterface::class, ProspectRepository::class);
        $this->app->bind(RefundRepositoryInterface::class, RefundRepository::class);
        $this->app->bind(BlogRepositoryInterface::class, BlogRepository::class);
        $this->app->bind(LoginActivityRepositoryInterface::class, LoginActivityRepository::class);
        $this->app->bind(IpAccessRepositoryInterface::class, IpAccessRepository::class);
        $this->app->bind(BrandingRepositoryInterface::class, BrandingRepository::class);
        $this->app->bind(LanguageRepositoryInterface::class, LanguageRepository::class);
        $this->app->bind(LandingProductRepositoryInterface::class, LandingProductRepository::class);
        $this->app->bind(\App\Repositories\Contracts\MajorRepositoryInterface::class, \App\Repositories\MajorRepository::class);
        $this->app->bind(MajorRepositoryInterface::class, MajorRepository::class);
        $this->app->bind(SchoolProfileRepositoryInterface::class, SchoolProfileRepository::class);
        $this->app->bind(GuardianRepositoryInterface::class, GuardianRepository::class);
        $this->app->bind(StudentMutationRepositoryInterface::class, StudentMutationRepository::class);
        $this->app->bind(AlumniRepositoryInterface::class, AlumniRepository::class);
        $this->app->bind(EmployeeRepositoryInterface::class, EmployeeRepository::class);
        $this->app->bind(StudentAttendanceRepositoryInterface::class, StudentAttendanceRepository::class);
        $this->app->bind(TeacherAttendanceRepositoryInterface::class, TeacherAttendanceRepository::class);
    }

    public function boot(): void
    {
        Event::listen(Login::class, [RecordLoginActivity::class, 'handleLogin']);
        Event::listen(Failed::class, [RecordLoginActivity::class, 'handleFailedLogin']);
    }
}
