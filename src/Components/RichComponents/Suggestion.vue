<template>
    <a v-if="url !== ''" target="_blank" rel="noopener noreferrer" :href="url" v-bind:class="{'suggestionEmoticon': emoticon, 'suggestion': !emoticon}"> {{title}}</a>
    <a v-else target="_blank" rel="noopener noreferrer" v-bind:class="{'suggestionEmoticon': emoticon, 'suggestion': !emoticon}" @click.native="$emit('emitting', title) ">{{title}}</a>
</template>
<style lang="sass" scoped>

.suggestion
    //display: inline-block
    display: inline-block
    background-color: #565758
    border-radius: 40px
    color: white
    cursor: pointer
    max-width: 100%
    margin-right: 5px
    margin-bottom: 5px
    font-size: 0.83em
    padding: 6px

    @media screen and (max-width: 700px)
        font-size: 0.83em

.suggestionEmoticon
    //display: inline-block
    display: inline-block
    background-color: #565758
    border-radius: 40px
    color: white
    cursor: pointer
    max-width: 100%
    margin-right: 5px
    margin-bottom: 5px
    font-size: 1em
    padding: 6px

    @media screen and (max-width: 700px)
        font-size: 1em


.suggestion[href]
    background-color: #565758
    box-shadow: 0 3px 6px 2px rgba(66,133,244,0.15)
    color: white
    text-decoration: none
</style>

<script>
export default {
    name: 'Suggestion',
    props: ['title', 'url', 'emoticon'],
    watch: {
    },
    methods: {
        emitting(title) {
            console.log("emitting....");
            console.log(title);
        },
        getClass() {
            return {

            }
        }
    }
}
</script>