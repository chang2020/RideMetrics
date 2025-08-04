interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: string;
  start_date: string;
  average_speed: number; // m/s
  max_speed: number; // m/s
  kudos_count: number;
  achievement_count: number;
}

interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
  city: string;
  state: string;
  country: string;
}

export class StravaAPI {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.STRAVA_CLIENT_ID || "";
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET || "";
    
    // Use the correct Replit domain format - check both possible env vars
    let domain = 'http://localhost:5000';
    if (process.env.REPLIT_DOMAIN) {
      domain = `https://${process.env.REPLIT_DOMAIN}`;
    } else if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
      domain = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    }
    this.redirectUri = `${domain}/api/strava/callback`;
    
    console.log('Strava OAuth Config:', {
      clientId: this.clientId,
      redirectUri: this.redirectUri,
      hasSecret: !!this.clientSecret
    });
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'read,activity:read_all',
      approval_prompt: 'auto'
    });

    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<StravaTokens> {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error(`Strava token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  async refreshTokens(refreshToken: string): Promise<StravaTokens> {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Strava token refresh failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getAthlete(accessToken: string): Promise<StravaAthlete> {
    const response = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get athlete: ${response.statusText}`);
    }

    return response.json();
  }

  async getActivities(accessToken: string, page = 1, perPage = 30): Promise<StravaActivity[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get activities: ${response.statusText}`);
    }

    return response.json();
  }

  async getActivity(accessToken: string, activityId: number): Promise<StravaActivity> {
    const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get activity: ${response.statusText}`);
    }

    return response.json();
  }
}

export const stravaAPI = new StravaAPI();