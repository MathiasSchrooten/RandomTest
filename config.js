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
        start_suggestions: [
            {
                title: 'I want to increase my digital return on investment 💻',
            },
            {
                title: 'I want to join the team! 💪'
            },
            {
                title: 'I want to have a 🥃 with you guys!'
            },
            {
                title: 'I am working on a project'
            }],
        origin_handle_conquered_suggs: [
            {
                title: 'The origin story',
            },
            {
                title: 'How we handle things'
            },
            {
                title: 'Technologies we conquered'
            }],
        join_team_suggestions: [
            {
                title: 'Yes 👍',
                url: 'https://www.wisemen.digital/careers'
            },
            {
                title: 'No 👎'
            }
        ],
        workingonproject: [
            {
                title: 'I have an idea 💡',
            },
            {
                title: 'I’m designing 🎨'
            },
            {
                title: 'I’m developing 💻'
            },
            {
                title: 'I’ve already launched 🚀'
            }],
        handle: [
            {
                title: 'Design 🎨',
            },
            {
                title: 'Develop 🔧'
            },
            {
                title: 'Grow 🌳'
            },
            {
                title: 'Go back'
            }],
        handle_develop: [
            {
                title: 'Iterative Development'
            },
            {
                title: 'Minimum Lovable Product',
            }],
        handle_grow: [
            {
                title: 'Go to Market',
            },
            {
                title: 'Branding'
            },
            {
                title: "Social Media"
            },
            {
                title: 'Measure and Improve'
            },
            {
                title: 'Conversion'
            },
            {
                title: 'Advertising'
            },
            {
                title: 'Personalization'
            }],
        handle_design: [
            {
                title: 'Ideation',
            },
            {
                title: 'Customer Journey'
            },
            {
                title: "Persona's"
            },
            {
                title: 'Architecture'
            },
            {
                title: 'Service Blueprint'
            },
            {
                title: 'Validation'
            },
            {
                title: 'Rapid Prototyping'
            },
            {
                title: 'UX/UI'
            }],
        drinks: [
            {
                title: '🍺',
            },
            {
                title: '🍷'
            },
            {
                title: "🍹"
            },
            {
                title: '🍸'
            },
            {
                title: '☕️'
            },
            {
                title: '🥃'
            },
            {
                title: '🍾'
            }],
        handle_develop_mlp: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#slide-6-trigger'
            },
            {
                title: 'No 👎',
            }],
        handle_grow_cs: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#slide-10-trigger'
            },
            {
                title: 'No 👎',
            }],
        handle_grow_dm: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#slide-10-trigger'
            },
            {
                title: 'No 👎',
            }],
        handle_grow_sla: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#bottom'
            },
            {
                title: 'No 👎',
            }],
        handle_design_explore: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#slide-2-trigger'
            },
            {
                title: 'No 👎',
            }],
        handle_design_plan: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#slide-5-trigger'
            },
            {
                title: 'No 👎',
            }],
        handle_design_validate: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#slide-3-trigger'
            },
            {
                title: 'No 👎',
            }],
        handle_design_ux: [
            {
                title: 'Yes 👍',
                url: 'https://wisemen.digital/approach#slide-4-trigger'
            },
            {
                title: 'No 👎',
            }],
        read_more: [
            {
                title: 'Read more'
            },
            {
                title: 'Go back'
            }
        ],
        you_bet: [
            {
                title: 'How we handle things'
            },
            {
                title: 'Technologies we conquered'
            },
            {
                title: '🔙 to start'
            }
        ],
        you_bet_suggs: [
            {
                title: 'You bet!'
            }
        ],
        skip_suggs: [
            {
                title: 'Skip'
            }
        ],
        skip2_suggs: [
            {
                title: 'Skip '
            }
        ],
        skip3_suggs: [
            {
                title: 'Skip  '
            }
        ],
        conquered_tech: [
            {
                title: 'Mobile'
            },
            {
                title: 'Ai'
            },
            {
                title: 'Conversational'
            },
            {
                title: 'AR/VR'
            },
            {
                title: 'IoT'
            },
            {
                title: 'RPA'
            }
        ],
        conquered_tech_ai: [
            {
                title: 'AR/VR'
            },
            {
                title: 'Conversational'
            },
            {
                title: 'IoT'
            },
            {
                title: 'Mobile'
            },
            {
                title: 'RPA'
            },
            {
                title: '🔙 to start'
            }
        ],
        conquered_tech_arvr: [
            {
                title: 'AI'
            },
            {
                title: 'Conversational'
            },
            {
                title: 'IoT'
            },
            {
                title: 'Mobile'
            },
            {
                title: 'RPA'
            },
            {
                title: '🔙 to start'
            }
        ],
        conquered_tech_conv: [
            {
                title: 'AI'
            },
            {
                title: 'AR/VR'
            },
            {
                title: 'IoT'
            },
            {
                title: 'Mobile'
            },
            {
                title: 'RPA'
            },
            {
                title: '🔙 to start'
            }
        ],
        conquered_tech_iot: [
            {
                title: 'AI'
            },
            {
                title: 'AR/VR'
            },
            {
                title: 'Conversational'
            },
            {
                title: 'Mobile'
            },
            {
                title: 'RPA'
            },
            {
                title: '🔙 to start'
            }
        ],
        conquered_tech_mobile: [
            {
                title: 'AI'
            },
            {
                title: 'AR/VR'
            },
            {
                title: 'Conversational'
            },
            {
                title: 'IoT'
            },
            {
                title: 'RPA'
            },
            {
                title: '🔙 to start'
            }
        ],
        conquered_tech_rpa: [
            {
                title: 'AI'
            },
            {
                title: 'AR/VR'
            },
            {
                title: 'Conversational'
            },
            {
                title: 'IoT'
            },
            {
                title: 'Mobile'
            },
            {
                title: '🔙 to start'
            }
        ],
        stop_suggs: [
            {
                title: 'Stop ✋'
            }
        ],

        beer_suggs: [
            {
                title: 'Stop ✋'
            }
        ],
        wine_suggs: [
            {
                title: 'Stop ✋'
            }
        ],
        cocktail_suggs: [
            {
                title: 'Stop ✋'
            }
        ],
        martini_suggs: [
            {
                title: 'Stop ✋'
            }
        ],
        coffee_suggs: [
            {
                title: 'Stop ✋'
            }
        ],
        whiskey_suggs: [
            {
                title: 'Stop ✋'
            }
        ],
        champagne_suggs: [
            {
                title: 'Stop ✋'
            }
        ],

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