<?php
/*
Plugin Name: mnTextSelector jQuery plugin
Plugin URI: https://github.com/mitnosirrag/mnTextSelector
Description: Quickly attach callback functions to user-highlighted text.
Author: Tim Garrison
Author URI: http://mitnosirrag.tumblr.com
Version: 1.2
*/

define('MNTEXTSELECTOR_VERSION','1.2');

add_action('init',array('MNTextSelectorPlugin','init'));

register_deactivation_hook(__FILE__,
    array('MNTextSelectorPlugin','uninstall'));

Class MNTextSelectorPlugin {

    static public function init() {
        add_action('admin_menu',
            array('MNTextSelectorPlugin','checkInstalled'));
        add_action('wp_enqueue_scripts',
            array('MNTextSelectorPlugin','initScripts'));
    }

    public static function checkInstalled() {
        if ( get_site_option('MNTEXTSELECTOR_VERSION') <
             MNTEXTSELECTOR_VERSION ) {
            self::install();
        }
    }

    public static function install() {
        update_site_option('MNTEXTSELECTOR_VERSION',
            MNTEXTSELECTOR_VERSION);
    }

    public static function uninstall() {
        delete_option('MNTEXTSELECTOR_VERSION');
    }

    public static function initScripts() {
        $src = self::getBaseURL() . '/js/jquery.mntextselector.closure.js';
        wp_register_script('mntextselector-closure',$src,array('jquery'));
        wp_enqueue_script('mntextselector-closure');
    }

    /*
    * gives us a starting point in the file system, used like DOC_ROOT
    */
    public static function getBasePath() {
        $folder = basename(dirname(__FILE__));
        return WP_PLUGIN_DIR . '/' . $folder;
    }

    /*
    * root URL for this plugin
    */
    public static function getBaseURL() {
        $folder = basename(dirname(__FILE__));
        return plugins_url($folder);
    }

}
