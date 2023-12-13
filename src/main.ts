/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

//axion  configuracion
import axios from "axios";

import mitt from 'mitt';
const emitter = mitt();

axios.interceptors.request.use(
    config => {
      config.headers["Access-Control-Allow-Origin"] = "*";
   
       config.headers["Content-type"] = "Application/json";
      if (localStorage.getItem("token") != null ){
        config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


const app = createApp(App)

registerPlugins(app)
app.provide('emitter', emitter);
app.mount('#app')
