<template>
    <div >
        <div style="display: flex;justify-content: flex-end; width: 100%; height: 100%;">
            <main id="app" >
                <div style=" width: 100%; overflow-y: scroll">
                    <TopHead v-if="app && messages.length > 0" :app="app"></TopHead>
                    <section class="container chat-container">

                        <div id="tContainer" ref="mContainer" class="messages">
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
                                    <td>
                                        <Bubble :text="m.queryResult.queryText"   from="me" />
                                    </td>
                                </tr>

                                <!-- Component iterator (Dialogflow Gateway Feature) -->
                                <tr v-for="component in m.queryResult.fulfillmentMessages">

                                    <td>

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
                                    </td>
                                </tr>
                            </table>
                            <div id="bottom"></div>
                            <table class="message" v-if="loading">
                                <tr>
                                    <!-- My message (Loading) -->
                                    <td><Bubble from="me" loading="false" /></td>
                                </tr>
                                <tr>
                                    <!-- Default / Webhook bubble (Loading) -->
                                    <td><Bubble loading="true" /></td>
                                </tr>
                            </table>
                        </div>
                    </section>
                </div>

<!--                <div class="bottomchatx">-->
                    <ChatInput class="bottomchat" :input-allowed="inputAllowed"  @submit="send" :suggestions="suggestions"></ChatInput>
<!--                </div>-->

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
    /*background-color: #1C1D1F*/
    background-color: transparent

#app
    /*background-color: rgba(0, 0, 0, .6)*/
    background-color: transparent
    backdrop-filter: blur(10px)
    display: flex
    flex-direction: column
    width: 100%

.container
    max-width: 100%
    margin-left: auto
    margin-right: auto
    padding: 16px
    position: relative
    height: 100%

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
    padding-top: 60px
    margin-top: -60px
    padding-bottom: 1px
    min-height: 80vh
    max-height: 80vh

.message
    width: 100%
    height: 100%
    display: inline-block

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

export default {
    name: 'app',
    components: {
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
            hey: 'Welcome visitor, what brings you to the Wisemen household today?'
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
                        console.log("multisuggestions incoming:");
                        console.log(last_message[component]);
                        suggestions.multi_suggestions = last_message[component].content;
                    }
                }
                return suggestions
            } else {
                return {
                    multi_suggestions: this.config.app.start_suggestions // <- if no messages are present, return start_suggestions, from config.js to help user figure out what he can do with your application
                }
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
        send(q){
            //TODO: add userId to getBotResponse
            let request = {
                "text": q,
                "languageCode": this.lang(),
                "userId": window.location.pathname
                //"userId": userId
            }; // <- this is how a Dialogflow request look like

            this.loading = true;

            // Make the request to gateway with formatting enabled */
            fetch('https://scvirtualagent.chatwise.be/getBotResponse', {method: 'POST', mode: 'cors', headers: {'content-type': 'application/json'}, body: JSON.stringify(request)})
            .then(response => {

                return response.json();
            })
            .then(response => {
                console.log("inputAllowed = " + response.inputAllowed);
                this.inputAllowed = response.inputAllowed;
                console.log(response);
                this.messages.push(response);
                this.loading = false

            });

            this.$nextTick(() => {
                let element = document.getElementById('bottom');
                setTimeout(() => element.scrollIntoView({block: 'start', behavior: 'smooth'}), 1000);
            })
        },
        timeOut() {

        }
    }
}
</script>