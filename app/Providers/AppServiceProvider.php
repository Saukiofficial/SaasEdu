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
    }

    public function boot(): void
    {
        //
    }
}
