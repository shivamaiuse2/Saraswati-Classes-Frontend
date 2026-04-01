export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  category: "COURSE" | "TEST_SERIES";
  referenceId: string;
  createdAt?: string;
  updatedAt?: string;
}
