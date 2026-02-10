"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Briefcase,
    Calendar,
    Clock,
    Filter,
    Search,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    Building2,
    MapPin,
    DollarSign,
    FileText,
    Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobApplication {
    _id: string;
    jobId: {
        _id: string;
        title: string;
        companyId: {
            name: string;
            logo?: string;
        };
        location: string;
        type: string;
        remote: boolean;
        salary?: {
            min?: number;
            max?: number;
            currency: string;
        };
    };
    status: 'applied' | 'interviewing' | 'rejected' | 'accepted' | 'withdrawn';
    appliedDate: string;
    lastUpdated: string;
    notes?: string;
    interviewDate?: string;
    offerDetails?: {
        salary?: number;
        startDate?: string;
        notes?: string;
    };
}

interface JobApplicationTrackerProps {
    userId?: string;
}

export default function JobApplicationTracker({ userId }: JobApplicationTrackerProps) {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { toast } = useToast();

    // Mock data for demonstration - in real app, this would come from API
    useEffect(() => {
        const mockApplications: JobApplication[] = [
            {
                _id: "1",
                jobId: {
                    _id: "job1",
                    title: "Senior Frontend Developer",
                    companyId: {
                        name: "TechCorp",
                        logo: ""
                    },
                    location: "San Francisco, CA",
                    type: "full-time",
                    remote: true,
                    salary: {
                        min: 120000,
                        max: 150000,
                        currency: "USD"
                    }
                },
                status: "applied",
                appliedDate: "2024-01-15T10:00:00Z",
                lastUpdated: "2024-01-15T10:00:00Z",
                notes: "Applied through company website"
            },
            {
                _id: "2",
                jobId: {
                    _id: "job2",
                    title: "Full Stack Engineer",
                    companyId: {
                        name: "StartupXYZ",
                        logo: ""
                    },
                    location: "New York, NY",
                    type: "full-time",
                    remote: false,
                    salary: {
                        min: 100000,
                        max: 130000,
                        currency: "USD"
                    }
                },
                status: "interviewing",
                appliedDate: "2024-01-10T14:30:00Z",
                lastUpdated: "2024-01-20T09:00:00Z",
                notes: "Phone interview scheduled",
                interviewDate: "2024-01-25T15:00:00Z"
            },
            {
                _id: "3",
                jobId: {
                    _id: "job3",
                    title: "React Developer",
                    companyId: {
                        name: "InnovateLabs",
                        logo: ""
                    },
                    location: "Austin, TX",
                    type: "contract",
                    remote: true,
                    salary: {
                        min: 80000,
                        max: 100000,
                        currency: "USD"
                    }
                },
                status: "rejected",
                appliedDate: "2024-01-05T11:15:00Z",
                lastUpdated: "2024-01-18T16:45:00Z",
                notes: "Received rejection email"
            }
        ];

        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
        setLoading(false);
    }, []);

    // Filter applications based on status and search term
    useEffect(() => {
        let filtered = applications;

        if (statusFilter !== "all") {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.jobId.companyId.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    }, [applications, statusFilter, searchTerm]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'applied':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'interviewing':
                return <User className="w-4 h-4 text-yellow-500" />;
            case 'accepted':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'withdrawn':
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'applied':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'interviewing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'withdrawn':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatSalary = (salary?: { min?: number; max?: number; currency: string }) => {
        if (!salary?.min && !salary?.max) return null;

        const { min, max, currency } = salary;
        if (min && max) {
            return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
        }
        if (min) {
            return `${currency} ${min.toLocaleString()}+`;
        }
        if (max) {
            return `Up to ${currency} ${max.toLocaleString()}`;
        }
        return null;
    };

    const handleStatusChange = async (applicationId: string, newStatus: string) => {
        // In a real app, this would make an API call
        setApplications(prev =>
            prev.map(app =>
                app._id === applicationId
                    ? { ...app, status: newStatus as any, lastUpdated: new Date().toISOString() }
                    : app
            )
        );

        toast({
            title: "Status Updated",
            description: `Application status changed to ${newStatus}`,
        });
    };

    const handleEditNotes = (application: JobApplication) => {
        setSelectedApplication(application);
        setIsEditDialogOpen(true);
    };

    const handleSaveNotes = async () => {
        if (!selectedApplication) return;

        // In a real app, this would make an API call
        setApplications(prev =>
            prev.map(app =>
                app._id === selectedApplication._id
                    ? { ...app, notes: selectedApplication.notes, lastUpdated: new Date().toISOString() }
                    : app
            )
        );

        setIsEditDialogOpen(false);
        setSelectedApplication(null);

        toast({
            title: "Notes Updated",
            description: "Application notes have been saved",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading applications...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Job Applications</h2>
                    <p className="text-muted-foreground">
                        Track and manage your job application status
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <Card className="glassmorphic">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 glassmorphic-input"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48 glassmorphic-input">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="interviewing">Interviewing</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.length === 0 ? (
                    <Card className="glassmorphic">
                        <CardContent className="p-8 text-center">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No applications found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "Start applying to jobs to track your applications here"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredApplications.map((application) => (
                        <Card key={application._id} className="glassmorphic hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Job Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-lg text-foreground truncate">
                                                    {application.jobId.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-2">
                                                    {application.jobId.companyId.name}
                                                </p>

                                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{application.jobId.location}</span>
                                                        {application.jobId.remote && (
                                                            <Badge variant="secondary" className="text-xs ml-1">Remote</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="capitalize">{application.jobId.type}</span>
                                                    </div>
                                                    {formatSalary(application.jobId.salary) && (
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="w-4 h-4" />
                                                            <span>{formatSalary(application.jobId.salary)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:min-w-0">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(application.status)}
                                            <Badge className={`text-xs font-medium ${getStatusColor(application.status)}`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={application.status}
                                                onValueChange={(value) => handleStatusChange(application._id, value)}
                                            >
                                                <SelectTrigger className="w-32 h-8 text-xs glassmorphic-input">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="applied">Applied</SelectItem>
                                                    <SelectItem value="interviewing">Interviewing</SelectItem>
                                                    <SelectItem value="accepted">Accepted</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditNotes(application)}
                                                className="h-8 px-2"
                                            >
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {application.notes && (
                                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground mb-1">Notes</p>
                                                <p className="text-sm text-muted-foreground">{application.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Interview/Offer Details */}
                                {(application.interviewDate || application.offerDetails) && (
                                    <div className="mt-4 space-y-2">
                                        {application.interviewDate && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-yellow-500" />
                                                <span className="font-medium">Interview:</span>
                                                <span>{new Date(application.interviewDate).toLocaleString()}</span>
                                            </div>
                                        )}
                                        {application.offerDetails && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2 text-sm text-green-800 mb-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="font-medium">Offer Received</span>
                                                </div>
                                                {application.offerDetails.salary && (
                                                    <p className="text-sm text-green-700">
                                                        Salary: ${application.offerDetails.salary.toLocaleString()}
                                                    </p>
                                                )}
                                                {application.offerDetails.startDate && (
                                                    <p className="text-sm text-green-700">
                                                        Start Date: {new Date(application.offerDetails.startDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Notes Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Application Notes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={selectedApplication?.notes || ""}
                                onChange={(e) => setSelectedApplication(prev =>
                                    prev ? { ...prev, notes: e.target.value } : null
                                )}
                                placeholder="Add notes about this application..."
                                className="glassmorphic-input"
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSaveNotes}>
                                Save Notes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}