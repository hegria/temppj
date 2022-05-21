

var accessToken;
let url = 'https://accounts.spotify.com/authorize?client_id=70becd8a2c0744a8b7bd5ff888f92ad2&response_type=token&redirect_uri=https://hegria.github.io/temppj/callback&scope=playlist-modify-public%20playlist-read-collaborative';


gettoken();

function gettoken(){
    var isPopupBlockerActivated = function(popupWindow) {
        if (popupWindow) {
            if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                try {
                    popupWindow.focus();
                } catch (e) {
                    return true;
                }
            } else {
                popupWindow.onload = function() {
                    return (popupWindow.innerHeight > 0) === false;
                };
            }
        } else {
            return true;
        }
        return false;
    };
     
    
    

    popup = window.open(url,'Login with Spotify','width=800,height=600');
    if (isPopupBlockerActivated(popup)) {
        alert("팝업 차단을 해제해주세요!!");
    }
    
    popup.onbeforeunload = function() {
        accessToken = localStorage.getItem('accessToken');
        console.log(accessToken);
    

      // let duration = parseInt(localStorage.getItem("duration"));
      let duration = 2100;
      let numtracks = duration / 210;
  
  
  
      // let weather = localStorage.getItem("weather");
      let weather = "Clouds";
      let genre = [];
  

    

    switch (weather) {
        case "Clouds":
            genre = ["indie", "r-n-b"]
            break;
        case "Clear":
            genre = ["k-pop", "dance"]
            break;
        case "Drizzle":
        case "Rain":
            genre = ["acoustic", "classical"]
            break;
        default:
            genre = ["k-pop"]
            break;
    }

    let user_id = 'hegria';

    let params = {
        "seed_artists": ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
        "seed_genres": ['classical'],
        "seed_tracks": ['11dFghVXANMlKmJXsNCbNl'],
        "min_popularity": 50,
        "market": "KR",
        "limit": numtracks
    }

    let songs = [];

    let query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');


    fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
    }).then((response) =>
        response.json()
    ).then((data)=>{
        user_id = data['id'];
        //노래 받아오기
    fetch('https://api.spotify.com/v1/recommendations?' + query, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
    }
    ).then((response) =>
        response.json()
    ).then((data) => {
    
        console.log(data);

        data['tracks'].forEach(element => {
            songs.push({ id: element['id'], name: element['name'], artist: element['artists'][0]['name'] }
            )
        });
        let songstourl = [];
        songs.forEach((song) => {
            songstourl.push(`spotify:track:${song['id']}`);
        });
        console.log(songstourl);
        console.log(songs);
        // playlist 만들기
        let params = {
            "name": 'newplaylistgoto',
            "public": true,
            "description": 'go a to b'
        };
        let query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
        fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(params)
        }).then((response) =>
            response.json()
        ).then((data) => {
            let playlistid = data['id'];
            let params = {
                "uris": songstourl
            }
            //곡추가하기
            fetch(`https://api.spotify.com/v1/playlists/${playlistid}/tracks`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(params)
            })
        })
    }
    );
    })

    
}
}