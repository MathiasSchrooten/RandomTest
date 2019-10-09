<template>
    <div >
        <div style="display: flex;justify-content: flex-end; width: 100%; height: 80%;">
            <main id="app" >
                <div style="width: 100%; height: 100%; overflow-y: scroll">
                    <TopHead v-if="app && messages.length > 0" :app="app"></TopHead>
                    <section class="container chat-container">

                        <div id="tContainer" ref="mContainer" class="">
                            <table class="message">
                                <tr>
                                    <td>
                                        <Bubble from="bot" :text="hey" :mp3url="false" :image-url="false" :video-url="false" :pdf-url="false"></Bubble>
                                    </td>
                                </tr>
                            </table>
                            <table  v-for="m in messages" class="message">
                                <tr>
                                    <!-- My message -->
                                    <Bubble v-if="m.queryResult.queryText !== '' || (meText !== '' && meVisible === true)" :text="m.queryResult.queryText"   from="me" />

                                </tr>

                                <!-- Component iterator (Dialogflow Gateway Feature) -->
                                <tr class="component" v-for="component in m.queryResult.fulfillmentMessages">

                                        <Bubble from="bot" :text="component.content" :mp3url="component.mp3url" :imageUrl="component.imageUrl" :videoUrl="component.videoUrl" :pdfUrl="component.pdfUrl"  v-if="component.name === 'multi'" />

                                        <Bubble from="bot" :text="component.content" :mp3url="false" :image-url="false" :video-url="false" :pdf-url="false"  v-if="component.name === 'DEFAULT'" />

                                        <Bubble from="bot" :text="component.content.displayText || component.content.textToSpeech" v-if="component.name == 'SIMPLE_RESPONSE'" />

                                        <!-- Card -->
                                        <Card from="bot" :title="component.content.title" :subtitle="component.content.subtitle" :image="component.content.image" :text="component.content.formattedText" :button="component.content.buttons[0]" v-if="component.name == 'CARD'" />

                                        <!-- Carousel layout and cards -->
                                        <div class="carousel" v-if="component.name === 'CAROUSEL_CARD'">
                                            <Card v-for="card in component.content" @click.native="send(card.info.key)" :key="card.info.key" :title="card.title" :image="card.image" :subtitle="card.subtitle" :text="card.description" />
                                        </div>

                                        <!-- List -->
                                        <List @select="send" :items="component.content.items" :title="component.content.title" v-if="component.name == 'LIST'" />

                                        <!-- Webhook Image -->
                                        <Picture v-if="component.name == 'IMAGE'" :image="component.content" />

                                </tr>
                            </table>
                            <div id="bottom"></div>
                            <table class="message" v-if="loading">
                                <tr>
                                    <!-- My message (Loading) -->
                                    <Bubble from="me" v-if="loading === true && meText !== ''"  :text="meText" />
                                </tr>
                                <tr v-if="loading === true">
                                    <Bubble from="bot" :text="loadingText" :isLoading="true" :mp3url="false" :image-url="false" :video-url="false" pdf-url=""/>

                                </tr>
                            </table>
                        </div>
                    </section>
                </div>

                    <ChatInput ref="chatInput" v-if="suggestionsVisible === true" class="bottomchat" :input-allowed="inputAllowed"  @submit="send" :suggestions="suggestions"></ChatInput>

            </main>

        </div>
    </div>


</template>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700')

body
    margin: 0
    padding: 0
    height: 100%
    font-family: Roboto, sans-serif
    font-display: swap
    background-color: transparent

#app
    /*background-color: rgba(0, 0, 0, .6)*/
    background-color: transparent
    display: flex
    flex-direction: column
    width: 100%

.container
    max-width: 100%
    margin-left: auto
    margin-right: auto
    padding: 16px
    position: relative
    max-height: 100%
