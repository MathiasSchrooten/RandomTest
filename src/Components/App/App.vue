<template>
    <div >
        <div style="display: flex;justify-content: flex-end; width: 100%; height: 80%;">
            <main id="app" >
                <div style="width: 100%; height: 100%; overflow-y: auto">
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
                                        <Picture v-if="component.name === 'IMAGE'" :image="component.content" />

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
    overflow-x: hidden
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
            intentName: ''
        };
    },

    created(){
    },
    computed: {
        /* The code below is used to extract suggestions from last message, to display it on ChatInput */
        suggestions: {
            get: function() {
                if(this.messages.length > 0){
                    let last_message = this.messages[this.messages.length - 1].queryResult.fulfillmentMessages;
                    let suggestions = [];

                    for (let component in last_message){
                        if (last_message[component].name === 'SUGGESTIONS') suggestions.text_suggestions = last_message[component].content;
                        if (last_message[component].name === 'LINK_OUT_SUGGESTION') suggestions.link_suggestion = last_message[component].content;
                        if (last_message[component].name === 'multi_suggestions') {
                        }
                    }

                    let suggestionsArray = [];
                    let suggestionsArray1 = [];
                    let suggestionsArray2 = [];
                    let suggestionsArray3 = [];
                    let suggestionsArray4 = [];

                    if (this.intentName === 'capture.methodOfContact.ui') {
                        let suggestions = this.config.app.stop_suggs;

                        suggestionsArray1.push(suggestions[0]);

                        suggestionsArray.push(suggestionsArray1);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'capture.lastName') {
                        let suggestions = this.config.app.skip3_suggs;

                        suggestionsArray1.push(suggestions[0]);

                        suggestionsArray.push(suggestionsArray1);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'haveadrink.beer' || this.intentName === 'haveadrink.champagne'
                        || this.intentName === 'haveadrink.cocktail' || this.intentName === 'haveadrink.coffee' || this.intentName === 'haveadrink.martini' || this.intentName === 'haveadrink.whiskey' || this.intentName === 'haveadrink.wine'
                        || this.intentName === 'workingonproject.alreadylaunched' || this.intentName === 'workingonproject.design' || this.intentName === 'workingonproject.developing' || this.intentName === 'workingonproject.idea') {
                        let suggestions = this.config.app.skip_suggs;

                        suggestionsArray1.push(suggestions[0]);

                        suggestionsArray.push(suggestionsArray1);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'capture.methodOfContact') {
                        let suggestions = this.config.app.skip2_suggs;

                        suggestionsArray1.push(suggestions[0]);

                        suggestionsArray.push(suggestionsArray1);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'jointeam') {
                        let suggestions = this.config.app.join_team_suggestions;

                        suggestionsArray1.push(suggestions[0]);
                        suggestionsArray1.push(suggestions[1]);

                        suggestionsArray.push(suggestionsArray1);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'a.cancelStop' || this.intentName === 'capture.lastName.stop' || this.intentName === 'capture.methodOfContact.call.confirm' || this.intentName === 'capture.methodOfContact.confirm'
                    || this.intentName === 'capture.methodOfContact.email.confirm' || this.intentName === 'capture.methodOfContact.email.stop' || this.intentName === 'capture.methodOfContact.stop' || this.intentName === 'Default Fallback Intent'
                    || this.intentName === 'Default Welcome Intent' || this.intentName === 'digitallyrelevant.originstory.goback' || this.intentName === 'handle.design.explore.no' || this.intentName === 'handle.design.explore.yes'
                    || this.intentName === 'handle.design.plan.no' || this.intentName === 'handle.design.plan.yes' || this.intentName === 'handle.design.ux.yes' || this.intentName === 'handle.design.ux.no' || this.intentName === 'handle.design.validate.yes'
                    || this.intentName === 'handle.design.validate.no' || this.intentName === 'handle.develop.mlp.no' || this.intentName === 'handle.develop.mlp.yes' || this.intentName === 'handle.grow.cs.yes' || this.intentName === 'handle.grow.cs.no'
                    || this.intentName === 'handle.grow.dm.yes' || this.intentName === 'handle.grow.dm.no' || this.intentName === 'handle.grow.sla.yes' || this.intentName === 'handle.grow.sla.no' || this.intentName === 'jointeam.no'
                    || this.intentName === 'jointeam.yes' || this.intentName === 'newuser_welcome' || this.intentName === 'digitallyrelevant.originstory.readmore.goback') {
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

                    if (this.intentName === 'workingonproject') {
                        let suggestions = this.config.app.workingonproject;

                        suggestionsArray1.push(suggestions[3]);
                        suggestionsArray2.push(suggestions[1]);
                        suggestionsArray2.push(suggestions[2]);
                        suggestionsArray3.push(suggestions[0]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle') {
                        let suggestions = this.config.app.handle;

                        suggestionsArray1.push(suggestions[0]);
                        suggestionsArray1.push(suggestions[1]);
                        suggestionsArray1.push(suggestions[2]);
                        suggestionsArray2.push(suggestions[3]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.grow.cs') {
                        let suggs = this.config.app.handle_grow_cs;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.grow.sla') {
                        let suggs = this.config.app.handle_grow_sla;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.grow.dm') {
                        let suggs = this.config.app.handle_grow_dm;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.grow') {
                        let suggestions = this.config.app.handle_grow;

                        suggestionsArray2.push(suggestions[0]);
                        suggestionsArray2.push(suggestions[1]);
                        suggestionsArray2.push(suggestions[2]);
                        suggestionsArray3.push(suggestions[3]);
                        suggestionsArray3.push(suggestions[4]);
                        suggestionsArray4.push(suggestions[5]);
                        suggestionsArray4.push(suggestions[6]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        suggestionsArray.push(suggestionsArray4);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.design') {
                        let suggestions = this.config.app.handle_design;

                        suggestionsArray2.push(suggestions[0]);
                        suggestionsArray2.push(suggestions[1]);
                        suggestionsArray4.push(suggestions[2]);
                        suggestionsArray4.push(suggestions[3]);
                        suggestionsArray4.push(suggestions[4]);
                        suggestionsArray3.push(suggestions[5]);
                        suggestionsArray3.push(suggestions[6]);
                        suggestionsArray3.push(suggestions[7]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        suggestionsArray.push(suggestionsArray4);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.develop') {
                        let suggs = this.config.app.handle_develop;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.develop.mlp') {
                        let suggs = this.config.app.handle_develop_mlp;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.design.explore') {
                        let suggs = this.config.app.handle_design_explore;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.design.validate') {
                        let suggs = this.config.app.handle_design_validate;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.design.plan') {
                        let suggs = this.config.app.handle_design_plan;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'handle.design.ux') {
                        let suggs = this.config.app.handle_design_ux;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        return suggestionsArray;
                    }


                    if (this.intentName === 'digitallyrelevant') {
                        let suggs = this.config.app.origin_handle_conquered_suggs;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);
                        suggestionsArray3.push(suggs[2]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);
                        return suggestionsArray;
                    }

                    if (this.intentName === 'haveadrink') {
                        let suggestions = this.config.app.drinks;

                        suggestionsArray1.push(suggestions[0]);
                        suggestionsArray1.push(suggestions[1]);
                        suggestionsArray1.push(suggestions[2]);
                        suggestionsArray2.push(suggestions[3]);
                        suggestionsArray2.push(suggestions[4]);
                        suggestionsArray2.push(suggestions[5]);
                        suggestionsArray2.push(suggestions[6]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.originstory.readmore.more') {
                        let suggs = this.config.app.you_bet_suggs;

                        suggestionsArray1.push(suggs[0]);

                        suggestionsArray.push(suggestionsArray1);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.youbet') {
                        let suggs = this.config.app.you_bet;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);
                        suggestionsArray3.push(suggs[2]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.originstory' || this.intentName === 'digitallyrelevant.originstory.readmore') {
                        let suggs = this.config.app.read_more;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray2.push(suggs[1]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.conqueredtechnologies') {
                        let suggs = this.config.app.conquered_tech;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray1.push(suggs[1]);
                        suggestionsArray2.push(suggs[2]);
                        suggestionsArray2.push(suggs[3]);
                        suggestionsArray3.push(suggs[4]);
                        suggestionsArray3.push(suggs[5]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.conqueredtechnologies.ai') {
                        let suggs = this.config.app.conquered_tech;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray1.push(suggs[1]);
                        suggestionsArray2.push(suggs[2]);
                        suggestionsArray2.push(suggs[3]);
                        suggestionsArray3.push(suggs[4]);
                        suggestionsArray3.push(suggs[5]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.conqueredtechnologies.arvr') {
                        let suggs = this.config.app.conquered_tech_arvr;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray1.push(suggs[1]);
                        suggestionsArray2.push(suggs[2]);
                        suggestionsArray2.push(suggs[3]);
                        suggestionsArray3.push(suggs[4]);
                        suggestionsArray3.push(suggs[5]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.conqueredtechnologies.conversational') {
                        let suggs = this.config.app.conquered_tech_conv;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray1.push(suggs[1]);
                        suggestionsArray2.push(suggs[2]);
                        suggestionsArray2.push(suggs[3]);
                        suggestionsArray3.push(suggs[4]);
                        suggestionsArray3.push(suggs[5]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.conqueredtechnologies.iot') {
                        let suggs = this.config.app.conquered_tech_iot;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray1.push(suggs[1]);
                        suggestionsArray2.push(suggs[2]);
                        suggestionsArray2.push(suggs[3]);
                        suggestionsArray3.push(suggs[4]);
                        suggestionsArray3.push(suggs[5]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }

                    if (this.intentName === 'digitallyrelevant.conqueredtechnologies.mobile') {
                        let suggs = this.config.app.conquered_tech_mobile;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray1.push(suggs[1]);
                        suggestionsArray2.push(suggs[2]);
                        suggestionsArray2.push(suggs[3]);
                        suggestionsArray3.push(suggs[4]);
                        suggestionsArray3.push(suggs[5]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }
                    if (this.intentName === 'digitallyrelevant.conqueredtechnologies.rpa') {
                        let suggs = this.config.app.conquered_tech_rpa;

                        suggestionsArray1.push(suggs[0]);
                        suggestionsArray1.push(suggs[1]);
                        suggestionsArray2.push(suggs[2]);
                        suggestionsArray2.push(suggs[3]);
                        suggestionsArray3.push(suggs[4]);
                        suggestionsArray3.push(suggs[5]);

                        suggestionsArray.push(suggestionsArray1);
                        suggestionsArray.push(suggestionsArray2);
                        suggestionsArray.push(suggestionsArray3);

                        return suggestionsArray;
                    }


                        if (suggestions.multi_suggestions !== undefined) {
                        this.suggestionsVisible = true;
                        let suggestionsArray = [];
                        let suggestionsArray1 = [];
                        let suggestionsArray2 = [];
                        let suggestionsArray3 = [];
                        let suggestionsArray4 = [];

                        //("CALCULATING SUGGESTIONS =<><><>");

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

                            suggestionsArray.push(suggestionsArray1);
                            suggestionsArray.push(suggestionsArray2);
                            suggestionsArray.push(suggestionsArray3);

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
            },
            set: function (newSuggestions) {
                this.suggestions = newSuggestions
            }

        }

    },
    mutations: {
        updateSuggestions (state, suggestions) {
            state.suggestions = suggestions;
        }
    },
    watch: {
        /* This function is triggered, when new messages arrive */
        messages(messages) {
            //TODO: comment this for dev, uncomment for prod
        },
    },
    methods: {
        showSuggestionsByIntent(intentName) {
            //console.log("intentname =");
            //console.log(intentName);

            if (intentName === 'jointeam') {
                let yesSuggestions = [
                    [{"title": "yes", "url": "https://www.google.com"}],

                ];
            }
        },
        addSuggestions(suggestions) {
            this.suggestions = suggestions
        },
        async send(q){
            if (this.lastRequestedMessage !== q || q === 'Read more') {
                //TODO: add userId to getBotResponse

                let request = {
                    "text": q,
                    "languageCode": this.lang(),
                    "userId": window.location.pathname
                };
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

                        this.intentName = response.queryResult.intent.displayName;
                        //this.suggestions = this.config.app.start_suggestions;
                        //this.addSuggestions(this.config.app.start_suggestions);

                        this.suggestionsVisible = true;

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

                                let name = response.queryResult.fulfillmentMessages[x].name;
                                let content = response.queryResult.fulfillmentMessages[x].content;

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
                                    //containsSuggestions = true;
                                    //suggestionsResponse = await this.extractSuggestions(response.queryResult.fulfillmentMessages);
                                }
                            }

                            for (let y = idsTextResponse.length - 1; y >= 0; y--) {
                                responsesToAdd.push(response.queryResult.fulfillmentMessages[idsTextResponse[y]]);
                                response.queryResult.fulfillmentMessages.splice([idsTextResponse[y]]);
                            }

                            responsesToAdd.reverse();
                            let isFirstMessage = true;

                            let getFirstResponse = this.getActualResponse(q);
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

                            this.loading = false;
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
                    //this.$refs.chatInput.focus();

                    setTimeout(function() {
                        element.scrollIntoView({block: 'start', behavior: 'smooth'});
                        //this.suggestionsVisible = true;
                    }.bind(this), 1000);
                    if (this.inputAllowed) {

                    }
                })
            }

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

                let newButtons = [];

                for (let i = 0; i < response.content.length; i++) {
                    let button = {
                        "title": response.content[i].title,
                        "url": response.content[i].url
                    };
                    newButtons.push(button);
                }

                let responseName = {
                    name: "multi_suggestions",
                    content: []
                };
                responseName.content.push(newButtons);
                newResponse.queryResult.fulfillmentMessages.push(responseName);
                return newResponse
            }
        },

        hasMultipleAnswers(response) {
            //console.log("has multiple answers? ");
            //console.log(response);
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