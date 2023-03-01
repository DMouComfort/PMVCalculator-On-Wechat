var fun=require("../../utils/fun.js");
var app = getApp()
Page({
    data: {
        utci:'',
        ta:'25',
        tr:'25',
        v:'0.5',
        rh:'50'
    },
    calUTCI: function () {
        var tai= parseFloat(this.data.ta);
        var tri=parseFloat(this.data.tr);
        var rhi=parseFloat(this.data.rh);
        var vi=parseFloat(this.data.v);   
        if(isNaN(tai)||isNaN(tri)||isNaN(rhi)||isNaN(vi)||rhi<0||rhi>100||vi<0)
        {
            wx.showModal({
            content: '有不合理输入参数或空值！请确定所有输入值都是数字，除了温度其他变量不允许是负数！',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                  console.log('确定')
                }
              }
            })
            return
        }
        if(vi>17||vi<0.5)
        {
            wx.showModal({
            content: '风速应在0.5m/s~17m/s之间！',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                  console.log('确定')
                }
              }
            })
            return
        }
        var pout=fun.calUTCI(tai,tri,vi,rhi);
        pout = Math.round(pout*100)/100;
        var ppdo = 0;
        this.setData({
            utci:pout
        })
    },
    taInput:function(e){
            this.setData({
             ta:e.detail.value
            })    
    },
    trInput:function(e){
    this.setData({
      tr:e.detail.value
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
});