<template>
    <div class="sc-typing-indicator">
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>
<script>
    export default {
        props: {
            messageColors: {
                type: Object,
                required: false
            }
        }
    }
</script>
<style lang="sass">
    .sc-typing-indicator
        text-align: left
        padding: 1px 2px
        border-radius: 6px

    .sc-typing-indicator span
        display: inline-block
        background-color: black
        width: 4px
        height: 4px
        border-radius: 100%
        margin-right: 3px
        animation: bob 1s infinite

    .sc-typing-indicator span:nth-child(1)
        animation-delay: -1s

    .sc-typing-indicator span:nth-child(2)
        animation-delay: -0.85s

    .sc-typing-indicator span:nth-child(3)
        animation-delay: -0.7s

    @keyframes bob
        10%
            transform: translateY(-10px)
            background-color: yellow

        50%
            transform: translateY(0)
            background-color: yellow


</style>