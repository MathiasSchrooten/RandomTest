<template>
        <div class="bottomchat">
            <div class="container">
                <!-- Here are the suggestions -->
                <div class="supercontainer">
<!--                    <div style="width: 20px; height: 20px; margin-bottom: -40px; background-color: red;"></div>-->

                    <div class="suggContainer">
                        <div class="suggestions">
                                <Suggestion v-if="suggestions.multi_suggestions" v-for="(suggestion, index) in suggestions.multi_suggestions" :key="index" @click.native="$emit('submit', suggestion.title)" :title="suggestion.title"  :url="suggestion.url" />
                        </div>
                    </div>
                </div>
            <div v-if="inputAllowed === true" class="flexible">
<!--                <div class="flexible">-->

                <!-- Text input -->
                    <div class="input-container">
                        <input  :aria-label="(config.i18n[lang()] && config.i18n[lang()].inputTitle) || config.i18n[config.app.fallback_lang].inputTitle" class="input" type="text" :placeholder="(config.i18n[lang()] && config.i18n[lang()].inputTitle) || config.i18n[config.app.fallback_lang].inputTitle" v-model="query" @keypress.enter="submit()" />
                    </div>
                </div>
            </div>
        </div>
</template>

<style lang="sass" scoped>
.leftright
    max-height: 100px
    max-width: 100px

.suggContainer
    margin-left: 30px
    margin-right: 30px
    white-space: nowrap
    overflow-x: auto
    /*display: inline-block*/


.supercontainer
    /*white-space: nowrap*/

.bottomchat
    position: fixed
    bottom: 0
    width: 100%
    background-color: var(--background)
    @media screen and (max-width: 1000px)
        width: 100%
        animation: 1.5s ease infinite

.flexible
    display: flex

.suggestions
    overflow-x: scroll
    overflow-y: scroll
    white-space: nowrap
    -webkit-overflow-scrolling: auto
    max-height: 100px
    display: inline-block

    &::-webkit-scrollbar
        display: none

.input-container
    width: 100%
    padding: 8px
    height: 60px
    /*position: absolute*/
    bottom: 0px
    left: 0px
    display: flex
    box-sizing: border-box
    border-radius: 40px
    flex: 1 0 0
    background-color: #3a3b3c

.element::-webkit-input-placeholder
    color: white !important

.input
    font-size: 1em
    font-weight: 500
    width: 100%
    box-sizing: border-box
    background-color: transparent
    border: none
    outline: none
    padding-left: 8px
    padding-right: 8px
    color: #FFFFFF

    /*@media screen and (max-width: 1000px)*/
    /*    font-size: 2em*/

.input::placeholder
    color: #98999a

.button-container
    padding: 8px
    width: 24px
    height: 24px
    margin-left: 6px
    border-radius: 50%
    cursor: pointer
    background-color: #202124
    color: white

    &.mic_button
        background-color: #F1F3F4
        color: white
        font-size: 24px

        &.mic_active
            background-color: #F44336
            color: white


</style>

<script>
import Suggestion from './../RichComponents/Suggestion.vue'

export default {
    name: 'ChatInput',
    props: ['suggestions', 'inputAllowed'],
    components: {
        Suggestion
    },
    data(){
        return {
            query: '',
            micro: false,
            recognition: null
        }
    },
    created(){
        if(window.webkitSpeechRecognition || window.SpeechRecognition){
            this.recognition = new webkitSpeechRecognition() || new SpeechRecognition();
            this.recognition.interimResults = true;
            this.recognition.lang = this.lang();
        }
    },
    watch: {
        /* This function triggers when user clicks on the microphone button */
        micro(bool){
            if(bool){
                /* When value is true, start voice recognition */
                this.recognition.start();
                this.recognition.onresult = (event) => {
                    for (let i = event.resultIndex; i < event.results.length; ++i){
                        this.query = event.results[i][0].transcript // <- push results to the Text input
                    }
                };

                this.recognition.onend = () => {
                    this.recognition.stop();
                    this.micro = false;
                    this.submit(this.query) // <- submit the result
                }
            }

            else {
                this.recognition.abort() // <- if user stops the recognition, abort it (in V1 this prevented users from starting a new recording)
            }
        }
    },
    methods: {
        submit(){
            if(this.query.length > 0){
                this.$emit('submit', this.query);
                this.query = '';
                //this.suggestions = "";
            }
        },
        emitting(title) {
            console.log("emitting....");
            console.log(title);
            this.suggestions = null;
            this.multi_suggestions = null;
        }
    }
}
</script>