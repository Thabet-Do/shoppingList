<template>
    <div id="app">
        <v-app id="inspire">
            <v-navigation-drawer v-model="drawer" app clipped>
                <v-list dense>
                    <v-list-item to="/">
                        <v-list-item-action>
                            <v-icon>fa-server</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Order Lists</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item to="/about">
                        <v-list-item-action>
                            <v-icon>fa-user-friends</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>About Us</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-app-bar app clipped-left>
                <v-app-bar-nav-icon class="font-weight-bold" @click.stop="drawer = !drawer"/>
                <v-toolbar-title class="site-logo">Home<span>List</span></v-toolbar-title>
            </v-app-bar>

            <v-content>
                <v-container>
                    <v-layout align-left justify-start>
                        <router-view/>
                    </v-layout>
                </v-container>
            </v-content>

<!--            <v-footer app>-->
<!--                <span>&copy; 2019 All Right Receded HomeList.com</span>-->
<!--            </v-footer>-->
        </v-app>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data: () => ({
            drawer: 0
        }),
    };
</script>

<style>
    .w-25 {
        width: 25% !important;
    }

    .w-50 {
        width: 50% !important;
    }

    .w-75 {
        width: 75% !important;
    }

    .w-100 {
        width: 100% !important;
    }

    main {
        background-color: #E1F5FE
    }
</style>
<style scoped>
    .v-app-bar__nav-icon i:before {
        font-weight: bold;
    }

    .site-logo {
        background-color: transparent;
        color: #0a6c7a;
        font-weight: 900 !important;
        font-size: 1.7rem !important;
        font-family: "Baloo Bhaijaan", "Roboto", sans-serif;
    }

    .site-logo span {
        color: #F44336;
    }

    .home {
        width: 100%;
    }
</style>
