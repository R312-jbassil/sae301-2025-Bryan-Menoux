// Configuration centralisée
export const getPocketBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    // Côté client
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:8090';
    }
    return 'https://ta-vue.bryan-menoux.fr';
  }
  // Côté serveur
  return 'http://localhost:8090';
};

export const POCKETBASE_URL = getPocketBaseURL();
