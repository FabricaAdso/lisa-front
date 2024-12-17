
export interface MenuItem {
  title: string;
  icon?: string;
  route: string | null;
  subMenu?: MenuItem[];
  theme: string;
  state?: boolean;
  Role?: string;
}
