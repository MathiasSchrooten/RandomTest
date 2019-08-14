<template>
    <a target="_blank" rel="noopener noreferrer" :href="url" class="suggestion">{{title}}</a>
</template>

<style lang="sass" scoped>
.suggestion
    display: inline-block
    //background-color: #1C1D1F;
    border-radius: 40px
    border: 2px solid #DADCE0
    color: white
    cursor: pointer
    margin-right: 5px
    margin-bottom: 15px
    font-size: 18px
    padding: 15px


.suggestion[href]
    background: #3C4043
    box-shadow: 0 3px 6px 2px rgba(66,133,244,0.15)
    color: white
    text-decoration: none
    border: 1px solid #3C4043
</style>

<script>
export default {
    name: 'Suggestion',
    props: ['title', 'url']
}
</script>