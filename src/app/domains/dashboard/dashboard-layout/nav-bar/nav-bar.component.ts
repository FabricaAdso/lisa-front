import { CommonModule } from '@angular/common'; // Importa el módulo común de Angular para usar directivas comunes
import { Component } from '@angular/core'; // Importa el decorador Component para crear componentes de Angular
import { RouterOutlet } from '@angular/router'; // Importa RouterOutlet para permitir la navegación entre rutas
import { NzIconModule } from 'ng-zorro-antd/icon'; // Importa el módulo de iconos de Ng Zorro
import { NzMenuModule } from 'ng-zorro-antd/menu'; // Importa el módulo de menús de Ng Zorro

@Component({
  selector: 'app-nav-bar', // Selector del componente, usado en HTML para referenciarlo
  standalone: true, // Indica que este componente es autónomo y no requiere un módulo Ng
  imports: [
    CommonModule, // Agrega el módulo común para acceder a directivas como *ngIf, *ngFor, etc.
    RouterOutlet, // Permite la inclusión de componentes basados en la ruta
    NzIconModule, // Agrega el módulo de iconos para usar en el menú
    NzMenuModule, // Agrega el módulo de menús para crear un menú de navegación
  ],
  templateUrl: './nav-bar.component.html', // Ruta del archivo de plantilla HTML
  styleUrls: ['./nav-bar.component.css'], // Ruta del archivo de estilos CSS
})
export class NavBarComponent {
  isLoggedIn = true; // Estado que indica si el usuario está logueado (true o false)
  userName = 'Yesid Jimenez'; // Nombre del usuario logueado, se puede modificar según el usuario

  // Método para simular el inicio de sesión
  login() {
    console.log('Iniciar sesión...'); // Muestra un mensaje en la consola cuando se llama a este método
    // Aquí puedes implementar la lógica de inicio de sesión (por ejemplo, autenticación con API)
    this.isLoggedIn = true; // Cambia el estado de inicio de sesión a verdadero (simulación)
  }
  Image_logo: string = 'assets/images/logo_lol.png';
  UserImage: string = 'assets/images/userimage.jpeg'
}
