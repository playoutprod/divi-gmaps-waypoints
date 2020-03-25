<?php
/*
Plugin Name: Divi Gmaps Waypoints
Plugin URI:  http://www.playoutprod.com/modules/DGW
Description: Google maps itinerary and waypoints module
Version:     1.0.0
Author:      playoutprod
Author URI:  http://www.playoutprod.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: digw-divi-gmaps-waypoints
Domain Path: /languages

Divi Gmaps Waypoints is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

Divi Gmaps Waypoints is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Divi Gmaps Waypoints. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
*/


if ( ! function_exists( 'digw_initialize_extension' ) ):
/**
 * Creates the extension's main class instance.
 *
 * @since 1.0.0
 */
function digw_initialize_extension() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/DiviGmapsWaypoints.php';
}
add_action( 'divi_extensions_init', 'digw_initialize_extension' );
endif;
