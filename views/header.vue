<template>
<div>
    <header>
        <nav>
            <div class='header_main'>
                <div class='user'>
                    <div class='user_head'></div>
                </div>
                <div class='user_info'>
                    <div v-if='login'>
                        <span @click='signout' class='signout'>Sign out</span>
                        <span>{{ userName }}</span>
                    </div>
                    <div v-if='!login'>
                        <span @click='signin'>Sign in</span>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</div>
</template>
<script>
    export default {
        data() {
            return {
            }
        },
        computed: {
            login() {
                return this.$store.state.login;
            },
            userName() {
                return this.$store.state.user;
            }
        },
        methods: {
            signin() {
                this.$store.commit('setPreUrl', document.location.href);
                this.$router.push('/signin');
            },
            signout() {
                let _this = this;
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4) {
                        let status = xhr.status;
                        if((status<300 && status>=200) || status==304) {
                            console.log('singout');
                            _this.$store.commit('setLogin', false);
                            _this.$store.commit('setUser', '');
                        }
                    }
                }
                xhr.open('GET', '/signout', true);
                xhr.send(null);
            }
        }
    }
</script>
<style scoped>
    span.signout{margin-right:20px;}
</style>