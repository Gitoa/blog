<template>
    <div>
        <div class='article_item' v-for='info in currentData'>
            <h2><router-link :to='"post/" + info.id'>{{ info.title }}</router-link></h2>
            <div class='item_info'><span class='postinfo'>posted by gitoo on {{info.time}}</span><span class='view'>view:{{ info.view }}</span><span class='comment_count'>comment:{{ info.comments }}</span></div>
            <p>{{ info.shortcut }}</p>
        </div>
        <div class='pageIndex'>
            <span class='prePage' v-if='prev' @click='currentPage--'>< prev</span><span class='nextPage' v-if='next' @click='currentPage++'>next ></span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data: [],
                currentPage: 0,
                maxLength: 4,
                totalPage: 0,
                currentData: [],
                prev: false,
                next: false
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
                        console.log(_this.data);
                        _this.currentData = data.slice(0, _this.maxLength);
                        console.log(_this.data.length, _this.maxLength);
                        _this.totalPage = Math.ceil(_this.data.length / _this.maxLength);
                        console.log(_this.totalPage);
                        if(_this.totalPage > 1) _this.next = true;
                        _this.prev = false;
                        console.log(data);
                    }
                }
            }
            xhr.open('GET', '/article_list', true);
            xhr.send(null);
        },
        methods: {

        },
        watch: {
            currentPage() {
                let start = this.currentPage * this.maxLength;
                let end = (this.currentPage + 1) * this.maxLength;
                console.log(start, end);
                this.currentData = this.data.slice(start, end);
                console.log(this.currentData);
                this.prev = this.currentPage <= 0 ? false : true;
                this.next = this.currentPage >= this.totalPage-1 ? false : true;
            }
        }
    }
</script>

<style scoped>
    
</style>