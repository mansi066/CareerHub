"use client"
import { Github, Twitter, Linkedin } from "lucide-react"

// Footer component
export default function Footer() {
  return (
    // Main footer wrapper with background and top border
    <footer className="bg-card border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center">

          {/* BRAND */}
          <div className="max-w-xs mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              {/* Logo box */}
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">C</span>
              </div>

              {/* Brand name */}
              <span className="font-bold text-foreground">CareerHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering careers and securing futures, one opportunity at a time.
            </p>
          </div>

          {/* OPPORTUNITIES */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Opportunities</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="footer-link">Jobs</a></li>
              <li><a href="#" className="footer-link">Scholarships</a></li>
              <li><a href="#" className="footer-link">Internships</a></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="footer-link">Career Blog</a></li>
              <li><a href="#" className="footer-link">Resume Tips</a></li>
              <li><a href="#" className="footer-link">Interview Prep</a></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="footer-link">Privacy</a></li>
              <li><a href="#" className="footer-link">Terms</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-center gap-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerHub. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" aria-label="Twitter" className="social-icon">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="social-icon">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" aria-label="GitHub" className="social-icon">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
