import { MenuItem } from "@shared/models/menuItems";

export const menuItems: MenuItem[] = [

  {
    title: 'Roles',
    icon: 'team',
    route: 'roles',
    theme: 'outline',
    state: false,
    Role: ['Aprendiz',]
  },
  {
    title: 'Centro Formativo',
    icon: 'bank',
    route: 'training-centers',
    theme: 'outline',
    state: false,
    Role: ['Usuario'],
  },
  {
    title: 'Sedes',
    icon: 'environment',
    route: 'environments',
    theme: 'outline',
    state: false,
    Role: ['Usuario'],
  },
  {
    title: 'Sesiones',
    icon: 'solution',
    route: 'session',
    theme: 'outline',
    state: false,
    Role: ['Usuario'],
  },
  {
    title: 'Gestion',
    icon: 'profile',
    route: 'managesession',
    theme: 'outline',
    state: false,
    Role: ['Usuario'],
  },
  {
    title: 'Calendario',
    icon: 'calendar',
    route: 'session-calendar',
    theme: 'outline',
    state: false,
    Role: ['Usuario'],
  },
  {
    title: 'Inasistencias',
    icon: 'user',
    route: 'absences',
    theme: 'outline',
    state: false,
    Role: ['Usuario'],
  },
  {
    title: 'Justificaciones',
    icon: 'file-text',
    route: 'justification',
    theme: 'outline',
    state: false,
    Role: ['Usuario'],
  }
];
