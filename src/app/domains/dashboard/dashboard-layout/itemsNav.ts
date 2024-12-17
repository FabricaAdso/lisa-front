import { MenuItem } from "@shared/models/menuItems";

export const menuItems: MenuItem[] = [
    {
      title: 'Ambientes',
      icon: 'environment',
      route: 'environments',
      theme: 'outline',
      state: false,
      Role: 'Admiin',
    },
    {
      title: 'Areas',
      icon: 'appstore',
      route: 'environments-area',
      theme: 'outline',
      state: false,
      Role: 'Admin',
    },
    {
      title: 'Inasistencias',
      icon: 'user',
      route: 'absences',
      theme: 'outline',
      state: false,
      Role: 'Instructor',
    },
    {
      title: 'Asignación',
      icon: 'solution',
      route: 'assists',
      theme: 'outline',
      state: false,
      Role: 'Admin',
    },
    {
      title: 'Asistencia',
      icon: 'check-square',
      route: 'fichas/:course_code/attendance',
      theme: 'outline',
      state: false,
      Role: 'Instructor',
    },
    {
      title: 'Centro Formativo',
      icon: 'bank',
      route: 'training-centers',
      theme: 'outline',
      state: false,
      Role: 'Admin',
    },
    {
      title: 'Cursos',
      icon: 'read',
      route: 'course',
      theme: 'outline',
      state: false,
      Role: 'Admin',
    },
    {
      title: 'Fichas',
      icon: 'profile',
      route: 'fichas',
      theme: 'outline',
      state: false,
      Role: 'Instructor',
    },
    {
      title: 'Justificaciones',
      icon: 'file-text',
      route: 'justification',
      theme: 'outline',
      state: false,
      Role: 'Aprendiz',
    },
    {
      title: 'Programas',
      icon: 'project',
      route: 'programs',
      theme: 'outline',
      state: false,
      Role: 'Admin',
    },
    {
      title: 'Roles',
      icon: 'team',
      route: 'roles',
      theme: 'outline',
      state: false,
      Role: 'Admin',
    },
    {
      title: 'Sedes',
      icon: 'home',
      route: 'headquarters',
      theme: 'outline',
      state: false,
      Role: 'Admin,',
    },
    {
      title: 'Sesiónes',
      icon: 'calendar',
      route: 'session',
      theme: 'outline',
      state: false,
      Role: 'Instructor',
    },
  ];