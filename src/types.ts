export interface Experience {
  title: string;
  company: string;
  period: string;
  description?: string;
}

export interface Software {
  name: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  imageUrl: string;
  number: string;
  pdfUrl?: string;
}
