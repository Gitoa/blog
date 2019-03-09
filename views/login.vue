<template>
    <div class='login'>
        <h1>BLOG</h1>
        <h2>welcome and enjoy yourself</h2>
        <!--<form v-if='signin'>
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
        <div v-if='!signin'>HAVE ACCOUNT?<a @click='signin=!signin'>SIGN IN</a></div>-->


        <form class='signin' :class='{"hidden":!signin}'>
            <input class='username' type='text' placeholder='your name' v-model='account'></input><br>
            <input class='password' type='password' placeholder='your password' v-model='password'></input><br>
            <input type='submit' value='Login' @click='submit($event)'></input>
        </form>
        <div class='signin' :class='{"hidden":!signin}'>NO ACCOUNT?<a @click='signin=!signin'>SIGN UP</a></div>
        <form class='signup' :class='{"hidden":signin}'>
            <input class='username' type='text' placeholder='your name' v-model='account'></input><br>
            <input class='password' type='password' placeholder='your password' v-model='password'></input><br>
            <input type='password' placeholder='repear your password' class='password' v-model='r_password'></input><br>
            <input type='submit' value='SIGN UP' @click='submit($event)'></input>
        </form>
        <div class='signup' :class='{"hidden":signin}'>HAVE ACCOUNT?<a @click='signin=!signin'>SIGN IN</a></div>
       
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
                                    console.log(preUrl);
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
    .login {width:500px; height:480px; padding:30px 0; border:solid 1px rgba(121, 184, 202, 0.8); margin:0 auto; text-align:center; color:#0084FF;}
    .username, .password {border:none; border-bottom:solid 1px #ccc; margin-top:40px; width:200px; font-size:16px; height:30px; padding-bottom:5px; outline:none;}
    input[type=submit] {border:none; padding:5px; font-size:16px; background-color:#0084FF; color:#fff; margin-top:40px;}
    form {margin-bottom:40px;}

    form.signin {position:absolute; top:108px; left:149px; transform-origin:center center -100px; transform:rotate3d(0, 0, 0, 90deg); transition:transform 0.6s linear 0s;}
    form.signin.hidden {-webkit-transform:rotate3d(0, 1, 0, 90deg);}
    form.signup.hidden {-webkit-transform:rotate3d(0, -1, 0, 90deg);}
    form.signup {position:absolute; top:108px; left:149px; transform-origin:center center -100px; transform:rotete3d(0, 0, 0, 90deg);  transition:transform 0.6s linear 0s;}

    div.signin {width:100%; position:absolute; bottom:30px; transform-origin:center center -11px; transform:rotate3d(0, 0, 0, 90deg); transition:transform 0.6s linear 0s;}
    div.signin.hidden {-webkit-transform:rotate3d(1, 0, 0, 90deg);}
    div.signup.hidden {-webkit-transform:rotate3d(-1, 0, 0, 90deg);}
    div.signup {width:100%; position:absolute; bottom:30px; transform-origin:center center -11px; transform:rotate3d(0, 0, 0, 90deg); transition:transform 0.6s linear 0s;}

    a {cursor:pointer;}
</style>