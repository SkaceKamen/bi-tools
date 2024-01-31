//_x select 1 setPos getpos player
//random(RSTF_SPAWN_DISTANCE_MAX - RSTF_SPAWN_DISTANCE_MIN);
//private _distance = RSTF_SPAWN_DISTANCE_MIN + random(RSTF_SPAWN_DISTANCE_MAX - RSTF_SPAWN_DISTANCE_MIN);
//[RSTF_MODE_ATTACKERS_SIDE] call RSTF_fnc_indexSide

params ["_test", ["_test2"]];

_test = "something";

diag_log _test2;

RSTF_SPAWNS = [
	[0,0,0],
	[0,0,0],
	[0,0,0]
];

/*
RSTF_MODE_PUSH_TASK_ATTACKERS = [
	[RSTF_MODE_ATTACKERS_SIDE] call RSTF_fnc_indexSide,
	"CAPTURE" + str(RSTF_MODE_PUSH_POINT_INDEX),
	["We need to capture this point to advance", "Capture point " + _pointLetter,""],
	RSTF_POINT,
	"ASSIGNED",
	0,
	true,
	"attack"
] call BIS_fnc_taskCreate;
*/

/*
0 spawn {
	if (RSTF_MODE_PUSH_POINT_INDEX == 0) then {
		sleep 10;
	};

	private _pointLetter = toString [65 + (RSTF_MODE_PUSH_POINT_INDEX % 26)];

	RSTF_MODE_PUSH_TASK_ATTACKERS = [
		[RSTF_MODE_ATTACKERS_SIDE] call RSTF_fnc_indexSide,
		"CAPTURE" + str(RSTF_MODE_PUSH_POINT_INDEX),
		["We need to capture this point to advance", "Capture point " + _pointLetter,""],
		RSTF_POINT,
		"ASSIGNED",
		0,
		true,
		"attack"
	] call BIS_fnc_taskCreate;

	RSTF_MODE_PUSH_TASK_DEFENDERS = [
		[RSTF_MODE_DEFENDERS_SIDE] call RSTF_fnc_indexSide,
		"DEFEND" + str(RSTF_MODE_PUSH_POINT_INDEX),
		["Defend this point to prevent enemies advance", "Defend point " + _pointLetter,""],
		RSTF_POINT,
		"ASSIGNED",
		0,
		true,
		"defend"
	] call BIS_fnc_taskCreate;
};
*/

//if (_index >= 0) then {
//_a set [_b, (_c select _d) + 1];
//};


/*{
	if (!isPlayer(_x) && alive(_x) && vehicle(_x) == _x) then {
		private _distance = _x distance RSTF_POINT;
		if (_distance > _killDistance) then {
			private _killTimeout = _x getVariable ["RSTF_KILL_TIMEOUT", 0];
			if (_killTimeout < RSTF_MODE_DISTANCE_KILL_TIMEOUT) then {
				_x setVariable ["RSTF_KILL_TIMEOUT", _killTimeout + 5];
			} else {
				if (RSTF_DEBUG) then {
					systemChat format["Killing %1 because its too far (%2 m)", name _x, _distance];
				};

				_x setDamage 1;
			};
		};
	};
} foreach units(_x);
*/


/*
if true then {
	RSTF_DIRECTION = RSTF_DIRECTION + 180;
} else {
	RSTF_DIRECTION = RSTF_DIRECTION;
};
*/

//toString [65 + (RSTF_MODE_PUSH_POINT_INDEX % 26)];


//RSTF_MODE_PUSH_startLoop = {
	
	/*
	// Build points
	private _center = RSTF_POINT;
	private _radius = RSTF_DISTANCE;
	private _direction = RSTF_DIRECTION;


	if (RSTF_MODE_DEFENDERS_SIDE == SIDE_FRIENDLY) then {
		_direction = _direction + 180;
	};
	
	_center = _center vectorAdd [
		sin(_direction + 180) * _radius,
		cos(_direction + 180) * _radius,
		0
	];

	while { count(RSTF_MODE_PUSH_POINTS) < RSTF_MODE_PUSH_POINT_COUNT } do {
		private _newCenter = _center;
		private _advance = _radius * 0.8;
		private _iteration = 0;
		private _adjustment = if (random 1 > 0.5) then { 1 } else { -1 };
		
		_direction = _direction - 20 + random 40;

		while { _iteration < 100000 } do {
			_newCenter = _center vectorAdd [
				sin(_direction) * _advance,
				cos(_direction) * _advance,
				0
			];

			if (!(surfaceIsWater _newCenter)) exitWith {};

			_iteration = _iteration + 1;
			_direction = _direction + _adjustment * 10;

			if (_iteration mod 10 == 0) then {
				_advance = _advance * 1.2;
			};
		};

		_center = _newCenter;

		if (RSTF_DEBUG) then {
			private _marker = createMarkerLocal [str(_center), _center];
			_marker setMarkerShape "ICON";
			_marker setMarkerType "mil_flag";
		};

		RSTF_MODE_PUSH_POINTS pushBack [_center, _direction];

		if (RSTF_MODE_PUSH_FIRST_POINT_EMPLACEMENTS || count(RSTF_MODE_PUSH_POINTS) > 1) then {
			[RSTF_MODE_PUSH_EMPLACEMENTS_PER_POINT, _center, _direction, RSTF_MODE_DEFENDERS_SIDE] call RSTF_fnc_spawnDefenceEmplacements;
		};
	};

	private _marker = createMarker ["PUSH_OBJECTIVE", _center];
	_marker setMarkerShape "ELLIPSE";
	_marker setMarkerSize [100, 100];
	_marker setMarkerColor RSTF_COLOR_NEUTRAL;

	waitUntil { sleep 0.1; !RSTF_INTRO_PLAYING; };
  */
	//call RSTF_MODE_PUSH_NEXT_POINT;
