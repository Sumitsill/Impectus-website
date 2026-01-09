import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

const initialInventory = [
    { id: 1, name: 'Paracetamol 500mg', stock: 1200, unit: 'Strips', status: 'available', expiry: '2025-12' },
    { id: 2, name: 'Amoxicillin 250mg', stock: 45, unit: 'Bottles', status: 'low', expiry: '2024-08' },
    { id: 3, name: 'Cetirizine 10mg', stock: 0, unit: 'Strips', status: 'out', expiry: '2025-01' },
    { id: 4, name: 'Ibuprofen 400mg', stock: 850, unit: 'Strips', status: 'available', expiry: '2026-03' },
    { id: 5, name: 'Metformin 500mg', stock: 200, unit: 'Strips', status: 'available', expiry: '2024-11' },
];

const PharmacyInventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory] = useState(initialInventory);

    const getStatusColor = (status: string) => {
        if (status === 'available') return 'text-green-400 bg-green-400/10 border-green-400/20';
        if (status === 'low') return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        return 'text-red-400 bg-red-400/10 border-red-400/20';
    };

    return (
        <DashboardLayout role="pharmacist" title="Inventory Management">

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end md:items-center">
                <div className="w-full md:w-96 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <Input
                        placeholder="Search medicines..."
                        className="pl-10 bg-slate-900/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary">
                        <Filter className="w-4 h-4 mr-2" /> Filters
                    </Button>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Add Medicine
                    </Button>
                </div>
            </div>

            {/* Inventory Table/Grid */}
            <Card className="overflow-hidden p-0 border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase tracking-wider font-medium text-xs">
                            <tr>
                                <th className="p-4">Medicine Name</th>
                                <th className="p-4">Stock Level</th>
                                <th className="p-4">Unit</th>
                                <th className="p-4">Expiry</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium">{item.name}</td>
                                    <td className="p-4">
                                        <span className={clsx("font-mono font-bold", item.status === 'out' ? 'text-red-500' : 'text-white')}>
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">{item.unit}</td>
                                    <td className="p-4 text-gray-400">{item.expiry}</td>
                                    <td className="p-4">
                                        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium border", getStatusColor(item.status))}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                            Update
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination mock */}
                <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <span>Showing 5 of 128 items</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10">Next</button>
                    </div>
                </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="p-4 flex items-center gap-4 bg-red-500/10 border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <div>
                        <h4 className="font-bold text-lg text-red-400">3 Items</h4>
                        <p className="text-xs text-gray-400">Out of Stock</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-orange-500/10 border-orange-500/20">
                    <AlertCircle className="w-8 h-8 text-orange-500" />
                    <div>
                        <h4 className="font-bold text-lg text-orange-400">12 Items</h4>
                        <p className="text-xs text-gray-400">Low Stock Alert</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-green-500/10 border-green-500/20">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                        <h4 className="font-bold text-lg text-green-400">Stock Verified</h4>
                        <p className="text-xs text-gray-400">Updated today</p>
                    </div>
                </Card>
            </div>

        </DashboardLayout>
    );
};

export default PharmacyInventory;
