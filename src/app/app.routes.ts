import { Routes } from '@angular/router';
import { GptComponent } from './pages/gpt/gpt.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [{
    path: 'assistant',
    component: GptComponent
}, {
    path: 'home',
    component: HomeComponent
}, {
    path: '',
    pathMatch: 'full',
    redirectTo: '/assistant'
}];
