import { UserIcon } from 'lucide-react';

const ViewInfoModal = ({ staff }) => {
    console.log(staff);
    return (
        <div >
            <div className='flex items-center space-x-4'>
                <div className="size-20 rounded-full overflow-hidden">
                    {staff.staff.profile_photo_path ? (
                        <img src={`/storage/${staff.staff.profile_photo_path}`} className="w-full h-full object-cover" alt={`${staff.staff.first_name}'s DP`} />
                    ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className='figtree-medium text-2xl'>{staff.staff.first_name[0].toUpperCase()}</span>
                            <span className='figtree-medium text-2xl'>{staff.staff.last_name[0].toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-semibold">{`${staff.staff.first_name} ${staff.staff.last_name}`}</h2>
                    <p className="text-sm text-muted-foreground">{staff.staff.email}</p>
                    <p className="text-sm text-muted-foreground">{staff.position[0].toUpperCase() + staff.position.slice(1)}</p>
                </div>
            </div>
            <div className='grid sm:grid-cols-2 gap-4 mt-4'>
                <div>
                    <h6 className='figtree-medium'>Username</h6>
                    <p className='text-muted-foreground'>{staff.staff.username}</p>
                </div>
                <div>
                    <h6 className='figtree-medium'>Contact Number</h6>
                    <p className='text-muted-foreground'>{staff.staff.contact_number || "N/A"}</p>
                </div>
                <div>
                    <h6 className='figtree-medium'>Position</h6>
                    <p className='text-muted-foreground'>{staff.role[0].toUpperCase() + staff.role.slice(1)}</p>
                </div>
                <div>
                    <h6 className='figtree-medium'>Role</h6>
                    <p className='text-muted-foreground'>{staff.role[0].toUpperCase() + staff.role.slice(1)}</p>
                </div>
                <div>
                    <h6 className='figtree-medium'>Status</h6>
                    <p className='text-muted-foreground'>{staff.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                    <h6 className='figtree-medium'>Date Joined</h6>
                    <p className='text-muted-foreground'>
                        {new Date(staff.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div>
                    <h6 className='figtree-medium'>Gender</h6>
                    <p className='text-muted-foreground'>{staff.staff.gender}</p>
                </div>
                <div>
                    <h6 className='figtree-medium'>Date of Birth</h6>
                    <p className='text-muted-foreground'>
                        {new Date(staff.staff.date_of_birth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ViewInfoModal;