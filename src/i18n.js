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
            },
            "statsCards": {
                "avgContext": "Average Context",
                "tokens": "tokens",
                "avgContextDesc": "*Average per conversation (Growth Hub Estimate)",
                "mostRecommended": "Most Recommended",
                "preview": "Preview",
                "mostRecommendedDesc": "*Based on the best global cost vs performance",
                "openSource": "Open-Source",
                "openSourceDesc": "Total privacy via self-hosting, offering the lowest cost on the market.",
                "beginnerModel": "Model for Beginners",
                "beginnerModelDesc": "Easy integration and the best entry cost on the market"
            },
            "costTable": {
                "title": "Strategic Model Comparison",
                "subtitle": "Based on market estimates and Input/Output blending.",
                "addModels": "Models",
                "col1": "Model / AI",
                "col2": "Provider",
                "col3": "In / Out (1M)",
                "col4": "Cost/Conv (70k)",
                "col5": "Impact (1000 Conv)",
                "recommended": "★ Recommended"
            },
            "costChart": {
                "title": "Cost per Conversation — Visual",
                "subtitle": "Direct comparison of cost per conversation at 70k tokens",
                "perConv": "/ conversation"
            },
            "costCalculator": {
                "title": "Monthly Cost Simulator",
                "subtitle": "Drag the slider to project monthly cost based on volume of conversations",
                "convsPerDay": "Convs/day",
                "perDay": "/day",
                "perMonth": "/month",
                "conversations": "conversations"
            },
            "chatWindow": {
                "configureApiKey": "Configure your API Key first by clicking the 🔑 icon",
                "errorProcessing": "Error processing. Try again.",
                "exportHeader": "Growth Hub AI Lab — Exported Chat",
                "model": "Model",
                "date": "Date",
                "growthLab": "Growth Lab:",
                "configKey": "Setup Key",
                "exportChat": "Export chat",
                "clearChat": "Clear chat",
                "startConv": "Start a conversation to test the selected model via OpenRouter.<br />Responses use <strong>Markdown</strong> for better formatting.",
                "thinking": "GROWTH HUB IS THINKING...",
                "sendMsgPls": "Send a message to the agent...",
                "cfgKeyStart": "Configure your API Key to start...",
                "estCost": "Estimated cost for this session:"
            },
            "attendanceSimulator": {
                "title": "Attendance Simulator",
                "subtitle": "Describe how your agent support works to calculate the real cost per conversation.",
                "addModels": "Models",
                "agentQuestions": "Agent Questions",
                "consumePrompts": "Each execution (question/response) consumes ~4,200 prompt tokens",
                "tools": "Tools",
                "consumeTools": "Each tool activation consumes ~8,000 tokens. Select the ones the agent uses:",
                "tokensPerConv": "Tokens per Conversation",
                "executions": "Executions",
                "toolsLegend": "Tools",
                "marginLegend": "Margin",
                "costPerConv": "Cost per Conversation",
                "monthlyProjection": "Monthly Projection (100 conv/day)",
                "perMonth": "/month",
                "scheduling": "Scheduling",
                "schedulingDesc": "Check schedules and book appointments",
                "spreadsheet": "Spreadsheet/CRM Search",
                "spreadsheetDesc": "Query data in spreadsheets or systems",
                "inventory": "Inventory Check",
                "inventoryDesc": "Check product availability",
                "tool": "tool",
                "toolsPlural": "tools"
            },
            "authModal": {
                "passwordUpdated": "Password updated successfully!",
                "recoveryLinkSent": "Recovery link sent successfully!",
                "accountCreated": "Account created successfully! Please log in.",
                "createNewPassword": "Create New Password",
                "recoverPassword": "Recover Password",
                "welcomeBack": "Welcome back",
                "createNewAccount": "Create new account",
                "typeNewPassword": "Type your new password below",
                "willSendLink": "We will send a link to your email",
                "loginToContinue": "Login to continue",
                "signupToStart": "Sign up to start",
                "yourEmailPlaceholder": "your email",
                "newPasswordPlaceholder": "New password",
                "rememberMe": "Remember me",
                "forgotPasswordBtn": "Forgot my password",
                "resetPasswordLoading": "Reset Password",
                "sendLink": "Send Link",
                "enterBtn": "Login",
                "createAccountNow": "Create Account Now",
                "backToLogin": "Back to Login",
                "dontHaveAccount": "Don't have an account? Create one",
                "alreadyHaveAccount": "Already have an account? Log in",
                "or": "Or",
                "continueWithGoogle": "Continue with Google"
            },
            "modelCatalog": {
                "title": "Model Catalog",
                "subtitle": "Select additional models to compare in your dashboard.",
                "emptyState": "No additional models currently available in the catalog.",
                "removeFromDashboard": "Remove from Dashboard",
                "addToDashboard": "Add to Dashboard"
            },
            "apiKeyModal": {
                "apiKey": "API Key",
                "openRouterDesc": "Insert your OpenRouter API key to use the AI Lab. The key is only saved in your browser.",
                "createKey": "Create key in OpenRouter",
                "remove": "Remove",
                "saved": "Saved!",
                "saveKey": "Save Key"
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
            },
            "statsCards": {
                "avgContext": "Contexto Médio",
                "tokens": "tokens",
                "avgContextDesc": "*Média por conversa (Estimativa Growth Hub)",
                "mostRecommended": "Mais Recomendável",
                "preview": "Preview",
                "mostRecommendedDesc": "*Baseado no melhor custo x performance global",
                "openSource": "Open-Source",
                "openSourceDesc": "Privacidade total via auto-hospedagem, oferecendo o menor custo do mercado.",
                "beginnerModel": "Modelo para Iniciantes",
                "beginnerModelDesc": "Fácil integração e o melhor custo de entrada do mercado"
            },
            "costTable": {
                "title": "Comparativo Estratégico de Modelos",
                "subtitle": "Baseado em estimativas de mercado e blending de Input/Output.",
                "addModels": "Modelos",
                "col1": "Modelo / IA",
                "col2": "Provedor",
                "col3": "In / Out (1M)",
                "col4": "Custo/Conv (70k)",
                "col5": "Impacto (1000 Conv)",
                "recommended": "★ Recomendado"
            },
            "costChart": {
                "title": "Custo por Conversa — Visual",
                "subtitle": "Comparação direta do custo por conversa de 70k tokens",
                "perConv": "/ conversa"
            },
            "costCalculator": {
                "title": "Simulador de Custo Mensal",
                "subtitle": "Arraste o slider para projetar o custo mensal baseado no volume de conversas",
                "convsPerDay": "Conversas/dia",
                "perDay": "/dia",
                "perMonth": "/mês",
                "conversations": "conversas"
            },
            "chatWindow": {
                "configureApiKey": "Configure sua API Key primeiro clicando no ícone 🔑",
                "errorProcessing": "Erro ao processar. Tente novamente.",
                "exportHeader": "Growth Hub AI Lab — Conversa exportada",
                "model": "Modelo",
                "date": "Data",
                "growthLab": "Growth Lab:",
                "configKey": "Configurar Key",
                "exportChat": "Exportar conversa",
                "clearChat": "Limpar chat",
                "startConv": "Inicie uma conversa para testar o modelo selecionado via OpenRouter.<br />As respostas usam <strong>Markdown</strong> para melhor formatação.",
                "thinking": "GROWTH HUB ESTÁ PENSANDO...",
                "sendMsgPls": "Envie uma mensagem para o agente...",
                "cfgKeyStart": "Configure sua API Key para começar...",
                "estCost": "Custo estimado desta sessão:"
            },
            "attendanceSimulator": {
                "title": "Simulador de Atendimento",
                "subtitle": "Descreva como funciona o atendimento do seu agente para calcular o custo real por conversa.",
                "addModels": "Modelos",
                "agentQuestions": "Perguntas do Agente",
                "consumePrompts": "Cada execução (pergunta/resposta) consome ~4.200 tokens de prompt",
                "tools": "Ferramentas (Tools)",
                "consumeTools": "Cada ativação de tool consome ~8.000 tokens. Selecione as que o agente usa:",
                "tokensPerConv": "Tokens por Conversa",
                "executions": "Execuções",
                "toolsLegend": "Tools",
                "marginLegend": "Margem",
                "costPerConv": "Custo por Conversa",
                "monthlyProjection": "Projeção Mensal (100 conv/dia)",
                "perMonth": "/mês",
                "scheduling": "Agendamento",
                "schedulingDesc": "Verificar horários e agendar compromissos",
                "spreadsheet": "Busca em Planilha/CRM",
                "spreadsheetDesc": "Consultar dados em planilhas ou sistemas",
                "inventory": "Verificação de Estoque",
                "inventoryDesc": "Checar disponibilidade de produtos",
                "tool": "tool",
                "toolsPlural": "tools"
            },
            "authModal": {
                "passwordUpdated": "Senha atualizada com sucesso!",
                "recoveryLinkSent": "Link de recuperação enviado com sucesso!",
                "accountCreated": "Conta criada com sucesso! Faça login.",
                "createNewPassword": "Criar Nova Senha",
                "recoverPassword": "Recuperar Senha",
                "welcomeBack": "Bem-vindo de volta",
                "createNewAccount": "Criar nova conta",
                "typeNewPassword": "Digite sua nova senha abaixo",
                "willSendLink": "Enviaremos um link para seu email",
                "loginToContinue": "Faça login para continuar",
                "signupToStart": "Cadastre-se para começar",
                "yourEmailPlaceholder": "seu email",
                "newPasswordPlaceholder": "Nova senha",
                "rememberMe": "Lembrar de mim",
                "forgotPasswordBtn": "Esqueci a senha",
                "resetPasswordLoading": "Redefinir Senha",
                "sendLink": "Enviar Link",
                "enterBtn": "Entrar",
                "createAccountNow": "Criar Conta Agora",
                "backToLogin": "Voltar para o Login",
                "dontHaveAccount": "Não tem uma conta? Crie uma",
                "alreadyHaveAccount": "Já tem uma conta? Entre",
                "or": "Ou",
                "continueWithGoogle": "Continuar com Google"
            },
            "modelCatalog": {
                "title": "Catálogo de Modelos",
                "subtitle": "Selecione modelos adicionais para comparar no seu dashboard.",
                "emptyState": "Nenhum modelo adicional disponível no momento no catálogo.",
                "removeFromDashboard": "Remover do Dashboard",
                "addToDashboard": "Adicionar ao Dashboard"
            },
            "apiKeyModal": {
                "apiKey": "API Key",
                "openRouterDesc": "Insira sua chave da API do OpenRouter para usar o AI Lab. A chave fica salva apenas no seu navegador.",
                "createKey": "Criar chave no OpenRouter",
                "remove": "Remover",
                "saved": "Salvo!",
                "saveKey": "Salvar Chave"
            }
        }
    }
};

const getInitialLanguage = () => {
    // 1. Check if user already manually selected a language
    const savedLng = localStorage.getItem('i18nextLng');
    if (savedLng) return savedLng;

    // 2. Otherwise, check browser language
    const browserLng = navigator.language || navigator.userLanguage;

    // If it's Brazilian or general Portuguese, return 'pt'
    if (browserLng.toLowerCase().startsWith('pt')) {
        return 'pt';
    }

    // 3. Default for everyone else (International/IP context via Browser API)
    return 'en';
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLanguage(),
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

// Listen for language changes and save to localStorage
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
});

export default i18n;
