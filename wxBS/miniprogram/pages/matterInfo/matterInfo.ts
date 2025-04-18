// index.ts
// 获取应用实例
import {getAxios, postAxios} from "../../utils/request";
import {getLogin, tips, showModal} from '../../utils/util'

const Base64 = require('../../utils/base64.js')

let app = getApp<IAppProps>()

interface TabPorps {
    pid: number,
    name: string,
    uptype?: number
}

interface FormProps {
    cate: string | number,
    uptype: string | number,
    pname: string,
    pphone: string | number,
    repconten: string,
    areaname: string,
    address: string,
    imageList: any[],
    videoList: any[],
    admincontent: string,
    adminimage: any[],
    appcontent:string
}

Component({
    data: {
        winWidth: <number>0,
        winHeight: <number>0,
        padtop: <number>0,
        mTitle: <string>'留言详情',
        guideInfo: <any>{},
        matterPid: <number>0,
        lastPage: <string>'../matterPushList/matterPushList?redirectback=true',
        ndata: <string[]>['实名', '匿名'],
        inputData: <FormProps>{
            cate: '',
            uptype: '',
            pname: '',
            pphone: '',
            address: '',
            areaname: '',
            repconten: '',
            imageList: [],
            videoList: [],
            admincontent: '',
            adminimage: [],
            cateSelect: '',//转交选择的类型
            areanameSelect: '',//转交选择的区域
            appcontent:'',//审核信息
        },
        cateData: <TabPorps[] | []>[],
        areaData: <TabPorps[] | []>[],
        imgurl: <string>'',
        videoUrl: <string>'',
        globletoken: <string>'',
        showview: <boolean>true,
        redirectback: <boolean>false,
        bheight: <number>44,
        showbtn: <boolean>false,
        level: <any>0,
        opinion: <string>'',
        labletitle: <string>'',
        headtitle: <string>'',
        mPid: <any>null,
        mtype: <number>0,
        transferOrNot: false,
        checkTypeId: <number>0,
        checkAreaId: <number>0,
        sitemanager:<any>0,
        sameUser:<boolean>false,
        showPage1:<boolean>true
    },
    lifetimes: {
        attached() {

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
        onLoad: function (options: { pid: number; type: number; flag: boolean }) {
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
                matterPid: options.pid,
                imgurl: app.globalData.baseUrl + '/gridfs/artworkmaster/',
                videoUrl: app.globalData.baseUrl + '/api/dbfile/videostream/',
                globletoken: '?token=' + (app.globalData.token == '' ? app.globalData.utoken : app.globalData.token),
                showbtn: options.type != 2 && app.globalData.userlevel != 0 ? true : false,
                bheight: options.type != 2 && app.globalData.userlevel != 0 ? 104 : 44,
                level: app.globalData.userlevel,
                sitemanager: app.globalData.userData.sitemanager
            })
            //如果type为1，全部隐藏
            if (options.type == 3){
                this.setData({
                    showbtn: false,
                    bheight: 44,
                })
            }
            //如果是直接从小程序跳转的，则需要重新获取openid，重新登录获取token
            if (options.flag) {
                getLogin().then(() => {
                    this.bindUserClick();
                    this.setData({
                        redirectback: true,
                        padtop:44
                    })
                });
            } else {
                this.getMatter(options.type);
            }
        },

        bindUserClick() {
            //先去校验当前人员的权限
            wx.showLoading({
                title: '身份校验中...',
                mask: true,
            })
            setTimeout(async () => {
                let res: any = await getAxios('/user/LoginForMiniProgramByOpenid', {openid: app.globalData.openid})
                if (res.code == 200) {
                    wx.hideLoading()
                    app.globalData.utoken = res.data
                    tips('身份校验成功', 'success', true, 1600)
                    await this.getUserinfo();
                } else {
                    wx.hideLoading()
                    app.globalData.utoken = ''
                    tips(res.msg, 'none', true, 1500)
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '../userLogin/userLogin',
                        })
                    }, 600)
                }
            }, 1300)
        },

        async getUserinfo() {
            getAxios('/user/getuserbyopenid', {openid: app.globalData.openid}).then(async (res: any) => {
                if (res.code == 200) {
                    app.globalData.userData = res.data
                    app.globalData.username = res.data.username
                    app.globalData.userlevel = res.data.userlevel
                    app.globalData.sitemanager = res.data.sitemanager
                    wx.setStorage({
                        key: "username",
                        data: res.data.username
                    })
                    await this.getMatter();
                } else {
                    tips('用户信息未获取', 'error', true, 1600)
                    app.globalData.userData = {}
                    app.globalData.username = ''
                    app.globalData.userlevel = 0
                    app.globalData.sitemanager  =0
                    wx.setStorage({
                        key: "username",
                        data: ''
                    })
                }
            })
        },
        async getMatter(type: number = 0) {
            let res: any = app.globalData.utoken != '' ? await getAxios(`/snapshot/id?pid=${this.data.matterPid}`, {}, 1) : await postAxios(`/api/sjmmatter/getMatterById?matterId=${this.data.matterPid}`, {}, 0)
            console.log(res.data);
            //如果返回的信息中的content不为空，需要给img标签添加样式
            if (res.code == 200) {
                //如果传过来的类型为3不用处理，前面已经隐藏了按钮
                console.log(app.globalData.userlevel)
                if(type != 3){
                    // if (app.globalData.userlevel == 2) {
                    //     if (res.data.type == 1 && res.data.apprank == 0) {
                    //         this.setData({
                    //             showbtn: true,
                    //             bheight: 104,
                    //         })
                    //     } else {
                    //         this.setData({
                    //             showbtn: false,
                    //             bheight: 44,
                    //         })
                    //     }
                    // } else if (app.globalData.userlevel == 3) {
                    //     if (res.data.type == 0) {
                    //         this.setData({
                    //             showbtn: true,
                    //             bheight: 104,
                    //         })
                    //     } else {
                    //         this.setData({
                    //             showbtn: false,
                    //             bheight: 44,
                    //         })
                    //     }
                    // }
                    if (app.globalData.userData.sitemanager == 1) {
                        if (res.data.type == 1 && res.data.apprank == 0) {
                            this.setData({
                                showbtn: true,
                                bheight: 104,
                            })
                        } else {
                            this.setData({
                                showbtn: false,
                                bheight: 44,
                            })
                        }
                    } else if (app.globalData.userData.sitemanager == 0) {
                        if (res.data.type == 0) {
                            this.setData({
                                showbtn: true,
                                bheight: 104,
                            })
                        } else {
                            this.setData({
                                showbtn: false,
                                bheight: 44,
                            })
                        }
                    }
                }
                if(app.globalData.userData.pid == res.data.adminuserid && res.data.type == 0){
                    this.setData({
                        sameUser:true
                    })
                }
                //  设置inputData的值
                this.setData({
                    inputData: {
                        cate: res.data.typename,
                        uptype: res.data.uptype,
                        pname: res.data.username == null ? "" : res.data.username,
                        pphone: res.data.pphone == null ? "" : res.data.pphone,
                        areaname: res.data.selareaname == null ? "" : res.data.selareaname,
                        address: res.data.address,
                        //repconten需base64解码
                        repconten: app.globalData.utoken != '' ? res.data.repconten : Base64.decode(res.data.repconten),
                        imageList: (res.data.arepimage == '' || res.data.arepimage == null) ? [] : res.data.arepimage.split(','),
                        videoList: (res.data.arepvideo == '' || res.data.arepvideo == null) ? [] : res.data.arepvideo.split(','),
                        admincontent: res.data.admincontent,
                        adminimage: (res.data.adminimage == '' || res.data.adminimage == null) ? [] : res.data.adminimage.split(','),
                        //    将图片的全量url放到imgs中
                        appcontent:res.data.appcontent,
                    },
                    // showview:res.data.uptype == 0 ? true : false,
                })
            }
        },
        previewImg(e: any) {
            let that = this
            let index = e.currentTarget.dataset.index;
            let imgArr = that.data.inputData.imageList;
            let urlArr = [];
            for (let i = 0; i < imgArr.length; i++) {
                urlArr.push(that.data.imgurl + imgArr[i] + that.data.globletoken)
            }
            wx.previewImage({
                current: that.data.imgurl + imgArr[index] + that.data.globletoken,
                urls: urlArr
            })
        },
        previewVideo(e: any) {
            let index = e.currentTarget.dataset.index;
            let that = this
            let vdoArr = that.data.inputData.videoList;
            let urlArr = [];
            for (let i = 0; i < vdoArr.length; i++) {
                let vdo = <any>{}
                vdo['url'] = that.data.videoUrl + vdoArr[i] + that.data.globletoken
                vdo['type'] = 'video'
                urlArr.push(vdo)
            }
            //    调用wx.previewMedia预览视频
            wx.previewMedia({
                sources: <any>urlArr,
                current: index,
                showmenu: true,
                showdownload: false,
                showvideo: true,
                success: (res: any) => {
                    console.log('previewMedia success', res)
                },
                fail: (res: any) => {
                    console.log('previewMedia fail', res)
                },
                complete: (res: any) => {
                    console.log('previewMedia complete', res)
                }
            })
        },

        previewImg1(e: any) {
            let that = this
            let index = e.currentTarget.dataset.index;
            let imgArr = that.data.inputData.adminimage;
            let urlArr = [];
            for (let i = 0; i < imgArr.length; i++) {
                urlArr.push(that.data.imgurl + imgArr[i] + that.data.globletoken)
            }
            wx.previewImage({
                current: that.data.imgurl + imgArr[index] + that.data.globletoken,
                urls: urlArr
            })
        },
        passClick() {
            let that = this
            wx.showModal({
                title: '提示',
                content: '你确定要通过吗？',
                success(res) {
                    if (res.confirm) {
                        that.passOver()
                        wx.showLoading({
                            title: '提交中...',
                            mask: true,
                        })
                    } else if (res.cancel) {
                        that.setData({
                            showpage: false
                        })
                    }
                },
            })
        },
        async getUpdateInfo(pid: number) {
            let res: any = await getAxios(`/snapshot/id?pid=${pid}`, {}, 1)
            //如果返回的信息中的content不为空，需要给img标签添加样式
            if (res.code == 200) {
                //  设置inputData的值
                this.setData({
                    inputData: {
                        cate: res.data.typename,
                        uptype: res.data.uptype,
                        pname: res.data.username == null ? "" : res.data.username,
                        pphone: res.data.pphone == null ? "" : res.data.pphone,
                        areaname: res.data.selareaname == null ? "" : res.data.selareaname,
                        address: res.data.address,
                        //repconten需base64解码
                        repconten: app.globalData.utoken != '' ? res.data.repconten : Base64.decode(res.data.repconten),
                        imageList: (res.data.arepimage == '' || res.data.arepimage == null) ? [] : res.data.arepimage.split(','),
                        videoList: (res.data.arepvideo == '' || res.data.arepvideo == null) ? [] : res.data.arepvideo.split(','),
                        admincontent: res.data.admincontent,
                        adminimage: (res.data.adminimage == '' || res.data.adminimage == null) ? [] : res.data.adminimage.split(','),
                        //    将图片的全量url放到imgs中
                        appcontent:res.data.appcontent,
                    },
                    // showview:res.data.uptype == 0 ? true : false,
                })
            }
        },
        async passOver() {
            let that = this
            let res: any = await getAxios('/snapshot/shenhe', {appmark: 1, matterid: this.data.matterPid}, 1)
            if (res.code == 200) {
                wx.hideLoading()
                that.setData({
                    showpage: false,
                    mPid: res.data
                })
                if (res.data) {
                    tips('成功继续下一条', 'success', true, 1600)
                    setTimeout(async () => {
                        await this.getUpdateInfo(res.data)
                    }, 500)
                } else {
                    tips('成功', 'success', true, 1600)
                    this.setData({
                        showpage: false,
                        headtitle: '',
                        labletitle: '',
                        opinion: '',
                        mtype: 0
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '../matterPushList/matterPushList',
                        })
                    }, 500)
                }
            } else {
                wx.hideLoading()
                tips('通过未成功', 'error', true, 1600)
            }
        },
        rejectClick() {
            this.setData({
                transferOrNot: false,
                showpage: true,
                headtitle: '打回办理',
                labletitle: '打回意见',
                opinion: '',
                mtype: 3
            })
        },
        overClick() {
            this.setData({
                transferOrNot: false,
                showpage: true,
                headtitle: '回复办理',
                labletitle: '回复意见',
                opinion: '',
                mtype: 1
            })
        },
        nocareClick() {
            this.setData({
                transferOrNot: false,
                showpage: true,
                headtitle: '忽略办理',
                labletitle: '忽略意见',
                opinion: '',
                mtype: 2
            })
        },
        transferClick() {
            this.getCateData()
            this.setData({
                transferOrNot: true,
                showpage: true,
                headtitle: '转交',
                labletitle: '转交给'
            })

        },
        bindCateChange: function (e: any) {
            let index = Number(e.detail.value)
            let arr = this.data.cateData
            this.setData({
                [`inputData.${e.currentTarget.id}`]: index,
                checkTypeId: arr[index].pid,
                checkAreaId: 0
            })
            this.getAreaDataByType(arr[index].pid);
        },
        bindAreaChange: function (e: any) {
            let index = Number(e.detail.value)
            let arr = this.data.areaData
            this.setData({
                [`inputData.${e.currentTarget.id}`]: index,
                checkAreaId: arr[index].pid
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
                [`inputData.areanameSelect`]: this.data.areaData.length > 0 ? 0 : null,
                checkAreaId: this.data.areaData[0].pid
            })
        },
        async saveClick(e: any) {
            if (this.data.transferOrNot) {
                console.log(this.data.matterPid)
                console.log(this.data.checkTypeId)
                console.log(this.data.checkAreaId)
                //checkTypeId与checkAreaId均不可为空或者为0
                if (this.data.checkTypeId == 0 || this.data.checkAreaId == 0) {
                    showModal('请选择转交类型和转交类型')
                } else {
                    let that = this
                    let res: any = await getAxios('/api/sjmmatter/turn', {
                        pid: this.data.matterPid,
                        typeid: this.data.checkTypeId,
                        areaid: this.data.checkAreaId
                    })
                    if (res.code == 200) {
                        wx.hideLoading()
                        that.setData({
                            showpage: false,
                            mPid: res.data
                        })
                        if (res.data) {
                            tips('成功继续下一条', 'success', true, 1600)
                            setTimeout(async () => {
                                await this.getUpdateInfo(res.data)
                            }, 500)
                        } else {
                            tips('成功', 'success', true, 1600)
                            that.setData({
                                showpage: false,
                                headtitle: '',
                                labletitle: '',
                                opinion: '',
                                mtype: 0
                            })
                            setTimeout(() => {
                                wx.redirectTo({
                                    url: '../matterPushList/matterPushList',
                                })
                            }, 500)
                        }
                    } else {
                        wx.hideLoading()
                        tips('操作失败', 'error', true, 1600)
                    }
                }
                //调用后台进行转交操作
            } else {
                let that = this
                let obj = e.detail.value
                let mtype = this.data.mtype
                if (obj.opinion == '') {
                    showModal(`请输入${this.data.labletitle}`)
                } else {
                    wx.showLoading({
                        title: '提交中...',
                        mask: true
                    })
                    let res: any = mtype == 1 ? await getAxios('/snapshot/handle', {
                        matterid: this.data.mPid ? this.data.mPid : this.data.matterPid,
                        opinion: obj.opinion
                    }, 1) : mtype == 2 ? await getAxios('/snapshot/zuofei', {
                        matterid: this.data.mPid ? this.data.mPid : this.data.matterPid,
                        opinion: obj.opinion
                    }, 1) : await getAxios('/snapshot/shenhe', {
                        appmark: 2,
                        matterid: this.data.mPid ? this.data.mPid : this.data.matterPid,
                        opinion: obj.opinion
                    }, 1)
                    if (res.code == 200) {
                        wx.hideLoading()
                        that.setData({
                            showpage: false,
                            mPid: res.data
                        })
                        if (res.data) {
                            tips('成功继续下一条', 'success', true, 1600)
                            setTimeout(async () => {
                                await this.getUpdateInfo(res.data)
                            }, 500)
                        } else {
                            tips('成功', 'success', true, 1600)
                            that.setData({
                                showpage: false,
                                headtitle: '',
                                labletitle: '',
                                opinion: '',
                                mtype: 0
                            })
                            setTimeout(() => {
                                wx.redirectTo({
                                    url: '../matterPushList/matterPushList',
                                })
                            }, 500)
                        }
                    } else {
                        wx.hideLoading()
                        tips('操作失败', 'error', true, 1600)
                    }
                }
            }
        },
        cancleClick() {
            this.setData({
                showpage: false,
                opinion: '',
                headtitle: '',
                labletitle: '',
                mtype: 0
            })
        },
    },
})
