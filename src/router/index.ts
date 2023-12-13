// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '../views/Inicio.vue'
import Login from '../components/Login/Login.vue'
import Register from '@/components/Login/Register.vue'
import notFount from '../views/notFount/NotFount.vue'
import Error from '../views/notFount/Error.vue'
import ActividadCompleta from '@/components/Actividad/ActividadCompleta.vue'
import Actividades from '../views/Actividades/Actividadad.vue'
import Ajustes from '@/views/Ajustes/Ajustes.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Inicio,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/noempresa',
    name: 'NoEmpresa',
    component: Error
  },
  {
    path: '/actividad',
    name: 'Actividad',
    component: ActividadCompleta
  },
  {
    path: '/ajustes',
    name: 'Ajustes',
    component: Ajustes
  },
  {
    path: '/detalleActividad/:tipo',
    name: 'detalleActividad',
    props: true,
    component: Actividades
  },
  {
    path :'/:pathMatch(.*)*',
    name: 'notFount',
    component:notFount
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})


export default router;
