<template>
    <div class='article'>
        <div class='title'><h2>{{ blog.title }}</h2></div>
        <div class='info'><span>view:{{ blog.view }}</span><span>comment:{{ blog.comments }}</span><span>{{ blog.time }}</span></div>
        <p class='content'>{{ blog.content }}</p>
        <div class='comment'>
            <div :class='"wordCount " + warn'>({{ words }}/100)</div>
            <textarea placeholder="发个友善的评论交流下 (=・ω・=)" v-model='comment'> </textarea>
            <button @click='sendcomment'>评论</button><button @click='clear'>清空</button>
        </div>
        <div class='comment-zone'>
            <div v-for='comment_item in comments' class='comment_item'>
                <p>{{ comment_item.user_id }}: {{ comment_item.content }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                blog: {
                },
                comments: [],
                comment: '',
                words: 100,
                warn: ''

            }
        },
        methods: {
            getArticle() {
                let _this = this;
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4) {
                        const status = xhr.status;
                        if((status>=200 && status<300) || status==304) {
                            let blog = JSON.parse(xhr.responseText);
                            console.log(blog);
                            _this.blog = blog;
                        }
                    }
                }
                xhr.open('GET', '/article_info/' + _this.$route.params.id, true);
                xhr.send(null);
            },
            getComments() {
                let _this = this;
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4) {
                        let status = xhr.status;
                        if((status<300 && status>=200) || status==304) {
                            _this.comments = JSON.parse(xhr.responseText);
                            console.log(_this.comments);
                        } else {
                            console.log('failed')
                        }
                    }
                }
                console.log(_this.article_id);
                xhr.open('GET', '/comments/' + _this.$route.params.id, true);
                xhr.send(null);
            },
            sendcomment() {
                if(!this.$store.state.login) {
                    alert('请先登录')
                    return;
                }
                let _this = this;
                let url = '/comment/' + _this.$route.params.id;
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
                            let {success, msg} = JSON.parse(xhr.responseText);
                            console.log(success, msg);
                            if(!success) {
                                _this.$store.commit('setLogin', false);
                                _this.$store.commit('setUser', '');
                                alert(msg);
                                return;
                            }
                            _this.getComments();
                            _this.comment = '';
                            _this.blog.comments ++;
                        } else {
                            console.log('send failed');
                        }
                    }
                }
                let myDate = new Date();
                let year = myDate.getFullYear();
                let month = myDate.getMonth() + 1;
                month = month < 10 ? '0' + month : month;
                let date = myDate.getDate();
                date = date < 10 ? '0' + date : date;
                let now = year + '-' + month +'-' + date;
                console.log(now);
                let comment_info = {
                    id: _this.blog.id + '_' + (_this.comments.length + 1),
                    article_id: _this.blog.id,
                    user_id: _this.$store.state.user,
                    content: _this.comment,
                    time: now,
                    to_user: 'mm'
                }
                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.send(JSON.stringify(comment_info));
            },
            clear() {
                this.comment = '';
            }
        },
        watch: {
            comment(val) {
                this.words = 100 - val.length;
                if(this.words < 0) {
                    this.warn = 'tooMany';
                } else {
                    this.warn = '';
                }
            }
        },
        mounted() {
            this.getArticle();
            this.getComments();
        }
    }
</script>

<style scoped>
    div.article {height:auto; overflow: scroll;}
    div.title {width:100%; text-align:center; margin-bottom:20px;}
    .info {width:100%; height:20px; font-size:12px; position:relative;}
    span:nth-child(1) {position:absolute; left:50px;}
    span:nth-child(2) {position:absolute; left:110px;}
    span:nth-child(3) {position:absolute; right:50px;}
    p.content {height:auto; min-height:400px; font-size:18px; text-indent:2em; margin-top:20px;}
    .comment-zone {}
    .comment {height:90px; position:relative;}
    .comment_item {margin-top:20px; padding-bottom:20px; border-bottom:solid 1px #ccc;}
    .wordCount {position:absolute; font-size:10px; right:5px; bottom:10px;}
    .wordCount.tooMany {color:red;}
    textarea {width:100%; height:60px; border:solid 1px #ccc; resize:none; padding:10px 0 0 10px; font-size:14px; outline:none;}
    button:nth-child(odd) {margin-right:20px; background-color:#fff;}
</style>