@font-face
    font-family: 'Material Icons'
    font-style: normal
    font-weight: 400
    font-display: swap
    src: url(https://fonts.gstatic.com/s/materialicons/v42/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format('woff2')

.material-icons
    font-family: 'Material Icons'
    font-weight: normal
    font-style: normal
    font-size: 50px
    line-height: 1
    letter-spacing: normal
    text-transform: none
    display: inline-block
    white-space: nowrap
    word-wrap: normal
    direction: ltr
    -webkit-font-feature-settings: 'liga'
    -webkit-font-smoothing: antialiased
</style>

<style lang="sass" scoped>
.chat-container
    padding-top: 45px
    //margin-top: -40px
    //padding-bottom: 1px
    min-height: 70vh
    max-height: 70vh

        //margin-top: -50px

.message
    width: 100%
    height: 100%
    table-layout: fixed

    .component
        padding-bottom: 10px
        width: 100%
        margin-bottom: 10px

.audio-toggle
    position: fixed
    top: 0
    right: 0
    margin: 8px
    z-index: 999
    padding: 10px
    background-color: #F1F3F4
    border-radius: 50%
    width: 24px
    height: 24px
    cursor: pointer
    color: #202124

.carousel
    overflow-x: scroll
    overflow-y: hidden
    white-space: nowrap
    -webkit-overflow-scrolling: touch
    padding-bottom: 20px
    padding-left: 10px
</style>
<script>

import Welcome from './../Welcome/Welcome.vue'
import TopHead from './../Partials/TopHead.vue'
import ChatInput from './../Partials/ChatInput.vue'

import Bubble from './../RichComponents/Bubble.vue'
import Card from './../RichComponents/Card.vue'
import List from './../RichComponents/List.vue'
import Picture from './../RichComponents/Picture.vue'

import * as uuidv1 from 'uuid/v1'
import TypingMessage from "../Partials/typingMessage.vue";

export default {
    name: 'app',
    components: {
        TypingMessage,
        Welcome,
        TopHead,
        ChatInput,
        Bubble,
        Card,
        List,
        Picture
    },
    data() {
        return {
            app: null,
            messages: [],
            language: '',
            session: '',
            muted: this.config.app.muted,
            loading: false,
            mp3url: false,
            imageUrl: false,
            pdfUrl: false,
            videoUrl: false,
            inputAllowed: false,
            suggestionsVisible: true,
            meVisible: true,
            hey: 'Welcome visitor, what brings you to the Wisemen household today?',
            loadingText: 'LOADINGTEXT',
            meText: '',
            lastRequestedMessage: '',
        };
    },
    created(){
    },
    computed: {
        /* The code below is used to extract suggestions from last message, to display it on ChatInput */
        suggestions(){
            if(this.messages.length > 0){
                let last_message = this.messages[this.messages.length - 1].queryResult.fulfillmentMessages;
                let suggestions = [];

                for (let component in last_message){
                    if (last_message[component].name === 'SUGGESTIONS') suggestions.text_suggestions = last_message[component].content;
                    if (last_message[component].name === 'LINK_OUT_SUGGESTION') suggestions.link_suggestion = last_message[component].content;
                    if (last_message[component].name === 'multi_suggestions') {
                       // suggestions.multi_suggestions = last_message[component].content;
                    }
                }

                if (suggestions.multi_suggestions !== undefined) {
                    this.suggestionsVisible = true;
                    let suggestionsArray = [];
                    let suggestionsArray1 = [];
                    let suggestionsArray2 = [];
                    let suggestionsArray3 = [];
                    let suggestionsArray4 = [];

                    if (suggestions.multi_suggestions[0].title === 'Read more') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'Yes') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        console.log("found the 'YES' suggestions!");
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'Iterative Development') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'Design 🎨') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);
                        suggestionsArray3.push(suggestions.multi_suggestions[2]);
                        suggestionsArray4.push(suggestions.multi_suggestions[3]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        suggestionsArray.push(suggestionsArray4);
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'I want to increase my digital return on investment 💻') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);
                        suggestionsArray2.push(suggestions.multi_suggestions[3]);
                        suggestionsArray3.push(suggestions.multi_suggestions[2]);


                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        suggestionsArray.push(suggestionsArray4);

                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'The origin story') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);
                        suggestionsArray3.push(suggestions.multi_suggestions[2]);
                       // suggestionsArray4.push(suggestions.multi_suggestions[3]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        //suggestionsArray.push(suggestionsArray4);
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'I have an idea 💡') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);
                        suggestionsArray3.push(suggestions.multi_suggestions[2]);
                        suggestionsArray4.push(suggestions.multi_suggestions[3]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        suggestionsArray.push(suggestionsArray4);

                        return suggestionsArray;
                    }

                    //

                    //How we handle things
                    if (suggestions.multi_suggestions[0].title === 'How we handle things') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray2.push(suggestions.multi_suggestions[1]);
                        suggestionsArray3.push(suggestions.multi_suggestions[2]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'Ideation') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray1.push(suggestions.multi_suggestions[1]);
                        suggestionsArray2.push(suggestions.multi_suggestions[2]);
                        suggestionsArray2.push(suggestions.multi_suggestions[3]);
                        suggestionsArray3.push(suggestions.multi_suggestions[4]);
                        suggestionsArray3.push(suggestions.multi_suggestions[5]);
                        suggestionsArray4.push(suggestions.multi_suggestions[6]);
                        suggestionsArray4.push(suggestions.multi_suggestions[7]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        suggestionsArray.push(suggestionsArray4);
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === 'Go to Market') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray1.push(suggestions.multi_suggestions[1]);
                        suggestionsArray2.push(suggestions.multi_suggestions[2]);
                        suggestionsArray2.push(suggestions.multi_suggestions[3]);
                        suggestionsArray3.push(suggestions.multi_suggestions[4]);
                        suggestionsArray3.push(suggestions.multi_suggestions[5]);
                        suggestionsArray4.push(suggestions.multi_suggestions[6]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        suggestionsArray.push(suggestionsArray4);
                        return suggestionsArray;
                    }

                    if (suggestions.multi_suggestions[0].title === '🍺') {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray1.push(suggestions.multi_suggestions[1]);
                        suggestionsArray2.push(suggestions.multi_suggestions[2]);
                        suggestionsArray2.push(suggestions.multi_suggestions[3]);
                        suggestionsArray2.push(suggestions.multi_suggestions[4]);
                        suggestionsArray3.push(suggestions.multi_suggestions[5]);
                        suggestionsArray3.push(suggestions.multi_suggestions[6]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }


                    //console.log(suggestions.multi_suggestions[0]);
                    if (suggestions.multi_suggestions.length < 3) {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        if (suggestions.multi_suggestions.length === 2) {
                            suggestionsArray1.push(suggestions.multi_suggestions[1]);
                        }
                        suggestionsArray.push(suggestionsArray1);
                    }

                    if (suggestions.multi_suggestions.length > 2 && suggestions.multi_suggestions.length <= 4) {
                        suggestionsArray1.push(suggestions.multi_suggestions[0]);
                        suggestionsArray1.push(suggestions.multi_suggestions[1]);
                        suggestionsArray2.push(suggestions.multi_suggestions[2]);
                        if (suggestions.multi_suggestions.length === 4) {
                            suggestionsArray2.push(suggestions.multi_suggestions[3]);
                        }
                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                    } else {
                        if (suggestions.multi_suggestions.length > 4 && suggestions.multi_suggestions.length <= 6) {
                            suggestionsArray1.push(suggestions.multi_suggestions[0]);
                            suggestionsArray1.push(suggestions.multi_suggestions[1]);
                            suggestionsArray2.push(suggestions.multi_suggestions[2]);
                            suggestionsArray2.push(suggestions.multi_suggestions[3]);
                            suggestionsArray3.push(suggestions.multi_suggestions[4]);
                            if (suggestions.multi_suggestions.length === 6) {
                                suggestionsArray3.push(suggestions.multi_suggestions[5]);
                            }
                            suggestionsArray.push(suggestionsArray1);
                            suggestionsArray.push(suggestionsArray2);
                            suggestionsArray.push(suggestionsArray3);
                        } else {
                            if (suggestions.multi_suggestions.length > 6 && suggestions.multi_suggestions.length <= 8) {
                                suggestionsArray1.push(suggestions.multi_suggestions[0]);
                                suggestionsArray1.push(suggestions.multi_suggestions[1]);
                                suggestionsArray2.push(suggestions.multi_suggestions[2]);
                                suggestionsArray2.push(suggestions.multi_suggestions[3]);
                                suggestionsArray3.push(suggestions.multi_suggestions[4]);
                                suggestionsArray3.push(suggestions.multi_suggestions[5]);
                                suggestionsArray4.push(suggestions.multi_suggestions[6]);

                                if (suggestions.multi_suggestions.length === 8) {
                                    suggestionsArray4.push(suggestions.multi_suggestions[7]);
                                }
                                suggestionsArray.push(suggestionsArray1);
                                suggestionsArray.push(suggestionsArray2);
                                suggestionsArray.push(suggestionsArray3);
                                suggestionsArray.push(suggestionsArray4);
                            }
                        }
                    }

                    return suggestionsArray;
                }

            } else {
                let suggestionsArray = [];
                let suggestionsArray1 = [];
                let suggestionsArray2 = [];
                let suggestionsArray3 = [];

                let suggestions = this.config.app.start_suggestions;

                suggestionsArray1.push(suggestions[0]);
                suggestionsArray2.push(suggestions[1]);
                suggestionsArray2.push(suggestions[3]);
                suggestionsArray3.push(suggestions[2]);

                suggestionsArray.push(suggestionsArray1);
                suggestionsArray.push(suggestionsArray2);
                suggestionsArray.push(suggestionsArray3);

                return suggestionsArray;
            }
        }
    },
    watch: {
        /* This function is triggered, when new messages arrive */
        messages(messages){
            //TODO: comment this for dev, uncomment for prod
        },

    },
    methods: {
        async send(q){
            if (this.lastRequestedMessage !== q || q === 'Read more') {
                //TODO: add userId to getBotResponse

                let request = {
                    "text": q,
                    "languageCode": this.lang(),
                    "userId": window.location.pathname
                    //"userId": userId
                }; // <- this is how a Dialogflow request look like
                this.lastRequestedMessage = q;

                this.loadingText = '';

                let element = document.getElementById('bottom');
                setTimeout(() => element.scrollIntoView({block: 'start', behavior: 'smooth'}), 1);


                this.meText = q;
                this.loading = true;

                await sleep(750);

                this.suggestionsVisible = false;
                // Make the request to gateway with formatting enabled */
                fetch('https://scvirtualagent.chatwise.be/getBotResponse', {method: 'POST', mode: 'cors', headers: {'content-type': 'application/json'}, body: JSON.stringify(request)})
                    .then(response => {
                        return response.json();
                    })
                    .then(async response => {
                        this.inputAllowed = response.inputAllowed;

                        if (this.hasMultipleAnswers(response)) {

                            let idsTextResponse = [];
                            let textResponsesArray = [];
                            let responsesToAdd = [];
                            let actualResponses = [];
                            let nActualResponses = [];
                            let idsNTextResponse = [];
                            let responsesToImmediatelyAdd = [];
                            let containsSuggestions = false;
                            let suggestionsResponse;

                            for (let x = 0; x < response.queryResult.fulfillmentMessages.length; x++) {
                                //console.log("x = " + x);

                                let name = response.queryResult.fulfillmentMessages[x].name;
                                let content = response.queryResult.fulfillmentMessages[x].content;

                                // console.log(content);
                                //console.log(name);
                                //console.log(content);

                                if (name === 'multi_suggestions') {
                                    containsSuggestions = true;
                                    suggestionsResponse = await this.extractSuggestions(response.queryResult.fulfillmentMessages[x]);
                                }

                                if (name === 'DEFAULT' || name === 'multi') {
                                    idsTextResponse.push(x);
                                    textResponsesArray.push(content);
                                } else if(name === 'multi_suggestions') {
                                    idsNTextResponse.push(x);
                                    nActualResponses.push(content);
                                    containsSuggestions = true;
                                    suggestionsResponse = await this.extractSuggestions(response.queryResult.fulfillmentMessages);
                                }
                            }

                            for (let y = idsTextResponse.length - 1; y >= 0; y--) {
                                responsesToAdd.push(response.queryResult.fulfillmentMessages[idsTextResponse[y]]);
                                response.queryResult.fulfillmentMessages.splice([idsTextResponse[y]]);
                            }

                            for (let w = idsNTextResponse.length -1; w >= 0; w--) {
                                //responsesToImmediatelyAdd.push(response.queryResult.fulfillmentMessages[idsNTextResponse[w]]);
                            }

                            responsesToAdd.reverse();
                            let isFirstMessage = true;

                            let getFirstResponse = this.getActualResponse(q);
                            //todo: remove my message
                            this.meText = "";
                            this.meVisible = false;
                            this.messages.push(getFirstResponse);

                            for (let z = 0; z < responsesToAdd.length; z++) {
                                if (isFirstMessage) {
                                    isFirstMessage = false
                                }

                                this.loading = true;
                                await sleep(1000);
                                response.queryResult.fulfillmentMessages.push(responsesToAdd[z]);

                                let actualResponse = this.generateActualResponses(response, responsesToAdd[z], isFirstMessage);
                                actualResponses.push(actualResponse);
                                this.suggestionsVisible = true;
                                this.messages.push(actualResponses[z]);

                                let element = document.getElementById('bottom');
                                element.scrollIntoView({block: 'start', behavior: 'smooth'});

                                this.loading = false;
                            }

                            // for (let zz = 0; zz < responsesToImmediatelyAdd.length; zz++) {
                            //
                            //     let actualResponse = this.generateActualResponses(response, responsesToAdd[zz], true);
                            //     actualResponses.push(actualResponse);
                            //     console.log(">??>>>>>>>> responsesToImmediatelyAdd =====>");
                            //     console.log(actualResponse);
                            //     this.suggestionsVisible = true;
                            //     this.messages.push(actualResponses[zz]);
                            // }

                            if (containsSuggestions) {
                                console.log("contains suggestions => pushing them into messages, suggResponse ===>");
                                console.log(suggestionsResponse);
                                //this.messages.push(suggestionsResponse)
                            }

                            this.loading = false;

                            if (containsSuggestions) {
                                //this.messages.push(suggestionsResponse);
                            }
                        } else {
                            this.messages.push(response);
                            this.loading = false
                        }
                    });

                this.$nextTick(() => {
                    window.scrollTo(0, 1);
                    window.scrollTo(0, 0);
                    let element = document.getElementById('bottom');
                    //element.scrollIntoView({block: 'start', behavior: 'smooth'});
                    this.suggestionsVisible = true;

                    setTimeout(function() {
                        element.scrollIntoView({block: 'start', behavior: 'smooth'});
                        this.suggestionsVisible = true;
                    }.bind(this), 1000);
                    if (this.inputAllowed) {
                        this.$refs.chatInput.focusNow();
                    }
                })
            }

        },
        timeOut() {

        },

        getActualResponse(messageText) {
            let newResponse = {
                queryResult: {
                    action: '',
                    fulfillmentMessages: [
                    ],
                    fulfillmentText: '',
                    intent: '',
                    queryText: messageText
                }
            };
            return newResponse
        },

        generateActualResponses(response, message, isFirstMessage) {
            // console.log("generatingActualResponses => first response =>");
            // console.log(response);


            //console.log("generatingActualResponses => old message =>");
            //let r = await response
            //console.log(message);
            let queryText;

            if (isFirstMessage) {
                queryText = response.queryResult.queryText
            } else {
                queryText = ""
            }

            let newResponse = {
                queryResult: {
                    action: response.queryResult.action,
                    fulfillmentMessages: [message],
                    fulfillmentText: '',
                    intent: response.queryResult.intent,
                    queryText: queryText
                }
            };

            response.queryResult.fulfillmentMessages = [];
            response.queryResult.fulfillmentMessages.push(message);


            //newResponse = Object.assign(response, newResponse);

            //console.log("generatingActualResponses => new message =>");
            //console.log(newResponse);

            return newResponse;
        },
        removeMyMessage(response) {
            console.log("removeMyMessage...");
            console.log(response);
            console.log("response.queryResult.queryText ... => " + response.queryResult.queryText);
            response.queryResult.queryText = "";
            return response
        },

        extractSuggestions(response) {
            //console.log("675 raw extract suggestions..");
            console.log(response);
            if (response.content !== "" && response.name === 'multi_suggestions') {
                let newResponse = {
                    queryResult: {
                        action: '',
                        fulfillmentMessages: [],
                        fulfillmentText: '',
                        intent: '',
                        queryText: ''
                    }
                };
                //onsole.log("response.content");
                //console.log(response.content);


                let newButtons = [];

                for (let i = 0; i < response.content.length; i++) {
                    console.log(response.content[0]);
                    let button = {
                        "title": response.content[i].title,
                        "url": response.content[i].url
                    };
                    newButtons.push(button);
                }

                newResponse.queryResult.fulfillmentMessages.push(newButtons);
                console.log("RETURNING FROM EXTRACT SUGGESTIONS =>");
                console.log(newResponse);
                return newResponse
            }
        },

        hasMultipleAnswers(response) {
            console.log("has multiple answers? ");
            console.log(response);
            let fulfillment = response.queryResult.fulfillmentMessages;

            console.log(fulfillment.length);
            return fulfillment.length > 2
        }
    }


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
</script>