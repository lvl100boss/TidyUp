<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\CustomVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'username',
        'email',
        'password',
        'contact_number',
        'profile_photo_path',
        'gender',
        'date_of_birth',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    }

    public function userRole()
    {
        return $this->hasOne(UserRole::class); // Each user has one role
    }

    public function appointments()
    {
        return $this->hasMany(Appointments::class); // Each user has many appointments
    }

    public function shop()
    {
        return $this->hasOne(Shop::class); // Each user has one shop
    }

    public function shopStaffs()
    {
        return $this->belongsTo(ShopStaffs::class, 'staff_id'); // Each user has many shop staffs
    }

    public function userAppointments()
    {
        return $this->hasMany(UserAppointments::class); // Each user has many user appointments
    }

    public function appointmentServices()
    {
        return $this->hasMany(AppointmentServices::class); // Each user has many appointment services
    }

    public function platformStaff()
    {
        return $this->hasOne(PlatformStaff::class); // Each user has one platform staff
    }

    /**
     * Check if the user has a specific role
     *
     * @param string $roleName
     * @return bool
     */
}
