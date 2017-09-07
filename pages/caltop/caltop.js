var fun=require("../../utils/fun.js");
var app = getApp()
Page({
    data: {
        pmv:'',
        tOp:'',
        v:'',
        rh:'',
        clo:'',
        met:'',
        metValues: ["请选择活动类型", "静坐（阅读）", "办公室打字", "躺着", "睡眠", "站着休息", "站着整理文档", "站着，偶尔走动", "提重物，打包", "做家务"],
        cloValues: ["请选择服装类型", "长裤、短袖衬衫", "长裤、长袖衬衫", "短袖衬衣、短裤", "长裤、长衬衫、短外衣", "长裤、长袖衬衫、背心、T恤", "长运动衣裤", "及膝裙、短袖衬衫、连裤袜、凉鞋", "及膝裙，长袖衬衫，连裤袜，长衬裙"],
        metValueIndex: 0,
        cloValueIndex: 0
    },
    calPMV: function () {
        var pmvi= parseFloat(this.data.pmv);
        var rhi=parseFloat(this.data.rh);
        var vi=parseFloat(this.data.v);
        var cloi=parseFloat(this.data.clo);
        var meti=parseFloat(this.data.met);        
        if(isNaN(pmvi)||isNaN(rhi)||isNaN(vi)||isNaN(cloi)||isNaN(meti)||rhi<0||rhi>100||cloi<0||meti<0||vi<0)
        {
            wx.showModal({
            content: '有不合理输入参数或空值！请确定所有输入值都是数字，除了PMV其他变量不允许是负数！',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('确定')
                }
            }
        });
            return
        }
        var pout=fun.findTo(pmvi,cloi,vi,meti,rhi);        
        pout=Math.round(pout*100)/100;
        this.setData({
            tOp:pout
        })
    },
    taInput:function(e){
            this.setData({
             pmv:e.detail.value
            })    
    },
    rhInput:function(e){
    this.setData({
      rh:e.detail.value
    })
    },
    vInput:function(e){
    this.setData({
      v:e.detail.value
    })
    },
    cloInput:function(e){
    this.setData({
      clo:e.detail.value
    })
    },
    metInput:function(e){
    this.setData({
      met:e.detail.value
    })
    },
    bindMetValueChange: function (e) {
      var metV = new Array(1.0, 1.0, 1.1, 0.8, 0.7, 1.2, 1.3, 2.1, 2.1, 2.66);
      console.log('picker met 发生选择改变，携带值为', e.detail.value);
      var tmp = e.detail.value;
      if (tmp != 0) {
        this.setData({
          metValueIndex: tmp,
          met: metV[tmp]
        }
        )
      }
    },
    bindCloValueChange: function (e) {
      var cloV = new Array(0.57, 0.57, 0.61, 0.36, 0.96, 1.14, 0.74, 0.54, 0.67);
      console.log('picker met 发生选择改变，携带值为', e.detail.value);
      var tmp = e.detail.value;
      if (tmp != 0) {
        this.setData({
          cloValueIndex: tmp,
          clo: cloV[tmp]
        }
        )
      }
    },
     clearInput: function (e) {
      this.setData({
        pmv: '',
        tOp: '',
        v: '',
        rh: '',
        clo: '',
        met: '',
        metValueIndex: 0,
        cloValueIndex: 0
      }
      )
    },
});