<?php
/**
 * Plugin Name: ToldYou Button
 * Description: Minimal WordPress integration for the ToldYou Button widget. Paste your Config ID and we will inject the hosted script on every page.
 * Version: 0.1.0
 * Author: ToldYou., Ltd.
 * License: GPL2+
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

if (!defined('TOLDYOU_BUTTON_WIDGET_BASE_URL')) {
    /**
     * Base URL (without trailing slash) that serves widget.js.
     * Update this constant if您的 ToldYou Button 服務部署在其他網域。
     */
    define('TOLDYOU_BUTTON_WIDGET_BASE_URL', 'https://chatbutton.backtrue.com');
}

if (!defined('TOLDYOU_BUTTON_WIDGET_VERSION')) {
    /**
     * Static version appended as ?v=... to the script URL.
     * 建議與主服務部署版本同步，以便快取失效。
     */
    define('TOLDYOU_BUTTON_WIDGET_VERSION', '1.0.0');
}

const TOLDYOU_BUTTON_OPTION_KEY = 'toldyou_button_config_id';

add_action('admin_init', 'toldyou_button_register_settings');
add_action('admin_menu', 'toldyou_button_register_menu_page');
add_action('wp_footer', 'toldyou_button_render_widget_script', 100);

/**
 * Register settings and field for the ToldYou Button Config ID.
 */
function toldyou_button_register_settings(): void
{
    register_setting(
        'toldyou_button',
        TOLDYOU_BUTTON_OPTION_KEY,
        [
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default'           => '',
        ]
    );

    add_settings_section(
        'toldyou_button_section',
        '',
        '__return_false',
        'toldyou-button'
    );

    add_settings_field(
        'toldyou_button_config_id_field',
        __('Config ID', 'toldyou-button'),
        'toldyou_button_render_input_field',
        'toldyou-button',
        'toldyou_button_section'
    );
}

/**
 * Add a "ToldYou Button" item under Settings.
 */
function toldyou_button_register_menu_page(): void
{
    add_options_page(
        __('ToldYou Button', 'toldyou-button'),
        __('ToldYou Button', 'toldyou-button'),
        'manage_options',
        'toldyou-button',
        'toldyou_button_render_settings_page'
    );
}

/**
 * Render the single Config ID input field.
 */
function toldyou_button_render_input_field(): void
{
    $config_id = get_option(TOLDYOU_BUTTON_OPTION_KEY, '');
    ?>
    <input
        type="text"
        id="toldyou_button_config_id"
        name="<?php echo esc_attr(TOLDYOU_BUTTON_OPTION_KEY); ?>"
        value="<?php echo esc_attr($config_id); ?>"
        class="regular-text"
        placeholder="例如：5fa0093d-0c74-4771-88e6-c485397573c2"
    />
    <p class="description">
        <?php echo wp_kses_post(__('請前往 ToldYou Button 產生器取得 <code>Config ID</code>，並貼上後儲存。', 'toldyou-button')); ?>
    </p>
    <?php
}

/**
 * Render the settings page wrapper.
 */
function toldyou_button_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('ToldYou Button', 'toldyou-button'); ?></h1>
        <p><?php esc_html_e('貼上從 ToldYou Button 成功頁或 Email 取得的 Config ID，儲存後即可在前台載入聊天按鈕。', 'toldyou-button'); ?></p>
        <form method="post" action="options.php">
            <?php
            settings_fields('toldyou_button');
            do_settings_sections('toldyou-button');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

/**
 * Inject the ToldYou Button script in the site footer when a Config ID is present.
 */
function toldyou_button_render_widget_script(): void
{
    if (is_admin()) {
        return;
    }

    $config_id = trim((string) get_option(TOLDYOU_BUTTON_OPTION_KEY, ''));

    if ($config_id === '') {
        return;
    }

    $config_id = apply_filters('toldyou_button_config_id', $config_id);
    $widget_src = apply_filters('toldyou_button_widget_src', toldyou_button_build_widget_src());

    if (!$widget_src) {
        return;
    }

    printf(
        "<script src='%s' data-config-id='%s'></script>\n",
        esc_url($widget_src),
        esc_attr($config_id)
    );
}

/**
 * Build the widget.js URL with cache-busting version parameter.
 */
function toldyou_button_build_widget_src(): string
{
    $base = untrailingslashit(TOLDYOU_BUTTON_WIDGET_BASE_URL) . '/widget.js';
    $version = TOLDYOU_BUTTON_WIDGET_VERSION;

    if ($version !== '') {
        $delimiter = strpos($base, '?') === false ? '?' : '&';
        return $base . $delimiter . 'v=' . rawurlencode($version);
    }

    return $base;
}
