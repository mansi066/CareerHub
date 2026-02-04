"use client";

import { useEffect, useState } from "react";
import type { Bookmark } from "@/types/bookmark";

const STORAGE_KEY = "careerhub_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored) as Bookmark[]);
      }
    } catch (error) {
      console.error("Failed to load bookmarks", error);
    }
  }, []);

  // Save bookmarks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Failed to save bookmarks", error);
    }
  }, [bookmarks]);

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks((prev: Bookmark[]) => {
      if (prev.some((b: Bookmark) => b.id === bookmark.id)) {
        return prev; // prevent duplicates
      }
      return [...prev, bookmark];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev: Bookmark[]) =>
      prev.filter((b: Bookmark) => b.id !== id)
    );
  };

  const isBookmarked = (id: string): boolean => {
    return bookmarks.some((b: Bookmark) => b.id === id);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
}