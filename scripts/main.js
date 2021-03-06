if (document.getElementsByName("abuseID") && document.getElementsByName("abuseID")[0]) {
    let steamid = document.getElementsByName("abuseID")[0].value
	
	var url = 'https://raw.githubusercontent.com/Dietze1595/Followergiveaway/master/creator';
	var storedText;

	fetch(url)
	  .then(function(response) {
		response.text().then(function(text) {
		  storedText = text;
		  done();
		});
	  });

	function done() {
		storedText = storedText.split("\n");
		Creator = storedText[0].split(" ").slice(1);
		Tester = storedText[1].split(" ").slice(1);
		Supporter = storedText[2].split(" ").slice(1);
		
		if(Tester.includes(steamid + ",")){
			VIP = "Tester"
		} else if(Creator.includes(steamid + ",")){
			VIP = "Creator"
		} else if (Supporter.includes(steamid + ",")){
			VIP = "Crazy Supporter"
		} else {
			VIP = ""
		}
	}

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", getFaceitId);
	oReq.open("GET", "https://api.faceit.com/search/v1?limit=5&query=" + steamid, true);
	oReq.send();
}

function getFaceitId() {
    let json = JSON.parse(this.responseText);
	
	if(json.payload.players.results.length == 0)
        return;
	
	json.payload.players.results.forEach((user, index) => {
        if (user.games.length > 0) {
            user.games.forEach((game) => {
                if (game.name == 'csgo')
				{
                    nickname = json.payload.players.results[index].nickname;
                    playerId = json.payload.players.results[index].guid;
					flag = "https://cdn-frontend.faceit.com/web/112-1536332382/src/app/assets/images-compress/flags/" + json.payload.players.results[index].country.toUpperCase() + ".png";
				}
			})
        }
    });
		
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
    afk = (json.payload.infractions) ? json.payload.infractions.afk : '-';
	
	
	//Get FACEIT live match
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getFaceitMatch);
    oReq.open("GET", "https://api.faceit.com/match/v1/matches/groupByState?userId=" + playerId);
    oReq.send();
	
}

