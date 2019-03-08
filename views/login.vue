<template>
    <div class='login'>
        <h1>BLOG</h1>
        <h2>welcome and enjoy yourself</h2>
        <form v-if='signin'>
            <input class='username' type='text' placeholder='your name' v-model='account'></input><br>
            <input class='password' type='password' placeholder='your password' v-model='password'></input><br>
            <input type='submit' value='Login' @click='submit($event)'></input>
        </form>
        <div v-if='signin'>NO ACCOUNT?<a @click='signin=!signin'>SIGN UP</a></div>
        <form v-if='!signin'>
            <input class='username' type='text' placeholder='your name' v-model='account'></input><br>
            <input class='password' type='password' placeholder='your password' v-model='password'></input><br>
            <input type='password' placeholder='repear your password' class='password' v-model='r_password'></input><br>
            <input type='submit' value='SIGN UP' @click='submit($event)'></input>
        </form>
        <div v-if='!signin'>HAVE ACCOUNT?<a @click='signin=!signin'>SIGN IN</a></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                signin: true,
                account: '',
                password: '',
                r_password: ''
            }
        },
        mounted() {
            if(this.$store.state.login) {
                this.$router.push('/index');
            }
        },
        methods: {
            submit(event) {
                let _this = this;
                event.preventDefault();
                if(this.account.length == 0 || this.password.length == 0) {
                    alert('account and password can\'t be empty!');
                    return;
                }
                let xhr = new XMLHttpRequest();
                if(this.signin) {//signin
                    xhr.onreadystatechange = function() {
                        if(xhr.readyState == 4) {
                            let status = xhr.status;
                            if((status < 300 && status >=200) || status == 304) {
                                let {success, msg} = JSON.parse(xhr.responseText);
                                console.log(success, msg);
                                if(success) {
                                    _this.$store.commit('setLogin', true);
                                    _this.$store.commit('setUser', _this.account);
                                    let preUrl = _this.$store.state.preUrl;
                                    console.log('redirect to prevPage')
                                    _this.$router.push(preUrl)
                                } else {
                                    alert(msg);
                                }
                            }
                        }
                    }
                    let req = JSON.stringify({account: this.account, password: this.password})
                    xhr.open('POST', '/signin', true);
                    xhr.send(req);
                } else {//signup
                    console.log('signup', this.password, this.r_password)
                    if(this.password !== this.r_password) {
                        alert('password not the same');
                        return;
                    }
                    xhr.onreadystatechange = function() {
                        console.log('change');
                        if(xhr.readyState == 4) {
                            let status = xhr.status;
                            if((status < 300 && status >=200) || status == 304) {
                                let {success, msg} = JSON.parse(xhr.responseText);
                                console.log(success, msg);
                                if(success) {
                                    alert('signup success');
                                    _this.signin == true;
                                } else {
                                    alert(msg);
                                }
                            }
                        }
                    }
                    xhr.open('POST', '/signup', true);
                    let req = JSON.stringify({account: this.account, password: this.password});
                    xhr.send(req);
                }
            }
        }
    }
</script>

<style scoped>
    .login {width:500px; height:auto; padding-top:30px 0; border:solid 1px rgba(121, 184, 202, 0.8); margin:0 auto; text-align:center; color:#0084FF;}
    .username, .password {border:none; border-bottom:solid 1px #ccc; margin-top:40px; width:200px; font-size:16px; height:30px; padding-bottom:5px; outline:none;}
    input[type=submit] {border:none; padding:5px; font-size:16px; background-color:#0084FF; color:#fff; margin-top:40px;}
    form {margin-bottom:40px;}
</style>