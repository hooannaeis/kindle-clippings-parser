---
title: "System Design Interview Twitter - A Frontend Deep Dive"
author: "open.substack.com"
last_interaction: "Samstag, 27. Dezember 2025 21:41:48"
---


## media optimization and sizing.

Twitter’s front-end requests media in multiple resolutions and serves the appropriate variant based on device type, screen density, and layout size. This is typically achieved using the <img srcset> and <picture> elements or equivalent client-side logic.
