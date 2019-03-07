<template>
    <div class='article'>
        <h2>{{ blog.title }}</h2>
        <div class='info'><span>阅读:{{ blog.view }}</span><span>评论:{{ blog.comments }}</span><span>{{ blog.time }}</span></div>
        <p>{{ blog.content }}</p>
        <div class='comment'>
            <div :class='"wordCount " + warn'>({{ words }}/100)</div>
            <textarea placeholder="发个友善的评论见证下 (=・ω・=)" v-model='comment'> </textarea>
            <button @click='sendcomment'>评论</button><button>清空</button>
        </div>
        <div class='comment-zone'>
            <ul>
                <li v-for='comment in comments'>
                    <div>
                        
                    </div>
                </li>
            </ul>
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
                            let resdata = JSON.parse(xhr.responseText);
                            console.log(resdata);
                            _this.getComments();
                            _this.comment = '';
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
                    user_id: 'gg',
                    content: _this.comment,
                    time: now,
                    to_user: 'mm'
                }
                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.send(JSON.stringify(comment_info));
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
    div.article {height:100%; min-height:500px; overflow: scroll; text-align:center;}
    .info {width:100%; border-bottom:solid 1px #ccc; height:20px; font-size:12px; position:relative;}
    span:nth-child(1) {position:absolute; left:50px;}
    span:nth-child(2) {position:absolute; left:110px;}
    span:nth-child(3) {position:absolute; right:50px;}
    p {height:calc(100% - 143px); font-size:14px; text-indent:2em;}
    .comment-zone {height:0;}
    .comment {height:90px; position:relative;}
    .wordCount {position:absolute; font-size:10px; right:5px; bottom:10px;}
    .wordCount.tooMany {color:red;}
    textarea {width:100%; height:60px; border:none; border-top:solid 1px #ccc; resize:none; padding:10px 0 0 10px; font-size:14px;}
    div {text-align:center;}
    button:nth-child(odd) {margin-right:20px; background-color:#fff;}
</style>
