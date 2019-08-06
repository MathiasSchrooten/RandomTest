<template>
        <div class="bottomchat">
            <div id="zehContainer" style="width: 90%;" class="container">
                <!-- Here are the suggestions -->
                <div class="suggestions">
                    <Suggestion v-if="suggestions.text_suggestions" v-for="(suggestion, index) in suggestions.text_suggestions" :key="index" @click.native="$emit('submit', suggestion)" :title="suggestion" />
                    <Suggestion v-if="suggestions.link_suggestion" :title="suggestions.link_suggestion.destinationName" :url="suggestions.link_suggestion.uri" />
                </div>
                <div style="height: 100px;"  class="flexible">
                    <!-- Text input -->
                    <div class="input-container">
                        <input style="width:90%" :aria-label="(config.i18n[lang()] && config.i18n[lang()].inputTitle) || config.i18n[config.app.fallback_lang].inputTitle" class="input" type="text" :placeholder="(config.i18n[lang()] && config.i18n[lang()].inputTitle) || config.i18n[config.app.fallback_lang].inputTitle" v-model="query" @keypress.enter="submit()" />
                        <div @click="submit()" style="width:5%; margin-right: 15px;" >
                            <input type="image" src="https://wisemenchatbot.s3-eu-west-1.amazonaws.com/submit+button.svg" />
                        </div>
                    </div>
                </div>
<!--                <div style="width: 50px; height: 50px; background-color: greenyellow"></div>-->

            </div>
        </div>


</template>

<style lang="sass" scoped>
.bottomchat
    position: relative
    bottom: 0
    height: 100%


.flexible
    display: flex

.suggestions
    overflow-x: scroll
    overflow-y: hidden
    white-space: nowrap
    -webkit-overflow-scrolling: touch

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
    background-color: rgba(#FFFFFF, .4)

.element::-webkit-input-placeholder
    color: white !important

.input
    font-size: 18px
    font-family: "Serif72 Beta"
    font-weight: bold
    margin: 10px 7px 10px 7px
    width: 100%
    box-sizing: border-box
    background-color: transparent
    border: none
    outline: none
    padding-left: 8px
    padding-right: 8px
    color: white

.input::placeholder
    color: white

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
    props: ['suggestions'],
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
            this.recognition = new webkitSpeechRecognition() || new SpeechRecognition()
            this.recognition.interimResults = true
            this.recognition.lang = this.lang()
        }
    },
    watch: {
        /* This function triggers when user clicks on the microphone button */
        micro(bool){
            if(bool){
                /* When value is true, start voice recognition */
                this.recognition.start()
                this.recognition.onresult = (event) => {
                    for (let i = event.resultIndex; i < event.results.length; ++i){
                        this.query = event.results[i][0].transcript // <- push results to the Text input
                    }
                }

                this.recognition.onend = () => {
                    this.recognition.stop()
                    this.micro = false
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
                this.$emit('submit', this.query)
                this.query = ''
            }
        }
    }
}
</script>