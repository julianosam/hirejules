import { Routes } from '@angular/router';
import { GptComponent } from './pages/gpt/gpt.component';

export const routes: Routes = [{
    path: 'assistant',
    component: GptComponent
},{
    path: '',
    component: GptComponent
}];
