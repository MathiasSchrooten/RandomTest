<template>
    <a target="_blank" rel="noopener noreferrer" :href="url" class="suggestion">{{title}}</a>
</template>

<style lang="sass" scoped>
.suggestion
    display: inline-block
    background-color: #565758
    border-radius: 40px
    color: white
    cursor: pointer
    margin-right: 5px
    margin-bottom: 15px
    font-size: 1em
    padding: 15px

    @media screen and (max-width: 1000px)
        //font-size: 1.7em
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
    props: ['title', 'url']
}
</script>