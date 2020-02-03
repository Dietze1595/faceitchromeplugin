if (document.getElementsByName("abuseID") && document.getElementsByName("abuseID")[0]) {
    let steamid = document.getElementsByName("abuseID")[0].value

	//Get Faceit userId & nickname
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", getFaceitId);
	oReq.open("GET", "https://api.faceit.com/search/v1?limit=5&query=" + steamid, true);
	oReq.send();
}

function getFaceitId() {
    let json = JSON.parse(this.responseText);
	
	if(!json.payload.players.results[0].nickname)
        return;
	
    nickname = json.payload.players.results[0].nickname;
	playerId = json.payload.players.results[0].guid;


	// Get Faceit csgo stats
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getFaceitElo);
    oReq.open("GET", "https://api.faceit.com/core/v1/nicknames/" + nickname, true);
    oReq.send();
}

function getFaceitElo() {
    let json = JSON.parse(this.responseText);

    if (!json.payload.games.csgo)
        return;

    level = json.payload.games.csgo.skill_level;
    elo = (json.payload.games.csgo.faceit_elo) ? json.payload.games.csgo.faceit_elo : '-';
    afk = (json.payload.infractions.afk) ? json.payload.infractions.afk : '-';
	
	//Get FACEIT live match
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getFaceitMatch);
    oReq.open("GET", "https://api.faceit.com/match/v1/matches/groupByState?userId=" + playerId);
    oReq.send();
	
}

function getFaceitMatch(){
	let json = JSON.parse(this.responseText);
	
	if(!json.payload["ONGOING"]){
		teamname1 = ""
		teamname2 = ""
		faceitmatch = ""
		playing = ""
	} else {
		let names = Object.getOwnPropertyNames(json.payload)	
		teamname1 = json.payload[names[0]][0].teams["faction1"].name
		teamname2 = json.payload[names[0]][0].teams["faction2"].name
		faceitmatch = json.payload[names[0]][0].id
		playing = "Go To Room"
	}
	
	// Get Faceit lifetime stats
	var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getFaceitData);
    oReq.open("GET", "https://api.faceit.com//stats/api/v1/stats/users/" + playerId + "/games/csgo", true);
    oReq.send();
}



function getFaceitData() {
    let json = JSON.parse(this.responseText);

    Matches = json.lifetime.m1;
    Wins = json.lifetime.m2;
    KD = json.lifetime.k5;
    HS = json.lifetime.k8;
    Rate = json.lifetime.k6;
	html();

}

function html(){
	
	
    //Select the element where to show faceit profile data
    let customize = (document.querySelector('.profile_customization_area') ? document.querySelector('.profile_customization_area') : document.querySelector('.profile_leftcol'));

    //Add the box with the data
    customize.innerHTML = `
    <div class="profile_customization">
        <div class="profile_customization_header">Faceitstats</div>
        <div class="profile_customization_block">
            <div class="favoritegroup_showcase">
                <div class="showcase_content_bg" style="padding-right: 0px";
>
                    <div class="favoritegroup_showcase_group showcase_slot" style="padding-left: 0px;height:55px">                  
                        <div class="favoritegroup_content">
                            <div class="favoritegroup_namerow ellipsis" style="float:left;margin-left: 12px;overflow:unset">
							<table align="center" style="font-size:0.07em; width:100%; font-weight: bold">
								<tbody>
									<tr style="vertical-align: middle">
										<td style="margin-left: auto; margin-right: auto; width:10%">
											<img src="https://cdn-frontend.faceit.com/web/960/src/app/assets/images-compress/skill-icons/skill_level_` + level + `_svg.svg" style="display:block; width:70%">
										</td>
										<td style="text-align:center; width:10%; height:35px">
											<a class="favoritegroup_name whiteLink" style="xx-large; display:block" target="_blank" href="https://www.faceit.com/en/players/` + nickname + `">
												` + nickname + `
											</a>
										</td>
										<td style="text-align:end; width:80%">
											<a style="color:#8e4100; font-weight: bold; font-size: 20px; font-family: Motiva Sans, Sans-serif; font-weight: 200; target="_blank" style="display:block" href="https://www.faceit.com/de/csgo/room/` + faceitmatch + `">
												` + playing + `
											</a>
										<td style="width:10%"></td>
									</tr>
								</tbody>
							</table>
                            </div>
                            <div class="favoritegroup_stats showcase_stats_row" style="position:unset;float:left;margin-left: 12px;margin-top:2px">
									<table align="center", width:100%">
										<tbody>
											<tr style="color: #ccc; font-size:1.3em">
												<td style="text-align:center; width:16%">Matches</td>
												<td style="text-align:center; width:16%">AVG K/D</td>
												<td style="text-align:center; width:16%">AVG HS%</td>
												<td style="text-align:center; width:16%">Win Rate %</td>
												<td style="text-align:center; width:16%">AFK</td>
												<td style="text-align:center; width:16%">ELO</td>
											</tr>
											<tr style="color: #62a7e3; font-size:1.4em">
												<td style="text-align:center; width:16%"><span>`+ Wins + "/" + Matches +`</span>
												</td>
												<td style="text-align:center; width:16%"><span>` + KD + `</span>
												</td>
												<td style="text-align:center; width:16%"><span>` + HS + `</span>
												</td>
												<td style="text-align:center; width:16%"><span>` + Rate + `</span>
												</td>
												<td style="text-align:center; width:16%"><span>` + afk + `</span>
												</td>
												<td style="text-align:center; width:16%"><span>` + elo + `</span>
												</td>
											</tr>
										</tbody>
									</table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>` + customize.innerHTML;

}
