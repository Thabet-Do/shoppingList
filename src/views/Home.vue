<template>
    <div class="home">
        <Items/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Items from '@/components/items'

    export default {
        name: 'home',
        components: {
          Items
        }
    }
</script>
