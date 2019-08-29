<template>
    <div class="overlay">
        <span style="font-size: 30px; color: white">HEYHEYHEY</span>
        <!-- Agent Title -->
        <h1 class="app-title">Heyheyheyyyyy</h1>

        <!-- Agent Description -->
        <p class="app-description">{{app.description}}</p>

    </div>
</template>

<style lang="sass" scoped>
.overlay
    text-align: center
    padding-top: 25px

.app-icon
    width: 120px
    height: 120px
    border-radius: 16px
    object-fit: cover

.app-title
    font-weight: 500
    font-size: 24px
    margin-top: 30px
    color: #202124
    line-height: 20px

.app-description
    font-size: 16px
    color: #FFFFFF

.language-picker
    display: inline-block
    border: 1px solid #E8EAED
    padding: 8px 12px
    border-radius: 40px
    cursor: pointer
    font-weight: 500
    margin-right: 2px

    &.picked
        background-color: #F1F3F4
        border: 1px solid #F1F3F4
</style>

<script>
const langs = require('langs')

export default {
    name: 'welcome',
    props: ['app'],
    data(){
        return {
            sel_lang: ''
        }
    },
    watch: {
        /* Save selected language */
        sel_lang(lang){
            if(this.history()) localStorage.setItem('lang', lang)

            else {
                this.config.app.fallback_lang = lang
            }
        }
    },
    /* Set default language on load (or fallback) */
    created(){
        if(this.app && this.app.defaultLanguageCode){
            this.sel_lang = this.app.defaultLanguageCode
        }

        else {
            this.sel_lang = this.config.app.fallback_lang
        }
    },
    filters: {
        /* This filter turns language code to the local language name using the langs dependency (example "en" -> "English") */
        toLang(code){
            return langs.where('1', code).local
        }
    }
}
</script>