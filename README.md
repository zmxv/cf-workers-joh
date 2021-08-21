# 👷 `cf-workers-joh` Cloudflare Job Openings History https://cloudflare.migrant.workers.dev

`cf-workers-joh` is a [Cloudflare Workers](https://developers.cloudflare.com/workers/) project that keeps track of Cloudflare's job opening changes.

This JavaScript Worker uses [Cron Triggers](https://developers.cloudflare.com/workers/platform/cron-triggers) to periodically scrape Cloudflare's job openings and stores snapshots in [Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv).
Job opening changes are then computed and displayed on the homepage.

The project is fully functional under Cloudflare's free plan.
It has no external dependencies and is intentionally kept small.
A larger project should probably leverage a framework such as [Flareact](https://flareact.com/).

To run in development mode:
```
wrangler dev
```

To deploy:
```
wrangler publish
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).

License: MIT
