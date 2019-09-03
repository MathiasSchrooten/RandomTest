let get_gateway_url = () => {
    if(window.location.host.includes("cloud.ushakov.co")){
        return "https://" + window.location.host.split('.')[0] + ".gateway.dialogflow.cloud.ushakov.co"
    }

    else {
        return "https://dialogflow-web-v2.gateway.dialogflow.cloud.ushakov.co"
    }
};

export default {
    app: {
        gateway: get_gateway_url(), // <- enter your gateway URL here, the function is just a helper function for my cloud integration. You don't normally need it
        muted: false, // <- mute microphone at start
        start_suggestions: ["I want to increase my digital return on investment", "I want to join the team!", "I want to have a 🥃 with you guys!", "I am working on a project"], // <- array of suggestions, displayed at the start screen
        fallback_lang: 'en' // <- fallback language code, if history mode or network is unavailable
    },
    i18n: {
        en: {
            welcomeTitle: "Welcome to",
            muteTitle: "Mute Toggle",
            inputTitle: "Type something here...",
            sendTitle: "Send",
            microphoneTitle: "Voice Input"
        },
        ru: {
            welcomeTitle: "Добро пожаловать в",
            muteTitle: "Режим звука",
            inputTitle: "Введите ваше сообщение",
            sendTitle: "Отправить",
            microphoneTitle: "Голосовой ввод"
        },
        de: {
            welcomeTitle: "Wilkommen bei",
            muteTitle: "Stumm Modus",
            inputTitle: "Schreiben Sie ihre Nachricht",
            sendTitle: "Senden",
            microphoneTitle: "Spracheingabe"
        },
        fr: {
            welcomeTitle: "Bienvenue à",
            muteTitle: "Sound Mode",
            inputTitle: "Entrez votre message",
            sendTitle: "Envoyer",
            microphoneTitle: "Entrée vocale"
        }
    }
}