function getFaceitMatch(){
	let json = JSON.parse(this.responseText);
	
	if(Object.keys(json.payload).length == 0){
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
    oReq.open("GET", "https://api.faceit.com/stats/api/v1/stats/users/" + playerId + "/games/csgo", true);
    oReq.send();
}



function getFaceitData() {
    let json = JSON.parse(this.responseText);

    Matches = json.lifetime.m1;
    Wins = json.lifetime.m2;
	Rate = json.lifetime.k6;
	
	var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", getAvgData);
    oReq.open("GET", "https://api.faceit.com/stats/v1/stats/time/users/" + playerId + "/games/csgo?size=50", true);
    oReq.send();
}


function getAvgData() {
    let json = JSON.parse(this.responseText);
	
	kills = 0;
	HS = 0;
	divid = 0;
	KD = 0;
	KR = 0;
	
	if(json.length==0)
		html();
	
	if(json.length < 20){
		length =json.length;
	} else {
		length=20;
	}
	
	
	
	for(i=0; i<length; i++){
		if(json[i].gameMode !== '5v5'){
			length = length + 1;
		} else {
			divid = divid + 1;
			kills = parseInt(json[i].i6) + kills;
			HS = parseInt(json[i].c4 * 100) + HS;
			KD = parseInt(json[i].c2 * 100) + KD;
			KR = parseInt(json[i].c3 * 100) + KR;
		}
	}
	
    AvgKills = Math.round(kills/divid);
    AvgHs = Math.round(HS/divid/100);
    AvgKD = (KD/divid/100).toFixed(2);
    AvgKR = (KR/divid/100).toFixed(2);
	html();

}

function html(){
	
	
    //Select the element where to show faceit profile data
    let customize = (document.querySelector('.profile_customization_area') ? document.querySelector('.profile_customization_area') : document.querySelector('.profile_leftcol'));

    //Add the box with the data
    customize.innerHTML = `
    <div class="profile_customization">
        <div class="profile_customization_header">
		
		<table align="center" style="font-size:1em; width:100%; font-weight: bold">
			<tbody>
				<tr style="vertical-align: middle">
					<td style="margin-left: auto; margin-right: auto; width:50%">Faceitstats</td>
					<td style="text-align:end; width:50%; font-family: Motiva Sans">` + VIP + `
					</td>			
					</tr>
				</tbody>
			</table>
		
		
		</div>
        <div class="profile_customization_block">
            <div class="favoritegroup_showcase">
                <div class="showcase_content_bg" style="padding-left: 0px; padding-right: 0px">
                    <div class="favoritegroup_showcase_group showcase_slot" style="padding-left: 0px;height:55px">                  
                        <div class="favoritegroup_content">
                            <div class="favoritegroup_namerow ellipsis" style="float:left;margin-left: 12px;overflow:unset">
							<table align="center" style="font-size:1em; width:100%; font-weight: bold">
								<tbody>
									<tr style="vertical-align: middle">
										<td style="margin-left: auto; margin-right: auto; width:10%">
											<img src="https://cdn-frontend.faceit.com/web/960/src/app/assets/images-compress/skill-icons/skill_level_` + level + `_svg.svg" style="display:block; width:70%">
										</td>
										<td style="margin-left: auto; margin-right: auto; width:10%">
											<img src="` + flag + `" style="display:block; width:70%">
										</td>
										<td style="text-align:inherit; width:55%; height:35px">
											<a class="favoritegroup_name whiteLink" style="xx-large; display:block" target="_blank" href="https://www.faceit.com/en/players/` + nickname + `">
												` + nickname + `
											</a>
										</td>
										<td style="text-align:end; width:20%">
											<a class="c" style="xx-large; display:block; background: #FF5500; text-align: center; border-radius:7.5px" target="_blank" href="https://www.faceit.com/de/csgo/room/` + faceitmatch + `">
												` + playing + `
											</a>
										<td style="width:5%"></td>
									</tr>
								</tbody>
							</table>
                            </div>
                            <div style="position:unset;float:left;width:100%;margin-top:2px">
									<table align="center", width:100%">
										<tbody>
											<tr style="color: #ccc; font-size:1em">
												<td style="text-align:center; width:10%">ELO</td>
												<td style="text-align:center; width:10%">Matches</td>
												<td style="text-align:center; width:10%">WinRate</td>
												<td style="text-align:center; width:10%">*AVG Kills</td>
												<td style="text-align:center; width:10%">*AVG HS%</td>
												<td style="text-align:center; width:10%">*AVG K/D</td>
												<td style="text-align:center; width:10%">*AVG K/R</td>
											</tr>
											<tr style="color: #62a7e3; font-size:1.3em">
												<td style="text-align:center; width:10%"><span>` + elo + `</span>
												</td>
												<td style="text-align:center; width:10%"><span>`+ Wins + "/" + Matches +`</span>
												</td>
												<td style="text-align:center; width:10%"><span>` + Rate + "%" + `</span>
												</td>
												<td style="text-align:center; width:10%"><span>` + AvgKills + `</span>
												</td>
												<td style="text-align:center; width:10%"><span>` + AvgHs + `</span>
												</td>
												<td style="text-align:center; width:10%"><span>` + AvgKD + `</span>
												</td>
												<td style="text-align:center; width:10%"><span>` + AvgKR + `</span>
												</td>
											</tr>
											</tr>
												<td colspan="3">
												</td>
												<td colspan="4" style="text-align:end; font-size:0.7em; width:30%"> 
													<span style="margin-right: 10px">*Last `+ divid +` Matches</span>
												</td>
										</tbody>
									</table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>` + customize.innerHTML;
	return;
	
	
	

}
