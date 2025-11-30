export type BreadcrumbItem = {
  name: string;
  href: string;
  items?: Record<string, BreadcrumbItem>;
};
