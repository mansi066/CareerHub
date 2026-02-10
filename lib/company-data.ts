// Company profiles and reviews data management
import { Review } from '@/models/Review.Model';

export interface CompanyProfile {
  id: string;
  companyName: string;
  email: string;
  industry: string;
  description: string;
  logo?: string;
  website?: string;
  location: string;
  foundedYear?: number;
  employeeCount?: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  benefits?: string[];
  techStack?: string[];
}

export interface CompanyReview {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  workEnvironment: number; // 1-5
  compensation: number; // 1-5
  careerGrowth: number; // 1-5
  createdAt: string;
  helpful: number;
  position?: string;
  workType?: 'full-time' | 'part-time' | 'internship' | 'contract';
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  averageWorkEnvironment: number;
  averageCompensation: number;
  averageCareerGrowth: number;
}

// Company data management functions
export class CompanyDataManager {
  private static COMPANIES_KEY = 'companyProfiles';

  // Get all company profiles
  static getCompanies(): CompanyProfile[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.COMPANIES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Get company by ID
  static getCompanyById(id: string): CompanyProfile | null {
    const companies = this.getCompanies();
    return companies.find(company => company.id === id) || null;
  }

  // Save company profile
  static saveCompany(company: CompanyProfile): void {
    if (typeof window === 'undefined') return;
    const companies = this.getCompanies();
    const existingIndex = companies.findIndex(c => c.id === company.id);
    
    if (existingIndex >= 0) {
      companies[existingIndex] = company;
    } else {
      companies.push(company);
    }
    
    localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(companies));
  }

