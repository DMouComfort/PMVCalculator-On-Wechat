function calPMV(ta,tr,v,rh,met,clo) {
  console.log("ta="+ta);
  console.log("tr="+tr);
  console.log("v="+v);
  console.log("rh="+rh);
  console.log("met="+met);
  console.log("clo="+clo);
  var fcl;
  if(clo<0.5)
  {
    fcl=1+0.2*clo;
  }
  else
  {
    fcl=1.05+0.1*clo;
  }
  console.log("fcl="+fcl);
  var icl=clo*0.155;/*单位换算*/
  var M=58.15*met;
  var tsk=35.7-0.028*M;
  console.log("tsk="+tsk);
  var pws=Math.exp(16.6536 - 4030.183 / (ta + 235));
  var pa = pws * rh / 100;
  var tcl=Math.min(ta,tsk);
  var hc0;
  if(v==0)
  {
    hc0=0;
  }
  else
  {
    hc0=12.1*Math.pow(v,0.5);
  } 
  var hc=hc0;
  var hc1;
  if(icl==0)
  {
    tcl=tsk;
    hc1=2.38*Math.pow(Math.abs(tcl-ta),0.25);
    hc=Math.max(hc1,hc0);
  }
  else
  {
    var maxIteration=100;
    var iteration;
    var Tr=tr+273;
    var a=273;
    var b=100;
    var A,B,C,X1,X2,X3,X4,Y1,Y2,Y3;
    for(iteration=0;iteration<maxIteration;iteration++)
    {     
      A=-icl*3.96*fcl;
      B=tsk+icl*fcl*(hc*ta+3.96*Math.pow(Tr/100,4));
      C=(1+icl*fcl*hc);
      X1=Math.pow(9*A*Math.pow(b,8)*Math.pow(C,2)+Math.pow(3*(-Math.pow(A,2)*Math.pow(b,12)*(-27*Math.pow(b,4)*Math.pow(C,4)+256*A*Math.pow(B+a*C,3))),0.5),1/3);
      X2=4*Math.pow(2/3,1/3)*A*Math.pow(b,4)*(B+a*C);
      X3=1/(Math.pow(2,1/3)*Math.pow(3,2/3)*A);
      X4=8*Math.pow(b,4)*C/A;
      Y1=X2/(A*X1);
      Y2=X3*X1;
      Y3=X4/(4*Math.pow(Y1+Y2,0.5));
      tcl=-a-1/2*Math.pow(Y1+Y2,0.5)+1/2*Math.pow(-Y1-Y2-Y3,0.5);
      hc1=2.38*Math.pow(Math.abs(tcl-ta),0.25);
      if(Math.abs(hc-Math.max(hc1,hc0))<0.0001)
      {
        break;
      }
      hc=Math.max(hc1,hc0);
    } 
    console.log("iteration="+iteration);
    var pmv=(0.303*Math.exp(-0.036*M)+0.028)*(M-fcl*hc*(tcl-ta)-3.96*fcl*(Math.pow((tcl+273)/100,4)-Math.pow(Tr/100,4))-0.0014*M*(34-ta)-0.017*M*(5.867-pa)-3.05*(5.733-0.00699*M-pa)-Math.max(0,0.42*(M-58.15)));
  }
  console.log("pmv="+pmv);
  return pmv
}

function calPPD(PMV){
  return (100 - 95 * Math.exp(-(0.03353 *Math.pow(PMV,4) + 0.2179 * Math.pow(PMV,2))))
}

