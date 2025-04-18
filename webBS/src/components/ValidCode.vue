<template>
    <div class="ValidCode disabled-select" :style="`width:${width}; height:${height}`" @click="refreshCode">
        <span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{item.code}}</span>
    </div>
</template>

<script>
    export default {
        name: "ValidCode",
        props:{
            width: {
                type: String,
                default: '100px'
            },
            height: {
                type: String,
                default: '45px'
            },
            length: {
                type: Number,
                default: 4
            }
        },
        data() {
            return {
                codeList: []
            }
        },
        mounted () {
            this.createdCode()
        },
        methods: {
            refreshCode () {
                this.createdCode()
            },
            createdCode () {
                let len = this.length,
                    codeList = [],
                    chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789',
                    charsLen = chars.length
                // 生成
                for (let i = 0; i < len; i++) {
                    let rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)]
                    codeList.push({
                        code: chars.charAt(Math.floor(Math.random() * charsLen)),
                        // code: this.random(0,9),
                        color: `rgb(${rgb})`,
                        // fontSize: `1${[Math.floor(Math.random() * 10)]}px`,
                        fontSize: `18px`,
                        // padding: `${[Math.floor(Math.random() * 10)]}px`,
                        transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
                    })
                }
                // 指向
                this.codeList = codeList
                // 将当前数据派发出去
                this.$emit('update:value', codeList.map(item => item.code).join(''))
            },
            getStyle (data) {
                // return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
                return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding};`
            },
            //包括下线数字（lower）也包括上限数字（upper）
            random(lower, upper) {
                return Math.floor(Math.random() * (upper - lower+1)) + lower;
            },

        }
    }
</script>

<style scoped>
    .ValidCode{
        position: absolute;
        z-index: 102;
        top:2px;
        right:1px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    span{
        display: inline-block;
    }
</style>
