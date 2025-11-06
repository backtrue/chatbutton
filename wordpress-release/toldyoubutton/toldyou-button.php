<?php
/**
 * Plugin Name: ToldYouButton
 * Description: Minimal WordPress integration for the ToldYouButton widget. Paste your Config ID and we will inject the hosted script on every page.
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
    define('TOLDYOU_BUTTON_WIDGET_BASE_URL', 'https://button.toldyou.co');
}

if (!defined('TOLDYOU_BUTTON_WIDGET_VERSION')) {
    /**
     * Static version appended as ?v=... to the script URL.
     * 建議與主服務部署版本同步，以便快取失效。
     */
    define('TOLDYOU_BUTTON_WIDGET_VERSION', '1.0.0');
}

const TOLDYOU_BUTTON_OPTION_KEY = 'toldyou_button_config_id';
const TOLDYOU_BUTTON_SCRIPT_HANDLE = 'toldyou-button-widget';

add_action('admin_init', 'toldyou_button_register_settings');
add_action('admin_menu', 'toldyou_button_register_menu_page');
add_action('wp_enqueue_scripts', 'toldyou_button_enqueue_widget_script');
add_filter('script_loader_tag', 'toldyou_button_add_config_id_attribute', 10, 3);

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
        'toldyoubutton'
    );

    add_settings_field(
        'toldyou_button_config_id_field',
        __('Config ID', 'toldyoubutton'),
        'toldyou_button_render_input_field',
        'toldyoubutton',
        'toldyou_button_section'
    );
}

/**
 * Add a "ToldYou Button" item under Settings.
 */
function toldyou_button_register_menu_page(): void
{
    add_options_page(
        __('ToldYou Button', 'toldyoubutton'),
        __('ToldYou Button', 'toldyoubutton'),
        'manage_options',
        'toldyoubutton',
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
        <?php
        printf(
            wp_kses(
                /* translators: %s is the link to ToldYouButton app. */
                __('請前往 <a href="%s" target="_blank" rel="noopener">ToldYouButton 產生器</a> 取得 <code>Config ID</code>，並貼上後儲存。', 'toldyoubutton'),
                [
                    'a'   => [
                        'href'   => [],
                        'target' => [],
                        'rel'    => [],
                    ],
                    'code' => [],
                ]
            ),
            esc_url('https://button.toldyou.co')
        );
        ?>
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
        <h1><?php esc_html_e('ToldYou Button', 'toldyoubutton'); ?></h1>
        <p><?php esc_html_e('貼上從 ToldYou Button 成功頁或 Email 取得的 Config ID，儲存後即可在前台載入聊天按鈕。', 'toldyoubutton'); ?></p>
        <form method="post" action="options.php">
            <?php
            settings_fields('toldyou_button');
            do_settings_sections('toldyoubutton');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

/**
 * Enqueue the ToldYouButton script when a Config ID is present.
 */
function toldyou_button_enqueue_widget_script(): void
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

    toldyou_button_store_config_id($config_id);

    wp_enqueue_script(
        TOLDYOU_BUTTON_SCRIPT_HANDLE,
        esc_url($widget_src),
        [],
        TOLDYOU_BUTTON_WIDGET_VERSION,
        true
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

/**
 * Store config ID for later use when filtering the script tag.
 */
function toldyou_button_store_config_id(string $config_id): void
{
    global $toldyou_button_config_id_for_tag;
    $toldyou_button_config_id_for_tag = $config_id;
}

/**
 * Retrieve the config ID stored for the script tag.
 */
function toldyou_button_get_stored_config_id(): string
{
    global $toldyou_button_config_id_for_tag;

    if (!isset($toldyou_button_config_id_for_tag)) {
        return '';
    }

    return (string) $toldyou_button_config_id_for_tag;
}

/**
 * Add data-config-id attribute to the enqueued script tag.
 */
function toldyou_button_add_config_id_attribute(string $tag, string $handle, string $src): string
{
    if (TOLDYOU_BUTTON_SCRIPT_HANDLE !== $handle) {
        return $tag;
    }

    $config_id = toldyou_button_get_stored_config_id();

    if ($config_id === '') {
        return $tag;
    }

    if (strpos($tag, ' data-config-id=') !== false) {
        return $tag;
    }

    $attribute = ' data-config-id="' . esc_attr($config_id) . '"';

    return preg_replace('/^(<script\b)/', '$1' . $attribute, $tag, 1);
}
