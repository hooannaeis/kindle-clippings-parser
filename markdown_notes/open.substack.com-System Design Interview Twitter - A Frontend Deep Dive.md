---
title: "System Design Interview Twitter - A Frontend Deep Dive"
author: "open.substack.com"
last_interaction: "2025-12-27T20:41:48.000Z"
---


## media optimization and sizing.

> research what those tags are about

Twitter’s front-end requests media in multiple resolutions and serves the appropriate variant based on device type, screen density, and layout size. This is typically achieved using the <img srcset> and <picture> elements or equivalent client-side logic.
