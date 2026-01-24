import React, { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    DollarSign,
    Users,
    Ticket,
    TrendingUp,
    Filter,
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const ReportsSection = () => {
    const [reportType, setReportType] = useState('revenue');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [format, setFormat] = useState('pdf');
    const [isGenerating, setIsGenerating] = useState(false);

    const { showSuccess, showError } = useToast();

    const reportTypes = [
        {
            id: 'revenue',
            label: 'Revenue Report',
            description: 'Detailed revenue breakdown by events and categories',
            icon: DollarSign,
            color: 'from-green-500 to-green-600',
        },
        {
            id: 'bookings',
            label: 'Bookings Report',
            description: 'Complete booking statistics and trends',
            icon: Ticket,
            color: 'from-blue-500 to-blue-600',
        },
        {
            id: 'users',
            label: 'Users Report',
            description: 'User registration and activity metrics',
            icon: Users,
            color: 'from-purple-500 to-purple-600',
        },
        {
            id: 'events',
            label: 'Events Report',
            description: 'Event performance and attendance data',
            icon: Calendar,
            color: 'from-orange-500 to-orange-600',
        },
        {
            id: 'analytics',
            label: 'Analytics Report',
            description: 'Comprehensive analytics and insights',
            icon: TrendingUp,
            color: 'from-pink-500 to-pink-600',
        },
    ];

    const quickDateRanges = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 days', value: '7days' },
        { label: 'Last 30 days', value: '30days' },
        { label: 'This month', value: 'thisMonth' },
        { label: 'Last month', value: 'lastMonth' },
        { label: 'This year', value: 'thisYear' },
    ];

    const handleQuickDate = (range) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (range) {
            case 'today':
                start = today;
                end = today;
                break;
            case 'yesterday':
                start = new Date(today.setDate(today.getDate() - 1));
                end = start;
                break;
            case '7days':
                start = new Date(today.setDate(today.getDate() - 7));
                end = new Date();
                break;
            case '30days':
                start = new Date(today.setDate(today.getDate() - 30));
                end = new Date();
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date();
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'thisYear':
                start = new Date(today.getFullYear(), 0, 1);
                end = new Date();
                break;
            default:
                break;
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            showError('Please select date range');
            return;
        }

        setIsGenerating(true);

        try {
            const result = await adminService.generateReport({
                type: reportType,
                startDate,
                endDate,
                format,
            });

            if (result.success) {
                showSuccess(`${format.toUpperCase()} report generated successfully!`);
                // Trigger download if URL is provided
                if (result.data.downloadUrl) {
                    window.open(result.data.downloadUrl, '_blank');
                }
            } else {
                showError(result.error || 'Failed to generate report');
            }
        } catch (error) {
            showError('Report generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
                <p className="text-white/70">Generate and download comprehensive reports</p>
            </div>

            {/* Report Types */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Select Report Type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setReportType(type.id)}
                                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                    reportType === type.id
                                        ? 'border-purple-500 backdrop-blur-lg bg-purple-500/20'
                                        : 'border-white/20 backdrop-blur-lg bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}
                                >
                                    <Icon className="text-white" size={24} />
                                </div>
                                <h3 className="text-white font-bold mb-2">{type.label}</h3>
                                <p className="text-white/70 text-sm">{type.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Date Range */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Date Range</h2>

                {/* Quick Date Selection */}
                <div className="mb-6">
                    <p className="text-white/70 text-sm mb-3">Quick Select:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickDateRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => handleQuickDate(range.value)}
                                className="px-4 py-2 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-all"
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
            </Card>

            {/* Format Selection */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Export Format</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['pdf', 'csv', 'excel'].map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                                format === fmt
                                    ? 'border-purple-500 backdrop-blur-lg bg-purple-500/20'
                                    : 'border-white/20 backdrop-blur-lg bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <FileText className="text-white mx-auto mb-2" size={32} />
                            <p className="text-white font-medium uppercase">{fmt}</p>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Generate Button */}
            <div className="flex justify-center">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerateReport}
                    loading={isGenerating}
                    disabled={isGenerating || !startDate || !endDate}
                    icon={<Download size={20} />}
                    className="px-12"
                >
                    {isGenerating ? 'Generating Report...' : 'Generate Report'}
                </Button>
            </div>

            {/* Recent Reports */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Reports</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                    <FileText className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Revenue Report - December 2025</p>
                                    <p className="text-white/60 text-xs">Generated on {formatDate(new Date())}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" icon={<Download size={16} />}>
                                Download
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ReportsSection;
