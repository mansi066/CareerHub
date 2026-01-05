// Bookmark/Save Jobs data management
export interface BookmarkedOpportunity {
  id: string;
  opportunityId: number;
  type: "job" | "internship" | "scholarship" | "company";
  title: string;
  company: string;
  location: string;
  salary?: string;
  deadline?: string;
  description: string;
  tags: string[];
  savedAt: string;
  notes?: string;
  companyId?: string; // For company bookmarks
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  bookmarks: string[]; // Array of bookmark IDs
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkStats {
  totalBookmarks: number;
  jobsCount: number;
  internshipsCount: number;
  scholarshipsCount: number;
  companiesCount: number;
  collectionsCount: number;
}

// Bookmark data management functions
export class BookmarkManager {
  private static BOOKMARKS_KEY = 'userBookmarks';
  private static COLLECTIONS_KEY = 'bookmarkCollections';

  // Get all bookmarks for current user
  static getBookmarks(): BookmarkedOpportunity[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Get bookmark by opportunity ID
  static getBookmarkByOpportunityId(opportunityId: number): BookmarkedOpportunity | null {
    const bookmarks = this.getBookmarks();
    return bookmarks.find(bookmark => bookmark.opportunityId === opportunityId) || null;
  }

  // Check if opportunity is bookmarked
  static isBookmarked(opportunityId: number): boolean {
    return this.getBookmarkByOpportunityId(opportunityId) !== null;
  }

  // Add bookmark
  static addBookmark(opportunity: any, type: "job" | "internship" | "scholarship" | "company", notes?: string): void {
    if (typeof window === 'undefined') return;
    
    const bookmarks = this.getBookmarks();
    
    // Check if already bookmarked
    if (this.isBookmarked(opportunity.id)) {
      return;
    }

    const bookmark: BookmarkedOpportunity = {
      id: this.generateId(),
      opportunityId: opportunity.id,
      type,
      title: opportunity.title || opportunity.companyName,
      company: opportunity.company || opportunity.companyName,
      location: opportunity.location,
      salary: opportunity.salary,
      deadline: opportunity.deadline,
      description: opportunity.description,
      tags: opportunity.tags || opportunity.techStack || [],
      savedAt: new Date().toISOString(),
      notes,
      companyId: opportunity.companyId || opportunity.id
    };

    bookmarks.push(bookmark);
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }

  // Remove bookmark
  static removeBookmark(opportunityId: number): void {
    if (typeof window === 'undefined') return;
    
    const bookmarks = this.getBookmarks();
    const filteredBookmarks = bookmarks.filter(bookmark => bookmark.opportunityId !== opportunityId);
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
  }

  // Toggle bookmark
  static toggleBookmark(opportunity: any, type: "job" | "internship" | "scholarship" | "company", notes?: string): boolean {
    if (this.isBookmarked(opportunity.id)) {
      this.removeBookmark(opportunity.id);
      return false; // Removed
    } else {
      this.addBookmark(opportunity, type, notes);
      return true; // Added
    }
  }

  // Get bookmarks by type
  static getBookmarksByType(type: "job" | "internship" | "scholarship" | "company"): BookmarkedOpportunity[] {
    const bookmarks = this.getBookmarks();
    return bookmarks.filter(bookmark => bookmark.type === type);
  }

  // Get recent bookmarks (last 10)
  static getRecentBookmarks(limit: number = 10): BookmarkedOpportunity[] {
    const bookmarks = this.getBookmarks();
    return bookmarks
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
      .slice(0, limit);
  }

  // Search bookmarks
  static searchBookmarks(query: string): BookmarkedOpportunity[] {
    const bookmarks = this.getBookmarks();
    const searchTerm = query.toLowerCase();
    
    return bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.company.toLowerCase().includes(searchTerm) ||
      bookmark.description.toLowerCase().includes(searchTerm) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Get bookmark statistics
  static getBookmarkStats(): BookmarkStats {
    const bookmarks = this.getBookmarks();
    const collections = this.getCollections();
    
    return {
      totalBookmarks: bookmarks.length,
      jobsCount: bookmarks.filter(b => b.type === 'job').length,
      internshipsCount: bookmarks.filter(b => b.type === 'internship').length,
      scholarshipsCount: bookmarks.filter(b => b.type === 'scholarship').length,
      companiesCount: bookmarks.filter(b => b.type === 'company').length,
      collectionsCount: collections.length
    };
  }

  // Update bookmark notes
  static updateBookmarkNotes(opportunityId: number, notes: string): void {
    if (typeof window === 'undefined') return;
    
    const bookmarks = this.getBookmarks();
    const bookmarkIndex = bookmarks.findIndex(b => b.opportunityId === opportunityId);
    
    if (bookmarkIndex >= 0) {
      bookmarks[bookmarkIndex].notes = notes;
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  }

  // Collections Management
  static getCollections(): BookmarkCollection[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.COLLECTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static createCollection(name: string, description?: string): BookmarkCollection {
    if (typeof window === 'undefined') throw new Error('Not in browser environment');
    
    const collections = this.getCollections();
    const collection: BookmarkCollection = {
      id: this.generateId(),
      name,
      description,
      bookmarks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    collections.push(collection);
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    return collection;
  }

  static addToCollection(collectionId: string, bookmarkId: string): void {
    if (typeof window === 'undefined') return;
    
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    
    if (collectionIndex >= 0 && !collections[collectionIndex].bookmarks.includes(bookmarkId)) {
      collections[collectionIndex].bookmarks.push(bookmarkId);
      collections[collectionIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    }
  }

  static removeFromCollection(collectionId: string, bookmarkId: string): void {
    if (typeof window === 'undefined') return;
    
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    
    if (collectionIndex >= 0) {
      collections[collectionIndex].bookmarks = collections[collectionIndex].bookmarks.filter(id => id !== bookmarkId);
      collections[collectionIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    }
  }

  static deleteCollection(collectionId: string): void {
    if (typeof window === 'undefined') return;
    
    const collections = this.getCollections();
    const filteredCollections = collections.filter(c => c.id !== collectionId);
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(filteredCollections));
  }

  static getCollectionBookmarks(collectionId: string): BookmarkedOpportunity[] {
    const collections = this.getCollections();
    const bookmarks = this.getBookmarks();
    const collection = collections.find(c => c.id === collectionId);
    
    if (!collection) return [];
    
    return bookmarks.filter(bookmark => collection.bookmarks.includes(bookmark.id));
  }

  // Initialize with default collection
  static initializeDefaultCollection(): void {
    if (typeof window === 'undefined') return;
    
    const collections = this.getCollections();
    if (collections.length === 0) {
      this.createCollection('My Saved Jobs', 'Default collection for saved opportunities');
    }
  }

  // Generate unique ID
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all bookmarks (for testing/reset)
  static clearAllBookmarks(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.BOOKMARKS_KEY);
    localStorage.removeItem(this.COLLECTIONS_KEY);
  }

  // Export bookmarks (for backup/sharing)
  static exportBookmarks(): string {
    const bookmarks = this.getBookmarks();
    const collections = this.getCollections();
    return JSON.stringify({ bookmarks, collections }, null, 2);
  }

  // Import bookmarks (for restore)
  static importBookmarks(data: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const parsed = JSON.parse(data);
      if (parsed.bookmarks) {
        localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(parsed.bookmarks));
      }
      if (parsed.collections) {
        localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(parsed.collections));
      }
    } catch (error) {
      throw new Error('Invalid bookmark data format');
    }
  }
}