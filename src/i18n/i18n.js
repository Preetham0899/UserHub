import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      PROFILE: 'Profile',
      SIGNED_IN_AS: 'Signed in as:',
      ADD_NEW_USER: 'Add New User',
      NAME: 'Name',
      EMAIL: 'Email',
      PHONE: 'Phone',
      WEBSITE: 'Website',
      ADD_USER: 'Add User',
      SAVING: 'Saving...',
      LOGOUT: 'Logout',
      SELECT_LANGUAGE: 'Select Language',
      USER_DIRECTORY: 'User Directory',
      SEARCH_PLACEHOLDER: 'Search by name, email, or phone...',
      NO_USERS_FOUND: 'No Users Found',
      TRY_ADD_USER: 'Try adding a new user from your Profile screen or refresh the list.',
      DELETE : 'Delete',
    },
  },
  es: {
    translation: {
      PROFILE: 'Perfil',
      SIGNED_IN_AS: 'Conectado como:',
      ADD_NEW_USER: 'Agregar nuevo usuario',
      NAME: 'Nombre',
      EMAIL: 'Correo electrónico',
      PHONE: 'Teléfono',
      WEBSITE: 'Sitio web',
      ADD_USER: 'Agregar usuario',
      SAVING: 'Guardando...',
      LOGOUT: 'Cerrar sesión',
      SELECT_LANGUAGE: 'Seleccionar idioma',
      USER_DIRECTORY: 'Directorio de usuarios',
      SEARCH_PLACEHOLDER: 'Buscar por nombre, correo o teléfono...',
      NO_USERS_FOUND: 'No se encontraron usuarios',
      TRY_ADD_USER: 'Intenta agregar un nuevo usuario desde tu pantalla de perfil o actualiza la lista.',
      DELETE : 'Eliminar',
    },
  },
};

i18n
  .use(initReactI18next) // this connects React to i18n context
  .init({
    resources,
    lng: 'en', // default
    fallbackLng: 'en',
    compatibilityJSON: 'v3', // for RN compatibility
    interpolation: { escapeValue: false },
  });

export default i18n;
