<template>
    <ul>
        <li v-for='info in data'>
            <div class='article'>
                <router-link :to='"post/" + info.id'><h2>{{ info.title }}</h2></router-link>
                <p>{{ info.shortcut }}</p>
                <span>{{ info.view }}</span><span>{{ info.comments }}</span><span>{{ info.time }}</span>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                data: [{
                    id: 1,
                    title: 'article1',
                    shortcut: 'this is the shortcut of article1',
                    view: 20,
                    comments: 1,
                    time: '2019-02-11'
                },
                {
                    id: 2,
                    title: 'article2',
                    shortcut: 'this is the shortcut of article2',
                    view: 18,
                    comments: 2,
                    time: '2019-03-05'
                }]
            }
        },
        mounted() {
            let _this = this;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    const status = xhr.status;
                    if((status>=200 && status<300) || status==304) {
                        let data = JSON.parse(xhr.responseText);
                        _this.data = data;
                        console.log(data);
                    }
                }
            }
            xhr.open('GET', '/article_list', true);
            xhr.send(null);
        }
    }
</script>

<style scoped>
    li {list-style: none;}
    .article {height:100px; padding:15px; border-bottom:solid 1px #ccc;}
    a {text-decoration:none;}
    h2 {font-size:18px;}
    span {margin-left:20px;}
</style>