"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JobApplicationTracker from "@/components/job-application-tracker";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Loader } from "lucide-react";

export default function ApplicationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Show loading state while checking authentication
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="glassmorphic p-8 rounded-2xl border-foreground/10 scale-in">
                    <div className="flex items-center gap-3">
                        <Loader className="w-5 h-5 text-foreground animate-spin" />
                        <span className="text-foreground font-medium">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (status === "unauthenticated" || !session) {
        return null;
    }

    // Don't show applications page for company users
    const user = session.user as any;
    if (user?.role === "company") {
        router.push("/dashboard/company");
        return null;
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <JobApplicationTracker userId={user?._id} />
                </div>
            </div>

            <Footer />
        </main>
    );
}