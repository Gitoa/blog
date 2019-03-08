<template>
    <div>
        <v-header></v-header>
        <div id='main' class='clearfix'>
            <div id='app'>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import vHeader from './views/header.vue';
    export default {
        components: {vHeader}
    }
</script>
