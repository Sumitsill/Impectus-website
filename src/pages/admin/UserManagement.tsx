import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, UserPlus, Filter, Download } from 'lucide-react';
import api from '../../lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    mobile: string;
    role: string;
    speciality?: string;
    created_at: string;
    verification_status: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusUpdate = async (userId: number, newStatus: string) => {
        setActionLoading(userId);
        try {
            await api.put(`/api/admin/users/${userId}/status`, { status: newStatus });
            await fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update user status");
        } finally {
            setActionLoading(null);
        }
    };

    const getRoleBadge = (role: string) => {
        const styles = {
            doctor: 'bg-primary/10 text-primary border-primary/20',
            admin: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            pharmacist: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
        return styles[role as keyof typeof styles] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <DashboardLayout role="admin" title="User Management">
            {/* Toolbar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <Button variant="outline" className="hidden md:flex"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                </div>
                <div className="flex gap-2 w-full md:w-auto ml-auto">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
                    <Button><UserPlus className="w-4 h-4 mr-2" /> Add User</Button>
                </div>
            </div>

            {/* Users Table */}
            <Card className="overflow-hidden border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name / Email</th>
                                <th className="px-6 py-4 font-medium">Role / Status</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Speciality</th>
                                <th className="px-6 py-4 font-medium text-right">Verification Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading users...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(user.role)} capitalize`}>
                                                    {user.role}
                                                </span>
                                                <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(user.verification_status)}`}>
                                                    {user.verification_status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {user.mobile || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {user.speciality ? (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                    {user.speciality}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role === 'doctor' && (
                                                <div className="flex justify-end gap-2">
                                                    {user.verification_status !== 'VERIFIED' && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 px-3 text-[10px] bg-green-600 hover:bg-green-500"
                                                            onClick={() => handleStatusUpdate(user.id, 'VERIFIED')}
                                                            isLoading={actionLoading === user.id}
                                                        >
                                                            Verify
                                                        </Button>
                                                    )}
                                                    {user.verification_status !== 'REJECTED' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-3 text-[10px] border-red-500/20 text-red-500 hover:bg-red-500/10"
                                                            onClick={() => handleStatusUpdate(user.id, 'REJECTED')}
                                                            isLoading={actionLoading === user.id}
                                                        >
                                                            Reject
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Static for now) */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {users.length} results</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 hover:bg-white/5 rounded transition-colors disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 hover:bg-white/5 rounded transition-colors disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default UserManagement;
