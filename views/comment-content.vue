<template>
    <ul>
        <li v-for='comment in comments'>
            <div>
                
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        props: ['article_id'],
        data() {
            return {
                comments: []
            }
        },
        methods: {
            
        },
        watch: {
            article_id() {
                let _this = this;
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4) {
                        let status = xhr.status;
                        if((status<300 && status>=200) || status==304) {
                            _this.comments = JSON.parse(xhr.responseText);
                        } else {
                            console.log('failed')
                        }
                    }
                }
                console.log(_this.article_id);
                xhr.open('GET', '/comments/' + _this.article_id, true);
                xhr.send(null);
            }
        }
    }
</script>

<style>
</style>