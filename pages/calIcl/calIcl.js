// pages/calIcl/calIcl.js
Page({
  data: {
    v1:0,
    v2:0,
    v3:0,
    v4:0,
    v5:0,
    v6:0,
    allclo:0,
    clo:0,
    checkboxItems1: [
      { name: '羽绒服', value: 0},
      { name: '西服上衣', value: 1 },
      { name: '羽绒背心', value: 2 },
      { name:'棉服（长）',value:3 },
      { name: '夹克', value: 4 },
      { name: '休闲外套', value: 5 },
      { name: '睡衣（薄）', value: 6 },
      { name: '睡衣（厚）', value: 7 },
      { name: '风衣（薄）', value: 8 },
      { name: '风衣（厚）', value: 9 },
      { name:'羊毛呢（短）', value: 10},
      { name: '羊毛呢（长）', value: 11 },
      { name: '冲锋衣', value: 12 }
      ],
      checkboxItems2: [
        { name: '毛衣（薄）', value: 0 },
        { name: '毛衣（厚）', value: 1 },
        { name: '针织衫（薄）', value: 2 },
        { name: '针织衫（厚）', value: 3 },
        { name: '羊绒衫', value: 4 },
        { name: '毛背心', value: 5 },
        { name: '长袖衬衫', value: 6 },
        { name: '连衣裙', value: 7 },
      ],
      checkboxItems3: [
        { name: '秋衣', value: 0 },
        { name: '秋裤（厚）', value: 1 },
        { name: '保暖秋衣', value: 2 },
        { name: '保暖秋裤', value: 3 },
        { name: '短袖汗衫', value: 4 },
        { name: '背心', value: 5 },
      ],
      checkboxItems4: [
        { name: '西裤/牛仔裤', value: 0 },
        { name: '打底裤（厚）', value: 1 },
        { name: '睡裤（薄）', value: 2 },
        { name: '睡裤（厚）', value: 3 },
        { name: '内加绒外裤', value: 4 },
        { name: '棉裤', value: 5 },
        { name: '羊绒裤', value: 6 },
        { name: '毛绒裤', value: 7 },
        { name: '短裤', value: 8 },
        { name: '半裙', value: 9 },
      ],
      checkboxItems5: [
        { name: '未到踝短袜', value: 0 },
        { name: '到踝短袜', value: 1 },
        { name: '到膝长袜', value: 2 },
        { name: '连裤袜（薄）', value: 3 },
        { name: '连裤袜（厚）', value: 4 }
      ],
      checkboxItems6: [
        { name: '皮鞋', value: 0 },
        { name: '运动鞋', value: 1 },
        { name: '凉拖鞋', value: 2 },
        { name: '棉拖鞋', value: 3 }
      ],
  },
  checkbox1Change: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems1 = this.data.checkboxItems1, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems1.length; i < lenI; ++i) {
      checkboxItems1[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems1[i].value == values[j]) {
          checkboxItems1[i].checked = true;
          break;
        }
      }
    };
    var sum=0;
    var Icl=new Array(0.55,0.42,0.3,0.4,0.35,0.35,0.2,0.46,0.4,0.6,0.5,0.6,0.45);
    for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
      sum = sum + Icl[values[j]];
    }
    var clo = this.data.clo - this.data.v1 + sum;
    var acl = Math.round((clo*0.835+0.161) * 100) / 100
    if (clo < 0.001) acl = 0;
    this.setData({
      checkboxItems1: checkboxItems1,
      v1:sum,
      allclo:acl,
      clo:clo
    });
    console.log(clo)
  },
  checkbox2Change: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems2, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    };
    var sum = 0;
    var Icl = new Array(0.2,0.35,0.1,0.15,0.35,0.14,0.07,0.2);
    for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
      sum = sum + Icl[values[j]];
    }
    console.log(sum)
    var clo = this.data.clo - this.data.v2 + sum;
    var acl = Math.round((clo * 0.835 + 0.161) * 100) / 100
    if (clo < 0.001) acl = 0;
    this.setData({
      checkboxItems2: checkboxItems,
      allclo: acl,
      v2:sum,
      clo:clo
    });
    console.log(clo)
  },
  checkbox3Change: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems3, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    };
    var sum = 0;
    var Icl = new Array(0.12,0.2,0.3,0.3,0.05,0.03);
    for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
      sum = sum + Icl[values[j]];
    }
    console.log(sum)
    var clo = this.data.clo - this.data.v3 + sum;
    var acl = Math.round((clo * 0.835 + 0.161) * 100) / 100
    if (clo < 0.001) acl = 0;
    this.setData({
      checkboxItems3: checkboxItems,
      allclo: acl,
      clo:clo,
      v3: sum
    });
    console.log(clo)
  },
  checkbox4Change: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems4, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    };
    var sum = 0;
    var Icl = new Array(0.15,0.1,0.2,0.25,0.25,0.2,0.3,0.25,0.06,0.12);
    for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
      sum = sum + Icl[values[j]];
    }
    console.log(sum)
    var clo = this.data.clo - this.data.v4 + sum;
    var acl = Math.round((clo * 0.835 + 0.161) * 100) / 100
    if (clo < 0.001) acl = 0;
    this.setData({
      checkboxItems4: checkboxItems,
      allclo: acl,
      clo:clo,
      v4: sum
    });
    console.log(clo)
  },
  checkbox5Change: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems5, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    };
    var sum = 0;
    var Icl = new Array(0.02,0.05,0.1,0.15,0.2);
    for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
      sum = sum + Icl[values[j]];
    }
    console.log(sum)
    var clo = this.data.clo - this.data.v5 + sum;
    var acl = Math.round((clo * 0.835 + 0.161) * 100) / 100
    if (clo < 0.001) acl = 0;
    this.setData({
      checkboxItems5: checkboxItems,
      clo:clo,
      allclo: acl,
      v5: sum
    });
    console.log(clo)
  },
  checkbox6Change: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems6, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    };
    var sum = 0;
    var Icl = new Array(0.15,0.15,0.02,0.1);
    for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
      sum = sum + Icl[values[j]];
    }
    console.log(sum)
    var clo = this.data.clo - this.data.v6 + sum;
    var acl = Math.round((clo * 0.835 + 0.161) * 100) / 100
    if (clo < 0.001) acl = 0;
    this.setData({
      checkboxItems6: checkboxItems,
      clo:clo,
      allclo: acl,
      v6: sum
    });
    console.log(clo)
  },
  clickBtn1: function(e){
    var checkboxItems = this.data.checkboxItems1;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
    }
    var tmp=this.data.clo-this.data.v1;
    var tmpp = Math.round((tmp * 0.835 + 0.161) * 100) / 100
    if (tmp < 0.001) tmpp = 0;
    this.setData({
      checkboxItems1: checkboxItems,
      v1:0,
      clo:tmp,
      allclo:tmpp
    });
  } ,
  clickBtn2: function (e) {
    var checkboxItems = this.data.checkboxItems2;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
    }
    var tmp = this.data.clo - this.data.v2;
    var tmpp = Math.round((tmp * 0.835 + 0.161) * 100) / 100
    if (tmp < 0.001) tmpp = 0;
    this.setData({
      checkboxItems2: checkboxItems,
      v2: 0,
      allclo: tmpp,
      clo:tmp
    });
  },
  clickBtn3: function (e) {
    var checkboxItems = this.data.checkboxItems3;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
    }
    var tmp = this.data.clo - this.data.v3;
    var tmpp = Math.round((tmp * 0.835 + 0.161) * 100) / 100
    if (tmp < 0.001) tmpp = 0;
    this.setData({
      checkboxItems3: checkboxItems,
      v3: 0,
      allclo: tmpp,
      clo:tmp
    });
  },
  clickBtn4: function (e) {
    var checkboxItems = this.data.checkboxItems4;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
    }
    var tmp = this.data.clo - this.data.v4;
    var tmpp = Math.round((tmp * 0.835 + 0.161) * 100) / 100
    if (tmp < 0.001) tmpp = 0;
    this.setData({
      checkboxItems4: checkboxItems,
      v4: 0,
      allclo: tmpp,
      clo:tmp
    });
  },
  clickBtn5: function (e) {
    var checkboxItems = this.data.checkboxItems5;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
    }
    var tmp = this.data.clo - this.data.v5;
    var tmpp = Math.round((tmp * 0.835 + 0.161) * 100) / 100
    if (tmp < 0.001) tmpp = 0;
    this.setData({
      checkboxItems5: checkboxItems,
      v5: 0,
      allclo: tmpp,
      clo:tmp
    });
  },
  clickBtn6: function (e) {
    var checkboxItems = this.data.checkboxItems6;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
    }
    var tmp = this.data.clo - this.data.v6;
    var tmpp = Math.round((tmp * 0.835 + 0.161) * 100) / 100
    if (tmp < 0.001) tmpp = 0;
    this.setData({
      checkboxItems6: checkboxItems,
      v6: 0,
      allclo: tmpp,
      clo:tmp
    });
  }
})