//
	//0 spawn {
	//	private _center = RSTF_POINT;
	//	private _radius = 100;
	//	private _currentOwner = -1;
	//	private _last = time;
//
	//	while { !RSTF_ENDED } do {
			// Count men for each side inside this point
			/*private _counts = [];
			{
				_counts set [_x, 0];
			} foreach RSTF_SIDES;*/

			//private _nearest = nearestObjects [RSTF_POINT, ["Man"], _radius, true];
			//{
				/*_index = -1;
				if (alive(_x)) then {
					if (side(_x) == west) then {
						_index = SIDE_FRIENDLY;
					};
					if (side(_x) == east) then {
						_index = SIDE_ENEMY;
					};
					if (side(_x) == resistance) then {
						_index = SIDE_NEUTRAL;
					};
				};*/

				//if (_index >= 0) then {
				//	_counts set [_index, (_counts select _index) + 1];
				//};
			//} foreach _nearest;

/*
			RSTF_MODE_PUSH_COUNTS = _counts;

			// Now find side with most men
			private _best = _currentOwner;
			private _bestCount = 0;

			{
				if (_x > _bestCount) then {
					_best = _foreachIndex;
					_bestCount = _x;
				};
			} foreach _counts;

			if (_best == RSTF_MODE_ATTACKERS_SIDE) then {
				// Add point and reset timer
				_last = time;
				RSTF_SCORE set [_best, (RSTF_SCORE select _best) + 1];

				// Notify clients
				publicVariable "RSTF_SCORE";
				0 remoteExec ["RSTF_fnc_onScore"];

				// End when limit is reached
				if (RSTF_SCORE select _best >= RSTF_MODE_PUSH_SCORE_LIMIT) then {
					if (RSTF_MODE_PUSH_POINT_INDEX >= count(RSTF_MODE_PUSH_POINTS) - 1) then {
						[SIDE_FRIENDLY] remoteExec ["RSTF_fnc_onEnd"];
					} else {
						// Create notification
						[format[
							"<t color='%1'>%2</t> captured objective, moving to next",
							RSTF_SIDES_COLORS_TEXT select SIDE_FRIENDLY,
							RSTF_SIDES_NAMES select _best
						], 5] remoteExec ["RSTFUI_fnc_addGlobalMessage"];

						call RSTF_MODE_PUSH_NEXT_POINT;
					};
				};
			};

			publicVariable "RSTF_MODE_PUSH_COUNTS";
*/
	//		sleep 1;
	//	};
	//};


	// Kill AI that are too far away from the objective (usually happens when point is pushed)
	/*0 spawn {
		private _killDistance = RSTF_SPAWN_DISTANCE_MAX + 50;

		while { !RSTF_ENDED } do {
			{
				{
					{
						if (!isPlayer(_x) && alive(_x) && vehicle(_x) == _x) then {
							private _distance = _x distance RSTF_POINT;
							if (_distance > _killDistance) then {
								private _killTimeout = _x getVariable ["RSTF_KILL_TIMEOUT", 0];
								if (_killTimeout < RSTF_MODE_DISTANCE_KILL_TIMEOUT) then {
									_x setVariable ["RSTF_KILL_TIMEOUT", _killTimeout + 5];
								} else {
									if (RSTF_DEBUG) then {
										systemChat format["Killing %1 because its too far (%2 m)", name _x, _distance];
									};

									_x setDamage 1;
								};
							};
						};
					} foreach units(_x);
				} foreach _x;
			} forEach RSTF_GROUPS;

			sleep 5;
		};
	}
	*/
//};
