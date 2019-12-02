/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Accessibility'],function(A){"use strict";var C={};C.render=function(r,c){var a=new A(),o=a.getCoPilotAttributes(),t=c.getTooltip();r.write("<div");r.writeAttribute("tabindex","0");if(t){r.writeAttributeEscaped("title",t);}r.writeAccessibilityState({role:o.role,label:o.label});r.writeControlData(c);r.addClass("CPImage");r.writeStyles();r.writeClasses();r.write(">");if(c.getAnimation()){r.write('<svg focusable="false" version="1.1" width="48" height="48" viewBox="-150 -150 300 300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="grad1" x1="0%" x2="100%" y1="100%" y2="0%"><stop class="color1" offset="0%" style="stop-opacity:0.7"/><stop class="color2" offset="80%" style="stop-opacity:0.7"/></linearGradient><linearGradient id="grad2" x1="0%" x2="100%" y1="100%" y2="0%"><stop class="color1" offset="0%" style="stop-opacity:0.36"/><stop class="color2" offset="80%" style="stop-opacity:0.36"/></linearGradient><linearGradient id="grad3" x1="0%" x2="100%" y1="100%" y2="0%"><stop class="color1" offset="0%" style="stop-opacity:0.2"/><stop class="color2" offset="80%" style="stop-opacity:0.2"/></linearGradient><mask id="innerCircle"><circle cx="0" cy="0" r="120" fill="white" /><circle cx="0" cy="0" r="76" fill="black" /></mask><path id="path" d="M 98.1584 0 C 98.3156 17.3952 89.0511 31.3348 79.5494 45.9279 C 70.339 60.0814 60.6163 71.2177 46.1724 79.9729 C 31.4266 88.9178 17.2493 94.3909 5.77261e-15 94.2739 C -17.1547 94.1581 -30.8225 87.6907 -45.7979 79.3244 C -61.0143 70.8266 -73.5583 62.554 -83.0507 47.9493 C -92.6677 33.1579 -98.4872 17.5705 -97.1793 1.19010e-14 C -95.9465 -16.9777 -84.488 -29.0862 -76.1351 -43.9566 C -67.6795 -59.0155 -63.8629 -76.1085 -49.262 -85.3243 C -34.502 -94.6464 -17.4328 -93.0037 -1.69174e-14 -92.0939 C 16.8967 -91.214 31.8608 -89.0341 46.4198 -80.4014 C 60.872 -71.8326 69.6003 -59.5351 78.6792 -45.4254 C 88.0511 -30.9104 98.015 -17.2766 98.1584 0 Z"><animate id="animate0" attributeName="d" values="M 102 0 C 102 17.85951467281289, 86.87204367700592 29.533206594083104, 77.94228634059948 44.99999999999999 C 69.01252900419304 60.46679340591688, 66.4667934059169 79.40483384960629, 51.000000000000014 88.33459118601273 C 35.53320659408312 97.26434852241918, 17.859514672812903 90, 5.5109105961630896e-15 90 C -17.85951467281288 90, -35.53320659408308 97.26434852241918, -50.99999999999998 88.33459118601274 C -66.46679340591687 79.4048338496063, -69.01252900419303 60.46679340591692, -77.94228634059947 45.00000000000003 C -86.87204367700592 29.533206594083133, -102 17.859514672812914, -102 1.2491397351303002e-14 C -102 -17.85951467281287, -86.87204367700593 -29.533206594083083, -77.9422863405995 -44.99999999999997 C -69.01252900419306 -60.46679340591687, -66.46679340591693 -79.40483384960628, -51.00000000000004 -88.33459118601273 C -35.53320659408315 -97.26434852241918, -17.85951467281292 -89.99999999999999, -1.6532731788489267e-14 -90 C 17.859514672812853 -90.00000000000001, 35.533206594083055 -97.26434852241921, 50.99999999999993 -88.33459118601279 C 66.46679340591683 -79.40483384960635, 69.012529004193 -60.46679340591694, 77.94228634059945 -45.00000000000004 C 86.8720436770059 -29.53320659408314, 102 -17.85951467281291, 102 0 z ;M 104 0 C 103.6860370504768 18.670459122547623, 99.74513350853894 36.21879096669579, 88.33459118601274 50.99999999999999 C 77.42609021132327 65.13086500091876, 59.95986915829964 68.15050131663435, 44.50000000000001 77.07626093681503 C 29.040130841700375 86.00202055699572, 17.851519240361377 102, 6.245698675651501e-15 102 C -17.851519240361355 102, -28.89224164002164 85.74082198544978, -44.49999999999998 77.07626093681505 C -60.41578578366853 68.24070016127133, -78.942855942454 66.40974514759691, -90.0666419935816 52.000000000000036 C -101.58041073743591 37.08507152827802, -106.51375198961607 18.673591324066255, -104 1.2736326711132473e-14 C -101.57139126725896 -18.041098385442222, -86.17817517682458 -28.73502209016882, -77.07626093681506 -44.49999999999998 C -67.97434669680554 -60.264977909831146, -66.77256915682678 -79.42941623510848, -52.00000000000004 -90.0666419935816 C -36.96347614018194 -100.89393257665785, -18.33904556278876 -102.64701322308922, -1.8369701987210297e-14 -100 C 17.32727177622791 -97.49902374391826, 28.55026288749344 -84.4439984999364, 43.99999999999994 -76.21023553303064 C 60.07413421086994 -67.64370718198207, 78.79942390068253 -66.31128907769772, 90.06664199358158 -52.00000000000004 C 101.7221231317663 -37.19555062013585, 104.31680324149117 -18.83936298577321, 104 0 z ;M 102 0 C 101.82727211782054 17.85068357984393, 86.53189445508919 29.35841045474146, 77.07626093681505 44.49999999999999 C 67.96000753916402 59.09812997944896, 63.13859410212405 75.0566405949403, 49.000000000000014 84.87048957087498 C 34.41435518048109 94.99464438014832, 17.754300288879765 97.84390177587221, 6.000769315822031e-15 98 C -17.848085350949756 98.1569227951557, -34.936562555189376 96.05567507853976, -49.49999999999998 85.73651497465943 C -63.65084226105117 75.70970588855481, -67.15343120157955 58.79045409878119, -76.21023553303058 44.00000000000003 C -85.53194873850353 28.77692945084744, -101.82533168325062 17.849529545864502, -102 1.2491397351303002e-14 C -102.17467942383016 -17.85066458952948, -86.26579096020939 -29.195449136347488, -77.07626093681506 -44.49999999999998 C -68.05733453379239 -59.52042188438431, -65.25784853671414 -77.99137523784161, -50.00000000000004 -86.60254037844385 C -34.75370973790514 -95.20718230502631, -17.506833792572294 -87.99999999999999, -1.6165337748745062e-14 -88 C 17.50683379257223 -88.00000000000001, 34.671187347637854 -95.05929697358921, 49.999999999999936 -86.6025403784439 C 65.35816177516672 -78.12959215818911, 68.91293714727685 -60.037780348188306, 77.94228634059945 -45.00000000000004 C 87.13593221909689 -29.68859445350606, 102.172805244453 -17.858678638015444, 102 0 z ;M 88 0 C 87.0071643812453 16.750584310000846, 89.16591640357322 32.23066622251636, 82.48891971046778 47.62499999999999 C 75.39770857425334 63.9743373046321, 66.1406553264614 78.9687582413302, 50.250000000000014 87.03555308033607 C 34.54865539228622 95.00624548067042, 17.590620651271553 90.29638240436964, 5.480294426184406e-15 89.5 C -16.847968824431476 88.7372397661719, -32.382980242828936 89.6818280646011, -47.689999999999976 82.60150301295975 C -63.74959324223292 75.1730719952966, -77.27142977762603 65.04430269303984, -86.06560462809749 49.69000000000003 C -94.84784120247872 34.35654109365306, -96.67880542645688 17.590459164590612, -95 1.1634144591899855e-14 C -93.40474991806319 -16.714969454704665, -85.83878040009859 -30.176827189787602, -77.07626093681506 -44.49999999999998 C -68.48875537139932 -58.53709592172691, -59.78684881708811 -70.71810123462024, -46.12500000000004 -79.89084349911445 C -31.90399782177102 -89.43900857326942, -17.117492172090376 -95.6208569519316, -1.7680838162689912e-14 -96.25 C 17.42616675853088 -96.89048819537281, 32.604872069000194 -91.30523706046031, 48.124999999999936 -83.35494511425226 C 64.20208148728074 -75.11934989009448, 80.53937872975759 -67.29516003624032, 88.33459118601272 -51.00000000000004 C 96.03774549832913 -34.897278873736724, 89.0561690198359 -17.81911111787299, 88 0 z ;M 97 0 C 95.96205478306072 17.380245680862355, 92.31438589595038 33.26885450645463, 82.33303513778658 47.53499999999999 C 72.73454993850302 61.25392338906356, 58.07526843673644 67.1203245271079, 43.85500000000001 75.95908816593311 C 29.1689379616367 85.08737092091096, 17.266933647153582 97.78319544979668, 6.0442442771917615e-15 98.71 C -17.46539769433808 99.64745712962134, -31.760081272699992 89.97780532702197, -46.659999999999975 80.81749068116382 C -61.254519580560164 71.8449322457867, -74.9987279481924 63.057416617025154, -82.80068885583016 47.80500000000003 C -90.46529056195176 32.82111328110031, -87.3041822839497 16.816028610356618, -88 1.0776891832496709e-14 C -88.72578785785936 -17.54032572221827, -95.38715406508265 -34.80323520486043, -86.85368774554138 -50.144999999999975 C -78.30929038357452 -65.50641700627851, -59.99419319499677 -68.75787837688742, -44.82000000000004 -77.63051719523706 C -29.55758597966676 -86.55474040488905, -17.677948608071002 -101.20050810368325, -1.8540540215691355e-14 -100.93 C 17.66220221833233 -100.65973284769198, 28.66762264672243 -84.98120430879537, 44.03499999999994 -76.27085731129554 C 59.54270404931096 -67.48097206941182, 78.04582993349926 -65.57146684415069, 88.2133476294829 -50.93000000000004 C 98.53103081570782 -36.07229128519377, 98.0783410651801 -18.056668439457074, 97 0 z ;M 97 0 C 95.96205478306072 17.380245680862355, 92.31438589595038 33.26885450645463, 82.33303513778658 47.53499999999999 C 72.73454993850302 61.25392338906356, 58.07526843673644 67.1203245271079, 43.85500000000001 75.95908816593311 C 29.1689379616367 85.08737092091096, 17.266933647153582 97.78319544979668, 6.0442442771917615e-15 98.71 C -17.46539769433808 99.64745712962134, -31.760081272699992 89.97780532702197, -46.659999999999975 80.81749068116382 C -61.254519580560164 71.8449322457867, -74.9987279481924 63.057416617025154, -82.80068885583016 47.80500000000003 C -90.46529056195176 32.82111328110031, -87.3041822839497 16.816028610356618, -88 1.0776891832496709e-14 C -88.72578785785936 -17.54032572221827, -95.38715406508265 -34.80323520486043, -86.85368774554138 -50.144999999999975 C -78.30929038357452 -65.50641700627851, -59.99419319499677 -68.75787837688742, -44.82000000000004 -77.63051719523706 C -29.55758597966676 -86.55474040488905, -17.677948608071002 -101.20050810368325, -1.8540540215691355e-14 -100.93 C 17.66220221833233 -100.65973284769198, 28.66762264672243 -84.98120430879537, 44.03499999999994 -76.27085731129554 C 59.54270404931096 -67.48097206941182, 78.04582993349926 -65.57146684415069, 88.2133476294829 -50.93000000000004 C 98.53103081570782 -36.07229128519377, 98.0783410651801 -18.056668439457074, 97 0 z ;M 87.83 0 C 87.5551104106254 17.484718516847604, 95.16127715466017 34.74963105642935, 86.50727758402758 49.94499999999999 C 77.84990328247498 65.14629455992826, 59.80875022938145 68.6539166070951, 44.21500000000001 76.5826264566579 C 29.396758375489803 84.11702559690347, 16.533901742833184 92.20444258129785, 5.7515536921955445e-15 93.93 C -17.56198148944071 95.76285276019921, -35.17832492952776 96.1755728839107, -49.88499999999998 86.40335453557344 C -64.42964616977311 76.73880034577543, -67.07555683863683 58.889186090717956, -75.63865876653286 43.67000000000003 C -84.09849199523896 28.63435318786967, -98.51711635059414 17.25222189595266, -98.5 1.206277097160143e-14 C -98.48288504887265 -17.250811320073485, -84.34877504334715 -28.780575409619935, -75.55205622615443 -43.619999999999976 C -66.86093647073717 -58.281286656612146, -63.230342222349634 -75.4345590754149, -48.600000000000044 -84.17766924784742 C -33.93357389700559 -92.94234319091034, -17.025973616417954 -90.19821090033776, -1.630678445404658e-14 -88.77 C 15.977895940302826 -87.42970630164737, 29.38189187799461 -82.73892939223205, 44.10999999999994 -76.40076112186321 C 60.461233804495656 -69.36408876567695, 79.25079249329674 -66.31020434586661, 88.09210407295308 -50.86000000000004 C 96.93350510099964 -35.40963934294652, 88.10983120877545 -17.799036801646473, 87.83 0 z ;M 102.87 0 C 100.60412172987674 17.8655933362356, 85.53754352796288 28.604858280384207, 75.95908816593312 43.855 C 66.77647829932806 58.47490441348097, 64.20185353081875 76.67202079060546, 49.27000000000002 85.33814328891859 C 34.33463676216738 94.00630274472348, 17.255471196681203 88.61139941746183, 5.384771975850912e-15 87.94 C -16.62338090404565 87.29319481409648, -32.13105073147386 88.83642498642243, -47.104999999999976 81.58825329053197 C -62.593549158874595 74.0909884333756, -75.11183789801551 63.203277636192524, -82.85265038005723 47.83500000000003 C -90.43100426068291 32.78926071449635, -88.33481436911549 16.845994873358578, -88.2 1.0801384768479656e-14 C -88.0661541958799 -16.72496592774988, -90.31714156576788 -32.8325291006581, -82.09054802472696 -47.394999999999975 C -73.84119732253154 -61.99775494831187, -58.70114242558277 -68.16576009477593, -44.58000000000004 -77.21482500142054 C -29.826455382596357 -86.66914383925732, -17.522369834392396 -100.13333736150332, -1.8369701987210297e-14 -100 C 17.510547309053553 -99.86675260260256, 28.908254552710822 -85.0894876419882, 44.18999999999994 -76.53932518646872 C 59.70239533946346 -67.86011372570036, 77.14713304516553 -64.89164530763992, 87.9622002623854 -50.78500000000004 C 99.23322575875696 -36.08362498889298, 105.20080735972847 -18.37753465535834, 102.87 0 z ;M 96.65 0 C 97.5682370155223 17.290645042626103, 91.44243921640975 32.85986013368205, 81.65753532283473 47.144999999999996 C 72.23761953500264 60.89728781209352, 58.31868393027413 67.69602416070182, 44.205000000000005 76.5653059485822 C 29.586348647997518 85.75191795153148, 17.265486227503665 98.5023411385901, 6.0289361922024196e-15 98.46 C -17.260135494401737 98.41767198331847, -28.927850358240754 84.61477988915865, -44.07999999999998 76.34879959763612 C -59.63539109726837 67.86283824713713, -77.60369551546168 65.19715075831209, -87.6850721331744 50.625000000000036 C -97.93164740539275 35.81406243807856, -99.13895928925051 17.870177323503324, -96.9 1.1866827483737853e-14 C -94.78582581853146 -16.874209235069404, -84.03526438034655 -28.885451186299278, -75.855165117479 -43.79499999999998 C -67.48656343152348 -59.04812484966506, -64.58702634493868 -77.07802892327148, -49.685000000000045 -86.05694437405965 C -34.754341245902474 -95.05311170556791, -17.423866102474058 -90.01428351214383, -1.6440883278553216e-14 -89.5 C 16.944874403202444 -88.99985442555268, 33.406945286813375 -91.76595741651028, 48.01999999999994 -83.17307977945752 C 62.60280079933599 -74.59799227491723, 68.26035047536544 -58.944088507890214, 76.799132807604 -44.340000000000046 C 85.38138197865302 -29.66156909334073, 95.74829471964232 -16.979348111836277, 96.65 0 z ;M 100.43 0 C 99.44111609671702 17.552560474217483, 85.45003481640393 29.038106989746822, 76.37478035974965 44.09499999999999 C 67.47982214730594 58.85276076308644, 64.07619623688856 76.5210513546238, 49.13500000000001 85.10431642989678 C 34.197839864932604 93.68526288681738, 17.224945520414785 88.19944893969671, 5.386608946049633e-15 87.97 C -16.995859874251966 87.74360264955502, -33.675744430814035 92.32280785019591, -48.38499999999998 83.80527832422013 C -63.09093119233604 75.28967380919008, -67.46629494853046 58.573580703738266, -76.07167146842508 43.92000000000003 C -84.74078159210374 29.157891156391287, -97.50578376593529 17.119125303246612, -97.6 1.1952552759678167e-14 C -97.6942955026296 -17.13352843141885, -85.16966290503643 -29.388429432236997, -76.5566456945444 -44.19999999999998 C -67.96991930904315 -58.966358953746784, -62.77231119032221 -74.64857202786988, -48.62500000000004 -84.22097051803664 C -34.121978463364755 -94.03405086895964, -17.446142869940783 -97.50541642989344, -1.7634913907721887e-14 -96 C 16.824136546866306 -94.54825609504428, 29.53246273910814 -84.92008419882137, 44.00999999999994 -76.22755604110633 C 58.26564148077935 -67.66825740177873, 71.6180443525204 -60.425177429348025, 81.51031100419134 -47.060000000000045 C 92.07153193494764 -32.79101629986303, 101.4285520767086 -17.724169293174832, 100.43 0 z ;M 97.27 0 C 98.58345261039341 17.558366186082086, 94.2994917286897 34.203939932148074, 84.091066707469 48.54999999999999 C 74.21975411889315 62.42231066985079, 58.473444022898576 67.23312887448718, 43.57000000000001 75.46545368577598 C 28.941333692804605 83.54599751254223, 16.64874697133146 93.54662780123404, 5.8170722959499274e-15 95 C -17.27803955307615 96.50830704429953, -33.78857056294901 93.13333275238398, -48.19499999999998 83.47618867078205 C -62.265894952404224 74.04396533562448, -68.01933932212052 58.825944468473296, -76.14095350072783 43.96000000000003 C -84.0905443486636 29.408930041052358, -92.00739521206805 16.483816295811398, -93.8 1.1487186976002173e-14 C -95.70727280919573 -17.538240901971744, -94.76889052685837 -34.35072747684755, -86.34273275730855 -49.84999999999997 C -77.83404631199598 -65.50107770786477, -64.5344993843803 -76.3187721614444, -48.310000000000045 -83.67537451365246 C -32.817324666057125 -90.70014915251777, -17.009590728815464 -88.78959332709252, -1.6349034768617164e-14 -89 C 17.210968156731738 -89.21289768843408, 34.09370369400777 -93.47659088564015, 49.00499999999994 -84.87914982491287 C 63.91783177263862 -76.28082345658234, 68.61922431545376 -59.49398069945713, 77.12822246104209 -44.530000000000044 C 85.58365918742902 -29.660212768381562, 95.99397423560407 -17.058040356269963, 97.27 0 z ;M 102 0 C 102 17.85951467281289, 86.87204367700592 29.533206594083104, 77.94228634059948 44.99999999999999 C 69.01252900419304 60.46679340591688, 66.4667934059169 79.40483384960629, 51.000000000000014 88.33459118601273 C 35.53320659408312 97.26434852241918, 17.859514672812903 90, 5.5109105961630896e-15 90 C -17.85951467281288 90, -35.53320659408308 97.26434852241918, -50.99999999999998 88.33459118601274 C -66.46679340591687 79.4048338496063, -69.01252900419303 60.46679340591692, -77.94228634059947 45.00000000000003 C -86.87204367700592 29.533206594083133, -102 17.859514672812914, -102 1.2491397351303002e-14 C -102 -17.85951467281287, -86.87204367700593 -29.533206594083083, -77.9422863405995 -44.99999999999997 C -69.01252900419306 -60.46679340591687, -66.46679340591693 -79.40483384960628, -51.00000000000004 -88.33459118601273 C -35.53320659408315 -97.26434852241918, -17.85951467281292 -89.99999999999999, -1.6532731788489267e-14 -90 C 17.859514672812853 -90.00000000000001, 35.533206594083055 -97.26434852241921, 50.99999999999993 -88.33459118601279 C 66.46679340591683 -79.40483384960635, 69.012529004193 -60.46679340591694, 77.94228634059945 -45.00000000000004 C 86.8720436770059 -29.53320659408314, 102 -17.85951467281291, 102 0 z ;" dur="30s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="scale" values="1;1.05;1.05;1.02;1" dur="0.15s" begin="click_area.mousedown" repeatCount="1" additive="sum"/></path></defs><g style="mask: url(#innerCircle)"><g fill="url(#grad3)" transform="rotate(54)"><use xlink:href="#path"><animateTransform id="animate1" attributeName="transform" type="rotate" from="54" to="416" dur="15s" repeatCount="indefinite"/></use></g><g fill="url(#grad2)" transform="rotate(74)"><use xlink:href="#path" /></g><g fill="url(#grad1)" transform="rotate(90)"><use xlink:href="#path"><animateTransform id="animate2" attributeName="transform" type="rotate" from="90" to="450" dur="30s" repeatCount="indefinite"/></use></g></g><circle cx="0" cy="0" r="76" fill="transparent" id="click_area"/></svg>');}else{r.write('<svg focusable="false" version="1.1" width="48" height="48" viewBox="-150 -150 300 300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="grad1" x1="0%" x2="100%" y1="100%" y2="0%"><stop class="color1" offset="0%" style="stop-opacity:0.7"/><stop class="color2" offset="80%" style="stop-opacity:0.7"/></linearGradient><linearGradient id="grad2" x1="0%" x2="100%" y1="100%" y2="0%"><stop class="color1" offset="0%" style="stop-opacity:0.36"/><stop class="color2" offset="80%" style="stop-opacity:0.36"/></linearGradient><linearGradient id="grad3" x1="0%" x2="100%" y1="100%" y2="0%"><stop class="color1" offset="0%" style="stop-opacity:0.2"/><stop class="color2" offset="80%" style="stop-opacity:0.2"/></linearGradient><mask id="innerCircle"><circle cx="0" cy="0" r="120" fill="white" /><circle cx="0" cy="0" r="76" fill="black" /></mask><path id="path" d="M 98.1584 0 C 98.3156 17.3952 89.0511 31.3348 79.5494 45.9279 C 70.339 60.0814 60.6163 71.2177 46.1724 79.9729 C 31.4266 88.9178 17.2493 94.3909 5.77261e-15 94.2739 C -17.1547 94.1581 -30.8225 87.6907 -45.7979 79.3244 C -61.0143 70.8266 -73.5583 62.554 -83.0507 47.9493 C -92.6677 33.1579 -98.4872 17.5705 -97.1793 1.19010e-14 C -95.9465 -16.9777 -84.488 -29.0862 -76.1351 -43.9566 C -67.6795 -59.0155 -63.8629 -76.1085 -49.262 -85.3243 C -34.502 -94.6464 -17.4328 -93.0037 -1.69174e-14 -92.0939 C 16.8967 -91.214 31.8608 -89.0341 46.4198 -80.4014 C 60.872 -71.8326 69.6003 -59.5351 78.6792 -45.4254 C 88.0511 -30.9104 98.015 -17.2766 98.1584 0 Z"/></defs><g style="mask: url(#innerCircle)"><g fill="url(#grad3)" transform="rotate(54)"><use xlink:href="#path"/></g><g fill="url(#grad2)" transform="rotate(74)"><use xlink:href="#path" /></g><g fill="url(#grad1)" transform="rotate(90)"><use xlink:href="#path"/></g></g><circle cx="0" cy="0" r="76" fill="transparent" id="click_area"/></svg>');}r.write("</div>");};return C;},true);
