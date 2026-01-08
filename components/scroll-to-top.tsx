"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-24 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 md:bottom-8 md:right-28 bg-blue-600 text-white hover:bg-blue-700"
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <ArrowUp className="h-6 w-6" />
        </Button>
    );
}
