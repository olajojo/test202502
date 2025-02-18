export interface SearchResult {
  numFound: number;
  docs: { title: string; author_name?: string[]; cover_i?: number }[];
}
