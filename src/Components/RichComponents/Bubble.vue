<template>
    <span>
        <!--imc image next to bot response-->
        <img v-if="from === 'bot'" class="image-wisemen" src="https://wisemenchatbot.s3-eu-west-1.amazonaws.com/Wisemen+chat+bubble.svg" alt="">

        <span class="bubble" :class="{'me': from === 'me', 'loading': loading}">

        <img style="margin-top: 5px; margin-left: 5px; width: 100%; max-width: 200px;" v-if="imageUrl != false && from =='bot'" v-bind:src="imageUrl" alt="">
        <br v-if="imageUrl != false && from == 'bot'">
        <br v-if="imageUrl != false && from == 'bot'">

        <span v-if="videoUrl != false && from =='bot'">
           <video controls="false" loop autoplay muted playsinline v-bind:src="videoUrl" ref="videoRef" id="video-container" class="video"></video>
            <br/>
        </span>

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

<!--                    <video controls="true" loop autoplay @ended="onEnd()" v-bind:src="videoUrl" ref="videoRef" id="video-container" class="video"></video>-->
   <br>
        </span>

            <div v-if="isLoading===true">
                <TypingMessage/>
            </div>

    </span>
        <!--user-image next to user response-->
        <img class="image-me" v-if="from == 'me'" src="https://wisemenchatbot.s3-eu-west-1.amazonaws.com/chatbubble+-+me.svg">

    </span>

</template>

<style lang="sass" scoped>

.video
    //margin-top: 10px
    margin: 5px
    width: 100%
    max-width: 300px
    height: 100%
    max-height: 100%

.textInBubble
    //font-size: 30px

.bubble
    color: white
    display: block
    position: relative
    //max-width: 55%
    font-size: 0.85em
    padding: 12px
    border-radius: 40px
    border: 1px solid var(--border)
    background-color: var(--background)
    min-width: 26px
    max-width: 75%

    /*@media screen and (max-width: 650px)*/
    /*    max-width: 55%*/
    /*    font-size: 0.7em*/


    &::before
        position: absolute
        left: 0
        top: 0
        margin-top: -9px
        margin-left: -1px

    &:not(.me)
        float: left
        border-radius: 0px 30px 30px 30px
        background-color: #323334
        margin-bottom: 15px

    /*&:not(.me)*/
    /*    background-color: #323334*/
    /*    float: left*/

    /* border-radius: 0 30px 30px 30px
        padding: 1rem
        margin-bottom: 30px
        margin-top: 2px
        float: left
        background-color: #323334
        margin-left: -2px
        /*@media screen and (max-width: 650px)*/
        /*    margin-top: 20px*/
        /*    margin-bottom: 45px*/

    &.me
        float: right
        border-radius: 30px 0px 30px 30px
        border: 0px solid #F1F3F4
        background-color: #FFD301
        font-size: 0.85em
        color: black
        margin-top: 2px
        margin-right: 20px
        margin-bottom: 15px



        &::before
            content: ''

        &::after
            position: absolute
            margin-top: -9px
            margin-right: -1px


        @media screen and (max-width: 1000px)
            right: 1%
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
    margin-top: 0
    padding-top: 3px
    position: absolute
    right: 1%

    @media screen and (max-width: 650px)
        margin-top: 0px
        margin-bottom: 30px

.image-wisemen
    float: left
    padding-top: 0px

    margin-right: 10px
    margin-top: 5px
    width: 25px
    height: 25px
    border-radius: 15px

    @media screen and (max-width: 650px)
        margin-top: 1px
        margin-bottom: 30px

</style>

<script>
import TypingMessage from "../Partials/typingMessage.vue";
export default {
    name: 'Bubble',
    components: {TypingMessage},
    props: ['text', 'from', 'loading', 'isLoading', 'mp3url', 'imageUrl', 'pdfUrl', 'videoUrl', 'componentName'],
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

    mounted: function() {
        if (this.$refs.videoRef) {
            console.log(this.$refs.videoRef.src);
            this.$refs.videoRef.play();
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
        },
        onEnd: function() {
            this.$refs.videoRef.play();
        }
     }
}
</script>


