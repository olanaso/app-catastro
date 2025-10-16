import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import FichaForm from './pages/FichaForm.jsx';
import PendientesPage from './pages/PendientesPage.jsx';
import EnviarInfoPage from './pages/EnviarInfoPage.jsx';

const routes = [
  {
    path: '/',
    component: LoginPage
  },
  {
    path: '/home',
    component: HomePage
  },
  {
    path: '/registrar',
    component: FichaForm
  },
  {
    path: '/pendientes',
    component: PendientesPage
  },
  {
    path: '/enviar',
    component: EnviarInfoPage
  }
];

export default routes;
