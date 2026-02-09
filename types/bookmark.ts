export type OpportunityType = "job" | "internship" | "scholarship";

export interface Bookmark {
  id: string;
  title: string;
  type: OpportunityType;
  deadline?: string;
  createdAt: string;
}