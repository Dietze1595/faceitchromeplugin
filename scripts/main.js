let token = "Bearer 72d06f36-b794-402f-a49b-166300da8013"
let playerId = ""
let membership
let level
let afk
let leaver
let nickname
let teamname1
let teamname2
let faceitmatch
let playing


if (document.getElementsByName("abuseID") && document.getElementsByName("abuseID")[0]) {
    let steamid = document.getElementsByName("abuseID")[0].value

    //We get FACEIT.com username from public API
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getFaceitId);
    oReq.open("GET", "https://open.faceit.com/data/v4/players?game=csgo&game_player_id=" + steamid, true);
	oReq.setRequestHeader('Authorization', token);
    oReq.send();
}

function getFaceitId() {
    let json = JSON.parse(this.responseText);
	

    playerId = json.player_id;

    //Get FACEIT Elo
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getFaceitElo);
    oReq.open("GET", "https://open.faceit.com/data/v4/players/" + playerId, true);
	oReq.setRequestHeader('Authorization', token);
    oReq.send();
}

function getFaceitElo() {
    let json = JSON.parse(this.responseText);
	
    if (!json.games.csgo)
        return;

    membership = json.membership_type;
    level = json.games.csgo.skill_level;
    elo = (json.games.csgo.faceit_elo) ? json.games.csgo.faceit_elo : '-';
    afk = (json.infractions.afk) ? json.infractions.afk : '-';
    leaver = (json.infractions) ? json.infractions.leaver : '-';
    nickname = json.nickname;
	
	//Get FACEIT Data
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
	
	
	
	
	var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getFaceitData);
    oReq.open("GET", "https://open.faceit.com/data/v4/players/" + playerId + "/stats/csgo", true);
	oReq.setRequestHeader('Authorization', token);
    oReq.send();
}



function getFaceitData() {
    let json = JSON.parse(this.responseText);

    let Matches = json.lifetime.Matches;
    let Wins = json.lifetime.Wins;
    let KD = json.lifetime["Average K/D Ratio"];
    let HS = json.lifetime["Average Headshots %"];
    let Rate = json.lifetime["Win Rate %"];

	
	
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