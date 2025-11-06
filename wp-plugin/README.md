# ToldYouButton – WordPress Plugin (P1.W MVP)

This folder contains the minimal WordPress plugin that bridges a ToldYouButton **Config ID** into any WordPress site by injecting the hosted `widget.js` script at the footer.

## Files

- `toldyou-button.php` – single-file plugin that registers a Settings page, stores the Config ID, and prints the script in `wp_footer`.

## Getting Started

1. Update the constants at the top of `toldyou-button.php` if needed:
   - `TOLDYOU_BUTTON_WIDGET_BASE_URL` – base domain serving `widget.js` (default: `https://button.toldyou.co`).
   - `TOLDYOU_BUTTON_WIDGET_VERSION` – query parameter appended as `?v=...` for cache busting.
2. Zip the folder as `toldyou-button.zip`.
3. Upload or copy the plugin to WordPress:
   - **Option A:** WordPress Admin → Plugins → Add New → Upload Plugin → choose the zip and install.
   - **Option B:** Copy the folder to `/wp-content/plugins/` in your environment.
4. Activate **ToldYouButton** in the Plugins list.
5. Navigate to **Settings → ToldYouButton**, paste the Config ID from the ToldYouButton web app success page/email, and click Save.

## Expected behaviour

- When a Config ID exists, the plugin injects `<script src="{BASE_URL}/widget.js?v={VERSION}" data-config-id="{ID}"></script>` at the bottom of every public page.
- When the Config ID field is empty, no script is output.

## QA Checklist

- [ ] Save with a valid Config ID → script appears in the site footer and the ToldYou widget renders.
- [ ] Clear the Config ID → script is removed after refreshing the frontend.
- [ ] Update Config ID → refreshed frontend loads the new widget config.

## Next steps / enhancements

- Internationalize strings via `load_plugin_textdomain`.
- Add validation or copy button on the settings page (stretch goal).
- Provide screenshots and description for WordPress.org listing.
