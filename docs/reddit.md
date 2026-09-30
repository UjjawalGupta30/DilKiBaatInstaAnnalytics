# Reddit — Community Radar

Reddit's current developer platform is changing. The current Developer Platform docs support reading/writing Reddit content through Devvit and require explicit user action before posting or commenting on a user's behalf.

Official references:
https://developers.reddit.com/docs/capabilities/server/reddit-api
https://developers.reddit.com/docs/capabilities/server/userActions
https://developers.reddit.com/app-registration

For Dil Ki Baat, the production-safe product behavior is:

Reddit discovery -> relevance/brand-fit scoring -> AI reply draft -> dashboard review -> explicit human action -> post.

Do not build a mass-commenting or auto-promotion loop. Respect subreddit rules and Reddit's developer/data policies.
