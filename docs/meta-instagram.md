# Meta / Instagram — Current Setup Notes

Meta's current official Instagram API workspace says Instagram Login supports Instagram professionals including businesses and creators. The Instagram Login collection lists these permissions for the current feature set:

- `instagram_business_basic`
- `instagram_business_manage_messages`
- `instagram_business_manage_comments`
- `instagram_business_content_publish`

Official starting point:
https://www.postman.com/meta/instagram/folder/1z5vxzu/instagram-api-with-instagram-login

For Reels, Meta's current official Postman collection documents the content-publishing flow as: create a Reel media container with a public `video_url`, poll the container until it is ready, then call `/{ig_user_id}/media_publish` with the container ID.

Official publishing reference:
https://www.postman.com/meta/instagram/request/5kkpkh6/upload-a-reel-to-an-ig-container
https://www.postman.com/meta/instagram/request/gabnx7r/publish-reel

Do not add `META_ACCESS_TOKEN` until the developer app and Instagram authorization are actually complete. Set `META_GRAPH_API_VERSION` to the version Meta shows for the current app/collection rather than hard-coding an outdated version.
