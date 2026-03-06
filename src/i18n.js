import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
const resources = {
    en: {
        translation: {
            "app": {
                "restrictedCharts": "Restricted Charts",
                "restrictedChartsDesc": "Login to view the visual model comparison",
                "restrictedSimulator": "Restricted Simulator",
                "restrictedSimulatorDesc": "Login to project your monthly costs accurately",
                "loginNow": "Login Now"
            },
            "header": {
                "costs": "Costs",
                "simulator": "Simulator",
                "logout": "LOGOUT",
                "login": "Login",
                "apiKey": "API Key"
            }
        }
    },
    pt: {
        translation: {
            "app": {
                "restrictedCharts": "Gráficos Restritos",
                "restrictedChartsDesc": "Faça login para visualizar a comparação visual entre modelos",
                "restrictedSimulator": "Simulador Restrito",
                "restrictedSimulatorDesc": "Faça login para projetar seus custos mensais com precisão",
                "loginNow": "Entrar agora"
            },
            "header": {
                "costs": "Custos",
                "simulator": "Simulador",
                "logout": "SAIR",
                "login": "Login",
                "apiKey": "API Key"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "pt", // force pt as default
        fallbackLng: "pt",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
