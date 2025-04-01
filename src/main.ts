import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { IconDefinition } from '@ant-design/icons-angular';
import { AppComponent } from './app/app.component';
import { NotificationOutline, UserOutline, HomeOutline, AlertOutline, BellOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
bootstrapApplication(AppComponent, appConfig,)
  .catch((err) => console.error(err));

  // Define los íconos que vas a utilizar
  const icons: IconDefinition[] = [NotificationOutline, UserOutline, HomeOutline, AlertOutline, BellOutline];
  NzIconModule.forRoot(icons);
