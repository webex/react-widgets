# Upgrading to Webex

The Cisco Spark SDK has been upgraded and renamed to the Webex SDK.
With this change, certain environment variables that are passed from the widget to the SDK have been renamed.


## Environment variables

**Rename these environment variables**

| old                        | new                   |
| -------------------------- | --------------------- |
| `CISCOSPARK_ACCESS_TOKEN`  | `WEBEX_ACCESS_TOKEN`  |
| `CISCOSPARK_APPID_ORGID`   | `WEBEX_APPID_ORGID`   |
| `CISCOSPARK_APPID_SECRET`  | `WEBEX_APPID_SECRET`  |
| `CISCOSPARK_CLIENT_ID`     | `WEBEX_CLIENT_ID`     |
| `CISCOSPARK_CLIENT_SECRET` | `WEBEX_CLIENT_SECRET` |
| `CISCOSPARK_LOG_LEVEL`     | `WEBEX_LOG_LEVEL`     |
| `CISCOSPARK_REDIRECT_URI`  | `WEBEX_REDIRECT_URI`  |
| `CISCOSPARK_SCOPE`         | `WEBEX_SCOPE`         |
