// madd.sts
// 获取应用实例
const app = getApp<IAppProps>()
import {getAxios, postAxios, getJson} from "../../utils/request";
import {photo, tips, showModal} from '../../utils/util'

const Base64 = require('../../utils/base64.js')

interface TabPorps {
    pid: number,
    name: string,
    uptype?: number,
}

interface FormProps {
    cate: string | number,
    uptype: string | number,
    pname: string,
    pphone: string,
    repconten: string,
}

Component({
    data: {
        winWidth: <number>0,
        winHeight: <number>0,
        padtop: <number>0,
        mTitle: <string>'我要留言',
        lastPage: <string>'../matter/matter',
        tabData: <TabPorps[] | []>[],
        currentTab: <number>0,
        inputData: <FormProps>{},
        cateData: <TabPorps[] | []>[],
        ndata: <string[]>['实名', '匿名'],
        showview: <boolean>true,
        showphone: <boolean>false,
        imgs: <string[]>[],
        imgurl: <string>'',
        videos: <string[]>[],
        videourl: <string>'',
        areaData: <TabPorps[] | []>[],
        mapContext: <any>null,
        phonename: <string>'获取手机号',
        none: <boolean>true,
        latitude: <number>0,
        longitude: <number>0,
        imgshow: <boolean>true,
        videoshow: <boolean>true,
        showPage: <boolean>false,
        isActivity:<number>0,
    },
    lifetimes: {
        attached() {
            this.getLocalData()
            this.getTabData()
            this.getCateData()
            // this.getAreaData()
        },
        ready() {

        },
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {

        },
        hide: function () {

        },
        resize: function () {

        },
    },
    methods: {
        onLoad: function (options: any) {
            wx.getSystemInfo({
                success: (res) => {
                    this.setData({
                        winWidth: res.windowWidth,
                        winHeight: res.windowHeight,
                        padtop: res.safeArea.top
                    });
                },
            })
            this.setData({
                imgurl: `${app.globalData.baseUrl}/api/dbfile/artworkmaster/`,
                videourl: `${app.globalData.baseUrl}/api/dbfile/videostream/`,
            })
            // if(options.currentTab){
            //   this.setData({
            //     currentTab:Number(options.currentTab)
            //   })
            //   const childComponent = this.selectComponent('#child');
            //   childComponent.reload();
            // }
        },
        getTabData() {
            let arr = <TabPorps[]>[{
                pid: 0,
                name: '发起留言'
            }, {
                pid: 1,
                name: '历史记录'
            }]
            this.setData({
                tabData: arr
            })
        },
        // 滑动切换
        swiperTab(e: any) {
            let that = this
            that.setData({
                currentTab: e.detail.current,
            })
            if (e.detail.current == 0) {
                that.setData({
                    inputData: <FormProps>{},
                    imgs: [],
                    videos: [],
                    imgshow: true,
                    videoshow: true,
                    showphone: false
                })
                this.getLocalData()
            }
        },
        // 点击切换
        bindclickTab(e: any) {
            let that = this
            let index = e.target.dataset.id
            if (index == 0) {
                that.setData({
                    inputData: <FormProps>{},
                    imgs: [],
                    videos: [],
                    imgshow: true,
                    videoshow: true,
                    showphone: false
                })
                this.getLocalData()
            }
            if (this.data.currentTab === index) {
                return false
            } else {
                that.setData({
                    currentTab: index
                })
            }
        },
        saveData(e: any) {
            const obj = e.detail.value
            this.matterInfo(obj)
        },
        matterInfo(obj: any) {

            let that = this
            let error: string = ''
            if ((!obj.cate || obj.cate == '') && (!obj.typeid || obj.typeid == '')) {
                error = '请选择诉求类别'
            } else if (!obj.pname || obj.pname == '') {
                error = '请输入姓名'
            } else if (!obj.pphone || obj.pphone == '') {
                error = '请获取手机号'
            } else if (!obj.repconten || obj.repconten == '') {
                error = '请输入留言内容'
            } else if ((!obj.areaname || obj.areaname == '') && (!obj.areaid || obj.areaid == '')) {
                error = '请选择所属部门'
            }
            if (error != '') {
                showModal(error)
            } else {
                let arr = that.data.imgs
                let vrr = that.data.videos
                //正式坐标
                let latitude = that.data.latitude
                let longitude = that.data.longitude
                Object.assign(obj, {
                    latitude: latitude,
                    longitude: longitude,
                    arepimage: arr.join(','),
                    arepvideo: vrr.join(','),
                    repconten: Base64.encode(obj.repconten)
                })
                wx.showLoading({
                    title: '提交中...',
                    mask: true
                })
                postAxios('/api/sjmmatter/xcxsavematter', obj).then((res: any) => {
                    if (res.code == 200) {
                        wx.hideLoading()
                        tips('提交成功', 'success', true, 2000)
                        that.setData({
                            inputData: <FormProps>{},
                            imgs: [],
                            videos: [],
                            imgshow: true,
                            videoshow: true,
                            showphone: false
                        })
                        setTimeout(() => {
                            wx.navigateTo({
                                url: '../jump/jump'
                            })
                        }, 1000)
                        //   that.setData({
                        //     currentTab:1,
                        // })
                        // const childComponent = this.selectComponent('#child');
                        // childComponent.reload();
                    } else {
                        wx.hideLoading()
                        wx.showModal({
                            title: '提示',
                            content: '提交失败，请重新提交！',
                            showCancel: false
                        })
                    }
                })
            }
        },
        async getPhoneNumber(e: any) {
            if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
                return
            } else {
                wx.showToast({
                    title: '您已经同意授权登录',
                })
                let res: any = await getAxios('/api/miniProgram/getPhoneNumber', {code: e.detail.code})
                if (res.code == 200) {
                    tips('已成功获取手机号', 'success', true)
                    this.setData({
                        ['inputData.pphone']: res.data,
                        showphone: true,
                        phonename: '获取手机号'
                    })
                } else {
                    tips('手机号获取失败', 'error', true)
                    this.setData({
                        ['inputData.pphone']: '',
                        showphone: false,
                        phonename: '再次获取'
                    })
                }
            }
        },
        bindcatechange(e: any) {
            // let index = Number(e.detail.value)
            // console.log(index);
            //获取index
            let name = e.currentTarget.dataset.name
            let indexdata = e.currentTarget.dataset.index
            let uptype = e.currentTarget.dataset.uptype
            //获取
            // let arr = this.data.cateData
            // @ts-ignore
            this.setData({
                ['inputData.cate']: name,
                ['inputData.uptype']: uptype,
                ['inputData.typeid']: indexdata
            })
            //获取对应的派出所前需要先清空
            this.setData({
                ['inputData.areaid']: '',
                ['inputData.areaname']: '',
            })
            this.getAreaDataByType(indexdata);
            this.setData({
                isActivity:indexdata,
                showPage: false
            })
        },
        async getCateData() {
            let res: any = await postAxios(`/api/sjmmatter/matterTypeList`, {})
            let arr: TabPorps[] = res.data.length > 0 ? res.data.map((item: any) => {
                return {
                    pid: item.pid,
                    name: item.name,
                    uptype: item.uptype
                }
            }) : []
            this.setData({
                cateData: arr,
            })
        },
        async getAreaData() {
            let res: any = await getAxios(`/api/sjmmatter/arealist`, {})
            let arr: TabPorps[] = res.data.length > 0 ? res.data.map((item: any) => {
                return {
                    pid: item.pid,
                    name: item.areaname,
                }
            }) : []
            this.setData({
                areaData: arr,
            })
        },
        async getAreaDataByType(typeid: any) {
            let res: any = await getAxios(`/api/sjmmatter/arealistbytype`, {
                typeid: typeid
            })
            let arr: TabPorps[] = res.data.length > 0 ? res.data.map((item: any) => {
                return {
                    pid: item.pid,
                    name: item.areaname,
                }
            }) : []
            this.setData({
                areaData: arr,
            })
            this.setData({
                [`inputData.areaname`]: this.data.areaData.length > 0 ? 0 : null,
                [`inputData.areaid`]: this.data.areaData.length > 0 ? this.data.areaData[0].pid : '',
            })
        },
        bindareachange(e: any) {
            let index = Number(e.detail.value)
            let arr = this.data.areaData
            console.log(index)
            console.log(arr[index].pid);
            console.log(e.currentTarget.id);
            this.setData({
                [`inputData.${e.currentTarget.id}`]: index,
                ['inputData.areaid']: arr[index].pid,
            })
        },
        chooseImg(e: any) {
            let that = this
            let imgs = that.data.imgs
            photo(4, 'image').then((item: any) => {
                console.log(item);
                if (item.length > 0) {
                    for (let i = 0; i < item.length; i++) {
                        imgs.push(item[i]);
                    }
                    wx.hideLoading()
                    that.setData({
                        imgs: imgs,
                        imgshow: imgs.length >= 4 ? false : true
                    })
                } else {
                    wx.hideLoading()
                    wx.showModal({
                        title: '提示',
                        content: '上传失败，请重新上传！',
                        showCancel: false
                    })
                }
            })
        },
        previewImg(e: any) {
            let that = this
            let index = e.currentTarget.dataset.index;
            let imgArr = that.data.imgs;
            let urlArr = [];
            for (let i = 0; i < imgArr.length; i++) {
                urlArr.push(that.data.imgurl + imgArr[i])
            }
            wx.previewImage({
                current: that.data.imgurl + imgArr[index],
                urls: urlArr
            })
        },
        deleteImg(e: any) {
            let that = this
            let imgArr = that.data.imgs
            let index = e.currentTarget.dataset.index;
            wx.showModal({
                title: '删除提示',
                content: '确定要删除此图片吗？',
                async success(res: any) {
                    if (res.confirm) {
                        imgArr.splice(index, 1)
                        that.setData({
                            imgshow: imgArr.length >= 4 ? false : true
                        })
                        await that.delImg(imgArr[index])
                    } else if (res.cancel) {
                        return false;
                    }
                    that.setData({
                        imgs: imgArr
                    })
                }
            })
        },
        async delImg(fileid: any) {
            let res: any = await getAxios('/api/dbfile/delfile', {fileid: fileid})
            if (res.code == 200) {
                tips('图片删除成功', 'success', true, 1500)
            } else {
                tips('图片删除失败', 'error', true, 1500)
            }
        },
        chooseVideo(e: any) {
            let that = this
            let videos = that.data.videos
            photo(1, 'video').then((item: any) => {
                console.log(item);
                if (item.length > 0) {
                    for (let i = 0; i < item.length; i++) {
                        videos.push(item[i]);
                    }
                    wx.hideLoading()
                    that.setData({
                        videos: videos,
                        videoshow: videos.length >= 1 ? false : true
                    })
                } else {
                    wx.hideLoading()
                    wx.showModal({
                        title: '提示',
                        content: '上传失败，请重新上传！',
                        showCancel: false
                    })
                }
            })
        },
        previewVideo(e: any) {
            let that = this
            let index = e.currentTarget.dataset.index;
            let vdoArr = that.data.videos;
            let urlArr = [];
            for (let i = 0; i < vdoArr.length; i++) {
                urlArr.push(that.data.videourl + vdoArr[i])
            }
            wx.previewMedia({
                sources: [{
                    url: that.data.videourl + vdoArr[index], // 预览地址，可图片可视频
                    type: "video", // image：图片，video: 视频
                }],
                current: 0, // 当前资源下标
                showmenu: true, // 如果是二维码\小程序码图片是否支持长按识别
                referrerPolicy: `https://servicewechat.com/${app.globalData.appid}/0/page-frame.html`, // 如果是cdn图片，并且设置了防盗链.
                success: res => {
                    console.log(res)
                },
                fail: err => {
                    console.log(err)
                }
            })
        },
        deleteVideo(e: any) {
            let that = this
            let vdoArr = that.data.videos;
            let index = e.currentTarget.dataset.index;
            wx.showModal({
                title: '删除提示',
                content: '确定要删除此视频吗？',
                async success(res) {
                    if (res.confirm) {
                        vdoArr.splice(index, 1)
                        that.setData({
                            videoshow: vdoArr.length >= 1 ? false : true
                        })
                        await that.delVideo(vdoArr[index])
                    } else if (res.cancel) {
                        return false;
                    }
                    that.setData({
                        videos: vdoArr
                    })
                }
            })
        },
        async delVideo(fileid: any) {
            let res: any = await getAxios('/api/dbfile/delfile', {fileid: fileid})
            if (res.code == 200) {
                tips('视频删除成功', 'success', true, 1500)
            } else {
                tips('视频删除失败', 'error', true, 1500)
            }
        },
        getLocalData() {
            let that = this
            wx.getSetting({
                success: res => {
                    if (!res.authSetting['scope.userLocation']) {
                        wx.authorize({
                            scope: 'scope.userLocation',
                            async success() {
                                await that.getLocal()
                            }
                        })
                    } else {
                        that.getLocal()
                    }
                }
            })
        },
        getLocal() {
            let that = this
            wx.getLocation({
                type: 'wgs84',
                async success(res: any) {
                    tips('已成功获取位置', 'success', true, 1500)
                    that.setData({
                        latitude: res.latitude,
                        longitude: res.longitude,
                    })
                    await that.getAreaName(res.longitude, res.latitude)
                    // setTimeout(async () => {
                    //     await that.getVillName(res.longitude, res.latitude)
                    // }, 2000)
                }
            })
        },
        async getVillName(longitude: any, latitude: any) {
            let that = this
            let rarr = that.data.areaData
            let res: any = await getAxios('/api/sjmmatter/getidbyjw', {latitude: latitude, longitude: longitude})
            if (res.data == null) {
                tips('无法判断位置，请手动选择所属部门', 'none', true, 1500)
                that.setData({
                    ['inputData.areaname']: null,
                    ['inputData.areaid']: res.data,
                })
            } else {
                let index = rarr.findIndex(item => item.pid == res.data)
                that.setData({
                    ['inputData.areaname']: index,
                    ['inputData.areaid']: res.data,
                })
            }
        },
        getAreaName(longitude: any, latitude: any) {
            let that = this
            let url = `https://api.tianditu.gov.cn/geocoder?postStr={'lon':${longitude},'lat':${latitude},'ver':1}&type=geocode&tk=${app.globalData.tk}`
            getJson(url, {}).then((res: any) => {
                if (res.status == "0" && res.msg == 'ok') {
                    let addres = `${res.result.addressComponent.city}${res.result.addressComponent.county}${res.result.addressComponent.address}`
                    that.setData({
                        ['inputData.address']: addres
                    })
                } else {
                    tips('无法准确定位', 'error', true, 2000)
                    that.setData({
                        ['inputData.address']: '定位失败'
                    })
                }
            })
        },
        bindscrolltolower() {
            const childComponent = this.selectComponent('#child');
            childComponent.loadMore();
        },
        cateClick() {
            //点击类型选择输入框，展示page-container
            this.setData({
                showPage: true
            })
        }
    },
})
