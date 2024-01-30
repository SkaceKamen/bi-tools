import { parseOperators } from './parseOperators'

export const operators = parseOperators(`
t:SCALAR
t:BOOL
t:ARRAY
t:STRING
t:NOTHING
t:ANY
t:NAMESPACE
t:NaN
t:IF
t:WHILE
t:FOR
t:SWITCH
t:EXCEPTION
t:WITH
t:CODE
t:OBJECT
t:VECTOR
t:TRANS
t:ORIENT
t:SIDE
t:GROUP
t:TEXT
t:SCRIPT
t:TARGET
t:JCLASS
t:CONFIG
t:DISPLAY
t:CONTROL
t:NetObject
t:SUBGROUP
t:TEAM_MEMBER
t:HASHMAP
t:TASK
t:DIARY_RECORD
t:LOCATION
b:CONTROL lnbsetcurselrow SCALAR
b:CONTROL removemenuitem SCALAR
b:CONTROL removemenuitem STRING
b:OBJECT currentzeroing ARRAY
b:OBJECT curatorcoef STRING
b:OBJECT getreldir ARRAY,OBJECT
b:STRING setmarkerpolyline ARRAY
b:CONTROL ctrlsetfontheighth6 SCALAR
b:OBJECT setturretlimits ARRAY
b:CONTROL menucollapse ARRAY
b:STRING configclasses CONFIG
b:ARRAY findemptyposition ARRAY
b:OBJECT getenv3dsoundcontroller STRING
b:ARRAY setwaypointtype STRING
b:ARRAY vectordistance ARRAY
b:CONTROL ctrlseturloverlaymode SCALAR
b:CONTROL lbsetcolor ARRAY
b:CONTROL lbsetcolorright ARRAY
b:ARRAY,OBJECT say3d STRING
b:ARRAY,OBJECT say3d ARRAY
b:OBJECT forceflagtexture STRING
b:CONTROL menusetdata ARRAY
b:STRING trim ARRAY
b:GROUP addvehicle OBJECT
b:FOR from SCALAR
b:OBJECT enablereload BOOL
b:FOR to SCALAR
b:ARRAY resize SCALAR
b:ARRAY resize ARRAY
b:OBJECT setpilotlight BOOL
b:CONTROL setvisibleiftreecollapsed ARRAY
b:ANY isequaltypeall ANY
b:OBJECT camconstuctionsetparams ARRAY
b:ARRAY,OBJECT commandsuppressivefire ARRAY,OBJECT
b:CONTROL tvtext ARRAY
b:OBJECT switchlight STRING
b:OBJECT elevateperiscope ARRAY
b:OBJECT camsettarget OBJECT
b:OBJECT camsettarget ARRAY
b:OBJECT setanimspeedcoef SCALAR
b:OBJECT setposaslw ARRAY
b:OBJECT camsetfocus ARRAY
b:STRING setmarkershapelocal STRING
b:CONTROL ctrlsetfontp STRING
b:CONTROL ctrlsetfontp SCALAR
b:CONTROL ctrlsetfont STRING
b:ARRAY allowgetin BOOL
b:CONTROL ctrlsetfonth4b STRING
b:CONTROL tvdata ARRAY
b:CONTROL ctrlsetscrollvalues ARRAY
b:OBJECT directsay STRING
b:CONTROL ctrlsetforegroundcolor ARRAY
b:TASK sendtaskresult ARRAY
b:TASK setsimpletaskdescription ARRAY
b:SCALAR setforcegeneratorrtd ARRAY
b:OBJECT worldtomodel ARRAY
b:OBJECT sethitindex ARRAY
b:OBJECT hideobject BOOL
b:STRING setmarkerpos ARRAY,OBJECT
b:ARRAY,OBJECT dofollow OBJECT
b:OBJECT get3denattribute STRING
b:GROUP get3denattribute STRING
b:ARRAY get3denattribute STRING
b:STRING get3denattribute STRING
b:SCALAR get3denattribute STRING
b:CONTROL menusetvalue ARRAY
b:OBJECT disableconversation BOOL
b:OBJECT camsetdive SCALAR
b:CONTROL tvsetselectcolor ARRAY
b:ARRAY apply CODE
b:HASHMAP apply CODE
b:OBJECT setweaponreloadingtime ARRAY
b:OBJECT enableai STRING
b:OBJECT removemagazine ARRAY,STRING
b:OBJECT remotecontrol OBJECT
b:OBJECT additem STRING
b:SCALAR,NaN != SCALAR,NaN
b:BOOL != BOOL
b:STRING != STRING
b:OBJECT != OBJECT
b:GROUP != GROUP
b:SIDE != SIDE
b:TEXT != TEXT
b:NAMESPACE != NAMESPACE
b:CONFIG != CONFIG
b:DISPLAY != DISPLAY
b:CONTROL != CONTROL
b:TEAM_MEMBER != TEAM_MEMBER
b:NetObject != NetObject
b:TASK != TASK
b:DIARY_RECORD != DIARY_RECORD
b:LOCATION != LOCATION
b:OBJECT addmpeventhandler ARRAY
b:OBJECT actionparams SCALAR
b:TEAM_MEMBER setfromeditor BOOL
b:OBJECT selectweaponturret ARRAY
b:OBJECT lockedcamerato ARRAY
b:SIDE getfriend SIDE
b:CONTROL deleteeditorobject STRING
b:ARRAY pushbackunique ANY
b:OBJECT synchronizeobjectsadd ARRAY
b:OBJECT disabletiequipment BOOL
b:OBJECT setweaponzeroing ARRAY
b:OBJECT setparticlerandom ARRAY
b:OBJECT targetsquery ARRAY
b:CONTROL lbsetselectcolorright ARRAY
b:TEAM_MEMBER registertask STRING
b:CONTROL menuurl ARRAY
b:OBJECT enableuavwaypoints BOOL
b:ARRAY,OBJECT distancesqr ARRAY,OBJECT
b:LOCATION distancesqr LOCATION
b:LOCATION distancesqr ARRAY
b:ARRAY distancesqr LOCATION
b:OBJECT setspeaker STRING
b:OBJECT setcustomweightrtd SCALAR
b:SCALAR,NaN <= SCALAR,NaN
b:OBJECT isuavconnectable ARRAY
b:OBJECT setlightvolumeshape ARRAY
b:OBJECT playaction STRING
b:OBJECT enabledirectionstabilization ARRAY
b:CONTROL ctrlsetangle ARRAY
b:OBJECT animatepylon ARRAY
b:OBJECT setammoonpylon ARRAY
b:OBJECT triggerattachobject SCALAR
b:OBJECT animationsourcephase STRING
b:CONTROL lnbsetvalue ARRAY
b:OBJECT loadmagazine ARRAY
b:CONTROL ctrlsetmodel STRING
b:OBJECT loadstatus STRING
b:OBJECT removempeventhandler ARRAY
b:SCALAR boundingbox OBJECT
b:OBJECT setlightbrightness SCALAR
b:OBJECT,GROUP,DISPLAY,CONTROL geteventhandlerinfo ARRAY
b:TASK setsimpletasktype STRING
b:OBJECT swimindepth SCALAR
b:OBJECT addrating SCALAR
b:ARRAY,OBJECT nearobjectsready SCALAR
b:ANY isequaltype ANY
b:ARRAY setwaypointposition ARRAY
b:CONTROL controlsgroupctrl SCALAR
b:CONTROL tvpictureright ARRAY
b:CONTROL ctrlsettooltipcolorshade ARRAY
b:OBJECT saveidentity STRING
b:OBJECT enablestamina BOOL
b:OBJECT setammo ARRAY
b:STRING setmarkerbrushlocal STRING
b:OBJECT removeownedmine OBJECT
b:LOCATION settype STRING
b:LOCATION attachobject OBJECT
b:OBJECT setunitability SCALAR
b:OBJECT weaponreloadingtime ARRAY
b:OBJECT additemtouniform STRING
b:CONTROL htmlload STRING
b:OBJECT setvehiclereceiveremotetargets BOOL
b:OBJECT enableweapondisassembly BOOL
b:OBJECT assignasgunner OBJECT
b:OBJECT setunitrecoilcoefficient SCALAR
b:OBJECT sethitpointdamage ARRAY
b:CONTROL menuchecked ARRAY
b:CONTROL allow3dmode BOOL
b:OBJECT limitspeed SCALAR
b:CONTROL loadoverlay CONFIG
b:OBJECT campreload SCALAR
b:OBJECT removeitemfrombackpack STRING
b:OBJECT settriggertype STRING
b:OBJECT allowservice SCALAR
b:STRING ppeffectcommit SCALAR
b:SCALAR ppeffectcommit SCALAR
b:ARRAY ppeffectcommit SCALAR
b:CONTROL updatedrawicon ARRAY
b:SCALAR setwinddir SCALAR
b:CONTROL ctrlremovealleventhandlers STRING
b:OBJECT assignascargo OBJECT
b:OBJECT setvehicleid SCALAR
b:STRING setmarkertypelocal STRING
b:OBJECT groupradio STRING
b:CONTROL slidersetrange ARRAY
b:OBJECT setmaxload SCALAR
b:CONTROL lnbsettext ARRAY
b:SCALAR setfog SCALAR,ARRAY
b:OBJECT setvectorup ARRAY
b:OBJECT setunittrait ARRAY
b:OBJECT forcewalk BOOL
b:OBJECT addweaponcargo ARRAY
b:SCALAR boundingboxreal OBJECT
b:OBJECT addweaponcargoglobal ARRAY
b:CONTROL tvsetpictureright ARRAY
b:OBJECT setlightintensity SCALAR
b:OBJECT customradio ARRAY
b:OBJECT currentmagazinedetailturret ARRAY
b:ARRAY,OBJECT settitleeffect ARRAY
b:CONTROL lnbsettextright ARRAY
b:ARRAY,OBJECT commandfollow OBJECT
b:CONTROL allowfileoperations BOOL
b:ANY param ARRAY
b:CONTROL lbsetpicturecolordisabled ARRAY
b:GROUP setcurrentwaypoint ARRAY
b:OBJECT removeitemfromuniform STRING
b:BOOL and BOOL
b:BOOL and CODE
b:OBJECT getturretlimits ARRAY
b:OBJECT vectormodeltoworld ARRAY
b:SCALAR setlightnings SCALAR
b:CONTROL lnbsortbyvalue ARRAY
b:CONTROL tvsetpicture ARRAY
b:CONTROL lnbsetdata ARRAY
b:OBJECT removeprimaryweaponitem STRING
b:CONTROL selecteditorobject STRING
b:OBJECT setpylonloadout ARRAY
b:CONTROL setobjectarguments ARRAY
b:OBJECT setflagtexture STRING
b:OBJECT removeitemfromvest STRING
b:OBJECT gethitindex SCALAR
b:OBJECT forcefollowroad BOOL
b:OBJECT removeaction SCALAR
b:OBJECT addplayerscores ARRAY
b:OBJECT setposworld ARRAY
b:ARRAY joinstring STRING
b:OBJECT,GROUP knowsabout OBJECT
b:SIDE knowsabout OBJECT
b:ANY in ARRAY
b:STRING in STRING
b:OBJECT in OBJECT
b:SCALAR,BOOL,ARRAY,STRING,NAMESPACE,NaN,CODE,SIDE,CONFIG in HASHMAP
b:ARRAY in LOCATION
b:OBJECT creatediarysubject ARRAY
b:CONTROL lnbsetpicturecolorselectedright ARRAY
b:OBJECT enablepersonturret ARRAY
b:CONTROL ctsetvalue ARRAY
b:ARRAY setwaypointscript STRING
b:CONTROL lbsetvalue ARRAY
b:OBJECT playmove STRING
b:OBJECT currentweaponturret ARRAY
b:CONTROL ctrlsetfontpb STRING
b:OBJECT lockcamerato ARRAY
b:ARRAY,OBJECT commandradio STRING
b:OBJECT ammoonpylon SCALAR,STRING
b:TEAM_MEMBER sendtask ARRAY
b:OBJECT removeweaponturret ARRAY
b:STRING cutfadeout SCALAR
b:SCALAR cutfadeout SCALAR
b:OBJECT removeallmpeventhandlers STRING
b:ARRAY inpolygon ARRAY
b:CONTROL tvsettext ARRAY
b:OBJECT triggerdynamicsimulation BOOL
b:ARRAY set3denobjecttype STRING
b:STRING setmarkertextlocal STRING
b:OBJECT addmagazinecargo ARRAY
b:OBJECT addmagazinecargoglobal ARRAY
b:OBJECT minedetectedby SIDE
b:CONTROL lnbtext ARRAY
b:BOOL && BOOL
b:BOOL && CODE
b:OBJECT isvehiclesensorenabled STRING
b:OBJECT setturretopticsmode SCALAR
b:OBJECT setturretopticsmode ARRAY
b:FOR step SCALAR
b:CONTROL tvsetdata ARRAY
b:CONTROL ctrlsetbackgroundcolor ARRAY
b:OBJECT canadditemtobackpack ARRAY,STRING
b:OBJECT setlightconepars ARRAY
b:OBJECT setposasl ARRAY
b:OBJECT,GROUP reveal OBJECT
b:OBJECT,GROUP reveal ARRAY
b:CONTROL lbsettooltip ARRAY
b:OBJECT vehicleradio STRING
b:CONTROL show3dicons BOOL
b:CONTROL ctrlsetdisabledcolor ARRAY
b:OBJECT reload ARRAY
b:OBJECT enablevehiclecargo BOOL
b:CONTROL lnbdata ARRAY
b:CONTROL lbadd STRING
b:OBJECT isflashlighton STRING
b:ANY execfsm STRING
b:OBJECT setcollisionlight BOOL
b:OBJECT setvectordir ARRAY
b:STRING get3denmissionattribute STRING
b:OBJECT setobjectmaterialglobal ARRAY
b:OBJECT setdropinterval SCALAR
b:CONTROL ctrlsettooltipcolortext ARRAY
b:CONTROL lbtext SCALAR
b:OBJECT switchmove STRING
b:BOOL || BOOL
b:BOOL || CODE
b:OBJECT additemcargo ARRAY
b:OBJECT neartargets SCALAR
b:OBJECT addgoggles STRING
b:CONTROL lbpicture SCALAR
b:CONTROL tvsetpicturecolor ARRAY
b:OBJECT allowcuratorlogicignoreareas BOOL
b:OBJECT assignascommander OBJECT
b:ARRAY showwaypoint STRING
b:ARRAY,OBJECT getdir ARRAY,OBJECT
b:CONTROL lbsettextright ARRAY
b:CONTROL ctrlremoveeventhandler ARRAY
b:CONTROL ctrlanimationphasemodel STRING
b:OBJECT addmagazine STRING
b:OBJECT addmagazine ARRAY
b:OBJECT disablenvgequipment BOOL
b:OBJECT targetknowledge OBJECT
b:CONTROL lbdata SCALAR
b:CONTROL lbdelete SCALAR
b:ARRAY createhashmapfromarray ARRAY
b:OBJECT campreparefov SCALAR
b:CONTROL newoverlay CONFIG
b:ARRAY insert ARRAY
b:STRING insert ARRAY
b:HASHMAP insert ARRAY
b:OBJECT respawnvehicle ARRAY
b:OBJECT camsetfov SCALAR
b:STRING cutobj ARRAY
b:SCALAR cutobj ARRAY
b:OBJECT turretunit ARRAY
b:OBJECT kbaddtopic ARRAY
b:OBJECT setformationtask STRING
b:OBJECT campreparebank SCALAR
b:TASK setsimpletaskalwaysvisible BOOL
b:OBJECT setcurrenttask TASK
b:LOCATION setposition ARRAY
b:IF then CODE
b:IF then ARRAY
b:CONTROL ctrlsettooltipmaxwidth SCALAR
b:CONTROL cbsetchecked BOOL
b:CONTROL tvsort ARRAY
b:OBJECT selectionnames SCALAR,STRING
b:OBJECT setuseractiontext ARRAY
b:OBJECT setsuppression SCALAR
b:CONTROL lbsetpicturerightcolor ARRAY
b:STRING setmarkertext STRING
b:OBJECT weaponsturret ARRAY
b:OBJECT removeitems STRING
b:SCALAR radiochannelsetcallsign STRING
b:CONTROL ctrlsetchecked BOOL
b:CONTROL ctrlsetchecked ARRAY
b:OBJECT,GROUP setgroupid ARRAY
b:OBJECT moveto ARRAY
b:CONTROL tvexpand ARRAY
b:OBJECT vectorworldtomodelvisual ARRAY
b:CONTROL tvadd ARRAY
b:SCALAR,CONTROL lbsortby ARRAY
b:OBJECT moveinturret ARRAY
b:OBJECT kbadddatabase STRING
b:CONTROL lbsetpicturerightcolorselected ARRAY
b:TEAM_MEMBER deleteresources ARRAY
b:ANY try CODE
b:OBJECT enablesimulationglobal BOOL
b:CONTROL ctrlsetfonth1b STRING
b:OBJECT setwantedrpmrtd ARRAY
b:CONTROL tvcount ARRAY
b:ARRAY,OBJECT infopanelcomponentenabled ARRAY
b:OBJECT ropedetach OBJECT
b:GROUP create3denentity ARRAY
b:STRING camcreate ARRAY
b:ARRAY,OBJECT say STRING
b:ARRAY,OBJECT say ARRAY
b:ARRAY set ARRAY
b:HASHMAP set ARRAY
b:SCALAR,NaN atan2 SCALAR,NaN
b:CONTROL ctrlsetscale SCALAR
b:TEAM_MEMBER unregistertask STRING
b:STRING ppeffectenable BOOL
b:ARRAY ppeffectenable BOOL
b:SCALAR ppeffectenable BOOL
b:ARRAY intersect ARRAY
b:OBJECT removehandgunitem STRING
b:ARRAY,OBJECT dofire OBJECT
b:EXCEPTION catch CODE
b:CONTROL lbsetselected ARRAY
b:STRING setdebriefingtext ARRAY
b:CONTROL ctrlsetfade SCALAR
b:OBJECT islaseron ARRAY
b:HASHMAP toarray BOOL
b:ANY set3denattribute ARRAY
b:OBJECT hcgroupparams GROUP
b:OBJECT selectionvectordirandup ARRAY
b:ARRAY,OBJECT sideradio STRING
b:OBJECT countenemy ARRAY
b:CONTROL progresssetposition SCALAR
b:ARRAY # SCALAR
b:OBJECT setdammage SCALAR
b:OBJECT moveinany OBJECT
b:CONTROL lnbdeletecolumn SCALAR
b:DISPLAY displayaddeventhandler ARRAY
b:CONTROL ctrlsettooltip STRING
b:OBJECT camcommit SCALAR
b:OBJECT setshotparents ARRAY
b:OBJECT modeltoworldvisual ARRAY
b:STRING,TEXT setattributes ARRAY
b:GROUP getgroupicon SCALAR
b:CONTROL tvdelete ARRAY
b:SCALAR,NaN mod SCALAR,NaN
b:CONTROL ctrlsetfonth5b STRING
b:STRING enableaifeature BOOL
b:OBJECT enableaifeature ARRAY
b:CONTROL addmenuitem ARRAY
b:OBJECT enablesimulation BOOL
b:OBJECT allowdamage BOOL
b:SCALAR,NaN % SCALAR,NaN
b:ANY execvm STRING
b:OBJECT setlightcolor ARRAY
b:ARRAY setwaypointhouseposition SCALAR
b:SIDE setfriend ARRAY
b:OBJECT addcuratoreditingarea ARRAY
b:OBJECT attachto ARRAY
b:STRING cutrsc ARRAY
b:SCALAR cutrsc ARRAY
b:OBJECT setcaptive SCALAR,BOOL
b:CONTROL editorseteventhandler ARRAY
b:SCALAR radiochannelsetlabel STRING
b:OBJECT lockedcargo SCALAR
b:OBJECT turretlocal ARRAY
b:OBJECT,GROUP setgroupidglobal ARRAY
b:OBJECT kbtell ARRAY
b:OBJECT setidentity STRING
b:CONTROL lnbsettooltip ARRAY
b:OBJECT doorphase STRING
b:ARRAY,OBJECT lookat ARRAY,OBJECT
b:GROUP selectleader OBJECT
b:CONTROL menuenabled ARRAY
b:OBJECT backpackspacefor STRING
b:OBJECT animatesource ARRAY
b:CONTROL drawicon ARRAY
b:OBJECT setunitloadout ARRAY
b:OBJECT setunitloadout STRING
b:OBJECT setunitloadout CONFIG
b:CONTROL ctdata SCALAR
b:OBJECT removecuratoraddons ARRAY
b:OBJECT playgesture STRING
b:OBJECT campreparetarget OBJECT
b:OBJECT campreparetarget ARRAY
b:CONTROL ctsetheadertemplate CONFIG
b:OBJECT setvehiclereportownposition BOOL
b:STRING setmarkerdirlocal SCALAR
b:SCALAR allobjects SCALAR
b:STRING allobjects SCALAR
b:OBJECT animationphase STRING
b:OBJECT lockturret ARRAY
b:ANY remoteexec ARRAY
b:OBJECT removeweaponglobal STRING
b:SCALAR,NaN * SCALAR,NaN
b:STRING createsite ARRAY
b:SCALAR,NaN == SCALAR,NaN
b:BOOL == BOOL
b:STRING == STRING
b:OBJECT == OBJECT
b:GROUP == GROUP
b:SIDE == SIDE
b:TEXT == TEXT
b:NAMESPACE == NAMESPACE
b:CONFIG == CONFIG
b:DISPLAY == DISPLAY
b:CONTROL == CONTROL
b:TEAM_MEMBER == TEAM_MEMBER
b:NetObject == NetObject
b:TASK == TASK
b:DIARY_RECORD == DIARY_RECORD
b:LOCATION == LOCATION
b:SCALAR setrainbow SCALAR
b:OBJECT getturretopticsmode ARRAY
b:OBJECT setfatigue SCALAR
b:ARRAY findany ARRAY
b:OBJECT setdamage SCALAR,ARRAY
b:OBJECT addmagazineturret ARRAY
b:STRING gettextwidth ARRAY
b:SIDE countside ARRAY
b:CONTROL ctfindrowheader SCALAR
b:OBJECT setparticleparams ARRAY
b:CONTROL drawrectangle ARRAY
b:CONTROL lnbaddrow ARRAY
b:SCALAR,NaN + SCALAR,NaN
b:STRING + STRING
b:ARRAY + ARRAY
b:CONTROL tvsetpicturecolorselected ARRAY
b:CONTROL drawline ARRAY
b:CONTROL posscreentoworld ARRAY
b:OBJECT sethidebehind ARRAY
b:OBJECT turretowner ARRAY
b:OBJECT setface STRING
b:SCALAR fadesound SCALAR
b:STRING splitstring STRING
b:CODE count ARRAY
b:SCALAR,NaN - SCALAR,NaN
b:ARRAY - ARRAY
b:ARRAY setwaypointformation STRING
b:OBJECT disableuavconnectability ARRAY
b:ARRAY,OBJECT nearroads SCALAR
b:DISPLAY displayctrl SCALAR
b:CODE foreach ARRAY
b:CODE foreach HASHMAP
b:OBJECT,GROUP setformdir SCALAR
b:CONTROL ctrlsetfontsecondary STRING
b:OBJECT lockcargo ARRAY
b:OBJECT lockcargo BOOL
b:OBJECT camcommitprepared SCALAR
b:HASHMAP get SCALAR,BOOL,ARRAY,STRING,NAMESPACE,NaN,CODE,SIDE,CONFIG
b:STRING set3denmissionattribute ARRAY
b:OBJECT setnamesound STRING
b:OBJECT modeltoworldvisualworld ARRAY
b:ARRAY,OBJECT doartilleryfire ARRAY
b:OBJECT isuniformallowed STRING
b:OBJECT skill STRING
b:SCALAR,NaN / SCALAR,NaN
b:CONFIG / STRING
b:OBJECT addweapon STRING
b:ARRAY waypointattachvehicle OBJECT
b:OBJECT creatediaryrecord ARRAY
b:OBJECT,GROUP lockwp BOOL
b:OBJECT addmagazineammocargo ARRAY
b:DISPLAY displayseteventhandler ARRAY
b:OBJECT addmagazineglobal STRING
b:OBJECT setunitposweak STRING
b:HASHMAP getordefaultcall ARRAY
b:CONTROL ctrlsettextcolor ARRAY
b:OBJECT addlivestats SCALAR
b:OBJECT forceadduniform STRING
b:OBJECT removeitem STRING
b:OBJECT vectorworldtomodel ARRAY
b:OBJECT setrandomlip BOOL
b:ARRAY setwppos ARRAY
b:CONTROL findeditorobject ARRAY
b:CONTROL findeditorobject ANY
b:OBJECT addforce ARRAY
b:OBJECT canvehiclecargo OBJECT
b:OBJECT weaponstate STRING
b:OBJECT lockedturret ARRAY
b:CONTROL lbpictureright SCALAR
b:CONTROL ctsetdata ARRAY
b:CONTROL ctrlmapcursor ARRAY
b:CONTROL drawlink ARRAY
b:OBJECT addcuratorpoints SCALAR
b:OBJECT assignasturret ARRAY
b:OBJECT sendsimplecommand STRING
b:CONTROL lnbsort ARRAY
b:CONTROL ctrlsetposition ARRAY
b:OBJECT removecuratoreditingarea SCALAR
b:ARRAY setwaypointspeed STRING
b:STRING createunit ARRAY
b:GROUP createunit ARRAY
b:STRING setdynamicsimulationdistance SCALAR
b:OBJECT setcuratorcameraareaceiling SCALAR
b:OBJECT addtorque ARRAY
b:ANY onmapsingleclick STRING,CODE
b:OBJECT setmass SCALAR,ARRAY
b:OBJECT kbadddatabasetargets STRING
b:CONTROL posworldtoscreen ARRAY
b:OBJECT selectionposition STRING
b:OBJECT selectionposition ARRAY
b:CONTROL updatemenuitem ARRAY
b:OBJECT addweaponturret ARRAY
b:SCALAR setwindforce SCALAR
b:SCALAR getfsmvariable ARRAY,STRING
b:TEAM_MEMBER addresources ARRAY
b:OBJECT addaction ARRAY
b:TASK setsimpletaskcustomdata ARRAY
b:ARRAY vectoradd ARRAY
b:CONTROL drawpolygon ARRAY
b:DISPLAY ctrlat ARRAY
b:OBJECT camsetrelpos ARRAY
b:CONTROL menushortcut ARRAY
b:OBJECT setcruisecontrol ARRAY
b:DISPLAY ctrlcreate ARRAY
b:OBJECT useaudiotimeformoves BOOL
b:OBJECT addscore SCALAR
b:OBJECT enablevehiclesensor ARRAY
b:OBJECT assigncurator OBJECT
b:OBJECT buildingexit SCALAR
b:OBJECT setfuel SCALAR
b:STRING ppeffectadjust ARRAY
b:SCALAR ppeffectadjust ARRAY
b:OBJECT magazineturretammo ARRAY
b:CONTROL nmenuitems SCALAR,STRING
b:SCALAR preloadobject STRING,OBJECT
b:CONTROL ctrlsetmodeldirandup ARRAY
b:OBJECT setplayervonvolume SCALAR
b:CONTROL lnbpictureright ARRAY
b:ARRAY setwaypointcombatmode STRING
b:OBJECT flyinheightasl ARRAY
b:DISPLAY creatempcampaigndisplay STRING
b:OBJECT enabledynamicsimulation BOOL
b:GROUP enabledynamicsimulation BOOL
b:OBJECT setposatl ARRAY
b:CONTROL setdrawicon ARRAY
b:OBJECT globalradio STRING
b:CONTROL seteditormode STRING
b:CONTROL tvtooltip ARRAY
b:CONTROL ctrlsettext STRING
b:ARRAY vectordistancesqr ARRAY
b:ARRAY,OBJECT sidechat STRING
b:OBJECT enableuavconnectability ARRAY
b:OBJECT addweaponglobal STRING
b:CONTROL ctrlcommit SCALAR
b:ARRAY findif CODE
b:OBJECT setlightir BOOL
b:ARRAY nearestobject STRING
b:ARRAY nearestobject SCALAR
b:OBJECT getopticsmode SCALAR
b:OBJECT setlightdaylight BOOL
b:OBJECT lightattachobject ARRAY
b:OBJECT setcenterofmass ARRAY
b:OBJECT hcsetgroup ARRAY
b:STRING setmarkercolor STRING
b:ARRAY matrixmultiply ARRAY
b:SCALAR,OBJECT setairportside SIDE
b:OBJECT setunitrank STRING
b:SWITCH : CODE
b:OBJECT setopticsmode SCALAR,ARRAY,STRING
b:OBJECT setobjecttextureglobal ARRAY
b:OBJECT getrelpos ARRAY
b:ARRAY synchronizewaypoint ARRAY
b:OBJECT synchronizewaypoint ARRAY
b:CONTROL lbsettext ARRAY
b:ARRAY append ARRAY
b:CONTROL lnbdeleterow SCALAR
b:IF throw ANY
b:ARRAY,OBJECT nearsupplies SCALAR,ARRAY
b:GROUP copywaypoints GROUP
b:TASK setsimpletasktarget ARRAY
b:TEAM_MEMBER setleader TEAM_MEMBER
b:CONTROL tvvalue ARRAY
b:GROUP unitsbelowheight SCALAR
b:ARRAY unitsbelowheight SCALAR
b:STRING setmarkershadowlocal BOOL
b:OBJECT disableai STRING
b:STRING servercommand STRING
b:SCALAR,NaN < SCALAR,NaN
b:OBJECT settriggertimeout ARRAY
b:LOCATION setdirection SCALAR
b:CONTROL lbisselected SCALAR
b:OBJECT campreparedir SCALAR
b:OBJECT setcombatbehaviour STRING
b:GROUP setcombatbehaviour STRING
b:CONTROL lbsetdata ARRAY
b:OBJECT camsetdir ARRAY
b:OBJECT setposasl2 ARRAY
b:OBJECT camsetbank SCALAR
b:OBJECT action ARRAY
b:ANY spawn CODE
b:OBJECT removemagazineturret ARRAY
b:OBJECT selectweapon STRING
b:OBJECT selectweapon ARRAY
b:CONTROL addeditorobject ARRAY
b:SCALAR,NaN > SCALAR,NaN
b:TEAM_MEMBER createtask ARRAY
b:OBJECT linkitem STRING
b:CONTROL seteditorobjectscope ARRAY
b:CONTROL tvsetpicturecolordisabled ARRAY
b:CONTROL showlegend BOOL
b:OBJECT removebinocularitem STRING
b:OBJECT setdir SCALAR
b:CONTROL setobjectproxy ARRAY
b:OBJECT disablebrakes BOOL
b:ARRAY,OBJECT enableinfopanelcomponent ARRAY
b:STRING setmarkersizelocal ARRAY
b:ARRAY ordergetin BOOL
b:CONTROL ctremoverows ARRAY
b:OBJECT getunittrait STRING
b:OBJECT hcremovegroup GROUP
b:ARRAY arrayintersect ARRAY
b:CONTROL lbsetpictureright ARRAY
b:DISPLAY setvariable ARRAY
b:CONTROL setvariable ARRAY
b:OBJECT setvariable ARRAY
b:GROUP setvariable ARRAY
b:NAMESPACE setvariable ARRAY
b:TEAM_MEMBER setvariable ARRAY
b:TASK setvariable ARRAY
b:LOCATION setvariable ARRAY
b:OBJECT issensortargetconfirmed SIDE
b:OBJECT setusermfdvalue ARRAY
b:CONTROL menusize ARRAY
b:OBJECT getsoundcontroller STRING
b:OBJECT enablemimics BOOL
b:CONTROL ctrlsetfonth2b STRING
b:OBJECT setcustomaimcoef SCALAR
b:OBJECT setairplanethrottle SCALAR
b:ARRAY find ANY
b:STRING find STRING
b:STRING find ARRAY
b:OBJECT setunitpos STRING
b:OBJECT animatedoor ARRAY
b:ANY isequaltypeparams ARRAY
b:CONTROL ctfindheaderrows SCALAR
b:LOCATION setsize ARRAY
b:OBJECT setobjectscale SCALAR
b:OBJECT gethit STRING
b:CONTROL drawarrow ARRAY
b:OBJECT setvehicleposition ARRAY
b:CONTROL ctrlshow BOOL
b:OBJECT removemagazineglobal STRING
b:OBJECT setlightflaremaxdistance SCALAR
b:OBJECT playmovenow STRING
b:ARRAY,OBJECT commandfire OBJECT
b:OBJECT addweaponwithattachmentscargo ARRAY
b:ARRAY,OBJECT domove ARRAY
b:OBJECT forcespeed SCALAR
b:CONTROL lbsetpicturerightcolordisabled ARRAY
b:STRING setmarkerbrush STRING
b:OBJECT setvelocitytransformation ARRAY
b:OBJECT enablecollisionwith OBJECT
b:DISPLAY displayremoveeventhandler ARRAY
b:OBJECT addmagazines ARRAY
b:STRING setmarkertype STRING
b:GROUP deletegroupwhenempty BOOL
b:CONTROL menuaction ARRAY
b:ARRAY isflatempty ARRAY
b:CONTROL ctrlsetstructuredtext TEXT
b:TEAM_MEMBER addteammember TEAM_MEMBER
b:SIDE revealmine OBJECT
b:SIDE reportremotetarget ARRAY
b:ARRAY,OBJECT setmusiceffect STRING
b:OBJECT switchgesture STRING
b:OBJECT,GROUP setformation STRING
b:TEAM_MEMBER setformation STRING
b:ARRAY vectorcos ARRAY
b:ARRAY,OBJECT commandwatch ARRAY
b:ARRAY,OBJECT commandwatch OBJECT
b:OBJECT setdiaryrecordtext ARRAY
b:CONTROL lbcolor SCALAR
b:OBJECT targets ARRAY
b:GROUP targets ARRAY
b:OBJECT addcuratorcameraarea ARRAY
b:ANY call CODE
b:CONTROL ctrlsetfonth6b STRING
b:STRING setmarkerposlocal ARRAY,OBJECT
b:OBJECT setpilotcamerarotation ARRAY
b:CONTROL ctrlmapsetposition ARRAY
b:OBJECT fire STRING
b:OBJECT fire ARRAY
b:OBJECT setautonomous BOOL
b:OBJECT setusermfdtext ARRAY
b:OBJECT getsoundcontrollerresult CONFIG
b:OBJECT setvehiclevarname STRING
b:CONTROL ctvalue SCALAR
b:CONTROL ctrlsetpositionh SCALAR
b:OBJECT hasweapon STRING
b:CONTROL ctrlsettextsecondary STRING
b:OBJECT setvehicletipars ARRAY
b:OBJECT setflagside SIDE
b:CONTROL ctrowcontrols SCALAR
b:OBJECT,GROUP setspeedmode STRING
b:OBJECT removeeventhandler ARRAY
b:GROUP removeeventhandler ARRAY
b:ARRAY waypointattachobject SCALAR,OBJECT
b:ARRAY joinsilent OBJECT,GROUP
b:CONTROL tvsortbyvalue ARRAY
b:STRING setmarkerdir SCALAR
b:OBJECT deletevehiclecrew OBJECT
b:CONTROL ctrlsetautoscrollrewind BOOL
b:CODE else CODE
b:OBJECT setdiarysubjectpicture ARRAY
b:CONTROL lbsetpicturecolor ARRAY
b:OBJECT buildingpos SCALAR
b:ARRAY setwaypointstatements ARRAY
b:ARRAY setwaypointforcebehaviour BOOL
b:CONTROL ctrlseturl STRING
b:OBJECT setunitfreefallheight SCALAR
b:OBJECT lasertarget ARRAY
b:OBJECT setmimic STRING
b:OBJECT engineon BOOL
b:SCALAR setwindstr SCALAR
b:SCALAR,NaN >= SCALAR,NaN
b:CONTROL lbtextright SCALAR
b:OBJECT allowsprint BOOL
b:OBJECT additemtobackpack STRING
b:CONTROL ctrlsetautoscrollspeed SCALAR
b:OBJECT unitturret OBJECT
b:OBJECT hideselection ARRAY
b:CONFIG >> STRING
b:CONTROL removedrawlinks ARRAY
b:ARRAY setwaypointcompletionradius SCALAR
b:GROUP setgroupiconparams ARRAY
b:CONTROL lbcolorright SCALAR
b:OBJECT setcuratoreditingareatype BOOL
b:OBJECT confirmsensortarget ARRAY
b:DISPLAY getvariable ARRAY,STRING
b:CONTROL getvariable ARRAY,STRING
b:OBJECT getvariable STRING
b:OBJECT getvariable ARRAY
b:GROUP getvariable STRING
b:GROUP getvariable ARRAY
b:NAMESPACE getvariable STRING
b:NAMESPACE getvariable ARRAY
b:TEAM_MEMBER getvariable STRING
b:TEAM_MEMBER getvariable ARRAY
b:TASK getvariable STRING
b:TASK getvariable ARRAY
b:LOCATION getvariable STRING
b:LOCATION getvariable ARRAY
b:OBJECT forceweaponfire ARRAY
b:OBJECT setlightambient ARRAY
b:OBJECT setdestination ARRAY
b:ARRAY pushback ANY
b:CONTROL ctrlenable BOOL
b:OBJECT groupchat STRING
b:SCALAR setrain SCALAR
b:OBJECT getspeed STRING
b:OBJECT addweaponitem ARRAY
b:OBJECT removesimpletask TASK
b:SCALAR add3denlayer STRING
b:CONTROL menupicture ARRAY
b:STRING cuttext ARRAY
b:SCALAR cuttext ARRAY
b:OBJECT triggerattachvehicle ARRAY
b:BOOL setcamuseti SCALAR
b:OBJECT addcuratoraddons ARRAY
b:OBJECT addbackpackcargo ARRAY
b:ARRAY join OBJECT,GROUP
b:ARRAY,OBJECT glanceat ARRAY,OBJECT
b:DISPLAY displayremovealleventhandlers STRING
b:ANY isequalref ANY
b:HASHMAP merge ARRAY,HASHMAP
b:TASK settaskstate STRING
b:CONTROL ctrlmapscreentoworld ARRAY
b:ARRAY setwaypointname STRING
b:OBJECT canadd ARRAY,STRING
b:STRING canadd ARRAY,STRING
b:OBJECT setmissiletarget OBJECT
b:STRING counttype ARRAY
b:ANY isnotequalto ANY
b:CONTROL moveobjecttoend STRING
b:OBJECT removemagazinesturret ARRAY
b:CONTROL tvsetcolor ARRAY
b:STRING regexfind ARRAY
b:CONTROL tvsetselected ARRAY
b:CONTROL ctheadercontrols SCALAR
b:OBJECT suppressfor SCALAR
b:CONTROL ctrlsettextcolorsecondary ARRAY
b:LOCATION setrectangular BOOL
b:CONTROL menuenable ARRAY
b:SCALAR bezierinterpolation ARRAY
b:CONTROL inserteditorobject ARRAY
b:STRING setdynamicsimulationdistancecoef SCALAR
b:SCALAR fadespeech SCALAR
b:DISPLAY closedisplay SCALAR
b:OBJECT setlightuseflare BOOL
b:OBJECT setvelocity ARRAY
b:ANY breakout STRING
b:ANY isequaltypeany ARRAY
b:OBJECT setpylonspriority ARRAY
b:TASK settaskresult ARRAY
b:ARRAY set3denlogictype STRING
b:CONTROL menuvalue ARRAY
b:CONTROL drawtriangle ARRAY
b:CONTROL lbsetselectcolor ARRAY
b:CONTROL mapcenteroncamera BOOL
b:CONTROL lbsetpicture ARRAY
b:OBJECT setammocargo SCALAR
b:OBJECT addbackpackcargoglobal ARRAY
b:ARRAY,OBJECT distance2d ARRAY,OBJECT
b:OBJECT moveout OBJECT
b:ARRAY,OBJECT commandfsm ARRAY
b:OBJECT setcamerainterest SCALAR
b:OBJECT seteffectivecommander OBJECT
b:OBJECT switchaction STRING
b:OBJECT animate ARRAY
b:OBJECT weaponsinfo ARRAY
b:OBJECT createsimpletask ARRAY
b:OBJECT setcuratorwaypointcost SCALAR
b:OBJECT setunitcombatmode STRING
b:ARRAY selectrandomweighted ARRAY
b:CONTROL ctrlsetshadow SCALAR
b:SCALAR random SCALAR,ARRAY
b:OBJECT setmissiletargetpos ARRAY
b:CONTROL ctrlsetfontheight SCALAR
b:OBJECT setslingload OBJECT
b:OBJECT diarysubjectexists STRING
b:CONTROL menusetshortcut ARRAY
b:CONTROL ctrlchecked SCALAR
b:CONTROL tvsettooltip ARRAY
b:OBJECT setfaceanimation SCALAR
b:OBJECT setflaganimationphase SCALAR
b:OBJECT addhandgunitem STRING
b:ARRAY setwaypointloiterradius SCALAR
b:STRING setpipeffect ARRAY
b:OBJECT playactionnow STRING
b:CONTROL ctrlsetpositionw SCALAR
b:OBJECT weapondirection STRING
b:CONTROL ctrlsetautoscrolldelay SCALAR
b:OBJECT countunknown ARRAY
b:CONTROL ctrlmapworldtoscreen ARRAY
b:STRING addpublicvariableeventhandler CODE
b:STRING addpublicvariableeventhandler ARRAY
b:ARRAY,OBJECT getpos ARRAY
b:SCALAR tofixed SCALAR
b:CONTROL ctrlsetactivecolor ARRAY
b:ARRAY,OBJECT ropeattachto OBJECT
b:ARRAY collect3denhistory CODE
b:CONTROL ctrlsetpositionx SCALAR
b:OBJECT moveincargo OBJECT
b:OBJECT moveincargo ARRAY
b:OBJECT canadditemtouniform ARRAY,STRING
b:OBJECT setbleedingremaining SCALAR
b:OBJECT setlightflaresize SCALAR
b:OBJECT removemagazines STRING
b:OBJECT vectormodeltoworldvisual ARRAY
b:ARRAY,OBJECT distance ARRAY,OBJECT
b:LOCATION distance LOCATION
b:LOCATION distance ARRAY
b:ARRAY distance LOCATION
b:CONTROL execeditorscript ARRAY
b:OBJECT setparticleclass STRING
b:ANY isnotequalref ANY
b:CONTROL ctrlsetpositiony SCALAR
b:OBJECT setparticlecircle ARRAY
b:CODE foreachmember TEAM_MEMBER
b:OBJECT setvelocitymodelspace ARRAY
b:OBJECT findcover ARRAY
b:ARRAY vectorfromto ARRAY
b:CONTROL ctrlsetfonth1 STRING
b:CONTROL ctrlsettooltipcolorbox ARRAY
b:OBJECT animatebay ARRAY
b:CONTROL drawlocation LOCATION
b:ARRAY setwaypointdescription STRING
b:OBJECT additemcargoglobal ARRAY
b:SCALAR radiochannelremove ARRAY
b:CONTROL removedrawicon ARRAY
b:OBJECT setlightattenuation ARRAY
b:CONTROL ctrlsetfonth2 STRING
b:OBJECT setname STRING
b:OBJECT setname ARRAY
b:LOCATION setname STRING
b:CONTROL lbvalue SCALAR
b:GROUP addgroupicon ARRAY
b:SCALAR ppeffectforceinnvg BOOL
b:CONTROL menuexpand ARRAY
b:CONTROL menusetpicture ARRAY
b:GROUP setgroupowner SCALAR
b:IF exitwith CODE
b:OBJECT setvehiclearmor SCALAR
b:CONTROL addmenu ARRAY
b:OBJECT savestatus STRING
b:ARRAY vectormultiply SCALAR
b:CONTROL ctrlmapanimadd ARRAY
b:OBJECT setstamina SCALAR
b:CONTROL ctrlsetfonth3 STRING
b:SCALAR setwaves SCALAR
b:CONTROL slidersetposition SCALAR
b:OBJECT campreparerelpos ARRAY
b:OBJECT setconvoyseparation SCALAR
b:OBJECT enablefatigue BOOL
b:OBJECT moveindriver OBJECT
b:CONTROL ctrlsetpixelprecision SCALAR
b:CONTROL ctrlsetpixelprecision STRING
b:ARRAY sort BOOL
b:DISPLAY createmissiondisplay STRING
b:DISPLAY createmissiondisplay ARRAY
b:OBJECT setfuelcargo SCALAR
b:ARRAY,OBJECT dotarget OBJECT
b:OBJECT addvest STRING
b:ANY remoteexeccall ARRAY
b:CONTROL ctrlsetfonth4 STRING
b:OBJECT canslingload OBJECT
b:STRING canslingload STRING
b:OBJECT selectdiarysubject STRING
b:OBJECT kbreact ARRAY
b:ARRAY vectordiff ARRAY
b:OBJECT land STRING
b:OBJECT,GROUP enablegunlights STRING
b:STRING setmarkershadow BOOL
b:OBJECT setowner SCALAR
b:CONTROL ctrlsetfonth5 STRING
b:CONTROL lnbsetpictureright ARRAY
b:CONTROL ctremoveheaders ARRAY
b:OBJECT switchcamera STRING
b:OBJECT setunloadincombat ARRAY
b:ARRAY,OBJECT inarea OBJECT
b:ARRAY,OBJECT inarea STRING
b:ARRAY,OBJECT inarea ARRAY
b:OBJECT inarea LOCATION
b:ARRAY inarea LOCATION
b:OBJECT skillfinal STRING
b:OBJECT loadidentity STRING
b:OBJECT addsecondaryweaponitem STRING
b:CONTROL ctrlsetfonth6 STRING
b:OBJECT removecuratorcameraarea SCALAR
b:TEAM_MEMBER removeteammember TEAM_MEMBER
b:CONTROL menuseturl ARRAY
b:CONTROL buttonsetaction STRING
b:CONTROL lbtooltip SCALAR
b:OBJECT joinassilent ARRAY
b:SCALAR,NaN ^ SCALAR,NaN
b:OBJECT modeltoworldworld ARRAY
b:CONTROL lnbcolorright ARRAY
b:CONTROL tvcollapse ARRAY
b:OBJECT inflame BOOL
b:BOOL or BOOL
b:BOOL or CODE
b:CONTROL menudelete ARRAY
b:CONTROL lnbsetcolumnspos ARRAY
b:CONTROL ctrlanimatemodel ARRAY
b:ARRAY,OBJECT say2d STRING
b:ARRAY,OBJECT say2d ARRAY
b:ARRAY,OBJECT commandchat STRING
b:STRING hintc STRING
b:STRING hintc TEXT
b:STRING hintc ARRAY
b:OBJECT setplatenumber STRING
b:CONTROL tvsetcursel ARRAY
b:ARRAY setwaypointvisible BOOL
b:ANY isequalto ANY
b:ARRAY,OBJECT nearobjects SCALAR,ARRAY
b:ARRAY vectorcrossproduct ARRAY
b:OBJECT hideobjectglobal BOOL
b:CONTROL lnbcolor ARRAY
b:TASK setsimpletaskdestination ARRAY
b:OBJECT directionstabilizationenabled ARRAY
b:ARRAY,OBJECT commandartilleryfire ARRAY
b:OBJECT setvehicleradar SCALAR
b:ARRAY,OBJECT dosuppressivefire ARRAY,OBJECT
b:OBJECT assignteam STRING
b:STRING callextension STRING
b:STRING callextension ARRAY
b:OBJECT kbhastopic STRING
b:CONTROL lnbaddcolumn SCALAR
b:OBJECT settriggeractivation ARRAY
b:OBJECT additemtovest STRING
b:OBJECT assignitem STRING
b:OBJECT adduniform STRING
b:OBJECT globalchat STRING
b:STRING regexmatch STRING
b:OBJECT,GROUP setbehaviourstrong STRING
b:CONTROL ctrlsetfonth3b STRING
b:CONTROL tvsortall ARRAY
b:CONTROL menutext ARRAY
b:CONTROL menushortcuttext ARRAY
b:OBJECT lockinventory BOOL
b:CONTROL tvsortbyvalueall ARRAY
b:OBJECT stop BOOL
b:ARRAY select SCALAR
b:ARRAY select BOOL
b:ARRAY select ARRAY
b:ARRAY select CODE
b:CONFIG select SCALAR
b:STRING select ARRAY
b:OBJECT setvehicleammo SCALAR
b:CONTROL lnbsetpicture ARRAY
b:OBJECT addweaponwithattachmentscargoglobal ARRAY
b:OBJECT,GROUP setcombatmode STRING
b:TEAM_MEMBER setcombatmode STRING
b:CONTROL tvsetvalue ARRAY
b:OBJECT setobjecttexture ARRAY
b:OBJECT assigntoairport SCALAR,OBJECT
b:OBJECT,GROUP enableattack BOOL
b:CONTROL createmenu SCALAR
b:SCALAR debugfsm BOOL
b:OBJECT camsetfovrange ARRAY
b:OBJECT synchronizeobjectsremove ARRAY
b:OBJECT addbinocularitem STRING
b:OBJECT modeltoworld ARRAY
b:ARRAY checkvisibility ARRAY
b:OBJECT kbremovetopic STRING
b:OBJECT settriggerarea ARRAY
b:OBJECT awake BOOL
b:LOCATION settext STRING
b:CONTROL menudata ARRAY
b:OBJECT campreparedive SCALAR
b:ARRAY setwaypointtimeout ARRAY
b:OBJECT enableaimprecision BOOL
b:OBJECT assignascargoindex ARRAY
b:OBJECT emptypositions STRING
b:STRING createvehicle ARRAY
b:ARRAY,OBJECT commandmove ARRAY
b:OBJECT ammo STRING
b:CONTROL ctsetrowtemplate CONFIG
b:OBJECT,GROUP allowfleeing SCALAR
b:OBJECT setflagowner OBJECT
b:ARRAY targetsaggregate ARRAY
b:OBJECT gethitpointdamage STRING
b:OBJECT leavevehicle OBJECT
b:GROUP leavevehicle OBJECT
b:OBJECT unassignitem STRING
b:LOCATION setspeech STRING
b:OBJECT addheadgear STRING
b:OBJECT setfeaturetype SCALAR
b:OBJECT setvectordirandup ARRAY
b:STRING regexreplace ARRAY
b:CONTROL lnbsetpicturecolor ARRAY
b:ARRAY,OBJECT commandtarget OBJECT
b:OBJECT flyinheight SCALAR
b:OBJECT lockdriver BOOL
b:GROUP addwaypoint ARRAY
b:OBJECT settriggertext STRING
b:SCALAR,NaN max SCALAR,NaN
b:OBJECT synchronizetrigger ARRAY
b:SCALAR,NaN min SCALAR,NaN
b:ARRAY vectordotproduct ARRAY
b:LOCATION setside SIDE
b:ANY set3denlayer SCALAR
b:CONTROL getobjectargument ARRAY
b:OBJECT addeventhandler ARRAY
b:GROUP addeventhandler ARRAY
b:OBJECT sethit ARRAY
b:CONTROL tvsetpicturerightcolorselected ARRAY
b:OBJECT removediaryrecord ARRAY
b:OBJECT settowparent OBJECT
b:ANY exec STRING
b:SCALAR setovercast SCALAR
b:ARRAY deleteat SCALAR
b:HASHMAP deleteat SCALAR,BOOL,ARRAY,STRING,NAMESPACE,NaN,CODE,SIDE,CONFIG
b:OBJECT getcargoindex OBJECT
b:SCALAR setradiomsg STRING
b:OBJECT setvehiclereportremotetargets BOOL
b:ARRAY,OBJECT setsoundeffect ARRAY
b:CONTROL menusetaction ARRAY
b:STRING objstatus STRING
b:CONTROL geteditorobjectscope STRING
b:OBJECT customchat ARRAY
b:OBJECT,GROUP move ARRAY
b:OBJECT setrotorbrakertd SCALAR
b:CONTROL ctsetcursel SCALAR
b:OBJECT currentvisionmode ARRAY
b:OBJECT currentvisionmode STRING
b:OBJECT removediarysubject STRING
b:ARRAY inrangeofartillery ARRAY
b:CONTROL listobjects STRING
b:OBJECT connectterminaltouav OBJECT
b:OBJECT setwingforcescalertd ARRAY
b:ARRAY deleterange ARRAY
b:CONTROL ctrladdeventhandler ARRAY
b:OBJECT setparticlefire ARRAY
b:CONTROL lbsetpicturecolorselected ARRAY
b:OBJECT setskill ARRAY
b:OBJECT setskill SCALAR
b:OBJECT removeweaponcargo ARRAY
b:OBJECT unlinkitem STRING
b:OBJECT currentmagazineturret ARRAY
b:ARRAY setwaypointloiteraltitude SCALAR
b:OBJECT,GROUP forgettarget OBJECT
b:OBJECT setbrakesrtd ARRAY
b:OBJECT worldtomodelvisual ARRAY
b:SCALAR faderadio SCALAR
b:OBJECT setoxygenremaining SCALAR
b:STRING iskindof STRING
b:STRING iskindof ARRAY
b:OBJECT iskindof STRING
b:CONTROL getobjectchildren STRING
b:OBJECT countfriendly ARRAY
b:OBJECT camcommand STRING
b:GROUP removegroupicon SCALAR
b:SCALAR publicvariableclient STRING
b:OBJECT vehiclechat STRING
b:SCALAR radiochanneladd ARRAY
b:LOCATION setimportance SCALAR
b:CONTROL ctrlsetmodelscale SCALAR
b:CONTROL lnbpicture ARRAY
b:WHILE do CODE
b:WITH do CODE
b:FOR do CODE
b:SWITCH do CODE
b:ARRAY findemptypositionready ARRAY
b:OBJECT enableautotrimrtd BOOL
b:OBJECT assignasdriver OBJECT
b:OBJECT periscopeelevation ARRAY
b:OBJECT enablecopilot BOOL
b:ARRAY lnbsortby ARRAY
b:CONTROL menuadd ARRAY
b:OBJECT checkaifeature STRING
b:OBJECT landat SCALAR,OBJECT
b:CONTROL onshownewobject STRING
b:ARRAY setwaypointloitertype STRING
b:OBJECT allowcrewinimmobile BOOL,ARRAY
b:STRING setmarkercolorlocal STRING
b:OBJECT settriggerstatements ARRAY
b:SCALAR setgusts SCALAR
b:OBJECT setrank STRING
b:STRING setmarkershape STRING
b:OBJECT settriggerinterval SCALAR
b:OBJECT,GROUP enableirlasers BOOL
b:SCALAR enablechannel BOOL
b:SCALAR enablechannel ARRAY
b:ANY clear3denattribute STRING
b:ARRAY getenvsoundcontroller STRING
b:CONTROL lnbtextright ARRAY
b:OBJECT canadditemtovest ARRAY,STRING
b:CONTROL tvsetpicturerightcolor ARRAY
b:SIDE addscoreside SCALAR
b:OBJECT enableropeattach BOOL
b:OBJECT setvehicleammodef SCALAR
b:OBJECT enableautostartuprtd BOOL
b:OBJECT setmagazineturretammo ARRAY
b:OBJECT gethidefrom OBJECT
b:CONTROL ondoubleclick STRING
b:OBJECT removeweaponattachmentcargo ARRAY
b:OBJECT setrepaircargo SCALAR
b:OBJECT setunconscious BOOL
b:GROUP setgroupicon ARRAY
b:ARRAY setwaypointbehaviour STRING
b:CONTROL slidersetspeed ARRAY
b:ARRAY inareaarray OBJECT
b:ARRAY inareaarray STRING
b:ARRAY inareaarray ARRAY
b:ARRAY inareaarray LOCATION
b:DISPLAY createdisplay STRING
b:CONTROL lnbvalue ARRAY
b:CONTROL tvpicture ARRAY
b:OBJECT setcuratorcoef ARRAY
b:CONTROL lnbsetpicturecolorselected ARRAY
b:OBJECT addcuratoreditableobjects ARRAY
b:OBJECT addbackpackglobal STRING
b:OBJECT kbwassaid ARRAY
b:CONTROL evalobjectargument ARRAY
b:OBJECT hcselectgroup ARRAY
b:ARRAY,OBJECT infopanelcomponents STRING
b:OBJECT getcompatiblepylonmagazines SCALAR,STRING
b:STRING getcompatiblepylonmagazines SCALAR,STRING
b:CONTROL menusetcheck ARRAY
b:OBJECT removecuratoreditableobjects ARRAY
b:STRING setmarkerpolylinelocal ARRAY
b:STRING createvehiclelocal ARRAY
b:CONTROL lnbsetcolorright ARRAY
b:OBJECT addbackpack STRING
b:CONTROL ctrlsetfontheightsecondary SCALAR
b:SCALAR setfsmvariable ARRAY
b:OBJECT campreparefovrange ARRAY
b:OBJECT moveincommander OBJECT
b:OBJECT groupselectunit ARRAY
b:CODE foreachmemberagent TEAM_MEMBER
b:CONTROL lnbsetcolor ARRAY
b:OBJECT fireattarget ARRAY
b:CONTROL ctrlseteventhandler ARRAY
b:OBJECT setdriveonpath ARRAY
b:OBJECT setenginerpmrtd ARRAY
b:CODE foreachmemberteam TEAM_MEMBER
b:OBJECT addownedmine OBJECT
b:CONTROL showneweditorobject ARRAY
b:ANY params ARRAY
b:OBJECT cameraeffect ARRAY
b:OBJECT getartilleryeta ARRAY
b:CONTROL lookatpos ARRAY
b:ARRAY,OBJECT dofsm ARRAY
b:OBJECT setobjectmaterial ARRAY
b:ARRAY,OBJECT getdirvisual ARRAY,OBJECT
b:OBJECT setvehiclecargo OBJECT
b:SCALAR fademusic SCALAR
b:OBJECT removealleventhandlers STRING
b:GROUP removealleventhandlers STRING
b:OBJECT camsetpos ARRAY
b:OBJECT joinas ARRAY
b:OBJECT moveingunner OBJECT
b:OBJECT campreparepos ARRAY
b:HASHMAP getordefault ARRAY
b:OBJECT alldiaryrecords STRING
b:STRING setmarkeralphalocal SCALAR
b:OBJECT disablecollisionwith OBJECT
b:ANY isequaltypearray ARRAY
b:OBJECT setvehiclelock STRING
b:OBJECT addprimaryweaponitem STRING
b:CONTROL lbsetcursel SCALAR
b:ARRAY,OBJECT seteffectcondition STRING
b:OBJECT aimedattarget ARRAY
b:CONTROL drawellipse ARRAY
b:OBJECT setactualcollectivertd SCALAR
b:OBJECT setpos ARRAY
b:CONTROL editobject STRING
b:CONTROL lnbsetpicturecolorright ARRAY
b:OBJECT allowdammage BOOL
b:OBJECT,GROUP setbehaviour STRING
b:SCALAR fadeenvironment SCALAR
b:OBJECT findnearestenemy ARRAY,OBJECT
b:ARRAY,OBJECT dowatch ARRAY
b:ARRAY,OBJECT dowatch OBJECT
b:OBJECT isirlaseron STRING
b:CONTROL ctrlsetmouseposition ARRAY
b:CONTROL ctrlsetfontheighth1 SCALAR
b:STRING setmarkersize ARRAY
b:ARRAY,OBJECT nearentities SCALAR,ARRAY
b:CONTROL tvsetpicturerightcolordisabled ARRAY
b:OBJECT lock BOOL
b:OBJECT lock SCALAR
b:OBJECT weaponaccessories STRING
b:CONTROL tvisselected ARRAY
b:OBJECT magazinesturret ARRAY
b:CONTROL ctrlsetfontheighth2 SCALAR
b:OBJECT campreparefocus ARRAY
b:OBJECT setpitch SCALAR
b:STRING setmarkeralpha SCALAR
b:CONTROL getobjectproxy STRING
b:CONTROL ctrlsettextselection ARRAY
b:OBJECT settaskmarkeroffset ARRAY
b:OBJECT setpilotcameradirection ARRAY
b:CONTROL ctrlsetfontheighth3 SCALAR
b:OBJECT settargetage STRING
b:OBJECT setpilotcameratarget ARRAY,OBJECT
b:OBJECT removesecondaryweaponitem STRING
b:OBJECT weaponaccessoriescargo ARRAY
b:OBJECT removeweapon STRING
b:CONTROL ctrlsetfontheighth4 SCALAR
b:CONTROL ctrlsetfontheighth5 SCALAR
b:CONTROL menusort ARRAY
b:CONTROL menusettext ARRAY
u:showradio BOOL
u:vectorup OBJECT
u:lnbsetcurselrow ARRAY
u:animationnames OBJECT
u:currentzeroing OBJECT
u:isonroad ARRAY,OBJECT
u:triggerarea OBJECT
u:settrafficspeed ARRAY
u:supportinfo STRING
u:taskdescription TASK
u:get3dengrid STRING
u:menucollapse ARRAY
u:isautohoveron OBJECT
u:ctrlangle CONTROL
u:moonphase ARRAY
u:onplayerdisconnected STRING,CODE
u:isshowing3dicons CONTROL
u:lbsetcolor ARRAY
u:getallhitpointsdamage OBJECT
u:lbsetcolorright ARRAY
u:getobjectscale OBJECT
u:menusetdata ARRAY
u:triggertext OBJECT
u:getfatigue OBJECT
u:ctrlshown CONTROL
u:eyedirection OBJECT
u:ctrlmodel CONTROL
u:tvtext ARRAY
u:trim STRING
u:ropeunwind ARRAY
u:fillweaponsfrompool OBJECT
u:hcselected OBJECT
u:asltoagl ARRAY
u:isobjectrtd OBJECT
u:enabletraffic BOOL
u:roledescription OBJECT
u:simpletasks OBJECT
u:getammocargo OBJECT
u:flagowner OBJECT
u:deletegroup GROUP
u:isclass CONFIG
u:tvdata ARRAY
u:getenginetargetrpmrtd OBJECT
u:waypointattachedvehicle ARRAY
u:speed OBJECT
u:keys HASHMAP
u:reloadenabled OBJECT
u:rating OBJECT
u:hideobject OBJECT
u:useaiopermapobstructiontest BOOL
u:primaryweapon OBJECT
u:addtoremainscollector ARRAY
u:connecttoserver ARRAY
u:uisleep SCALAR
u:ctrlmodelscale CONTROL
u:curatorcameraareaceiling OBJECT
u:menusetvalue ARRAY
u:removevest OBJECT
u:gearslotdata CONTROL
u:formationposition OBJECT
u:displayuniquename DISPLAY
u:gettrimoffsetrtd OBJECT
u:getmissionconfigvalue ARRAY,STRING
u:getuserinfo STRING
u:simulcloudocclusion ARRAY
u:movetofailed OBJECT
u:playmission ARRAY
u:rankid OBJECT
u:showgps BOOL
u:synchronizedtriggers ARRAY
u:removeallitemswithmagazines OBJECT
u:setaperturenew ARRAY
u:getallenv3dsoundcontrollers OBJECT
u:getplayervonvolume OBJECT
u:setinfopanel ARRAY
u:simulinclouds ARRAY
u:isarray CONFIG
u:leaderboardsrequestuploadscorekeepbest ARRAY
u:removebackpackglobal OBJECT
u:exportjipmessages STRING
u:ctrlhtmlloaded CONTROL
u:getmarkercolor STRING
u:markeralpha STRING
u:face OBJECT
u:lbsetselectcolorright ARRAY
u:getattacktarget OBJECT
u:getvehiclecargo OBJECT
u:deletelocation LOCATION
u:menuurl ARRAY
u:ceil SCALAR,NaN
u:waypointvisible ARRAY
u:enablesatnormalondetail BOOL
u:getposatl OBJECT
u:objectcurators OBJECT
u:activatekey STRING
u:disableremotesensors BOOL
u:attackenabled OBJECT,GROUP
u:curatoreditingarea OBJECT
u:setterrainheight ARRAY
u:alldiarysubjects OBJECT
u:playmusic STRING
u:playmusic ARRAY
u:assignedteam OBJECT
u:vectordirvisual OBJECT
u:lnbsetvalue ARRAY
u:triggeractivated OBJECT
u:unassignvehicle OBJECT
u:boundingbox OBJECT
u:activetitleeffectparams SCALAR
u:geteventhandlerinfo ARRAY
u:ppeffectcreate ARRAY
u:set3denmissionattributes ARRAY
u:movetime OBJECT
u:waypointspeed ARRAY
u:tvpictureright ARRAY
u:if BOOL
u:ctrltext CONTROL
u:ctrltext SCALAR
u:ctrlclassname CONTROL
u:getcustomsoundcontrollercount OBJECT
u:markershadow STRING
u:getsensortargets OBJECT
u:actionname STRING
u:animationstate OBJECT
u:markertype STRING
u:lineintersectsobjs ARRAY
u:weaponcargo OBJECT
u:enableweapondisassembly BOOL
u:menuchecked ARRAY
u:buttonaction CONTROL
u:buttonaction SCALAR
u:hcshowbar BOOL
u:drop ARRAY
u:isturnedout OBJECT
u:removeallsecondaryweaponitems OBJECT
u:addweaponpool ARRAY
u:camtarget OBJECT
u:issimpleobject OBJECT
u:set3deniconsvisible ARRAY
u:setwinddir ARRAY
u:reverse ARRAY
u:reverse STRING
u:getcameraviewdirection OBJECT
u:slidersetrange ARRAY
u:textlogformat ARRAY
u:set3denattributes ARRAY
u:deletemarkerlocal STRING
u:lnbsettext ARRAY
u:exp SCALAR,NaN
u:waypointstatements ARRAY
u:scudstate OBJECT
u:sliderrange CONTROL
u:sliderrange SCALAR
u:isautotrimonrtd OBJECT
u:boundingboxreal OBJECT
u:terrainintersect ARRAY
u:ropedestroy OBJECT
u:tvsetpictureright ARRAY
u:ctrlbackgroundcolor CONTROL
u:createteam ARRAY
u:floor SCALAR,NaN
u:lnbsettextright ARRAY
u:param ARRAY
u:lbsetpicturecolordisabled ARRAY
u:setcamshakeparams ARRAY
u:lognetwork ARRAY
u:abs SCALAR,NaN
u:debriefingtext STRING
u:lnbsortbyvalue ARRAY
u:istouchingground OBJECT
u:taskmarkeroffset OBJECT
u:aisfinishheal ARRAY
u:tvsetpicture ARRAY
u:vest OBJECT
u:headgear OBJECT
u:lnbsetdata ARRAY
u:fuel OBJECT
u:agltoasl ARRAY
u:weaponsitemscargo OBJECT
u:linearconversion ARRAY
u:getforcedspeed OBJECT
u:removemissioneventhandler ARRAY
u:damage OBJECT
u:getmodelinfo OBJECT
u:str ANY
u:tostring ARRAY
u:tostring CODE
u:dogetout ARRAY,OBJECT
u:getbleedingremaining OBJECT
u:squadparams OBJECT
u:groupfromnetid STRING
u:leader OBJECT
u:leader GROUP
u:leader TEAM_MEMBER
u:settrafficdistance SCALAR
u:currentthrowable OBJECT
u:ctaddrow CONTROL
u:enableengineartillery BOOL
u:terrainintersectasl ARRAY
u:debuglog ANY
u:lnbsetpicturecolorselectedright ARRAY
u:lnbaddarray ARRAY
u:savevar STRING
u:onbriefingteamswitch STRING
u:lbsetvalue ARRAY
u:uniformitems OBJECT
u:getcustomaimcoef OBJECT
u:ingameuiseteventhandler ARRAY
u:leaderboardrequestrowsfriends STRING
u:edit3denmissionattributes STRING
u:showcommandingmenu STRING
u:unitrecoilcoefficient OBJECT
u:unassigncurator OBJECT
u:actionkeysnames ARRAY,STRING
u:alllods STRING,OBJECT
u:objectparent OBJECT
u:clearmagazinecargo OBJECT
u:hostmission ARRAY
u:canmove OBJECT
u:getstatvalue STRING
u:tvsettext ARRAY
u:positioncameratoworld ARRAY
u:getwingsorientationrtd OBJECT
u:isstaminaenabled OBJECT
u:getusermfdtext OBJECT
u:weaponsitems OBJECT
u:vectornormalized ARRAY
u:unitbackpack OBJECT
u:finite SCALAR,NaN
u:lnbtext ARRAY
u:teamname TEAM_MEMBER
u:pickweaponpool OBJECT
u:surfaceiswater ARRAY
u:freeextension STRING
u:getslingload OBJECT
u:getallpylonsinfo OBJECT
u:reload OBJECT
u:tvsetdata ARRAY
u:allvariables CONTROL
u:allvariables DISPLAY
u:allvariables TEAM_MEMBER
u:allvariables NAMESPACE
u:allvariables OBJECT
u:allvariables GROUP
u:allvariables TASK
u:allvariables LOCATION
u:setterraingrid SCALAR
u:speaker OBJECT
u:lbsettooltip ARRAY
u:weapons OBJECT
u:selectededitorobjects CONTROL
u:leaderboardsrequestuploadscore ARRAY
u:removeall3deneventhandlers STRING
u:lnbdata ARRAY
u:unitisuav OBJECT
u:lbadd ARRAY
u:lnbclear CONTROL
u:lnbclear SCALAR
u:assignedtarget OBJECT
u:cameraeffectenablehud BOOL
u:execfsm STRING
u:attachedto OBJECT
u:showuavfeed BOOL
u:querymagazinepool STRING
u:effectivecommander OBJECT
u:sizeof STRING
u:configof OBJECT
u:compilescript ARRAY
u:landresult OBJECT
u:cbchecked CONTROL
u:onhcgroupselectionchanged STRING,CODE
u:ctrlscale CONTROL
u:asin SCALAR,NaN
u:lbtext ARRAY
u:clearweaponcargoglobal OBJECT
u:assigneddriver OBJECT
u:allcontrols DISPLAY
u:allcontrols CONTROL
u:getcruisecontrol OBJECT
u:taskresult TASK
u:lbpicture ARRAY
u:numbertodate ARRAY
u:leaderboardstate STRING
u:tvsetpicturecolor ARRAY
u:secondaryweaponmagazine OBJECT
u:flaganimationphase OBJECT
u:setaperture SCALAR
u:assignedgroup OBJECT
u:gettowparent OBJECT
u:do3denaction STRING
u:showpad BOOL
u:ctrlidc CONTROL
u:getdir OBJECT
u:uniformcontainer OBJECT
u:lbsortbyvalue CONTROL
u:lbsortbyvalue SCALAR
u:isplayer OBJECT
u:isplayer ARRAY
u:buldozer_enableroaddiag BOOL
u:campreloaded OBJECT
u:terrainintersectatasl ARRAY
u:local OBJECT
u:local GROUP
u:drawicon3d ARRAY
u:surfacetype ARRAY
u:lbdata ARRAY
u:lbdelete ARRAY
u:getvehicletipars OBJECT
u:createhashmapfromarray ARRAY
u:boundingcenter OBJECT
u:enablediaglegend BOOL
u:ctrlidd DISPLAY
u:fleeing OBJECT
u:getgroupiconparams GROUP
u:cutobj ARRAY
u:iscopilotenabled OBJECT
u:maxload OBJECT
u:uniform OBJECT
u:commandgetout ARRAY,OBJECT
u:wfsidetext SIDE
u:wfsidetext OBJECT
u:wfsidetext GROUP
u:tvexpandall SCALAR
u:tvexpandall CONTROL
u:velocitymodelspace OBJECT
u:getallownedmines OBJECT
u:onpreloadstarted STRING,CODE
u:modparams ARRAY
u:flagtexture OBJECT
u:getfuelcargo OBJECT
u:groupid GROUP
u:groupid OBJECT
u:rotorsrpmrtd OBJECT
u:waypointloiterradius ARRAY
u:size LOCATION
u:delete3denentities ARRAY
u:captivenum OBJECT
u:waypointtimeout ARRAY
u:tvsort ARRAY
u:selectionnames OBJECT
u:lbselection CONTROL
u:position OBJECT
u:position LOCATION
u:canunloadincombat OBJECT
u:attachedobjects OBJECT
u:netid OBJECT
u:netid GROUP
u:waypointcompletionradius ARRAY
u:removeallassigneditems OBJECT
u:addonfiles ARRAY
u:sethumidity SCALAR
u:ropeunwound OBJECT
u:waypointposition ARRAY
u:isdlcavailable SCALAR
u:waypointtype ARRAY
u:addswitchableunit OBJECT
u:closeoverlay CONTROL
u:tvexpand ARRAY
u:getartilleryammo ARRAY
u:tvadd ARRAY
u:owner OBJECT
u:progressloadingscreen SCALAR
u:estimatedtimeleft SCALAR
u:driver OBJECT
u:displayparent DISPLAY
u:sleep SCALAR
u:primaryweaponmagazine OBJECT
u:ctrlparentcontrolsgroup CONTROL
u:actionkeysimages ARRAY,STRING
u:enablesentences BOOL
u:sin SCALAR,NaN
u:while CODE
u:try CODE
u:curatoreditableobjects OBJECT
u:entities STRING
u:entities ARRAY
u:tvcount ARRAY
u:create3denentity ARRAY
u:setgroupiconsselectable BOOL
u:showwarrant BOOL
u:assigneditems OBJECT
u:copytoclipboard STRING
u:! BOOL
u:groupselectedunits OBJECT
u:titlefadeout SCALAR
u:atltoasl ARRAY
u:loaduniform OBJECT
u:islaseron OBJECT
u:someammo OBJECT
u:toarray STRING
u:toarray HASHMAP
u:setwind ARRAY
u:groupowner GROUP
u:isweaponrested OBJECT
u:isaimprecisionenabled OBJECT
u:isagent TEAM_MEMBER
u:commander OBJECT
u:toupperansi STRING
u:markerpos STRING
u:markerpos ARRAY
u:leaderboardinit STRING
u:taskcustomdata TASK
u:lnbdeletecolumn ARRAY
u:incapacitatedstate OBJECT
u:opensteamapp SCALAR
u:saveoverlay CONTROL
u:magazinesallturrets ARRAY,OBJECT
u:collectivertd OBJECT
u:tvdelete ARRAY
u:format ARRAY
u:insidebuilding OBJECT
u:infopanel STRING
u:getpylonmagazines OBJECT
u:taskcompleted TASK
u:playsound3d ARRAY
u:getanimaimprecision OBJECT
u:execvm STRING
u:waypointformation ARRAY
u:cantriggerdynamicsimulation OBJECT
u:vehiclemoveinfo OBJECT
u:ongroupiconoverenter STRING,CODE
u:backpackmagazines OBJECT
u:cutrsc ARRAY
u:comment STRING
u:weaponlowered OBJECT
u:handshit OBJECT
u:selectbestplaces ARRAY
u:removeallcuratorcameraareas OBJECT
u:taskparent TASK
u:get3denconnections ANY
u:triggertype OBJECT
u:hidebody OBJECT
u:lnbsettooltip ARRAY
u:showchat BOOL
u:case ANY
u:getpilotcameratarget OBJECT
u:triggerammo OBJECT
u:missiletarget OBJECT
u:menuenabled ARRAY
u:scoreside SIDE
u:behaviour OBJECT
u:getmagazinecargo OBJECT
u:nearestterrainobjects ARRAY
u:lifestate OBJECT
u:issprintallowed OBJECT
u:triggerinterval OBJECT
u:setpipviewdistance SCALAR
u:classname LOCATION
u:difficultyoption STRING
u:getfieldmanualstartpage DISPLAY
u:islocalized STRING
u:triggertimeout OBJECT
u:remoteexec ARRAY
u:ctcursel CONTROL
u:units GROUP
u:units OBJECT
u:units SIDE
u:removeallcontainers OBJECT
u:hcleader GROUP
u:systemchat STRING
u:detectedmines SIDE
u:getobjecttype OBJECT
u:inputmouse SCALAR
u:inputmouse STRING
u:getturretopticsmode OBJECT
u:ropeattachedto OBJECT
u:diag_codeperformance ARRAY
u:inputaction STRING
u:oncommandmodechanged STRING,CODE
u:movetocompleted OBJECT
u:requiredversion STRING
u:lnbaddrow ARRAY
u:+ SCALAR,NaN
u:+ ARRAY
u:+ HASHMAP
u:textlog ANY
u:openyoutubevideo STRING
u:combatmode OBJECT,GROUP
u:ppeffectdestroy SCALAR
u:ppeffectdestroy ARRAY
u:canstand OBJECT
u:vectormagnitude ARRAY
u:add3deneventhandler ARRAY
u:rotorsforcesrtd OBJECT
u:count ARRAY
u:count STRING
u:count CONFIG
u:count HASHMAP
u:- SCALAR,NaN
u:formationleader OBJECT
u:getplatenumber OBJECT
u:displayctrl SCALAR
u:radiochannelcreate ARRAY
u:enginestorquertd OBJECT
u:isengineon OBJECT
u:uniqueunititems ARRAY,OBJECT
u:needservice OBJECT
u:for STRING
u:for ARRAY
u:getforcedflagtexture OBJECT
u:collapseobjecttree CONTROL
u:waypointhouseposition ARRAY
u:getplayerscores OBJECT
u:enableradio BOOL
u:scriptdone SCRIPT
u:skill OBJECT
u:settimemultiplier SCALAR
u:waypointtimeoutcurrent GROUP
u:magazinecargo OBJECT
u:decaygraphvalues ARRAY
u:ropecut ARRAY
u:creatediarylink ARRAY
u:add3denconnection ARRAY
u:backpack OBJECT
u:ctrlmapanimcommit CONTROL
u:mapanimadd ARRAY
u:surfacenormal ARRAY
u:lineintersectswith ARRAY
u:hcremoveallgroups OBJECT
u:waituntil CODE
u:getposworld OBJECT
u:toupper STRING
u:showwatch BOOL
u:configsourcemodlist CONFIG
u:createtrigger ARRAY
u:getstamina OBJECT
u:waypointshow ARRAY
u:ctrltype CONTROL
u:getmass OBJECT
u:weaponstate OBJECT
u:weaponstate ARRAY
u:lbpictureright ARRAY
u:load OBJECT
u:loadabs OBJECT
u:removeswitchableunit OBJECT
u:inheritsfrom CONFIG
u:lnbsort ARRAY
u:forceunicode SCALAR
u:loadconfig STRING
u:islighton ARRAY,OBJECT
u:simulationenabled OBJECT
u:currentmagazinedetail OBJECT
u:onmapsingleclick STRING,CODE
u:screenshot STRING
u:unitaimpositionvisual OBJECT
u:actionids OBJECT
u:everybackpack OBJECT
u:asltoatl ARRAY
u:vehiclereceiveremotetargets OBJECT
u:listvehiclesensors OBJECT
u:sethudmovementlevels ARRAY
u:currentmuzzle OBJECT
u:selectionposition ARRAY
u:ctrlautoscrollspeed CONTROL
u:currentweaponmode OBJECT
u:getwingspositionrtd OBJECT
u:waypointloitertype ARRAY
u:name OBJECT
u:name LOCATION
u:onbriefinggroup STRING
u:ropesattachedto OBJECT
u:locationposition LOCATION
u:importance LOCATION
u:set3denmodelsvisible ARRAY
u:captive OBJECT
u:isweapondeployed OBJECT
u:isweapondeployed ARRAY
u:assert BOOL
u:keyimage SCALAR,STRING
u:removeallweapons OBJECT
u:titleobj ARRAY
u:lbsort CONTROL
u:lbsort ARRAY
u:lbsort SCALAR
u:vehiclevarname OBJECT
u:triggertimeoutcurrent OBJECT
u:menushortcut ARRAY
u:ctrlmodeldirandup CONTROL
u:assignedgunner OBJECT
u:setmouseposition ARRAY
u:terminate SCRIPT
u:soldiermagazines OBJECT
u:getmarkerpos STRING
u:getmarkerpos ARRAY
u:endmission STRING
u:leaderboardrequestrowsglobal ARRAY
u:magazinesammo ARRAY,OBJECT
u:getunitfreefallinfo OBJECT
u:getcorpse OBJECT
u:removeuniform OBJECT
u:faction OBJECT
u:ctrltextsecondary CONTROL
u:lnbpictureright ARRAY
u:servercommandavailable STRING
u:geteditormode CONTROL
u:removeallprimaryweaponitems OBJECT
u:getdiverstate OBJECT
u:getunloadincombat OBJECT
u:diag_lightnewload STRING
u:clear3deninventory ARRAY
u:verifysignature STRING
u:group OBJECT
u:allturrets ARRAY
u:allturrets OBJECT
u:restarteditorcamera CONTROL
u:camcommitted OBJECT
u:tvtooltip ARRAY
u:startloadingscreen ARRAY
u:ctrlsettext ARRAY
u:listremotetargets SIDE
u:vectorlinearconversion ARRAY
u:currenttask OBJECT
u:menuhover CONTROL
u:menuhover SCALAR
u:flagside OBJECT
u:isinremainscollector OBJECT
u:nearestobject ARRAY
u:magazinesammocargo OBJECT
u:ctrlstyle CONTROL
u:setplayable OBJECT
u:unlockachievement STRING
u:getallunittraits OBJECT
u:forcecadetdifficulty ARRAY
u:removeallbinocularitems OBJECT
u:collisiondisabledwith OBJECT
u:groups SIDE
u:lbsettext ARRAY
u:isautonomous OBJECT
u:additempool ARRAY
u:lnbdeleterow ARRAY
u:throw ANY
u:getmissionlayerentities SCALAR,STRING
u:dissolveteam STRING
u:publicvariableserver STRING
u:handgunmagazine OBJECT
u:getoxygenremaining OBJECT
u:progressposition CONTROL
u:tvvalue ARRAY
u:vehicle OBJECT
u:buldozer_loadnewroads STRING
u:removeallactions OBJECT
u:vectormagnitudesqr ARRAY
u:getnumber CONFIG
u:servercommand STRING
u:attachedobject LOCATION
u:everycontainer OBJECT
u:ctrlautoscrollrewind CONTROL
u:stopenginertd OBJECT
u:preprocessfilelinenumbers STRING
u:gunner OBJECT
u:lbsetdata ARRAY
u:continuewith ANY
u:diag_localized STRING
u:actionkeysex STRING
u:isvehiclecargo OBJECT
u:agent TEAM_MEMBER
u:openmap ARRAY
u:openmap BOOL
u:playsound STRING
u:playsound ARRAY
u:dostop ARRAY,OBJECT
u:oneachframe STRING,CODE
u:lightdetachobject OBJECT
u:getconnecteduavunit OBJECT
u:getpersonuseddlcs OBJECT
u:getgroupicons GROUP
u:getwppos ARRAY
u:isallowedcrewinimmobile OBJECT
u:action ARRAY
u:playsoundui ARRAY
u:setsimulweatherlayers SCALAR
u:getdescription OBJECT
u:ropeendposition OBJECT
u:taskname TASK
u:text STRING
u:text LOCATION
u:items OBJECT
u:showcinemaborder BOOL
u:ctrlautoscrolldelay CONTROL
u:onpreloadfinished STRING,CODE
u:getobjectid OBJECT
u:nearestlocation ARRAY
u:getrepaircargo OBJECT
u:titlersc ARRAY
u:setcurrentchannel SCALAR
u:lbsetpictureright ARRAY
u:pitch OBJECT
u:onbriefingplan STRING
u:isvehicleradaron OBJECT
u:menusize ARRAY
u:formattext ARRAY
u:camerainterest OBJECT
u:removeheadgear OBJECT
u:side OBJECT
u:side GROUP
u:side LOCATION
u:completedfsm SCALAR
u:toloweransi STRING
u:playableslotsnumber SIDE
u:servercommandexecutable STRING
u:enablesaving BOOL,ARRAY
u:lockedinventory OBJECT
u:unitcombatmode OBJECT
u:queryitemspool STRING
u:isformationleader OBJECT
u:numberofenginesrtd OBJECT
u:velocity OBJECT
u:setplayerrespawntime SCALAR
u:preloadsound STRING
u:getallsoundcontrollers OBJECT
u:setviewdistance SCALAR
u:rad SCALAR,NaN
u:getcustomsoundcontroller ARRAY
u:infopanels ARRAY,OBJECT
u:remove3denconnection ARRAY
u:getmarkertype STRING
u:magazinesdetail ARRAY,OBJECT
u:markersize STRING
u:ctrlshow ARRAY
u:waypointattachedobject ARRAY
u:ishidden OBJECT
u:preloadtitleobj ARRAY
u:tvcollapseall SCALAR
u:tvcollapseall CONTROL
u:ctrlparent CONTROL
u:diag_dynamicsimulationend STRING
u:registeredtasks TEAM_MEMBER
u:ctheadercount CONTROL
u:deg SCALAR,NaN
u:forceatpositionrtd ARRAY
u:actionkeysnamesarray ARRAY,STRING
u:titlecut ARRAY
u:configsourceaddonlist CONFIG
u:disableuserinput BOOL
u:aimpos OBJECT
u:nearestmines ARRAY
u:ropesegments OBJECT
u:cancelsimpletaskdestination TASK
u:set3denlinesvisible ARRAY
u:menuaction ARRAY
u:clearweaponcargo OBJECT
u:enableenvironment BOOL,ARRAY
u:markercolor STRING
u:createsimpleobject ARRAY
u:airportside SCALAR,OBJECT
u:assignedvehiclerole OBJECT
u:lnbgetcolumnsposition CONTROL
u:lnbgetcolumnsposition SCALAR
u:displaychild DISPLAY
u:enableteamswitch BOOL
u:waypointforcebehaviour ARRAY
u:precision OBJECT
u:ropes OBJECT
u:lbcolor ARRAY
u:settrafficdensity ARRAY
u:call CODE
u:createsoundsource ARRAY
u:backpackcontainer OBJECT
u:vectorupvisual OBJECT
u:istext CONFIG
u:leaderboardrequestrowsglobalarounduser ARRAY
u:vectordir OBJECT
u:clearbackpackcargoglobal OBJECT
u:compatibleitems ARRAY,STRING
u:equipmentdisabled OBJECT
u:getdlcusagetime SCALAR
u:members TEAM_MEMBER
u:worldtoscreen ARRAY
u:teamtype TEAM_MEMBER
u:removeallhandgunitems OBJECT
u:private ARRAY,STRING
u:radiochannelinfo SCALAR
u:curatoreditingareatype OBJECT
u:magazinesdetailbackpack ARRAY,OBJECT
u:with NAMESPACE
u:allsimpleobjects ARRAY
u:ctrlmapscale CONTROL
u:createdialog STRING
u:createdialog ARRAY
u:currentwaypoint GROUP
u:createmarker ARRAY
u:magazinesammofull ARRAY,OBJECT
u:hashvalue SCALAR,BOOL,ARRAY,STRING,NAMESPACE,NaN,CODE,OBJECT,SIDE,GROUP,CONFIG
u:drawlaser ARRAY
u:hint STRING,TEXT
u:putweaponpool OBJECT
u:getobjectdlc OBJECT
u:enabledebriefingstats ARRAY
u:goto STRING
u:deletewaypoint ARRAY
u:setshadowdistance SCALAR
u:tvsortbyvalue ARRAY
u:lockidentity OBJECT
u:typeof OBJECT
u:deletevehiclecrew OBJECT
u:score OBJECT
u:matrixtranspose ARRAY
u:gettextureinfo STRING
u:isawake OBJECT
u:lbsetpicturecolor ARRAY
u:nextmenuitemindex CONTROL
u:lasertarget OBJECT
u:unitready ARRAY,OBJECT
u:showmap BOOL
u:deletemarker STRING
u:isautostartupenabledrtd OBJECT
u:allmissionobjects STRING
u:getcenterofmass OBJECT
u:surfacetexture ARRAY
u:stance OBJECT
u:curatorpoints OBJECT
u:lbtextright ARRAY
u:alive OBJECT
u:getterrainheightasl ARRAY
u:crew OBJECT
u:triggerattachedvehicle OBJECT
u:rank OBJECT
u:getlightingat OBJECT
u:settiparameter ARRAY
u:getrotorbrakertd OBJECT
u:itemswithmagazines OBJECT
u:selectmax ARRAY
u:selectmin ARRAY
u:isbleeding OBJECT
u:isrealtime CONTROL
u:ctrlactivate CONTROL
u:acos SCALAR,NaN
u:ctrlshadow CONTROL
u:assignedvehicles GROUP
u:processdiarylink STRING
u:lbcolorright ARRAY
u:namesound OBJECT
u:isnil STRING,CODE
u:locked OBJECT
u:ctrlenable ARRAY
u:getdlcassetsusagebyname STRING
u:clearbackpackcargo OBJECT
u:binocularitems OBJECT
u:setrain ARRAY
u:setrain CONFIG
u:menupicture ARRAY
u:cuttext ARRAY
u:formationdirection OBJECT
u:creategroup ARRAY,SIDE
u:preloadtitlersc ARRAY
u:getweaponcargo OBJECT
u:isabletobreathe OBJECT
u:getassignedcuratorunit OBJECT
u:ctrlcommitted CONTROL
u:ctrlmapanimdone CONTROL
u:setgroupiconsvisible ARRAY
u:gearslotammocount CONTROL
u:enginespowerrtd OBJECT
u:markerbrush STRING
u:sethorizonparallaxcoef SCALAR
u:echo STRING
u:dynamicsimulationenabled OBJECT
u:dynamicsimulationenabled GROUP
u:get3denentity SCALAR
u:hcallgroups OBJECT
u:setcamshakedefparams ARRAY
u:diag_log ANY
u:screentoworld ARRAY
u:default CODE
u:currentcommand OBJECT
u:sliderposition CONTROL
u:sliderposition SCALAR
u:unitpos OBJECT
u:finddisplay SCALAR
u:finddisplay STRING
u:itemcargo OBJECT
u:getusermfdvalue OBJECT
u:allowedservice OBJECT
u:menuenable ARRAY
u:secondaryweaponitems OBJECT
u:createmarkerlocal ARRAY
u:round SCALAR,NaN
u:deleteidentity STRING
u:getaimingcoef OBJECT
u:breakout STRING
u:ropeattachedobjects OBJECT
u:menuvalue ARRAY
u:lbsetselectcolor ARRAY
u:mineactive OBJECT
u:enablestressdamage BOOL
u:mapcenteroncamera CONTROL
u:ctaddheader CONTROL
u:lbsetpicture ARRAY
u:handgunweapon OBJECT
u:activateaddons ARRAY
u:addmagazinepool ARRAY
u:synchronizedwaypoints OBJECT
u:synchronizedwaypoints ARRAY
u:vehiclecargoenabled OBJECT
u:compilefinal STRING
u:cos SCALAR,NaN
u:taskhint ARRAY
u:moveout OBJECT
u:setstatvalue ARRAY
u:deleteteam TEAM_MEMBER
u:getobjectfov OBJECT
u:get3denactionstate STRING
u:save3deninventory ARRAY
u:createagent ARRAY
u:importallgroups CONTROL
u:selectrandomweighted ARRAY
u:assignedvehicle OBJECT
u:expecteddestination OBJECT
u:goggles OBJECT
u:removeallcuratoraddons OBJECT
u:random ARRAY
u:random SCALAR,NaN
u:objectfromnetid STRING
u:menusetshortcut ARRAY
u:ctrlchecked CONTROL
u:tvsettooltip ARRAY
u:isburning OBJECT
u:getobjectmaterials OBJECT
u:getplayeruid OBJECT
u:airplanethrottle OBJECT
u:binocular OBJECT
u:getweaponsway OBJECT
u:handgunitems OBJECT
u:removeallcuratoreditingareas OBJECT
u:waypointloiteraltitude ARRAY
u:skiptime SCALAR
u:getpos OBJECT
u:getpos LOCATION
u:curatorcameraarea OBJECT
u:enableaudiofeature ARRAY
u:publicvariable STRING
u:showscoretable SCALAR
u:tofixed SCALAR
u:create3dencomposition ARRAY
u:collect3denhistory CODE
u:backpackcargo OBJECT
u:getobjecttextures OBJECT
u:vestmagazines OBJECT
u:curatoraddons OBJECT
u:dynamicsimulationdistancecoef STRING
u:compatiblemagazines ARRAY,STRING
u:secondaryweapon OBJECT
u:atan SCALAR,NaN
u:nearestobjects ARRAY
u:getposvisual OBJECT
u:deletecollection OBJECT
u:triggerstatements OBJECT
u:switch ANY
u:inputcontroller SCALAR
u:priority TASK
u:get3denlayerentities SCALAR
u:setlocalwindparams ARRAY
u:lbvalue ARRAY
u:createcenter SIDE
u:getposaslw OBJECT
u:getposworldvisual OBJECT
u:menuexpand ARRAY
u:menusetpicture ARRAY
u:atg SCALAR,NaN
u:lineintersectssurfaces ARRAY
u:candeployweapon OBJECT
u:ongroupiconoverleave STRING,CODE
u:camdestroy OBJECT
u:curatorwaypointcost OBJECT
u:slidersetposition ARRAY
u:ismarkedforcollection OBJECT
u:getassignedcuratorlogic OBJECT
u:adduseractioneventhandler ARRAY
u:diag_setlightnew STRING
u:triggeractivation OBJECT
u:ctrldelete CONTROL
u:parsetext STRING
u:teammember OBJECT
u:actionkeys STRING
u:actionkeys ARRAY
u:waypointbehaviour ARRAY
u:preloadcamera ARRAY
u:parsenumber STRING
u:parsenumber BOOL
u:ctrltooltip CONTROL
u:deletecenter SIDE
u:ctrlfontheight CONTROL
u:remoteexeccall ARRAY
u:setstaminascheme STRING
u:parsesimplearray STRING
u:rectangular LOCATION
u:addmusiceventhandler ARRAY
u:resetsubgroupdirection OBJECT
u:lognetworkterminate SCALAR
u:channelenabled SCALAR
u:lnbsetpictureright ARRAY
u:getroadinfo OBJECT
u:cleargroupicons GROUP
u:setcustomsoundcontroller ARRAY
u:taskdestination TASK
u:taskalwaysvisible TASK
u:move3dencamera ARRAY
u:vestitems OBJECT
u:log SCALAR,NaN
u:switchcamera OBJECT
u:setcustommissiondata ARRAY
u:currentpilot OBJECT
u:markerpolyline STRING
u:ppeffectcommitted STRING
u:ppeffectcommitted SCALAR
u:menuseturl ARRAY
u:buttonsetaction ARRAY
u:lbtooltip ARRAY
u:fromeditor TEAM_MEMBER
u:waypointsenableduav OBJECT
u:lnbcolorright ARRAY
u:tvcollapse ARRAY
u:airdensityrtd SCALAR
u:fileexists STRING
u:menudelete ARRAY
u:keyname SCALAR,STRING
u:closedialog SCALAR
u:lnbsetcolumnspos ARRAY
u:commandstop ARRAY,OBJECT
u:scriptname STRING
u:list OBJECT
u:disablemapindicators ARRAY
u:hintc STRING
u:isfinal STRING,CODE
u:displayupdate DISPLAY
u:tan SCALAR,NaN
u:detach OBJECT
u:needreload OBJECT
u:waypointdescription ARRAY
u:image STRING
u:brakesdisabled OBJECT
u:values HASHMAP
u:tvsetcursel ARRAY
u:tvclear SCALAR
u:tvclear CONTROL
u:isnull OBJECT
u:isnull GROUP
u:isnull SCRIPT
u:isnull CONFIG
u:isnull DISPLAY
u:isnull CONTROL
u:isnull TEAM_MEMBER
u:isnull NetObject
u:isnull TASK
u:isnull DIARY_RECORD
u:isnull LOCATION
u:setacctime SCALAR
u:removebackpack OBJECT
u:hideobjectglobal OBJECT
u:ctrlmapposition CONTROL
u:lnbcolor ARRAY
u:getsensorthreats OBJECT
u:remove3denlayer SCALAR
u:lnbcurselrow CONTROL
u:lnbcurselrow SCALAR
u:getbackpackcargo OBJECT
u:typename ANY
u:getshotparents OBJECT
u:curatorregisteredobjects OBJECT
u:ctrlenabled CONTROL
u:ctrlenabled SCALAR
u:removeallmusiceventhandlers STRING
u:gesturestate OBJECT
u:playersnumber SIDE
u:onplayerconnected STRING,CODE
u:lnbaddcolumn ARRAY
u:mapgridposition ARRAY,OBJECT
u:ropeattachenabled OBJECT
u:menutext ARRAY
u:menushortcuttext ARRAY
u:firstbackpack OBJECT
u:lnbsetpicture ARRAY
u:getitemcargo OBJECT
u:tvsetvalue ARRAY
u:removemusiceventhandler ARRAY
u:gettext CONFIG
u:getburningvalue OBJECT
u:formation OBJECT,GROUP
u:formation TEAM_MEMBER
u:simulclouddensity ARRAY
u:tolower STRING
u:localize STRING
u:loadbackpack OBJECT
u:unassignteam OBJECT
u:removeallownedmines OBJECT
u:getassetdlcinfo STRING,OBJECT
u:getassetdlcinfo ARRAY
u:ropelength OBJECT
u:menudata ARRAY
u:getanimspeedcoef OBJECT
u:fullcrew OBJECT
u:fullcrew ARRAY
u:createvehicle ARRAY
u:formationmembers OBJECT
u:addcamshake ARRAY
u:markertext STRING
u:getcontainermaxload STRING
u:getgraphvalues ARRAY
u:namedproperties OBJECT
u:type TASK
u:type LOCATION
u:focusedctrl DISPLAY
u:lnbsetpicturecolor ARRAY
u:visibleposition OBJECT
u:speedmode OBJECT,GROUP
u:vestcontainer OBJECT
u:getpilotcameradirection OBJECT
u:conversationdisabled OBJECT
u:currenttasks TEAM_MEMBER
u:markerdir STRING
u:showhud BOOL
u:showhud ARRAY
u:getposasl OBJECT
u:showcuratorcompass BOOL
u:forcemap BOOL
u:inflamed OBJECT
u:loadfile STRING
u:calculateplayervisibilitybyfriendly BOOL
u:waypoints OBJECT,GROUP
u:scopename STRING
u:weaponinertia OBJECT
u:ctrlurl CONTROL
u:missiletargetpos OBJECT
u:menusetaction ARRAY
u:ctrlscrollvalues CONTROL
u:isdamageallowed OBJECT
u:isforcedwalk OBJECT
u:currentvisionmode OBJECT
u:currentvisionmode ARRAY
u:enablecaustics BOOL
u:selectrandom ARRAY
u:deactivatekey STRING
u:haspilotcamera OBJECT
u:setdate ARRAY
u:direction OBJECT
u:direction LOCATION
u:admin SCALAR
u:dynamicsimulationdistance STRING
u:getmissionpath STRING
u:ppeffectenabled SCALAR
u:ppeffectenabled STRING
u:getdlcs SCALAR
u:getsuppression OBJECT
u:lbsetpicturecolorselected ARRAY
u:settrafficgap ARRAY
u:camusenvg BOOL
u:ctclear CONTROL
u:resources TEAM_MEMBER
u:gettextraw CONFIG
u:calculatepath ARRAY
u:removeuseractioneventhandler ARRAY
u:getterrainheight ARRAY
u:getarray CONFIG
u:hintsilent STRING,TEXT
u:ctrlforegroundcolor CONTROL
u:assignedcommander OBJECT
u:taskchildren TASK
u:updateobjecttree CONTROL
u:showcompass BOOL
u:isnumber CONFIG
u:lnbpicture ARRAY
u:waypointname ARRAY
u:deletesite OBJECT
u:nearestbuilding OBJECT
u:nearestbuilding ARRAY
u:addforcegeneratorrtd ARRAY
u:forcegeneratorrtd SCALAR
u:getposatlvisual OBJECT
u:getallenvsoundcontrollers ARRAY
u:enabledynamicsimulationsystem BOOL
u:clearitemcargoglobal OBJECT
u:getmissionconfig STRING
u:sqrt SCALAR,NaN
u:ctrlurloverlaymode CONTROL
u:ctrltextheight CONTROL
u:removegoggles OBJECT
u:showsubtitles BOOL
u:getplayerchannel OBJECT
u:clearitemcargo OBJECT
u:menuadd ARRAY
u:sendudpmessage ARRAY
u:checkaifeature STRING
u:uavcontrol OBJECT
u:iswalking OBJECT
u:compile STRING
u:tasktype TASK
u:flag OBJECT
u:composetext ARRAY
u:formleader OBJECT
u:stopped OBJECT
u:clearallitemsfrombackpack OBJECT
u:leaderboardgetrows STRING
u:nearestlocations ARRAY
u:addmissioneventhandler ARRAY
u:ongroupiconclick STRING,CODE
u:hmd OBJECT
u:setobjectviewdistance SCALAR
u:setobjectviewdistance ARRAY
u:waypointscript ARRAY
u:lnbtextright ARRAY
u:magazinesdetailuniform ARRAY,OBJECT
u:tvsetpicturerightcolor ARRAY
u:hintcadet STRING,TEXT
u:remove3deneventhandler ARRAY
u:ctrowcount CONTROL
u:roadsconnectedto ARRAY,OBJECT
u:lbcursel CONTROL
u:lbcursel SCALAR
u:canfire OBJECT
u:creategeardialog ARRAY
u:slidersetspeed ARRAY
u:configproperties ARRAY
u:sendaumessage ARRAY
u:binocularmagazine OBJECT
u:set3dengrid ARRAY
u:iskeyactive STRING
u:isobjecthidden OBJECT
u:configsourcemod CONFIG
u:lnbvalue ARRAY
u:tvpicture ARRAY
u:underwater OBJECT
u:showwaypoints BOOL
u:sliderspeed CONTROL
u:sliderspeed SCALAR
u:confighierarchy CONFIG
u:setmusiceventhandler ARRAY
u:unitaimposition OBJECT
u:lnbsize CONTROL
u:lnbsize SCALAR
u:ropecreate ARRAY
u:deletestatus STRING
u:lnbsetpicturecolorselected ARRAY
u:morale OBJECT
u:tvselection CONTROL
u:ctrlfade CONTROL
u:selectplayer OBJECT
u:createlocation ARRAY
u:menusetcheck ARRAY
u:failmission STRING
u:lnbsetcolorright ARRAY
u:preprocessfile STRING
u:combatbehaviour OBJECT
u:combatbehaviour GROUP
u:setcompassoscillation ARRAY
u:iscollisionlighton OBJECT
u:removeallmissioneventhandlers STRING
u:ctrlvisible SCALAR
u:formationtask OBJECT
u:menuclear CONTROL
u:menuclear SCALAR
u:ismanualfire OBJECT
u:opendlcpage SCALAR
u:ln SCALAR,NaN
u:wingsforcesrtd OBJECT
u:setdefaultcamera ARRAY
u:removefromremainscollector ARRAY
u:ctrltextcolor CONTROL
u:playscriptedmission ARRAY
u:lnbsetcolor ARRAY
u:deletevehicle OBJECT
u:onteamswitch STRING,CODE
u:lineintersects ARRAY
u:isuavconnected OBJECT
u:ctrlposition CONTROL
u:lbsize CONTROL
u:lbsize SCALAR
u:getunitloadout ARRAY,OBJECT
u:getunitloadout STRING
u:getunitloadout CONFIG
u:getpilotcamerarotation OBJECT
u:roadat ARRAY,OBJECT
u:createguardedpoint ARRAY
u:commitoverlay CONTROL
u:params ARRAY
u:currentweapon OBJECT
u:getdirvisual OBJECT
u:ctrlmapmouseover CONTROL
u:drawline3d ARRAY
u:ctrlmapanimclear CONTROL
u:leaderboarddeinit STRING
u:clearoverlay CONTROL
u:enginesrpmrtd OBJECT
u:datetonumber ARRAY
u:setsystemofunits SCALAR
u:breakto STRING
u:difficultyenabled STRING
u:clearmagazinecargoglobal OBJECT
u:isgroupdeletedwhenempty GROUP
u:breakwith ANY
u:flatten ARRAY
u:synchronizedobjects OBJECT
u:ctrlmouseposition CONTROL
u:tg SCALAR,NaN
u:useaisteeringcomponent BOOL
u:getdammage OBJECT
u:lbsetcursel ARRAY
u:setarmorypoints SCALAR
u:weightrtd OBJECT
u:loadvest OBJECT
u:gearidcammocount SCALAR
u:ctrltextwidth CONTROL
u:removealluseractioneventhandlers ARRAY
u:pose OBJECT
u:nearestlocationwithdubbing ARRAY
u:createmine ARRAY
u:lnbsetpicturecolorright ARRAY
u:getmarkersize STRING
u:getposaslvisual OBJECT
u:eyepos OBJECT
u:opengps BOOL
u:removeallitems OBJECT
u:vehiclereportownposition OBJECT
u:createvehiclecrew OBJECT
u:uniformmagazines OBJECT
u:enablecamshake BOOL
u:tvcursel SCALAR
u:tvcursel CONTROL
u:ctrltextselection CONTROL
u:setdetailmapblendpars ARRAY
u:onbriefingnotes STRING
u:markershape STRING
u:backpackitems OBJECT
u:getdebriefingtext STRING
u:magazines ARRAY,OBJECT
u:waypointcombatmode ARRAY
u:getplayerid OBJECT
u:enginesisonrtd OBJECT
u:queryweaponpool STRING
u:didjipowner OBJECT
u:primaryweaponitems OBJECT
u:visiblepositionasl OBJECT
u:lightison OBJECT
u:assignedcargo OBJECT
u:currentmagazine OBJECT
u:vehiclereportremotetargets OBJECT
u:taskstate TASK
u:get3denselected STRING
u:set3denselected ARRAY
u:magazinesdetailvest ARRAY,OBJECT
u:not BOOL
u:lbclear CONTROL
u:lbclear SCALAR
u:forcerespawn OBJECT
u:titletext ARRAY
u:getconnecteduav OBJECT
u:geteditorcamera CONTROL
u:configname CONFIG
u:lockeddriver OBJECT
u:ctrlsetfocus CONTROL
u:unitaddons STRING
u:getpilotcameraposition OBJECT
u:markerchannel STRING
u:get3denentityid ANY
u:menusort ARRAY
u:menusettext ARRAY
n:sideenemy
n:safezonex
n:pixelh
n:slingloadassistantshown
n:windstr
n:isinstructorfigureenabled
n:clearmagazinepool
n:getmusicplayedtime
n:safezoney
n:getclientstatenumber
n:getclientstate
n:date
n:getelevationoffset
n:getterraingrid
n:player
n:exit
n:mapanimclear
n:halt
n:apertureparams
n:current3denoperation
n:missiondifficulty
n:nextweatherchange
n:allsites
n:teamswitchenabled
n:savemissionprofilenamespace
n:blufor
n:worldname
n:isremoteexecuted
n:curatorcamera
n:resistance
n:visiblescoretable
n:ismultiplayersolo
n:displaynull
n:diaryrecordnull
n:is3denmultiplayer
n:diag_frameno
n:getlighting
n:currentnamespace
n:armorypoints
n:pixelgrid
n:configfile
n:markasfinishedonsteam
n:getcalculateplayervisibilitybyfriendly
n:visiblewatch
n:estimatedendservertime
n:diag_activemissionfsms
n:sidelogic
n:hudmovementlevels
n:controlnull
n:opfor
n:issteamoverlayenabled
n:issaving
n:rainbow
n:gettiparameters
n:cansuspend
n:servertime
n:teams
n:endl
n:librarycredits
n:all3denentities
n:shownwarrant
n:allmines
n:ismissionprofilenamespaceloaded
n:alldisplays
n:ambienttemperature
n:isautotest
n:viewdistance
n:sideambientlife
n:isgamefocused
n:getterraininfo
n:allmapmarkers
n:getshadowdistance
n:worldsize
n:getaudiooptionvolumes
n:rain
n:didjip
n:missionstart
n:airdensitycurvertd
n:environmentenabled
n:false
n:safezonewabs
n:sunormoon
n:profilename
n:difficultyenabledrtd
n:allairports
n:savegame
n:hasinterface
n:runinitscript
n:getartillerycomputersettings
n:visiblemap
n:shownchat
n:forceweatherchange
n:clearitempool
n:missionend
n:mapanimdone
n:showncompass
n:continue
n:winddir
n:currentchannel
n:resetcamshake
n:ispipenabled
n:pixelgridbase
n:gettotaldlcusagetime
n:sidefriendly
n:endloadingscreen
n:profilenamesteam
n:missionnamesource
n:playableunits
n:opencuratorinterface
n:gusts
n:overcastforecast
n:dynamicsimulationsystemenabled
n:commandingmenu
n:missionconfigfile
n:cheatsenabled
n:get3denlinesvisible
n:distributionregion
n:windrtd
n:allcurators
n:benchmark
n:getmissiondlcs
n:shownartillerycomputer
n:scriptnull
n:isfilepatchingenabled
n:missionname
n:istuthintsenabled
n:missionprofilenamespace
n:nil
n:true
n:issteammission
n:alladdonsinfo
n:isremoteexecutedjip
n:diag_fps
n:acctime
n:enableenddialog
n:linebreak
n:language
n:clearweaponpool
n:safezoneh
n:allunitsuav
n:radioenabled
n:shownradio
n:allplayers
n:clearforcesrtd
n:clearradio
n:disabledebriefingstats
n:logentities
n:pixelw
n:visiblecompass
n:getpipviewdistance
n:diag_scope
n:servernamespace
n:locationnull
n:shownwatch
n:playerside
n:lightnings
n:simulweathersync
n:shownmap
n:shownpad
n:diag_deltatime
n:isactionmenuvisible
n:independent
n:campaignconfigfile
n:clientowner
n:getobjectviewdistance
n:overcast
n:safezonexabs
n:forceend
n:diag_activesqfscripts
n:remoteexecutedowner
n:systemtime
n:objnull
n:selectnoplayer
n:sentencesenabled
n:getdlcassetsusage
n:diag_activesqsscripts
n:diag_stacktrace
n:wind
n:shownsubtitles
n:servername
n:sideempty
n:humidity
n:hcshownbar
n:diag_ticktime
n:visiblegps
n:pi
n:shownuavfeed
n:ismultiplayer
n:allusers
n:productversion
n:isdedicated
n:alldeadmen
n:diag_fpsmin
n:freelook
n:pixelgridnouiscale
n:missionnamespace
n:showncuratorcompass
n:saveprofilenamespace
n:finishmissioninit
n:fog
n:buldozer_isenabledroaddiag
n:userinputdisabled
n:netobjnull
n:loadgame
n:isuicontext
n:cameraview
n:isserver
n:reversedmousey
n:speechvolume
n:getremotesensorsdisabled
n:rainparams
n:moonintensity
n:librarydisclaimers
n:forcedmap
n:getsteamfriendsservers
n:profilenamespace
n:cadetmode
n:tasknull
n:get3dencamera
n:cameraon
n:allgroups
n:systemtimeutc
n:agents
n:briefingname
n:copyfromclipboard
n:cursorobject
n:break
n:east
n:teamswitch
n:localnamespace
n:shownscoretable
n:diag_activescripts
n:isstressdamageenabled
n:diag_allmissioneventhandlers
n:fogparams
n:time
n:shownhud
n:switchableunits
n:playerrespawntime
n:groupiconsvisible
n:initambientlife
n:allcutlayers
n:curatormouseover
n:civilian
n:missionversion
n:activatedaddons
n:environmentvolume
n:showngps
n:get3denmouseover
n:is3denpreview
n:getcursorobjectparams
n:cursortarget
n:sideunknown
n:fogforecast
n:allactivetitleeffects
n:savejoysticks
n:buldozer_reloadopermap
n:difficulty
n:getmissionlayers
n:systemofunits
n:dialog
n:is3den
n:radiovolume
n:savingenabled
n:particlesquality
n:west
n:mapanimcommit
n:vehicles
n:curatorselected
n:parsingnamespace
n:musicvolume
n:waves
n:getvideooptions
n:disableserialization
n:daytime
n:grpnull
n:teammembernull
n:soundvolume
n:alldead
n:getloadedmodsinfo
n:getresolution
n:timemultiplier
n:createhashmap
n:safezonew
n:getsubtitleoptions
n:allenv3dsoundsources
n:allunits
n:getmouseposition
n:groupiconselectable
n:uinamespace
n:isgamepaused
n:customwaypointposition
n:isstreamfriendlyuienabled
n:confignull
n:get3deniconsvisible
`)