  // Fetch reviews for a specific company from API
  static async getCompanyReviews(companyId: string): Promise<CompanyReview[]> {
    try {
      const response = await fetch(`/api/reviews?companyId=${companyId}`);
      if (!response.ok) {
        console.error('Failed to fetch reviews:', response.statusText);
        return [];
      }
      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  // Submit a new review via API
  static async submitReview(reviewData: {
    companyId: string;
    rating: number;
    title: string;
    content: string;
    pros: string[];
    cons: string[];
    workEnvironment: number;
    compensation: number;
    careerGrowth: number;
    position?: string;
    workType?: 'full-time' | 'part-time' | 'internship' | 'contract';
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to submit review' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error submitting review:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Get review statistics for a company
  static async getReviewStats(companyId: string): Promise<ReviewStats> {
    const reviews = await this.getCompanyReviews(companyId);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        averageWorkEnvironment: 0,
        averageCompensation: 0,
        averageCareerGrowth: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const totalWorkEnvironment = reviews.reduce((sum, review) => sum + review.workEnvironment, 0);
    const totalCompensation = reviews.reduce((sum, review) => sum + review.compensation, 0);
    const totalCareerGrowth = reviews.reduce((sum, review) => sum + review.careerGrowth, 0);

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return {
      averageRating: Math.round((totalRating / reviews.length) * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
      averageWorkEnvironment: Math.round((totalWorkEnvironment / reviews.length) * 10) / 10,
      averageCompensation: Math.round((totalCompensation / reviews.length) * 10) / 10,
      averageCareerGrowth: Math.round((totalCareerGrowth / reviews.length) * 10) / 10,
    };
  }

  // Initialize with sample data (for demo purposes)
  // Initialize with 42 sample companies across diverse global industries
  static initializeSampleData(): void {
    if (typeof window === 'undefined') return;
    
    const existingCompanies = this.getCompanies();
    if (existingCompanies.length ==42) return; // Prevent overwriting if already populated

    const sampleCompanies: CompanyProfile[] = [
      // --- EXISTING 21 (Optimized) ---
      { id: 'tc-1', companyName: 'TechCorp Solutions', email: 'hr@techcorp.com', industry: 'Technology', description: 'Enterprise SaaS and cloud infrastructure leader.', website: 'https://techcorp.com', location: 'San Francisco, CA', averageRating: 4.2, totalReviews: 45, createdAt: new Date().toISOString(), techStack: ['React', 'Node.js', 'AWS'] },
      { id: 'il-2', companyName: 'Innovate Labs', email: 'careers@innovatelabs.ai', industry: 'AI', description: 'Building next-gen LLMs and computer vision.', website: 'https://innovatelabs.ai', location: 'New York, NY', averageRating: 4.8, totalReviews: 12, createdAt: new Date().toISOString(), techStack: ['Python', 'PyTorch', 'CUDA'] },
      { id: 'ge-3', companyName: 'GreenEnergy Systems', email: 'jobs@greenenergy.io', industry: 'Clean Tech', description: 'Sustainable energy storage and smart grid software.', website: 'https://greenenergy.io', location: 'Austin, TX', averageRating: 3.9, totalReviews: 88, createdAt: new Date().toISOString(), techStack: ['Java', 'Spring', 'Kafka'] },
      { id: 'fn-4', companyName: 'FinFlow Finance', email: 'hr@finflow.com', industry: 'Fintech', description: 'Digital banking and cross-border payment rails.', website: 'https://finflow.com', location: 'London, UK', averageRating: 4.1, totalReviews: 156, createdAt: new Date().toISOString(), techStack: ['Go', 'TypeScript', 'Redis'] },
      { id: 'ht-5', companyName: 'HealthSync', email: 'hr@healthsync.io', industry: 'Healthcare', description: 'Patient records and remote diagnostic solutions.', website: 'https://healthsync.io', location: 'Boston, MA', averageRating: 4.5, totalReviews: 32, createdAt: new Date().toISOString(), techStack: ['Ruby', 'React Native', 'AWS'] },
      { id: 'ed-6', companyName: 'EduLeap', email: 'careers@eduleap.edu', industry: 'EdTech', description: 'Adaptive learning platforms for K-12 students.', website: 'https://eduleap.edu', location: 'Bangalore, India', averageRating: 4.0, totalReviews: 210, createdAt: new Date().toISOString(), techStack: ['Python', 'Django', 'PostgreSQL'] },
      { id: 'cy-7', companyName: 'CyberShield', email: 'sec@cybershield.net', industry: 'Cybersecurity', description: 'Threat detection and incident response automation.', website: 'https://cybershield.net', location: 'Seattle, WA', averageRating: 4.4, totalReviews: 75, createdAt: new Date().toISOString(), techStack: ['Rust', 'Python', 'Elasticsearch'] },
      { id: 'am-8', companyName: 'AutoMotion', email: 'hr@automotion.com', industry: 'Automotive', description: 'Software for autonomous and electric vehicles.', website: 'https://automotion.com', location: 'Detroit, MI', averageRating: 3.7, totalReviews: 440, createdAt: new Date().toISOString(), techStack: ['C++', 'ROS', 'Embedded Linux'] },
      { id: 'st-9', companyName: 'SkyTravel', email: 'jobs@skytravel.com', industry: 'Travel', description: 'AI-powered global flight booking engine.', website: 'https://skytravel.com', location: 'Barcelona, Spain', averageRating: 3.5, totalReviews: 120, createdAt: new Date().toISOString(), techStack: ['Java', 'Angular', 'Oracle'] },
      { id: 'fd-10', companyName: 'FoodieDeliver', email: 'hr@foodie.com', industry: 'E-commerce', description: 'Local grocery delivery using drone logistics.', website: 'https://foodie.com', location: 'Chicago, IL', averageRating: 4.3, totalReviews: 15, createdAt: new Date().toISOString(), techStack: ['Kotlin', 'GraphQL', 'MongoDB'] },
      { id: 'ec-11', companyName: 'EcoRetail', email: 'jobs@ecoretail.com', industry: 'E-commerce', description: 'Zero-waste online marketplace for artisan goods.', website: 'https://ecoretail.com', location: 'Portland, OR', averageRating: 4.6, totalReviews: 8, createdAt: new Date().toISOString(), techStack: ['Next.js', 'Stripe', 'Tailwind'] },
      { id: 'bt-12', companyName: 'BlockTrust', email: 'hr@blocktrust.io', industry: 'Blockchain', description: 'Enterprise infrastructure for supply chain transparency.', website: 'https://blocktrust.io', location: 'Zug, Switzerland', averageRating: 4.7, totalReviews: 19, createdAt: new Date().toISOString(), techStack: ['Solidity', 'Rust', 'Ethereum'] },
      { id: 'gm-13', companyName: 'GameGalaxy', email: 'play@gamegalaxy.com', industry: 'Gaming', description: 'Indie studio creating VR RPG experiences.', website: 'https://gamegalaxy.com', location: 'Tokyo, Japan', averageRating: 4.5, totalReviews: 66, createdAt: new Date().toISOString(), techStack: ['C#', 'Unity', 'UE5'] },
      { id: 'cl-14', companyName: 'CloudScale', email: 'hr@cloudscale.net', industry: 'Technology', description: 'Serverless monitoring and observability tools.', website: 'https://cloudscale.net', location: 'Berlin, Germany', averageRating: 4.3, totalReviews: 29, createdAt: new Date().toISOString(), techStack: ['Prometheus', 'Grafana', 'Go'] },
      { id: 'ss-15', companyName: 'SolarStream', email: 'hello@solarstream.com', industry: 'Clean Tech', description: 'Residential solar energy management software.', website: 'https://solarstream.com', location: 'Phoenix, AZ', averageRating: 3.6, totalReviews: 110, createdAt: new Date().toISOString(), techStack: ['PHP', 'Laravel', 'MySQL'] },
      { id: 'md-16', companyName: 'MediaMinds', email: 'hr@mediaminds.com', industry: 'Media', description: 'Programmatic advertising and real-time bidding.', website: 'https://mediaminds.com', location: 'Toronto, Canada', averageRating: 3.8, totalReviews: 95, createdAt: new Date().toISOString(), techStack: ['Scala', 'Spark', 'Kafka'] },
      { id: 'lg-17', companyName: 'LogiLink', email: 'jobs@logilink.com', industry: 'Logistics', description: 'Optimizing last-mile delivery via AI tracking.', website: 'https://logilink.com', location: 'Shenzhen, China', averageRating: 4.0, totalReviews: 180, createdAt: new Date().toISOString(), techStack: ['Python', 'FastAPI', 'GCP'] },
      { id: 'bt-18', companyName: 'BioTrend', email: 'hr@biotrend.org', industry: 'Biotech', description: 'Genomics and drug discovery platform.', website: 'https://biotrend.org', location: 'Cambridge, MA', averageRating: 4.7, totalReviews: 14, createdAt: new Date().toISOString(), techStack: ['R', 'Python', 'Kubernetes'] },
      { id: 'ar-19', companyName: 'Architex', email: 'talent@architex.com', industry: 'Construction', description: '3D modeling and BIM software for architecture.', website: 'https://architex.com', location: 'Paris, France', averageRating: 4.1, totalReviews: 52, createdAt: new Date().toISOString(), techStack: ['C#', '.NET', 'Azure'] },
      { id: 'sv-20', companyName: 'SpaceVentures', email: 'launch@spaceventures.com', industry: 'Aerospace', description: 'Satellite constellations for global internet.', website: 'https://spaceventures.com', location: 'Cape Canaveral, FL', averageRating: 4.9, totalReviews: 5, createdAt: new Date().toISOString(), techStack: ['Rust', 'Python', 'Grafana'] },
      { id: 'ww-21', companyName: 'WealthWise', email: 'hr@wealthwise.com', industry: 'Fintech', description: 'Robo-advisor platform for retail investing.', website: 'https://wealthwise.com', location: 'Singapore', averageRating: 4.2, totalReviews: 38, createdAt: new Date().toISOString(), techStack: ['TS', 'Node.js', 'Firebase'] },

      { id: 'nq-22', companyName: 'NanoQuantum', email: 'hr@nanoq.io', industry: 'Quantum Computing', description: 'Building room-temperature quantum processors.', website: 'https://nanoq.io', location: 'Vancouver, Canada', averageRating: 4.6, totalReviews: 22, createdAt: new Date().toISOString(), techStack: ['C++', 'Python', 'Qiskit'] },
      { id: 'ot-23', companyName: 'OceanTech', email: 'explore@ocean.no', industry: 'Maritime', description: 'Autonomous underwater research drones.', website: 'https://ocean.no', location: 'Oslo, Norway', averageRating: 4.4, totalReviews: 31, createdAt: new Date().toISOString(), techStack: ['C++', 'Linux', 'Python'] },
      { id: 'as-24', companyName: 'AgriSense', email: 'hr@agrisense.ke', industry: 'AgriTech', description: 'Precision farming using satellite imagery.', website: 'https://agrisense.ke', location: 'Nairobi, Kenya', averageRating: 4.1, totalReviews: 110, createdAt: new Date().toISOString(), techStack: ['Python', 'TensorFlow', 'PostGIS'] },
      { id: 'um-25', companyName: 'UrbanMove', email: 'hr@urbanmove.es', industry: 'Transport', description: 'Smart city bike and scooter sharing networks.', website: 'https://urbanmove.es', location: 'Madrid, Spain', averageRating: 3.7, totalReviews: 890, createdAt: new Date().toISOString(), techStack: ['Go', 'React', 'Redis'] },
      { id: 'ds-26', companyName: 'DeepStream', email: 'jobs@deepstream.se', industry: 'Media', description: 'AI video compression and delivery protocols.', website: 'https://deepstream.se', location: 'Stockholm, Sweden', averageRating: 4.5, totalReviews: 44, createdAt: new Date().toISOString(), techStack: ['C++', 'Rust', 'FFmpeg'] },
      { id: 'if-27', companyName: 'IronFoundry', email: 'hr@iron.com', industry: 'Manufacturing', description: 'Sustainable steel production using hydrogen.', website: 'https://iron.com', location: 'Pittsburgh, PA', averageRating: 3.9, totalReviews: 205, createdAt: new Date().toISOString(), techStack: ['Java', 'IoT', 'Azure'] },
      { id: 'sb-28', companyName: 'SoftBank Group', email: 'hr@softbank.jp', industry: 'Investment', description: 'Global tech holding and venture capital.', website: 'https://softbank.jp', location: 'Tokyo, Japan', averageRating: 3.4, totalReviews: 2100, createdAt: new Date().toISOString(), techStack: ['Python', 'Tableau', 'Excel'] },
      { id: 'rw-29', companyName: 'RoboWork', email: 'jobs@robowork.com', industry: 'Robotics', description: 'Exoskeletons for industrial factory workers.', website: 'https://robowork.com', location: 'Boston, MA', averageRating: 4.6, totalReviews: 18, createdAt: new Date().toISOString(), techStack: ['C', 'C++', 'Python'] },
      { id: 'gz-30', companyName: 'GameGaze', email: 'hr@gamegaze.ca', industry: 'Gaming', description: 'Cloud gaming infrastructure and SDKs.', website: 'https://gamegaze.ca', location: 'Montreal, Canada', averageRating: 4.3, totalReviews: 55, createdAt: new Date().toISOString(), techStack: ['WebRTC', 'Go', 'React'] },
      { id: 'nl-31', companyName: 'NanoLogic', email: 'hr@nanologic.com', industry: 'Semiconductors', description: 'Carbon nanotube based processor design.', website: 'https://nanologic.com', location: 'Hsinchu, Taiwan', averageRating: 4.8, totalReviews: 9, createdAt: new Date().toISOString(), techStack: ['Verilog', 'C', 'Python'] },
      { id: 'sg-32', companyName: 'SolarGlass', email: 'hr@solarglass.com', industry: 'Clean Tech', description: 'Photovoltaic windows for urban skyscrapers.', website: 'https://solarglass.com', location: 'Phoenix, AZ', averageRating: 4.2, totalReviews: 41, createdAt: new Date().toISOString(), techStack: ['Python', 'MATLAB', 'IoT'] },
      { id: 'sd-33', companyName: 'StellarData', email: 'hr@stellardata.com', industry: 'Technology', description: 'Deep space communication relay networks.', website: 'https://stellardata.com', location: 'San Diego, CA', averageRating: 4.9, totalReviews: 4, createdAt: new Date().toISOString(), techStack: ['Rust', 'C++', 'GCP'] },
      { id: 'zv-34', companyName: 'ZestVideo', email: 'hr@zest.io', industry: 'Social Media', description: 'Short-form video platform for education.', website: 'https://zest.io', location: 'Seoul, Korea', averageRating: 4.1, totalReviews: 670, createdAt: new Date().toISOString(), techStack: ['Node.js', 'React', 'MongoDB'] },
      { id: 'bf-35', companyName: 'BioFuel Pro', email: 'hr@biofuel.br', industry: 'Energy', description: 'Converting organic waste into aviation fuel.', website: 'https://biofuel.br', location: 'Rio de Janeiro, Brazil', averageRating: 3.8, totalReviews: 112, createdAt: new Date().toISOString(), techStack: ['Python', 'SCADA', 'Azure'] },
      { id: 'cl-36', companyName: 'CyberLaw', email: 'hr@cyberlaw.com', industry: 'LegalTech', description: 'Automated contract review and compliance.', website: 'https://cyberlaw.com', location: 'Washington, D.C.', averageRating: 4.3, totalReviews: 34, createdAt: new Date().toISOString(), techStack: ['NLP', 'Python', 'React'] },
      { id: 'fm-37', companyName: 'FleetMaster', email: 'hr@fleet.io', industry: 'Logistics', description: 'Autonomous trucking and freight management.', website: 'https://fleet.io', location: 'San Jose, CA', averageRating: 4.0, totalReviews: 89, createdAt: new Date().toISOString(), techStack: ['Go', 'Python', 'AWS'] },
      { id: 'ap-38', companyName: 'AquaPure', email: 'hr@aquapure.com', industry: 'Clean Tech', description: 'Nano-membrane desalination technology.', website: 'https://aquapure.com', location: 'Dubai, UAE', averageRating: 4.5, totalReviews: 12, createdAt: new Date().toISOString(), techStack: ['C++', 'IoT', 'Python'] },
      { id: 'vs-39', companyName: 'VisionSystems', email: 'hr@visionsys.com', industry: 'AI', description: 'Facial recognition for secure campus access.', website: 'https://visionsys.com', location: 'Tel Aviv, Israel', averageRating: 4.2, totalReviews: 48, createdAt: new Date().toISOString(), techStack: ['Python', 'OpenCV', 'TensorFlow'] },
      { id: 'pm-40', companyName: 'PeerPay', email: 'hr@peerpay.com', industry: 'Fintech', description: 'P2P lending for international students.', website: 'https://peerpay.com', location: 'Sydney, Australia', averageRating: 3.9, totalReviews: 220, createdAt: new Date().toISOString(), techStack: ['TypeScript', 'Node', 'Solana'] },
      { id: 'rt-41', companyName: 'RetailTrace', email: 'hr@trace.io', industry: 'Blockchain', description: 'Verifying authenticity of luxury retail goods.', website: 'https://trace.io', location: 'Milan, Italy', averageRating: 4.4, totalReviews: 29, createdAt: new Date().toISOString(), techStack: ['Solidity', 'NFT', 'React'] },
      { id: 'bc-42', companyName: 'BioCode', email: 'hr@biocode.com', industry: 'Biotech', description: 'Synthesizing DNA for long-term data storage.', website: 'https://biocode.com', location: 'Cambridge, UK', averageRating: 4.7, totalReviews: 15, createdAt: new Date().toISOString(), techStack: ['Python', 'Rust', 'AWS'] }
    ];

    localStorage.setItem(this.COMPANIES_KEY, JSON.stringify(sampleCompanies));
  }
  // Generate unique ID
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}