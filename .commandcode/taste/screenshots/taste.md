# screenshots
- For team previews meant to be reviewed offline, deliver full-page screenshots saved as PNGs in the project's `screenshots/` directory (named `<page>-full.png`), not just live URLs. Confidence: 0.7
- Before capturing a full-page screenshot, scroll stepwise through the page (repeated `scrollBy` with pauses) to trigger lazy-loaded images and embeds, wait until every `<img>` reports `complete && naturalWidth > 0`, then scroll back to top and capture — otherwise below-the-fold assets render as black boxes. Confidence: 0.8
- Lazy iframes (video/trailer embeds) need extra dwell time centered in view (~5–10s) before they mount and render; verify with a quick viewport screenshot before the final full-page capture. Confidence: 0.7
- Run browser automation in an isolated named session (e.g., `agent-browser --session <project>-shots`) instead of the default shared session, so concurrently open human/other-agent tabs can't hijack or pollute captures. Confidence: 0.7
- Always visually verify each captured screenshot by reading the image back and checking for black boxes or missing content before handing it off. Confidence: 0.7
- Clean up fully after browser capture tasks: delete temporary check screenshots, close the browser session, and kill the background dev server that was started for the task. Confidence: 0.7
