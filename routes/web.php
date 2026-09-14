<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\PractitionerVerificationController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\MyObservationController;
use App\Http\Controllers\PractitionerApplicationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::resource('users', UserController::class)
            ->except(['show'])
            ->middleware('permission:users.manage');

        Route::resource('roles', RoleController::class)
            ->except(['show'])
            ->middleware('permission:roles.manage');

        Route::resource('permissions', PermissionController::class)
            ->except(['show'])
            ->middleware('permission:permissions.manage');

        Route::middleware('permission:practitioner_verifications.manage')
            ->group(function (): void {
                Route::get(
                    'practitioner-verifications',
                    [PractitionerVerificationController::class, 'index']
                )->name('practitioner-verifications.index');

                Route::get(
                    'practitioner-verifications/{verification}',
                    [PractitionerVerificationController::class, 'show']
                )->name('practitioner-verifications.show');

                Route::patch(
                    'practitioner-verifications/{verification}/review',
                    [PractitionerVerificationController::class, 'review']
                )->name('practitioner-verifications.review');

                Route::get(
                    'practitioner-documents/{document}/download',
                    [PractitionerVerificationController::class, 'downloadDocument']
                )->name('practitioner-documents.download');
            });
    });

Route::middleware('auth')
    ->prefix('my/observations')
    ->name('my.observations.')
    ->group(function (): void {
        Route::get('/', [MyObservationController::class, 'index'])->name('index');
        Route::get('/create', [MyObservationController::class, 'create'])->name('create');
        Route::post('/', [MyObservationController::class, 'store'])->name('store');
        Route::get('/{observation}/edit', [MyObservationController::class, 'edit'])->name('edit');
        Route::put('/{observation}', [MyObservationController::class, 'update'])->name('update');
        Route::patch('/{observation}/archive', [MyObservationController::class, 'archive'])->name('archive');
        Route::patch('/{observation}/restore', [MyObservationController::class, 'restore'])->name('restore');
    });

Route::middleware('auth')
    ->prefix('practitioner/application')
    ->name('practitioner.application.')
    ->group(function (): void {
        Route::get('/', [PractitionerApplicationController::class, 'show'])->name('show');
        Route::post('/draft', [PractitionerApplicationController::class, 'saveDraft'])->name('draft');
        Route::post('/submit', [PractitionerApplicationController::class, 'submit'])->middleware('verified')->name('submit');
    });

require __DIR__.'/settings.php';
