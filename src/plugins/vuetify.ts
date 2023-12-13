/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { ThemeDefinition, createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VStepper } from 'vuetify/labs/VStepper'
import { VDatePicker } from 'vuetify/labs/VDatePicker'

const MyTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#b059b1',
    secondary: '#8ED7DE',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    bar: '#EDFBFF',
    btnAdd: '#2789D9',
    cardNotas:"#C3A6F5",
    cardRecursos: "#8ED7DE",
    cardArchivos:"#BAF59D",
    cardTitle: "#26A1E0",
    transparent: "#FFFFFF00",
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDataTable,
    VStepper,
    VDatePicker,
  },
  theme: {
    // defaultTheme: "MyTheme",
    defaultTheme: localStorage.getItem("theme") == undefined ? 'MyTheme' : localStorage.getItem("theme")?.toString(),
    themes: {
      MyTheme,
    },
  },
})