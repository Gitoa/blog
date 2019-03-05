<template>
    <div>
        {{ $route.params.id }}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                blog: []
            }
        },
        mounted() {
            let _this = this;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(xhr.readystate == 4) {
                    const status = xhr.status;
                    if((status>=200 && status<300) || status==304) {
                        let blog = JSON.parse(xhr.responseText);
                        _this.data = blog;
                    }
                }
            }
            xhr.open('GET', '/article_info/' + _this.$route.params.id, true);
            xhr.send(null);
        }
    }
</script>
