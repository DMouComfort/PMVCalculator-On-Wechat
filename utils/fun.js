function calPMV(ta,tr,v,rh,met,clo) {
   var fcl;
  if(clo<0.5)
  {
    fcl=1+0.2*clo;
  }
  else
  {
    fcl=1.05+0.1*clo;
  }
  var icl=clo*0.155;/*单位换算*/
  var M=58.15*met;
  var tsk=35.7-0.028*M;
  console.log("tsk="+tsk);
  var pws=Math.exp(16.6536 - 4030.183 / (ta + 235));
  var pa = pws * rh / 100;
  var tcl=Math.min(ta,tsk);
  var hc_f = 12.1*Math.pow(v,0.5)
  var max_iteration = 1e5
  var hc = hc_f
  var hr = 4
  var hc_n,tcl_k,tr_k,tcl1
  for(var i = 0; i < max_iteration; i++){
    hc_n = 2.38*Math.pow(Math.abs(ta - tcl), 0.25)
    hc = Math.max(hc_n, hc_f)
    tcl_k = tcl + 273
    tr_k = tr + 273
    hr = 3.96e-8 * (Math.pow(tcl_k,2) + Math.pow(tr_k,2))*(tcl_k + tr_k)
    tcl1 = (icl*fcl*(hc*ta + hr*tr) + tsk)/(1 + icl*fcl*(hr + hc))
    if(Math.abs(tcl - tcl1) < 1e-4){
      break
    }
    tcl = tcl1
  }
  var r = fcl*hr*(tcl - tr)
  var c = fcl*hc*(tcl - ta)
  var c_res = 0.0014*M*(34- ta)
  var e_res =  0.017*M*(5.867-pa)
  var e_dif = 3.05*(5.733-0.00699*M-pa)
  var e_rsw = Math.max(0,0.42*(M-58.15))
  var tl = M - c - r - c_res - e_res - e_dif - e_rsw
  var pmv = (0.303*Math.exp(-0.036*M) + 0.028)*tl
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
function findSET(TA, TR, VEL, RH, MET, CLO) {
  //Input variables – TA (air temperature): °C, TR (mean radiant temperature): °C, VEL (air velocity): m/s, //RH (relative humidity): %, MET: met unit, CLO: clo unit, WME (external work): W/m2, PATM (atmospheric pressure): kPa
  var WME = 0
  var PATM = 101.325
  var KCLO = 0.25;
  var BODYWEIGHT = 69.9;
  var BODYSURFACEAREA = 1.8258;
  var METFACTOR = 58.2;
  var SBC = 0.000000056697;
  var CSW = 170.0;
  var CDIL = 120.0;
  var CSTR = 0.5;
  var LTIME = 60.0;
  var VaporPressure = RH * FindSaturatedVaporPressure(TA)/100.0;
  var AirVelocity = Math.max(VEL, 0.1); 
  var TempSkinNeutral = 33.7;
  var TempCoreNeutral = 36.8; 
  var TempBodyNeutral = 36.49;
  var SkinBloodFlowNeutral = 6.3;
  var TempSkin = TempSkinNeutral;
  var TempCore = TempCoreNeutral;
  var SkinBloodFlow = SkinBloodFlowNeutral;
  var MSHIV = 0.0;
  var ALFA = 0.1;
  var ESK = 0.1 * MET;
  var PressureInAtmospheres = PATM * 0.009869;
  var RCL = 0.155 * CLO;
  var FACL = 1.0 + 0.15 * CLO;
  var LR = 2.2/PressureInAtmospheres;
  var RM = MET * METFACTOR;
  var M = MET * METFACTOR;
  if (CLO <= 0) {
      var WCRIT = 0.38 * Math.pow(AirVelocity, -0.29);
      var ICL = 1.0;
  }
  else {
    var WCRIT = 0.59 * Math.pow(AirVelocity, -0.08);
      var ICL = 0.45;
  }
  var CHC = 3.0 * Math.pow(PressureInAtmospheres, 0.53);
  var CHCV = 8.600001 * Math.pow((AirVelocity * PressureInAtmospheres), 0.53);
  var CHC = Math.max(CHC, CHCV);
  var CHR = 4.7;
  var CTC = CHR + CHC;
  var RA = 1.0/(FACL * CTC);
  //Resistance of air layer to dry heat transfer
  var TOP = (CHR * TR + CHC * TA)/CTC;
  var TCL = TOP + (TempSkin - TOP)/(CTC * (RA + RCL));
  //TCL and CHR are solved iteratively using: H(Tsk – TOP) = CTC(TCL – TOP), //where H = 1/(RA + RCL) and RA = 1/FACL*CTC
  var TCL_OLD = TCL;
  var flag = true;
  var DRY, HFCS, ERES, CRES, SCR, SSK, TCSK, TCCR, DTSK, DTCR, TB, SKSIG, WARMS, COLDS, CRSIG, WARMC, COLDC, BDSIG, WARMB, COLDB, REGSW, ERSW, REA, RECL, EMAX, PRSW, PWET, EDIF, ESK;
  for (var TIM = 1; TIM <= LTIME; TIM++) {
    do {
      if (flag) {
        TCL_OLD = TCL;
        CHR = 4.0 * SBC * Math.pow(((TCL + TR)/2.0 + 273.15), 3.0) * 0.72;
        CTC = CHR + CHC;
        RA = 1.0/(FACL * CTC);
        TOP = (CHR * TR + CHC * TA)/CTC;
      }
      TCL = (RA * TempSkin + RCL * TOP)/(RA + RCL);
      flag = true;
    }while (Math.abs(TCL - TCL_OLD) > 0.01);
    flag = false;
    DRY = (TempSkin - TOP)/(RA + RCL);
    HFCS = (TempCore - TempSkin) * (5.28 + 1.163 * SkinBloodFlow);
    ERES = 0.0023 * M * (44.0 - VaporPressure);
    CRES = 0.0014 * M * (34.0 - TA);
    SCR = M - HFCS - ERES - CRES - WME;
    SSK = HFCS - DRY - ESK;
    TCSK = 0.97 * ALFA * BODYWEIGHT;
    TCCR = 0.97 * (1 - ALFA) * BODYWEIGHT;
    DTSK = (SSK * BODYSURFACEAREA)/(TCSK * 60.0);
    DTCR = SCR * BODYSURFACEAREA/(TCCR * 60.0);
    TempSkin = TempSkin + DTSK;
    TempCore = TempCore + DTCR;
    TB = ALFA * TempSkin + (1 - ALFA) * TempCore;
    SKSIG = TempSkin - TempSkinNeutral;
    if (SKSIG > 0)
    {
      WARMS = SKSIG;
      COLDS = 0.0;
    }
    else
    {
      WARMS = 0.0;
      COLDS = -1.0 * SKSIG;
    }
    CRSIG = (TempCore - TempCoreNeutral);
    if (CRSIG > 0)
    {
      WARMC = CRSIG;
      COLDC = 0.0;
    }
    else
    {
      WARMC = 0.0;
      COLDC = -1.0 * CRSIG;
    }
    BDSIG = TB - TempBodyNeutral;
    WARMB = (BDSIG > 0) * BDSIG;
    SkinBloodFlow = (SkinBloodFlowNeutral + CDIL * WARMC)/(1 + CSTR * COLDS);
    SkinBloodFlow = Math.max(0.5, Math.min(90.0, SkinBloodFlow));
    REGSW = CSW * WARMB * Math.exp(WARMS/10.7);
    REGSW = Math.min(REGSW, 500.0);
    var ERSW = 0.68 * REGSW;
    var REA = 1.0/(LR * FACL * CHC);
    var RECL = RCL/(LR * ICL);
    var EMAX = (FindSaturatedVaporPressure(TempSkin) - VaporPressure)/(REA + RECL);
    var PRSW = ERSW/EMAX;
    var PWET = 0.06 + 0.94 * PRSW;
    var EDIF = PWET * EMAX - ERSW;
    var ESK = ERSW + EDIF;
    if (PWET > WCRIT)
    {
      PWET = WCRIT; PRSW = WCRIT/0.94;
      ERSW = PRSW * EMAX;
      EDIF = 0.06 * (1.0 - PRSW) * EMAX;
      ESK = ERSW + EDIF;
    }
    ESK = ERSW + EDIF;
    MSHIV = 19.4 * COLDS * COLDC;
    M = RM + MSHIV;
    ALFA = 0.0417737 + 0.7451833/(SkinBloodFlow + 0.585417);
  }
    var HSK = DRY + ESK;
  var RN = M - WME;
  var ECOMF = 0.42 * (RN - (1 * METFACTOR));
  if (ECOMF < 0.0) ECOMF = 0.0;
  EMAX = EMAX * WCRIT;
  var W = PWET;
  var PSSK = FindSaturatedVaporPressure(TempSkin);
  var CHRS = CHR;
  if (MET < 0.85) {
  var CHCS = 3.0;
  } else {
    var CHCS = 5.66 * Math.pow(((MET - 0.85)), 0.39);
    CHCS = Math.max(CHCS, 3.0);
  }
  var CTCS = CHCS + CHRS;
  var RCLOS = 1.52/((MET - WME/METFACTOR) + 0.6944) - 0.1835;
  var RCLS = 0.155 * RCLOS;
  var FACLS = 1.0 + KCLO * RCLOS;
  var FCLS = 1.0/(1.0 + 0.155 * FACLS * CTCS * RCLOS);
  var IMS = 0.45;
  var ICLS = IMS * CHCS/CTCS * (1 - FCLS)/(CHCS/CTCS - FCLS * IMS);
  var RAS = 1.0/(FACLS * CTCS);
  var REAS = 1.0/(LR * FACLS * CHCS);
  var RECLS = RCLS/(LR * ICLS);
  var HD_S = 1.0/(RAS + RCLS);
  var HE_S = 1.0/(REAS + RECLS);
  //SET determined using Newton’s iterative solution
  var DELTA = .0001;
  var dx = 100.0;
  var SET, ERR1, ERR2;
  var SET_OLD = TempSkin - HSK/HD_S;
  while (Math.abs(dx) > .01) {
  //Lower bound for SET
  ERR1 = (HSK - HD_S * (TempSkin - SET_OLD) - W * HE_S * (PSSK - 0.5 * FindSaturatedVaporPressure(SET_OLD)));
  ERR2 = (HSK - HD_S * (TempSkin - (SET_OLD + DELTA)) - W * HE_S * (PSSK - 0.5 * FindSaturatedVaporPressure((SET_OLD + DELTA)))); 
  SET = SET_OLD - DELTA * ERR1/(ERR2 - ERR1); 
  dx = SET - SET_OLD; 
  SET_OLD = SET;
  }
  return SET;
  }
function FindSaturatedVaporPressure(T){
  return Math.exp(18.6686 - 4030.183/(T + 235.0));
}

function findAdjTa(Ta, Tr, V, RH, M, Icl){
  var set0=findSET(Ta, Tr, V, RH, M, Icl);
  var adjTa = Ta;
  var adjTr = Tr;
  var delta = 0.001;
  var d_T;
  var MaxIteration = 1000;
  var Err1,Err2;
  for (var i = 0; i < MaxIteration; i++) {
    Err1 = set0 - findSET(adjTa, adjTr, 0.1, RH, M, Icl);
    Err2 = set0 - findSET(adjTa + delta, adjTr + delta, 0.1, RH, M, Icl);
    d_T = delta * Err1 / (Err2 - Err1);
    adjTa = adjTa - d_T;
    adjTr = adjTr - d_T;
    if (Math.abs(d_T)  < 0.0001) break;
  }
  var CE = Ta - adjTa
  console.log('CE='+CE+'℃')
  console.log('Ta='+Ta+'℃')
  return CE
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

function calUTCI(ta, tr, va, rh){
  var d_t = tr-ta
  var pa = CalPws(ta) * rh / 100 * 0.001
  var utci = ta +
  6.07562052e-01      +
  -2.27712343e-02   * ta  +
  8.06470249e-04   * ta*ta  +
  -1.54271372e-04   * ta*ta*ta  +
  -3.24651735e-06   * ta*ta*ta*ta  +
  7.32602852e-08   * ta*ta*ta*ta*ta  +
  1.35959073e-09   * ta*ta*ta*ta*ta*ta  +
  -2.25836520e+00   * va  +
  8.80326035e-02   * ta*va  +
  2.16844454e-03   * ta*ta*va  +
  -1.53347087e-05   * ta*ta*ta*va  +
  -5.72983704e-07   * ta*ta*ta*ta*va  +
  -2.55090145e-09   * ta*ta*ta*ta*ta*va  +
  -7.51269505e-01   * va*va  +
  -4.08350271e-03   * ta*va*va  +
  -5.21670675e-05   * ta*ta*va*va  +
  1.94544667e-06   * ta*ta*ta*va*va  +
  1.14099531e-08   * ta*ta*ta*ta*va*va  +
  1.58137256e-01   * va*va*va  +
  -6.57263143e-05   * ta*va*va*va  +
  2.22697524e-07   * ta*ta*va*va*va  +
  -4.16117031e-08   * ta*ta*ta*va*va*va  +
  -1.27762753e-02   * va*va*va*va  +
  9.66891875e-06   * ta*va*va*va*va  +
  2.52785852e-09   * ta*ta*va*va*va*va  +
  4.56306672e-04   * va*va*va*va*va  +
  -1.74202546e-07   * ta*va*va*va*va*va  +
  -5.91491269e-06   * va*va*va*va*va*va  +
  3.98374029e-01   * d_t  +
  1.83945314e-04   * ta*d_t  +
  -1.73754510e-04   * ta*ta*d_t  +
  -7.60781159e-07   * ta*ta*ta*d_t  +
  3.77830287e-08   * ta*ta*ta*ta*d_t  +
  5.43079673e-10   * ta*ta*ta*ta*ta*d_t  +
  -2.00518269e-02   * va*d_t  +
  8.92859837e-04   * ta*va*d_t  +
  3.45433048e-06   * ta*ta*va*d_t  +
  -3.77925774e-07   * ta*ta*ta*va*d_t  +
  -1.69699377e-09   * ta*ta*ta*ta*va*d_t  +
  1.69992415e-04   * va*va*d_t  +
  -4.99204314e-05   * ta*va*va*d_t  +
  2.47417178e-07   * ta*ta*va*va*d_t  +
  1.07596466e-08   * ta*ta*ta*va*va*d_t  +
  8.49242932e-05   * va*va*va*d_t  +
  1.35191328e-06   * ta*va*va*va*d_t  +
  -6.21531254e-09   * ta*ta*va*va*va*d_t  +
  -4.99410301e-06   * va*va*va*va*d_t  +
  -1.89489258e-08   * ta*va*va*va*va*d_t  +
  8.15300114e-08   * va*va*va*va*va*d_t  +
  7.55043090e-04   * d_t*d_t  +
  -5.65095215e-05   * ta*d_t*d_t  +
  -4.52166564e-07   * ta*ta*d_t*d_t  +
  2.46688878e-08   * ta*ta*ta*d_t*d_t  +
  2.42674348e-10   * ta*ta*ta*ta*d_t*d_t  +
  1.54547250e-04   * va*d_t*d_t  +
  5.24110970e-06   * ta*va*d_t*d_t  +
  -8.75874982e-08   * ta*ta*va*d_t*d_t  +
  -1.50743064e-09   * ta*ta*ta*va*d_t*d_t  +
  -1.56236307e-05   * va*va*d_t*d_t  +
  -1.33895614e-07   * ta*va*va*d_t*d_t  +
  2.49709824e-09   * ta*ta*va*va*d_t*d_t  +
  6.51711721e-07   * va*va*va*d_t*d_t  +
  1.94960053e-09   * ta*va*va*va*d_t*d_t  +
  -1.00361113e-08   * va*va*va*va*d_t*d_t  +
  -1.21206673e-05   * d_t*d_t*d_t  +
  -2.18203660e-07   * ta*d_t*d_t*d_t  +
  7.51269482e-09   * ta*ta*d_t*d_t*d_t  +
  9.79063848e-11   * ta*ta*ta*d_t*d_t*d_t  +
  1.25006734e-06   * va*d_t*d_t*d_t  +
  -1.81584736e-09   * ta*va*d_t*d_t*d_t  +
  -3.52197671e-10   * ta*ta*va*d_t*d_t*d_t  +
  -3.36514630e-08   * va*va*d_t*d_t*d_t  +
  1.35908359e-10   * ta*va*va*d_t*d_t*d_t  +
  4.17032620e-10   * va*va*va*d_t*d_t*d_t  +
  -1.30369025e-09   * d_t*d_t*d_t*d_t  +
  4.13908461e-10   * ta*d_t*d_t*d_t*d_t  +
  9.22652254e-12   * ta*ta*d_t*d_t*d_t*d_t  +
  -5.08220384e-09   * va*d_t*d_t*d_t*d_t  +
  -2.24730961e-11   * ta*va*d_t*d_t*d_t*d_t  +
  1.17139133e-10   * va*va*d_t*d_t*d_t*d_t  +
  6.62154879e-10   * d_t*d_t*d_t*d_t*d_t  +
  4.03863260e-13   * ta*d_t*d_t*d_t*d_t*d_t  +
  1.95087203e-12   * va*d_t*d_t*d_t*d_t*d_t  +
  -4.73602469e-12   * d_t*d_t*d_t*d_t*d_t*d_t  +
  5.12733497e+00   * pa  +
  -3.12788561e-01   * ta*pa  +
  -1.96701861e-02   * ta*ta*pa  +
  9.99690870e-04   * ta*ta*ta*pa  +
  9.51738512e-06   * ta*ta*ta*ta*pa  +
  -4.66426341e-07   * ta*ta*ta*ta*ta*pa  +
  5.48050612e-01   * va*pa  +
  -3.30552823e-03   * ta*va*pa  +
  -1.64119440e-03   * ta*ta*va*pa  +
  -5.16670694e-06   * ta*ta*ta*va*pa  +
  9.52692432e-07   * ta*ta*ta*ta*va*pa  +
  -4.29223622e-02   * va*va*pa  +
  5.00845667e-03   * ta*va*va*pa  +
  1.00601257e-06   * ta*ta*va*va*pa  +
  -1.81748644e-06   * ta*ta*ta*va*va*pa  +
  -1.25813502e-03   * va*va*va*pa  +
  -1.79330391e-04   * ta*va*va*va*pa  +
  2.34994441e-06   * ta*ta*va*va*va*pa  +
  1.29735808e-04   * va*va*va*va*pa  +
  1.29064870e-06   * ta*va*va*va*va*pa  +
  -2.28558686e-06   * va*va*va*va*va*pa  +
  -3.69476348e-02   * d_t*pa  +
  1.62325322e-03   * ta*d_t*pa  +
  -3.14279680e-05   * ta*ta*d_t*pa  +
  2.59835559e-06   * ta*ta*ta*d_t*pa  +
  -4.77136523e-08   * ta*ta*ta*ta*d_t*pa  +
  8.64203390e-03   * va*d_t*pa  +
  -6.87405181e-04   * ta*va*d_t*pa  +
  -9.13863872e-06   * ta*ta*va*d_t*pa  +
  5.15916806e-07   * ta*ta*ta*va*d_t*pa  +
  -3.59217476e-05   * va*va*d_t*pa  +
  3.28696511e-05   * ta*va*va*d_t*pa  +
  -7.10542454e-07   * ta*ta*va*va*d_t*pa  +
  -1.24382300e-05   * va*va*va*d_t*pa  +
  -7.38584400e-09   * ta*va*va*va*d_t*pa  +
  2.20609296e-07   * va*va*va*va*d_t*pa  +
  -7.32469180e-04   * d_t*d_t*pa  +
  -1.87381964e-05   * ta*d_t*d_t*pa  +
  4.80925239e-06   * ta*ta*d_t*d_t*pa  +
  -8.75492040e-08   * ta*ta*ta*d_t*d_t*pa  +
  2.77862930e-05   * va*d_t*d_t*pa  +
  -5.06004592e-06   * ta*va*d_t*d_t*pa  +
  1.14325367e-07   * ta*ta*va*d_t*d_t*pa  +
  2.53016723e-06   * va*va*d_t*d_t*pa  +
  -1.72857035e-08   * ta*va*va*d_t*d_t*pa  +
  -3.95079398e-08   * va*va*va*d_t*d_t*pa  +
  -3.59413173e-07   * d_t*d_t*d_t*pa  +
  7.04388046e-07   * ta*d_t*d_t*d_t*pa  +
  -1.89309167e-08   * ta*ta*d_t*d_t*d_t*pa  +
  -4.79768731e-07   * va*d_t*d_t*d_t*pa  +
  7.96079978e-09   * ta*va*d_t*d_t*d_t*pa  +
  1.62897058e-09   * va*va*d_t*d_t*d_t*pa  +
  3.94367674e-08   * d_t*d_t*d_t*d_t*pa  +
  -1.18566247e-09   * ta*d_t*d_t*d_t*d_t*pa  +
  3.34678041e-10   * va*d_t*d_t*d_t*d_t*pa  +
  -1.15606447e-10   * d_t*d_t*d_t*d_t*d_t*pa  +
  -2.80626406e+00   * pa*pa  +
  5.48712484e-01   * ta*pa*pa  +
  -3.99428410e-03   * ta*ta*pa*pa  +
  -9.54009191e-04   * ta*ta*ta*pa*pa  +
  1.93090978e-05   * ta*ta*ta*ta*pa*pa  +
  -3.08806365e-01   * va*pa*pa  +
  1.16952364e-02   * ta*va*pa*pa  +
  4.95271903e-04   * ta*ta*va*pa*pa  +
  -1.90710882e-05   * ta*ta*ta*va*pa*pa  +
  2.10787756e-03   * va*va*pa*pa  +
  -6.98445738e-04   * ta*va*va*pa*pa  +
  2.30109073e-05   * ta*ta*va*va*pa*pa  +
  4.17856590e-04   * va*va*va*pa*pa  +
  -1.27043871e-05   * ta*va*va*va*pa*pa  +
  -3.04620472e-06   * va*va*va*va*pa*pa  +
  5.14507424e-02   * d_t*pa*pa  +
  -4.32510997e-03   * ta*d_t*pa*pa  +
  8.99281156e-05   * ta*ta*d_t*pa*pa  +
  -7.14663943e-07   * ta*ta*ta*d_t*pa*pa  +
  -2.66016305e-04   * va*d_t*pa*pa  +
  2.63789586e-04   * ta*va*d_t*pa*pa  +
  -7.01199003e-06   * ta*ta*va*d_t*pa*pa  +
  -1.06823306e-04   * va*va*d_t*pa*pa  +
  3.61341136e-06   * ta*va*va*d_t*pa*pa  +
  2.29748967e-07   * va*va*va*d_t*pa*pa  +
  3.04788893e-04   * d_t*d_t*pa*pa  +
  -6.42070836e-05   * ta*d_t*d_t*pa*pa  +
  1.16257971e-06   * ta*ta*d_t*d_t*pa*pa  +
  7.68023384e-06   * va*d_t*d_t*pa*pa  +
  -5.47446896e-07   * ta*va*d_t*d_t*pa*pa  +
  -3.59937910e-08   * va*va*d_t*d_t*pa*pa  +
  -4.36497725e-06   * d_t*d_t*d_t*pa*pa  +
  1.68737969e-07   * ta*d_t*d_t*d_t*pa*pa  +
  2.67489271e-08   * va*d_t*d_t*d_t*pa*pa  +
  3.23926897e-09   * d_t*d_t*d_t*d_t*pa*pa  +
  -3.53874123e-02   * pa*pa*pa  +
  -2.21201190e-01   * ta*pa*pa*pa  +
  1.55126038e-02   * ta*ta*pa*pa*pa  +
  -2.63917279e-04   * ta*ta*ta*pa*pa*pa  +
  4.53433455e-02   * va*pa*pa*pa  +
  -4.32943862e-03   * ta*va*pa*pa*pa  +
  1.45389826e-04   * ta*ta*va*pa*pa*pa  +
  2.17508610e-04   * va*va*pa*pa*pa  +
  -6.66724702e-05   * ta*va*va*pa*pa*pa  +
  3.33217140e-05   * va*va*va*pa*pa*pa  +
  -2.26921615e-03   * d_t*pa*pa*pa  +
  3.80261982e-04   * ta*d_t*pa*pa*pa  +
  -5.45314314e-09   * ta*ta*d_t*pa*pa*pa  +
  -7.96355448e-04   * va*d_t*pa*pa*pa  +
  2.53458034e-05   * ta*va*d_t*pa*pa*pa  +
  -6.31223658e-06   * va*va*d_t*pa*pa*pa  +
  3.02122035e-04   * d_t*d_t*pa*pa*pa  +
  -4.77403547e-06   * ta*d_t*d_t*pa*pa*pa  +
  1.73825715e-06   * va*d_t*d_t*pa*pa*pa  +
  -4.09087898e-07   * d_t*d_t*d_t*pa*pa*pa  +
  6.14155345e-01   * pa*pa*pa*pa  +
  -6.16755931e-02   * ta*pa*pa*pa*pa  +
  1.33374846e-03   * ta*ta*pa*pa*pa*pa  +
  3.55375387e-03   * va*pa*pa*pa*pa  +
  -5.13027851e-04   * ta*va*pa*pa*pa*pa  +
  1.02449757e-04   * va*va*pa*pa*pa*pa  +
  -1.48526421e-03   * d_t*pa*pa*pa*pa  +
  -4.11469183e-05   * ta*d_t*pa*pa*pa*pa  +
  -6.80434415e-06   * va*d_t*pa*pa*pa*pa  +
  -9.77675906e-06   * d_t*d_t*pa*pa*pa*pa  +
  8.82773108e-02   * pa*pa*pa*pa*pa  +
  -3.01859306e-03   * ta*pa*pa*pa*pa*pa  +
  1.04452989e-03   * va*pa*pa*pa*pa*pa  +
  2.47090539e-04   * d_t*pa*pa*pa*pa*pa  +
  1.48348065e-03   * pa*pa*pa*pa*pa*pa  
  return(utci)
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
  calUTCI: calUTCI
}