function findTo(PMV,clo,v,met,rh){
  var iteration=1;
  var maxIteration=100;
  var dx=100;
  var delta=0.0001;
  var t0=24;
  var Err1,Err2,t1,T0;
  while(Math.abs(dx)>0.001&&iteration<maxIteration){
    Err1=calPMV(t0,t0,v,rh,met,clo)-PMV;
    T0=t0+delta;
    Err2=calPMV(T0,T0,v,rh,met,clo)-PMV;
    t1=t0-delta*Err1/(Err2-Err1);
    dx=t1-t0;
    t0=t1;
    iteration++;
  }
  if(iteration==maxIteration){
    return 99999;
  }
  else{
    return t1;
  }
}
function findSET(Ta, Tr, V, RH, M, Icl){
 
  var KCLO=0.25;
  var SBC=0.000000056697;
  var CSW=170.0;
  var CDIL=120.0;
  var CSTR=0.5;
  var SBF0=6.3;
  var Patm0=101.325;
  var K=5.28;
  var DT=60;
  var IMS=0.45;
  var ADu=1.8258;
  var Weight=69.6;
  var LR, Pwater, Fcl, Wcrit, Kicl, Hc, SBF, Rea, Recl, Top,Hr, Tcl, R, C, Eres, Cres, Qtrans, Mshiv, Esk, Ersw, Emax, w, wet, Ediff, Dry, Hsk, H, Ra, Pskin, d_Tsk, Sweat,Scr, Ssk, Ccr, Csk, alpha,Hd_s, He_s
  var T =new Array(3);
  var Err = new Array(3);
  var Warm= new Array(3)
  var Cold = new Array(3);
  //0~2分别代表核心(Core)，皮肤(Skin)，身体(Body)
  var TNeutral =new Array(36.49,33.7,36.49);
  var Patm=Patm0;
  var i;
  for(i=0;i<3;i++){
  T[i]=TNeutral[i];
  }
  alpha=0.1;
  V=Math.max(V,0.1);
  SBF=SBF0;
  Mshiv=0;
  Esk=0.1*M;
  Fcl=1.0+0.15*Icl;
  Icl=Icl*0.155;
  Pwater=RH/100*FindSaturatedVaporPressure(Ta);
  LR=15.1512*(25+273.15)/273.15*(Patm0/Patm);
  M=M*58.2;
  if(Icl<=0){
  Wcrit=0.38*Math.pow(V,-0.29);
  Kicl=1.0;
  }
  else{
  Wcrit = 0.59* Math.pow(V, -0.08);
  Kicl=0.45;
  }
  Hc = Math.max(3.0 * Math.pow(Patm / Patm0, 0.53), 8.600001 * Math.pow((V * Patm / Patm0), 0.53));//计算对流传热系数
  var Tsk_old;
  var Iteration;
  d_Tsk=100;
  for(Iteration=0;Iteration<60;Iteration++){
  Tsk_old=T[1];
  console.log("Tsk_old="+Tsk_old);
  if(d_Tsk>0.1){
    Tcl = CalTcl(T,Ta, Tr, Ta, Icl, SBC, Fcl, Hc, 1);
  }
  else{
    Tcl = CalTcl(T,Ta, Tr, Tcl, Icl, SBC, Fcl, Hc, 0);
  }
  console.log("Tcl=" + Tcl);
  Hr = 4.0 * SBC * Math.pow(((Tcl + Tr) / 2.0 + 273.15), 3.0) * 0.72;
  H = Hc + Hr;
  Top = (Hc * Ta + Hr * Tr) / H;
  Ra = 1 / (Fcl * H);
  Tcl = (Ra * T[1] + Icl * Top) / (Ra + Icl);
  console.log(Tcl);
  R = Hr * Fcl * (Tcl - Tr);//表面辐射
  C = Hc * Fcl * (Tcl - Ta);//表面对流
  Dry = (T[1] - Top) / (1 / (Fcl * (Hc + Hr)) + Icl);
  Eres = 0.017 * M * (5.867 - Pwater);//呼吸潜热
  Cres = 0.0014 * M * (34.0 - Ta);//呼吸显热
  Qtrans = (T[0] - T[1]) * (K + 1.163 * SBF);
  Scr = M + Mshiv - Eres - Cres - Qtrans;
  Ssk = Qtrans - R - C - Esk;
  Ccr = 0.97 * (1 - alpha) * Weight;//核心热容
  Csk = 0.97 * alpha * Weight;//皮肤热容
  //------------------更新各个节点的温度-------------------
  T[0] = T[0]+Scr * ADu / Ccr * DT / 3600;
  T[1] = T[1] +Ssk * ADu / Csk * DT / 3600;
  T[2] = alpha * T[1] + (1 - alpha) * T[0];
  //-------------------------------------------------------
  for (i = 0; i < 3; i++) {
    Err[i] = T[i] - TNeutral[i];
    Warm[i] = Math.max(Err[i], 0);
    Cold[i] = -Math.min(Err[i], 0);
  }//计算冷或热信号
  //下面是调节过程：========================================================================================
  //1.血流量变化：
  SBF = Math.max(0.5, Math.min(90.0, (SBF0 + CDIL * Warm[0]) / (1 + CSTR * Cold[1])));
  alpha = 0.0417737 + 0.7451833 / (SBF + 0.585417);
  //2.出汗量的调节以及皮肤湿润度的计算
  Sweat = Math.min(500.0, CSW * Warm[2] * Math.exp(Warm[1] / 10.7));
  Ersw = 0.68 * Sweat;
  //计算代谢出汗量		
  Rea = 1.0 / (LR * Fcl * Hc);//空气湿阻
  Recl = Icl / (LR * Kicl);//服装湿阻
  Emax = (FindSaturatedVaporPressure(T[1]) - Pwater) / (Rea + Recl);
  wet = 0.06 + 0.94 * Ersw / Emax;
  Ediff = wet * Emax - Ersw;
  if (wet > Wcrit) {
    wet = Wcrit;
    Ersw = Wcrit / 0.94;
    Ediff = 0.06 * (1 - Wcrit / 0.94) * Emax;
  }
  if (Emax < 0) {
    Ediff = 0;
    Ersw = 0;
    wet = Wcrit;
    Esk = Emax;
  }
  Esk = Ediff + Ersw;
  //3.颤栗产热
  Mshiv = 19.4 * Cold[1] * Cold[0];
  d_Tsk = Math.abs(T[1] - Tsk_old);
  if (d_Tsk < 0.0001) break;
  }
  Hsk = Dry + Esk;
  Pskin = FindSaturatedVaporPressure(T[1]);
  var Hr_s= Hr;
  var Met= M / 58.2;
  var Hc_s;
  if (Met < 0.85) {
    Hc_s = 3;
  }
  else {
    Hc_s = Math.max(3, 5.66 * Math.pow(Met - 0.85, 0.39));
  }

  var H_s= Hc_s + Hr_s;
  var Icl_s= 1.52 / (Met + 0.6944) - 0.1835;
  var Facl_s= 1 + 0.25 * Icl_s;
  Icl_s = Icl_s*0.155;
  var Fcl_s= 1 / (1 + Icl_s * Facl_s * (Hc_s + Hr_s));
  var Kicl_s= IMS * Hc_s / H_s * (1 - Fcl_s) / (Hc_s / H_s - Fcl_s * IMS);
  var Ra_s= 1 / (Facl_s * H_s);
  var Rea_s= 1 / (LR * Facl_s * Hc_s);
  var Recl_s= Icl_s / (LR * Kicl_s);
  Hd_s = 1 / (Ra_s + Icl_s);
  He_s = 1 / (Rea_s + Recl_s);
  var d_T;
  var MaxIteration=100;
  var F1,F2,p_s;
  var SETemperature=Top;
  for(i=0;i<MaxIteration;i++){
    p_s=FindSaturatedVaporPressure(SETemperature);
    F1 = Hsk - Hd_s * (T[1] - SETemperature) - wet * He_s * (Pskin - 0.5 * p_s);
    F2 = Hd_s + wet * He_s * 0.5 * p_s * (4030.183 / Math.pow(235 + SETemperature, 2));
    d_T=F1/F2;
    SETemperature=SETemperature-d_T;
    if(d_T<0.001)break;
  }
  return SETemperature
}
function FindSaturatedVaporPressure(T){
  return Math.exp(16.6536-4030.183/(T+235));
}
function CalTcl(T,Ta,Tr,Tcl,Icl,SBC,Fcl,Hc,flg) {
  var Hr,H;
  if (flg == 1) {
    var Tr1= Tr + 273.15;
    var A1= -Icl * SBC * 0.72 * Fcl;
    var a= 273.15;
    var B1= T[1] + Icl * Fcl * (Hc * Ta + SBC * 0.72 * Math.pow(Tr1, 4));
    var C1= (1 + Fcl * Icl * Hc);
    var X1= Math.pow(9 * A1 * Math.pow(C1, 2) + Math.pow(3.0, 0.5) * Math.pow(-Math.pow(A1, 2) * (-27 * Math.pow(C1, 4) + 256 * A1 * Math.pow(B1 + a * C1, 3)), 0.5), 1.0 / 3.0);
    var X2= 4 * Math.pow(2.0 / 3.0, 1.0 / 3.0) * A1 * (B1 + a * C1);
    var X3= 1 / (Math.pow(2.0, 1.0 / 3.0) * Math.pow(3.0, 2.0 / 3.0) * A1);
    var X4= 8 * C1 / A1;
    var Y1= X2 / (A1 * X1);
    var Y2= X3 * X1;
    var Y3= X4 / (4 * Math.pow(Y1 + Y2, 0.5));
    Tcl = -a - 1.0 / 2.0 * Math.pow(Y1 + Y2, 0.5) + 1.0 / 2.0 * Math.pow(-Y1 - Y2 - Y3, 0.5);
    Hr = SBC * 0.72 * ((Tcl + 273.15) * (Tcl + 273.15) + Tr1 * Tr1) * (Tr1 + Tcl + 273.15);
  }
  else {
    var Tcl_prev= 10000.0;
    while (Math.abs(Tcl_prev - Tcl) > 0.001) {
      Tcl_prev = Tcl;
      Hr = 4.0 * SBC * Math.pow(((Tcl + Tr) / 2.0 + 273.15), 3.0) * 0.72;//这个计算Hr的公式来自SET计算的程序，感觉不太对，但是为了对比结果，还是保留了。
      H = Hc + Hr;
      var Top = (Hc * Ta + Hr * Tr) / H;
      var Ra = 1 / (Fcl * H);
      Tcl = (Ra * T[1] + Icl * Top) / (Ra + Icl);
    }
  }
  return Tcl;
}
function findAdjTa(Ta, Tr, V, RH, M, Icl){
  var set0=findSET(Ta, Tr, V, RH, M, Icl);
  var adjTa=set0;
  var delta=0.001;
  var d_T;
  var MaxIteration = 1000;
  var Err1,Err2;
  for (var i = 0; i < MaxIteration; i++) {
    Err1 = set0 - findSET(adjTa, Tr, 0.15, RH, M, Icl);
    Err2 = set0 - findSET(adjTa+delta, Tr, 0.15, RH, M, Icl);
    d_T = delta * Err1 / (Err2 - Err1);
    adjTa = adjTa - d_T;
    if (d_T < 0.0001) break;
  }
  return adjTa
}
function CalPws(Ta){
  var Ta = 273.15 + Ta;
  var c1 = -5.6745359e3;
  var c2 = 6.3925247;
  var c3 = -9.677843e-3;
  var c4 = 6.2215701e-7;
  var c5 = 2.0747825e-9;
  var c6 = -9.484024e-13;
  var c7 = 4.1635019;
  var c8 = -5.8002206e3;
  var c9 = 1.3914993;
  var c10 = -4.8640239e-2;
  var c11 = 4.1764768e-5;
  var c12 = -1.4452093e-8;
  var c13 = 6.5459673;
  var Pws;
  if (Ta < 273.15)
    Pws = Math.exp(c1 / Ta + c2 + c3 * Ta + c4 * Math.pow(Ta, 2) + c5 * Math.pow(Ta, 3) + c6 * Math.pow(Ta, 4) + c7 * Math.log(Ta));
  else
    Pws = Math.exp(c8 / Ta + c9 + c10 * Ta + c11 * Math.pow(Ta, 2) + c12 * Math.pow(Ta, 3) + c13 * Math.log(Ta));    
  return Pws;
}
function CalPwsByRHPa(RH, Pa){
  return Pa / (RH / 100);
}
function CalPaByd(d,B){
  return (B * d) / (d + 621.945);
}
function CalPaByRH(RH, Pws){
  return RH / 100 * Pws;
}
function CaldByPa(Pa, B){
  return 621.945 * Pa / (B - Pa);
}
function CaldByTaTw(Ta, Tw, B){
  var dw = CaldByTd(Tw, B) / 1000;
  var d;
  if (Ta>= 0){
    d = ((2501 - 2.326 * Tw) * dw - 1.006 * (Ta - Tw)) / (2501 + 1.86 * Ta - 4.186 * Tw);
  }
                
  else{
    d = ((2830 - 0.24 * Tw) * dw - 1.006 * (Ta - Tw)) / (2830 + 1.86 * Ta - 2.1 * Tw);
  }
  return d * 1000;
}
function CaldByTd(Td, B){
  var Pws = CalPws(Td);
  return CaldByPa(Pws, B);
}
function CaldByTah(Ta, h){
  return (h - 1.006 * Ta) / (2501 + 1.86 * Ta) * 1000;
}
function CalRHByPaPws(Pa, Pws){
  return Pa / Pws * 100;
}
function CalhByTad(Ta, d){
  return 1.006 * Ta + 0.001 * d * (2501 + 1.86 * Ta);
}
function CalrouByTad(Ta, d, B){
  return B / (1000 * 0.287042 * (Ta + 273.15) * (1 + 1.607858 * d * 0.001));
}
function CalTd(Pa){
  Pa = Pa / 1000;
  var c1 = 6.54;
  var c2 = 14.526;
  var c3 = 0.7389;
  var c4 = 0.09486;
  var c5 = 0.4569;
  var a = Math.log(Pa);
  var t1 = c1 + c2 * a + c3 * Math.pow(a, 2) + c4 * Math.pow(a, 3) + c5 * Math.pow(Pa, 0.1984);
  if (t1 >= 0)
                return t1;
  else
    return 6.09 + 12.608 * a + 0.4959 * Math.pow(a, 2);

}
function CalTwByTad(Ta, d, B){
  var Tw = Ta;
  var dT = 0.001;
  var x = 100;
  var iteration = 0;
  var Maxiteration = 100;
  var f1,f2;
  while (Math.abs(x) > 1e-4 && iteration < Maxiteration){
    f1 = CaldByTaTw(Ta, Tw, B);
    f2 = CaldByTaTw(Ta, Tw + dT, B);
    x = dT * (f1 - d) / (f2 - f1);
    Tw = Tw - x;
    iteration = iteration + 1;
  }          
  return Tw;
}
function CalTaByRHd(RH, d, B){
  var Pa = CalPaByd(d, B);
  var Pws = Pa / (RH / 100);
  return CalTd(Pws);
}
function CalTaByRHh(RH, h, B){
  var Ta = h/1.006;
  var dT =- 0.001;
  var x = 100;
  var iteration = 0;
  var Maxiteration = 100;
  var f1,f2;
  while (Math.abs(x) > 1e-4 && iteration < Maxiteration){
    f1 = CalPaByd(CaldByTah(Ta, h), B) / CalPws(Ta) * 100;
    f2 = CalPaByd(CaldByTah(Ta + dT, h), B) / CalPws(Ta + dT) * 100;
    x = dT * (f1 - RH) / (f2 - f1);
    Ta = Ta - x;
    iteration = iteration + 1;
  }
  return Ta;

}
function CalTaByRHTw(RH, Tw, B){
  var Ta = 20;
  var dT = 0.001;
  var x = 100;
  var iteration = 0;
  var Maxiteration = 100;
  var f1, f2;
  while (Math.abs(x) > 1e-4 && iteration < Maxiteration){
    f1 = CalPaByd(CaldByTaTw(Ta, Tw, B), B) / CalPws(Ta) * 100;
    f2 = CalPaByd(CaldByTaTw(Ta + dT, Tw, B), B) / CalPws(Ta + dT) * 100;
    x = dT * (f1 - RH) / (f2 - f1);
    Ta = Ta - x;
    iteration = iteration + 1;
  }
  return Ta;
               
}
function CalTaBydh(d, h){

  return (h - 0.001 * d * 2501) / (1.006 + 0.001 * d * 1.86);
}
function CalTaBydTw(d, Tw, B){
  var dw = CaldByTd(Tw, B) / 1000;
  var d = d / 1000;
  var Ta = ((2501 - 2.326 * Tw) * dw + 1.006 * Tw - d * (2501 - 4.186 * Tw)) / (1.006 + 1.86 * d);
  if (Ta< 0){
    return ((2830 - 0.24 * Tw) * dw + 1.006 * Tw - d * (2830 - 2.1 * Tw)) / (1.006 + 1.86 * d);
  }
  return Ta;                
}
function CalTaByhTw(h, Tw, B){
  var Ta = h/1.006;
  var dT = -0.001;
  var x = 100;
  var iteration = 0;
  var Maxiteration = 100;
  var f1,f2;
  while (Math.abs(x) > 1e-4 && iteration < Maxiteration){
    f1 = CaldByTaTw(Ta, Tw, B) - CaldByTah(Ta, h);
    f2 = CaldByTaTw(Ta + dT, Tw, B) - CaldByTah(Ta + dT, h);
    x = dT * f1 / (f2 - f1);
    Ta = Ta - x;
    iteration = iteration + 1;
  }
  return Ta;
                
}


  






module.exports = {
  calPMV:calPMV,
  calPPD:calPPD,
  findTo:findTo,
  findSET:findSET,
  findAdjTa:findAdjTa,
  CalPws:CalPws,
  CalPwsByRHPa: CalPwsByRHPa,
  CalPaByRH: CalPaByRH,
  CalPaByd: CalPaByd,
  CaldByPa: CaldByPa,
  CaldByTaTw: CaldByTaTw,
  CaldByTd: CaldByTd,
  CaldByTah: CaldByTah,
  CalRHByPaPws: CalRHByPaPws,
  CalhByTad: CalhByTad,
  CalrouByTad: CalrouByTad,
  CalTd: CalTd,
  CalTwByTad: CalTwByTad,
  CalTaByRHd: CalTaByRHd,
  CalTaByRHh: CalTaByRHh,
  CalTaByRHTw: CalTaByRHTw,
  CalTaBydh: CalTaBydh,
  CalTaBydTw: CalTaBydTw,
  CalTaByhTw: CalTaByhTw,
}
