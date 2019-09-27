<template>
    <span>
        <!--imc image next to bot response-->
        <img v-if="from === 'bot'" class="image-wisemen" src="https://wisemenchatbot.s3-eu-west-1.amazonaws.com/Wisemen+chat+bubble.svg" alt="">

        <span class="bubble" :class="{'me': from === 'me', 'loading': loading}">

        <img style="margin-top: 10px; margin-left: 15px; width: 100%; max-width: 200px;" v-if="imageUrl != false && from =='bot'" v-bind:src="imageUrl" alt="">
        <br v-if="imageUrl != false && from == 'bot'">
        <br v-if="imageUrl != false && from == 'bot'">
        <template class="textInBubble" v-for="line in text">{{line}}</template>

        <button name="playButton" v-if="from == 'bot' && mp3url != false" class="btn btn-primary btn-sm" @click.prevent="audio.isPlaying ? pause(audio) : play(audio)" v-for="audio in audios" :key="audio.id"><span class="fa fa-play-circle-o"></span>

            <img v-if="mp3url!=false && from == 'bot'" style="width:15px; height:15px;" src="https://cdn3.iconfinder.com/data/icons/iconic-1/32/play_alt-512.png" alt="">
            <!--<audio id="audio" src=""></audio>-->
        </button>


        <span v-if="pdfUrl != false && from =='bot'">
            <br>
            <a v-bind:href="pdfUrl" target="_blank">Open PDF</a>
        </span>
        <span v-if="videoUrl != false && from =='bot'">
            <br>
           <video v-bind:src="videoUrl" id="video-container" style="width:100%;max-width: 300px;" controls></video>
            <br>
        </span>

    </span>
        <!--user-image next to user response-->
        <img class="image-me" v-if="from == 'me'" src="https://wisemenchatbot.s3-eu-west-1.amazonaws.com/chatbubble+-+me.svg">

    </span>

</template>

<style lang="sass" scoped>

.textInBubble
    //font-size: 30px

.bubble
    color: white
    display: inline-block
    position: relative
    max-width: 55%
    font-size: 0.85em
    //this is dev shit bruh

    @media screen and (max-width: 650px)
        max-width: 55%
        font-size: 0.7em


    &::before
        /*content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyOHB4IiB2aWV3Qm94PSIwIDAgMjQgMjgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjQuMDAwMDAwLCAtMTAxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDEwMS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLjUsMS4yMTMzNzE0OCBDMC41LDcuNjA2NjkwNjcgMC41LDguNzU1Nzk0NzggMC41LDI2LjkzMjQ3OTIgTDIyLjU4NjkzMDIsOC41MjY3MDQwNCBDMTMuMDQwODkxNSw4LjU4NTgzODUzIDUuNjY5NjIyMDQsNi4xNTI1ODA2MyAwLjUsMS4yMTMzNzE0OCBaIiBzdHJva2U9IiNFOEVBRUQiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgcG9pbnRzPSIxIDkgMjQgOSAxIDI4Ij48L3BvbHlnb24+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==")*/
        position: absolute
        left: 0
        top: 0
        margin-top: -10px
        margin-left: -1px


    &:not(.me)
        border-radius: 0 30px 30px 30px
        padding: 1rem
        margin-bottom: 30px
        margin-top: 2px
        float: left
        background-color: #323334
        margin-left: -2px
        @media screen and (max-width: 650px)
            margin-top: 20px
            margin-bottom: 45px

    &.me
        border-radius: 30px 0px 30px 30px
        background-color: #FFD301
        padding: 1rem
        border: 0px solid #F1F3F4
        color: black
        margin-top: -45px
        margin-right: 20px
        margin-bottom: 30px
        position: absolute
        right: 3rem

        @media screen and (max-width: 650px)
            margin-top: -50px

        @media (min-width: 1300px)
            //position: absolute
            //right: 8%





        @media screen and (max-width: 1000px)
            right: 6%
            //margin-top: -50px

    &.loading
        width: 20px
        height: 16px
        animation: loading 1.5s ease infinite

@keyframes loading
    0%
        opacity: 0
    50%
        opacity: 1
    100%
        opacity: 0

.image-me
    height: 25px
    width: 25px
    float: right
    margin-top: -45px
    padding-top: 3px
    position: absolute
    right: 3%
    @media screen and (max-width: 650px)
        margin-top: -50px
        margin-bottom: 30px

.image-wisemen
    float: left
    padding-top: 0px

    margin-right: 10px
    margin-top: 2px
    width: 25px
    height: 25px
    border-radius: 15px

    @media screen and (max-width: 650px)
        margin-top: 10px
        margin-bottom: 30px

</style>

<script>
export default {
    name: 'Bubble',
    props: ['text', 'from', 'loading', 'mp3url', 'imageUrl', 'pdfUrl', 'videoUrl', 'componentName'],
    data: function() {
        return {
            hey: 'hey',
            isPlaying: false,
            file: null
        }
    },
    computed: {
        audios: function() {
            return [
                {
                    id: 'mp3',
                    name: 'mp3name',
                    file: new Audio(this.mp3url),
                    isPlaying: false
                }
            ]
        }
    },
    methods: {
        play(audio) {
            audio.isPlaying = true;
            audio.file.play();
        },
        pause (audio) {
            audio.isPlaying = false;
            audio.file.pause();
        }
     }
}
</script>