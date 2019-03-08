<template>
    <div class='comment'>
        <div :class='"wordCount " + warn'>({{ words }}/100)</div>
        <textarea placeholder="发个友善的评论见证下 (=・ω・=)" v-model='comments'> </textarea>
        <button @click='sendcomment'>评论</button>
        <button>清空</button>
    </div>
</template>

<script>
    export default {
        props: ['comment_num'],
        data() {
            return {
                comments: '',
                words: 100,
                warn: ''
            }
        },
        methods: {
            sendcomment() {
                console.log('login:', this.$store.state.login);
                if(!this.$store.state.login) {
                    alert('请先登录')
                    return;
                }
                let _this = this;
                let url = '/comment';
                if(_this.words < 0) {
                    alert('字数过多');
                    return;
                } else if (_this.words == 100) {
                    alert('评论不能为空');
                    return;
                }
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4) {
                        const status = xhr.status;
                        if((status<300 && status>=200) || status == 304) {
                            console.log('send success');
                        } else {
                            console.log('send failed');
                        }
                    }
                }
                xhr.open('POST', url, true);
                xhr.send(JSON.stringify(_this.comments));
            }
        },
        watch: {
            comments: function(val) {
                this.words = 100 - val.length;
                if(this.words < 0) {
                    this.warn = 'tooMany';
                } else {
                    this.warn = '';
                }
            }
        }
    }
</script>

<style scoped>
    .comment {height:90px; position:relative;}
    .wordCount {position:absolute; font-size:10px; right:5px; bottom:10px;}
    .wordCount.tooMany {color:red;}
    textarea {width:100%; height:60px; border:none; border-top:solid 1px #ccc; resize:none; padding:10px 0 0 10px; font-size:14px;}
    div {text-align:center;}
    button:nth-child(odd) {margin-right:20px; background-color:#fff;}
</style>