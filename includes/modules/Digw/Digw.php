<?php

class Digw extends ET_Builder_Module_Map {

	public $slug       = 'digw';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'http://www.playoutprod.com/modules/DGW',
		'author'     => 'playoutprod',
		'author_uri' => 'http://www.playoutprod.com',
	);

	public function custom_enqueue_scripts(){
		if ( et_pb_enqueue_google_maps_script() ) {
			wp_enqueue_script( 'google-maps-api' );
		}
	}

	public function init() {
		
		add_action('wp_enqueue_scripts', array($this,'custom_enqueue_scripts'), 101);

		$this->name = esc_html__( 'Waypoints map', 'digw-domain' );
		$this->icon_path =  plugin_dir_path( __FILE__ ) . 'sun.svg';
		$this->main_css_element = '%%order_class%%.additional_class';
		$this->child_slug      = 'et_pb_map_pin';
		$this->child_item_text = esc_html__( 'Pin', 'et_builder' );

		// définir les sections et les sous sections (toggles) par onglet
		$this->settings_modal_toggles = array(
			'general'  => array(
				'toggles' => array(
					'map' => esc_html__( 'Map', 'et_builder' ),
				),
			),
			'advanced' => array(
				'toggles' => array(
					'controls' => esc_html__( 'Controls', 'et_builder' ),
					'child_filters' => array(
						'title' => esc_html__( 'Map', 'et_builder' ),
						'priority' => 51,
					),
				),
			),
		);

		$this->advanced_fields = array(
			'box_shadow'            => array(
				'default' => array(
					'css' => array(
						'overlay' => 'inset',
					),
				),
			),
			'margin_padding' => array(
				'css' => array(
					'important' => array( 'custom_margin' ), // needed to overwrite last module margin-bottom styling
				),
			),
			'filters'               => array(
				'css' => array(
					'main' => '%%order_class%%',
				),
				'child_filters_target' => array(
					'tab_slug'    => 'advanced',
					'toggle_slug' => 'child_filters',
					'label'       => esc_html__( 'Map', 'et_builder' ),
				),
			),
			'child_filters'         => array(
				'css' => array(
					'main' => '%%order_class%% .gm-style>div>div>div>div>div>img',
				),
			),
			'height'                => array(
				'css' => array(
					'main'    => '%%order_class%% > .et_pb_map',
				),
				'options' => array(
					'height' => array(
						'default'         => '440px',
						'default_tablet'  => '350px',
						'default_phone'   => '200px',
					),
				),
			),
			'fonts'                 => false,
			'text'                  => false,
			'button'                => false,
			'position_fields'       => array(
				'default' => 'relative',
			),
		);
	}

	function render( $attrs, $content = null, $render_slug ) {

		$id = uniqid('digw-');

		$re = '/(\[et_pb_map_pin( title="([^"]*)")? pin_address="([^"]*)"( zoom_level="[^"]*")? pin_address_lat="([^"]*)" pin_address_lng="([^"]*)" _builder_version="[^"]*"( hover_enabled="[^"]*")?\]([^\[]*)\[\/et_pb_map_pin\])/m';
		preg_match_all($re, $content, $matches, PREG_SET_ORDER, 0);

		$pins = array();
		// Print the entire match result
		foreach ($matches as $key => $value) {
				$pin = array();
				$pin['title'] = str_replace("'","’",$value[3]);
				$pin['lat'] = $value[6];
				$pin['lng'] = $value[7];
				$pin['content'] = str_replace("'","’",$value[9]);
				array_push($pins,$pin);
		}

		return sprintf('
			 <div class="et_pb_map_container"><div data=\'%1$s\' class="digw et_pb_map" id="%2" lat="%3$g" lng="%4$g" zoom="%4$d"></div></div>',
			 json_encode($pins), $id, $this->props["address_lat"], $this->props["address_lng"],$this->props["zoom_level"]
		);

	}
}

new Digw;
