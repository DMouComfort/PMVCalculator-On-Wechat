var fun=require("../../utils/fun.js");
Page({
  data: {
    x1Values: ["干球温度(℃)", "相对湿度(%)", "含湿量(g/kg)", "湿球温度(℃)", "露点温度(℃)", "焓(kJ/kg)","水蒸气分压力(kPa)"],
    x2Values: ["相对湿度(%)", "含湿量(g/kg)", "湿球温度(℃)", "露点温度(℃)", "焓(kJ/kg)", "水蒸气分压力(kPa)"],
    x1ValueIndex: 0,
    x2ValueIndex: 0,
    Ta:25,
    B:101325,
    Td:13.9,
    Tw:17.89,
    RH:50,
    d:9.88,
    h:50.32,
    Pws:3.169,
    Pa:1.585,
    rou:1.165,
  },
  bindx1ValueChange: function (e) {
    console.log('picker met 发生选择改变，携带值为', e.detail.value);
    var tmp = e.detail.value;
    var list=this.data.x1Values;
    var newlist = new Array();
    var k=0;
    console.log(tmp);
    for (var i = 0; i < 7; ++i) {
      if (tmp==2||tmp==4||tmp==6)
      {
        if ((i != 2) && (i != 4) && (i != 6)) {
          newlist[k] = list[i];
          k++;
        }
      }
      else{
        if (i != tmp) {
          newlist[k] = list[i];
          k++;
        }
      } 
    }
      this.setData({
        x1ValueIndex: tmp,
        x2Values: newlist,
      }
      )
  },
  bindx2ValueChange: function (e) {
    console.log('picker met 发生选择改变，携带值为', e.detail.value);
    var tmp = e.detail.value;
    this.setData({
      x2ValueIndex: tmp,
    }
    )
  },
  x1Input: function(e) {
    console.log(1);
    var tmp = parseFloat(e.detail.value);
    if (isNaN(tmp)) {
      return;
    }
      var flg = parseInt(this.data.x1ValueIndex); 
      switch (flg){
        case 0:{
            this.setData({
              Ta: e.detail.value
            })
            break;
        }
        case 1:{
          console.log('湿度');
          this.setData({
            RH: e.detail.value
          })
          break;
        }
        case 2: {
          console.log('含湿量');
          this.setData({
            d: e.detail.value
          })
          break;
        }
        case 3: {
          console.log('湿球温度');
          this.setData({
            Tw: e.detail.value
          })
          break;
        } 
        case 4: {
          console.log('露点温度');
          this.setData({
            Td: e.detail.value
          })
          break;
        }
        case 5: {
          console.log('焓');
          this.setData({
            h: e.detail.value
          })
          break;
        }  
        case 6: {
          console.log('水蒸气分压力');
          this.setData({
            Pa: e.detail.value
          })
          break;
        }    
      }
  },
  x2Input: function (e) {
    var flg = this.data.x2Values[this.data.x2ValueIndex];
    var tmp = parseFloat(e.detail.value);
    if (isNaN(tmp)) {
      return;
    }
    console.log(e.detail.value);
    switch (flg) {
      case "干球温度(℃)": {
        console.log('温度');
        this.setData({
          Ta: e.detail.value
        })
        break;
      }
      case "相对湿度(%)": {
        console.log('湿度');
        this.setData({
          RH: e.detail.value
        })
        break;
      }
      case "含湿量(g/kg)": {
        console.log('含湿量');
        this.setData({
          d: e.detail.value
        })
        break;
      }
      case "湿球温度(℃)": {
        console.log('湿球温度');
        this.setData({
          Tw: e.detail.value
        })
        break;
      }
      case "露点温度(℃)": {
        console.log('露点温度');
        this.setData({
          Td: e.detail.value
        })
        break;
      }
      case "焓(kJ/kg)": {
        console.log('焓');
        this.setData({
          h: e.detail.value
        })
        break;
      }
      case "水蒸气分压力(kPa)": {
        console.log('水蒸气分压力');
        this.setData({
          Pa: e.detail.value
        })
        break;
      }
    }
  },
  cal:function(){
    var flg1 = parseInt(this.data.x1ValueIndex);
    var flg2 = this.data.x2Values[this.data.x2ValueIndex];
    console.log(flg2);
    switch (flg1){
      case 0:{
        this.CalPws();
        switch (flg2){
          case "相对湿度(%)": {
            this.CalPaByRH();
            this.CalTd();
            this.CaldByPa();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
          case "含湿量(g/kg)": {
            this.CalPaByd();
            this.CalTd();
            this.CalhByTad();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "湿球温度(℃)": {
            this.CaldByTaTw(); 
            this.CalPaByd();
            this.CalTd();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
          case "露点温度(℃)": {
            this.CaldByTd();
            this.CalPaByd();
            this.CalhByTad();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "焓(kJ/kg)": {
            this.CaldByTah();
            this.CalPaByd();
            this.CalTd();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "水蒸气分压力(kPa)": {
            this.CaldByPa();
            this.CalTd();
            this.CalhByTad();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
        }
        break;

      }
      case 1:{
        switch (flg2){
          case "干球温度(℃)": {
            this.CalPws();
            this.CalPaByRH();
            this.CalTd();
            this.CaldByPa();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
          case "含湿量(g/kg)": {
            this.CalTaByRHd();
            this.CalPws();
            this.CalPaByd();
            this.CalTd();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
          case "湿球温度(℃)": {
            this.CalTaByRHTw();
            this.CalPws();
            this.CalPaByRH();
            this.CalTd();
            this.CaldByPa();
            this.CalhByTad();
            break;
          }
          case "露点温度(℃)": {
            this.CaldByTd();
            this.CalTaByRHd();
            this.CalPws();
            this.CalPaByd();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
          case "焓(kJ/kg)": {
            this.CalTaByRHh();
            this.CalPws();
            this.CaldByTah();
            this.CalPaByd();
            this.CalTd();
            this.CalTwByTad();
            break;
          }
          case "水蒸气分压力(kPa)": {
            this.CaldByPa();
            this.CalTaByRHd();
            this.CalPws();
            this.CalTd();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
        }
        break;
      }
      case 2: {
        this.CalTd();
        this.CalPaByd();
        switch (flg2) {
          case "相对湿度(%)": {
            this.CalTaByRHd();
            this.CalPws();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
          case "干球温度(℃)": {
            this.CalPws();
            this.CalhByTad();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "湿球温度(℃)": {
            this.CalTaBydTw();
            this.CalPws();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
          case "焓(kJ/kg)": {
            this.CalTaBydh();
            this.CalPws(); 
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
        }
        break;
      }
      case 3: {
        switch (flg2) {
          case "相对湿度(%)": {
            this.CalTaByRHTw();
            this.CalPws();
            this.CalPaByRH();
            this.CalTd();
            this.CaldByPa();
            this.CalhByTad();
            break;
          }
          case "含湿量(g/kg)": {
            this.CalTd();
            this.CalPaByd();
            this.CalTaBydTw();
            this.CalPws();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
          case "干球温度(℃)": {
            this.CalPws();
            this.CaldByTaTw();
            this.CalPaByd();
            this.CalTd();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
          case "露点温度(℃)": {
            this.CaldByTd();
            this.CalPaByd();
            this.CalTaBydTw();
            this.CalPws();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
          case "焓(kJ/kg)": {
            this.CalTaByhTw();
            this.CalPws();
            this.CaldByTaTw();
            this.CalPaByd();
            this.CalTd();
            this.CalRHByPaPws();
            break;
          }
          case "水蒸气分压力(kPa)": {
            this.CaldByPa();
            this.CalTd();
            this.CalTaBydTw();
            this.CalPws();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
        }
        break;
      }
      case 4: {
        this.CaldByTd();
        this.CalPaByd();
        switch (flg2) {
          case "相对湿度(%)": {
            this.CalTaByRHd();
            this.CalPws();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
          case "干球温度(℃)": {
            this.CalPws();
            this.CalhByTad();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "湿球温度(℃)": {
            this.CalTaBydTw();
            this.CalPws();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
          case "焓(kJ/kg)": {
            this.CalTaBydh();
            this.CalPws();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
        }
        break;
      }
      case 5: {
        switch (flg2) {
          case "相对湿度(%)": {
            this.CalTaByRHh();
            this.CalPws();
            this.CaldByTah();
            this.CalPaByd();
            this.CalTd();
            this.CalTwByTad();
            break;
          }
          case "含湿量(g/kg)": {
            this.CalTd();
            this.CalPaByd();
            this.CalTaBydh();
            this.CalPws();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "湿球温度(℃)": {
            this.CalTaByhTw();
            this.CalPws();
            this.CaldByTaTw();
            this.CalPaByd();
            this.CalTd();
            this.CalRHByPaPws();
            break;
          }
          case "露点温度(℃)": {
            this.CaldByTd();
            this.CalPaByd();
            this.CalTaBydh();
            this.CalPws();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "干球温度(℃)": {
            this.CalPws();
            this.CaldByTah();
            this.CalPaByd();
            this.CalTd();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "水蒸气分压力(kPa)": {
            this.CaldByPa();
            this.CalTd();
            this.CalTaBydh();
            this.CalPws();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
        }
        break;
      } 
      case 6: {
        this.CaldByPa();
        this.CalTd();
        switch (flg2) {
          case "相对湿度(%)": {
            this.CalTaByRHd();
            this.CalPws();
            this.CalhByTad();
            this.CalTwByTad();
            break;
          }
          case "干球温度(℃)": {
            this.CalPws();
            this.CalhByTad();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
          case "湿球温度(℃)": {
            this.CalTaBydTw();
            this.CalPws();
            this.CalhByTad();
            this.CalRHByPaPws();
            break;
          }
          case "焓(kJ/kg)": {
            this.CalTaBydh();
            this.CalPws();
            this.CalTwByTad();
            this.CalRHByPaPws();
            break;
          }
        }
        break;
      }
    }
    this.CalrouByTad();

  },
  CalPws:function(){
    console.log('a1=',this.data.Ta);
    var Ta = parseFloat(this.data.Ta);
    console.log(Ta);
    var Pws = Math.round(fun.CalPws(Ta) ) / 1000;
    this.setData({
      Pws: Pws
    })
  },
  CalPwsByRHPa:function(){
    var RH = parseFloat(this.data.RH);
    var Pa = parseFloat(this.data.Pa)*1000;
    var Pws = Math.round(fun.CalPwsByRHPa(RH,Pa)) / 1000;
    this.setData({
      Pws: Pws
    })
  },
  CalPaByd:function(){
    var d = parseFloat(this.data.d);
    var B=parseFloat(this.data.B);
    var Pa = Math.round(fun.CalPaByd(d, B)) / 1000;
    this.setData({
      Pa: Pa
    })
  },
  CalPaByRH:function(){
    var RH = parseFloat(this.data.RH);
     console.log(RH);
    var Pws = parseFloat(this.data.Pws)*1000;
    console.log(Pws);
    var Pa = Math.round(fun.CalPaByRH(RH, Pws)) / 1000;
    this.setData({
      Pa: Pa
    })

  },
  CaldByPa:function(){
    var Pa = parseFloat(this.data.Pa)*1000;
    var B = parseFloat(this.data.B) ;
    var d = Math.round(fun.CaldByPa(Pa, B)*100) / 100;
    this.setData({
      d: d
    })
  },
  CaldByTaTw:function(){
    var Ta = parseFloat(this.data.Ta);
    var Tw = parseFloat(this.data.Tw);
    var B = parseFloat(this.data.B);
    var d = Math.round(fun.CaldByTaTw(Ta,Tw, B) * 100) / 100;
    this.setData({
      d: d
    })
  },
  CaldByTd:function(){
    var Td = parseFloat(this.data.Td);
    var B = parseFloat(this.data.B);
    var d = Math.round(fun.CaldByTd(Td, B) * 100) / 100;
    this.setData({
      d: d
    })
  },
  CaldByTah: function () {
    var Ta = parseFloat(this.data.Ta);
    var h = parseFloat(this.data.h);
    var d = Math.round(fun.CaldByTah(Ta, h) * 100) / 100;
    this.setData({
      d: d
    })
  },
  CalRHByPaPws: function () {
    var Pa = parseFloat(this.data.Pa);
    var Pws = parseFloat(this.data.Pws);
    var RH = Math.round(fun.CalRHByPaPws(Pa, Pws) * 100) / 100;
    this.setData({
      RH: RH
    })
  },
  CalhByTad: function () {
    var Ta = parseFloat(this.data.Ta);
    var d = parseFloat(this.data.d);
    var h = Math.round(fun.CalhByTad(Ta, d) * 100) / 100;
    this.setData({
      h: h
    })
  },
  CalrouByTad: function (){
    var Ta = parseFloat(this.data.Ta);
    var d = parseFloat(this.data.d);
    var B = parseFloat(this.data.B);
    var rou = Math.round(fun.CalrouByTad(Ta, d,B) * 1000) / 1000;
    this.setData({
      rou: rou
    })
  },
  CalTd:function(){
    var Pa = parseFloat(this.data.Pa)*1000;
    var Td = Math.round(fun.CalTd(Pa) * 100) / 100;
    this.setData({
      Td: Td
    })
  },
  CalTwByTad: function () {
    var Ta = parseFloat(this.data.Ta);
    var d = parseFloat(this.data.d);
    var B = parseFloat(this.data.B);
    var Tw = Math.round(fun.CalTwByTad(Ta, d, B) * 100) / 100;
    this.setData({
      Tw: Tw
    })
  },
  CalTaByRHd: function(){
    var RH = parseFloat(this.data.RH);
    var d = parseFloat(this.data.d);
    var B = parseFloat(this.data.B);
    var Ta = Math.round(fun.CalTaByRHd(RH, d, B) * 100) / 100;
    this.setData({
      Ta: Ta
    })
  },
  CalTaByRHh: function () {
    var RH = parseFloat(this.data.RH);
    var h = parseFloat(this.data.h);
    var B = parseFloat(this.data.B);
    var Ta = Math.round(fun.CalTaByRHh(RH, h, B) * 100) / 100;
    this.setData({
      Ta: Ta
    })
  },
  CalTaByRHTw:function () {
    var RH = parseFloat(this.data.RH);
    var Tw = parseFloat(this.data.Tw);
    var B = parseFloat(this.data.B);
    var Ta = Math.round(fun.CalTaByRHTw(RH, Tw, B) * 100) / 100;
    this.setData({
      Ta: Ta
    })
  },
  CalTaBydh: function () {
    var d = parseFloat(this.data.d);
    var h = parseFloat(this.data.h);
    var Ta = Math.round(fun.CalTaBydh(d, h) * 100) / 100;
    this.setData({
      Ta: Ta
    })
  },
  CalTaBydTw: function () {
    var d = parseFloat(this.data.d);
    var Tw = parseFloat(this.data.Tw);
    var B = parseFloat(this.data.B);
    var Ta = Math.round(fun.CalTaBydTw(d, Tw, B) * 100) / 100;
    this.setData({
      Ta: Ta
    })
  },
  CalTaByhTw: function () {
    var h = parseFloat(this.data.h);
    var Tw = parseFloat(this.data.Tw);
    var B = parseFloat(this.data.B);
    var Ta = Math.round(fun.CalTaByhTw(h, Tw, B) * 100) / 100;
    this.setData({
      Ta: Ta
    })
  },
  BInput:function(e){
    this.setData({
      B: e.detail.value
    })

  }
});



