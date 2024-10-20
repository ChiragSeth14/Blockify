const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config(); // Load environment variables from .env file if needed

const app = express();

// Manually using the provided access and refresh tokens
let accessToken = 'BQByn5-ZijPYRqEpuh7or4JrzFAIO6kt7bBw5j4g7EG0a5sqqMpQxYqd_JOtr6Y3Ps2H3z6_x0_NcxUHXymTx_8q0IX1lu_invi3BEjZwZP88QjdqJypIO0jwCHpijwByF5x-Q1uFHXvo0yqTkCVWykLFmtNanPuV4jawm4595ugOBS5AHCGr7HasZqpLpKfErG2TvBEDaj0qyIlg3z_Pg';
let refreshToken = 'AQDuAqOw_C8bO4TGOP0wxLkhY4TENq9IhBFk6DNuHWukIzrZaC3rC3TwlZdkgY-KaRIvtco_DdCrmM_w6d-KSPbpFr7W1MB4tVW6DZ2VdvREwrnRPs32mvl29nZEoe-nRAA';

const CLIENT_ID_NEW = process.env.CLIENT_ID || 'your_spotify_client_id'; // Replace if using .env
const CLIENT_SECRET_NEW = process.env.CLIENT_SECRET || 'your_spotify_client_secret'; // Replace if using .env

// Function to refresh access token when expired
async function refreshAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const data = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID_NEW,
        client_secret: CLIENT_SECRET_NEW
    };

    try {
        const response = await axios.post(tokenUrl, querystring.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        accessToken = response.data.access_token; // Update access token
        console.log('New access token:', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error.response.data);
    }
}

// Function to get currently playing track using access token
async function getCurrentlyPlayingTrack() {
    const url = 'https://api.spotify.com/v1/me/player/currently-playing';

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.data && response.data.item) {
            console.log('Currently playing track:', response.data.item.name);
            return response.data.item;
        } else {
            console.log('No song is currently playing.');
        }
    } catch (error) {
        // Check if the error is due to token expiration
        if (error.response && error.response.status === 401) {
            console.log('Access token expired, refreshing token...');
            await refreshAccessToken(); // Refresh token
            return await getCurrentlyPlayingTrack(); // Retry request
        } else {
            console.error('Error fetching currently playing track:', error.response ? error.response.data : error.message);
        }
    }
}

// Endpoint to display currently playing track
app.get('/currently-playing', async (req, res) => {
    const track = await getCurrentlyPlayingTrack();
    if (track) {
        res.send(`Currently playing: ${track.name} by ${track.artists[0].name}`);
    } else {
        res.send('No song is currently playing.');
    }
});

// Listen on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
