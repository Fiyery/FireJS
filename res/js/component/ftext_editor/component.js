"use strict";

class ComponentFTextEditor extends Component {

    static tag = "ftext_editor";

	constructor(element) {
        super(element);

		// Set command with css style inline attributs.
		document.execCommand("styleWithCSS", null, true);
		
		// For switching mode WYSIWYG / HTML.
		this.data = {};
		this.data.mode_wysiwyg = true

		// Load content save into localStorage.
		this.data.load_save = (typeof this.element.attr("data-load-save") !== "undefined") ? (this.element.attr("data-load-save") === "1") : (true);
		this.data.save_id = this.element.attr("data-save-id") || "commun";
		this.data.save_time = this.element.attr("data-save-time") || 10;

		this.data.form_id = this.element.attr("form") || null;

		// For the selection.
		this.global_range = null;

		// Call Command.
		this.commands = {
			// Basic formatage.
			"bold" : "bold",
			"italic" : "italic",
			"underline" : "underline",
			"strikethrough" : "strikethrough",
			"clear" : "removeFormat",
			// Alignement.
			"justifyleft" : "justifyleft",
			"justifyright" : "justifyright",
			"justifycenter" : "justifycenter",
			"justifyfull" : "justifyfull",
			"outdent" : "outdent",
			"indent" : "indent",
			// List.
			"unorderedlist" : "insertunorderedlist",
			"orderedlist" : "insertorderedlist",
			// Externe.
			"link" : "createLink",
		};
    }

	bind(html) {
		html = super.bind(html);
		html = html.replace(/{\$image}/gm, this.element.attr("data-dir-image"));
		html = html.replace(/{\$name}/gm, this.element.attr("name"));
		delete this.attributes["data-dir-image"];
		delete this.attributes["data-load-save"];
		delete this.attributes["data-save-id"];
		delete this.attributes["data-save-time"];
		return html;
	}

    html() {
        return `
			<div class='ftext_editor'>
				<div class='menu'>
					<div class='group_command mode_wysiwyg'>
						<!-- Bold -->
						<button class='button bold' title='Gras'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z" />
							</svg>
						</button>

						<!-- Italic -->
						<button class='button italic' title='Italique'>
							<svg fill="#444" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 0h24v24H0z" fill="none"/>
								<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
							</svg>
						</button>

						<!--  Underline -->
						<button class='button underline' title='Souligné'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z" />
							</svg>
						</button>

						<!--  Strike -->
						<button class='button strikethrough' title='Barré'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,14H21V12H3M5,4V7H10V10H14V7H19V4M10,19H14V16H10V19Z" />
							</svg>
						</button>
					</div>

					<div class='group_command mode_wysiwyg'>
						<!-- Color -->
						<button class='button color' title='Couleur'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z" />
							</svg>
						</button>
						<div class='toolkit'>
							<!-- Red -->
							<div class='palette'>
								<button data-color='#ffebee' title='#ffebee'></button>
								<button data-color='#ffcdd2' title='#ffcdd2'></button>
								<button data-color='#ef9a9a' title='#ef9a9a'></button>
								<button data-color='#e57373' title='#e57373'></button>
								<button data-color='#ef5350' title='#ef5350'></button>
								<button data-color='#f44336' title='#f44336'></button>
								<button data-color='#e53935' title='#e53935'></button>
								<button data-color='#d32f2f' title='#d32f2f'></button>
								<button data-color='#c62828' title='#c62828'></button>
								<button data-color='#b71c1c' title='#b71c1c'></button>
							</div>
							<!-- Pink -->
							<div class='palette'> 
								<button data-color='#fce4ec' title='#fce4ec'></button>
								<button data-color='#f8bbd0' title='#f8bbd0'></button>
								<button data-color='#f48fb1' title='#f48fb1'></button>
								<button data-color='#f06292' title='#f06292'></button>
								<button data-color='#ec407a' title='#ec407a'></button>
								<button data-color='#e91e63' title='#e91e63'></button>
								<button data-color='#d81b60' title='#d81b60'></button>
								<button data-color='#c2185b' title='#c2185b'></button>
								<button data-color='#ad1457' title='#ad1457'></button>
								<button data-color='#880e4f' title='#880e4f'></button>
							</div> 
							<!-- Purple -->
							<div class='palette'> 
								<button data-color='#f3e5f5' title='#f3e5f5'></button>
								<button data-color='#e1bee7' title='#e1bee7'></button>
								<button data-color='#ce93d8' title='#ce93d8'></button>
								<button data-color='#ba68c8' title='#ba68c8'></button>
								<button data-color='#ab47bc' title='#ab47bc'></button>
								<button data-color='#9c27b0' title='#9c27b0'></button>
								<button data-color='#8e24aa' title='#8e24aa'></button>
								<button data-color='#7b1fa2' title='#7b1fa2'></button>
								<button data-color='#6a1b9a' title='#6a1b9a'></button>
								<button data-color='#4a148c' title='#4a148c'></button>
							</div> 
							<!-- Deep Purple -->
							<div class='palette'> 
								<button data-color='#ede7f6' title='#ede7f6'></button>
								<button data-color='#d1c4e9' title='#d1c4e9'></button>
								<button data-color='#b39ddb' title='#b39ddb'></button>
								<button data-color='#9575cd' title='#9575cd'></button>
								<button data-color='#7e57c2' title='#7e57c2'></button>
								<button data-color='#673ab7' title='#673ab7'></button>
								<button data-color='#5e35b1' title='#5e35b1'></button>
								<button data-color='#512da8' title='#512da8'></button>
								<button data-color='#4527a0' title='#4527a0'></button>
								<button data-color='#311b92' title='#311b92'></button>
							</div> 
							<!-- Indigo -->
							<div class='palette'> 
								<button data-color='#e8eaf6' title='#e8eaf6'></button>
								<button data-color='#c5cae9' title='#c5cae9'></button>
								<button data-color='#9fa8da' title='#9fa8da'></button>
								<button data-color='#7986cb' title='#7986cb'></button>
								<button data-color='#5c6bc0' title='#5c6bc0'></button>
								<button data-color='#3f51b5' title='#3f51b5'></button>
								<button data-color='#3949ab' title='#3949ab'></button>
								<button data-color='#303f9f' title='#303f9f'></button>
								<button data-color='#283593' title='#283593'></button>
								<button data-color='#1a237e' title='#1a237e'></button>
							</div> 
							<!-- Blue -->
							<div class='palette'> 
								<button data-color='#e3f2fd' title='#e3f2fd'></button>
								<button data-color='#bbdefb' title='#bbdefb'></button>
								<button data-color='#90caf9' title='#90caf9'></button>
								<button data-color='#64b5f6' title='#64b5f6'></button>
								<button data-color='#42a5f5' title='#42a5f5'></button>
								<button data-color='#2196f3' title='#2196f3'></button>
								<button data-color='#1e88e5' title='#1e88e5'></button>
								<button data-color='#1976d2' title='#1976d2'></button>
								<button data-color='#1565c0' title='#1565c0'></button>
								<button data-color='#0d47a1' title='#0d47a1'></button>
							</div> 
							<!-- Light Blue -->
							<div class='palette'> 
								<button data-color='#e1f5fe' title='#e1f5fe'></button>
								<button data-color='#b3e5fc' title='#b3e5fc'></button>
								<button data-color='#81d4fa' title='#81d4fa'></button>
								<button data-color='#4fc3f7' title='#4fc3f7'></button>
								<button data-color='#29b6f6' title='#29b6f6'></button>
								<button data-color='#03a9f4' title='#03a9f4'></button>
								<button data-color='#039be5' title='#039be5'></button>
								<button data-color='#0288d1' title='#0288d1'></button>
								<button data-color='#0277bd' title='#0277bd'></button>
								<button data-color='#01579b' title='#01579b'></button>
							</div> 
							<!-- Cyan -->
							<div class='palette'> 
								<button data-color='#e0f7fa' title='#e0f7fa'></button>
								<button data-color='#b2ebf2' title='#b2ebf2'></button>
								<button data-color='#80deea' title='#80deea'></button>
								<button data-color='#4dd0e1' title='#4dd0e1'></button>
								<button data-color='#26c6da' title='#26c6da'></button>
								<button data-color='#00bcd4' title='#00bcd4'></button>
								<button data-color='#00acc1' title='#00acc1'></button>
								<button data-color='#0097a7' title='#0097a7'></button>
								<button data-color='#00838f' title='#00838f'></button>
								<button data-color='#006064' title='#006064'></button>
							</div> 
							<!-- Teal -->
							<div class='palette'> 
								<button data-color='#e0f2f1' title='#e0f2f1'></button>
								<button data-color='#b2dfdb' title='#b2dfdb'></button>
								<button data-color='#80cbc4' title='#80cbc4'></button>
								<button data-color='#4db6ac' title='#4db6ac'></button>
								<button data-color='#26a69a' title='#26a69a'></button>
								<button data-color='#009688' title='#009688'></button>
								<button data-color='#00897b' title='#00897b'></button>
								<button data-color='#00796b' title='#00796b'></button>
								<button data-color='#00695c' title='#00695c'></button>
								<button data-color='#004d40' title='#004d40'></button>
							</div> 
							<!-- Green -->
							<div class='palette'> 
								<button data-color='#e8f5e9' title='#e8f5e9'></button>
								<button data-color='#c8e6c9' title='#c8e6c9'></button>
								<button data-color='#a5d6a7' title='#a5d6a7'></button>
								<button data-color='#81c784' title='#81c784'></button>
								<button data-color='#66bb6a' title='#66bb6a'></button>
								<button data-color='#4caf50' title='#4caf50'></button>
								<button data-color='#43a047' title='#43a047'></button>
								<button data-color='#388e3c' title='#388e3c'></button>
								<button data-color='#2e7d32' title='#2e7d32'></button>
								<button data-color='#1b5e20' title='#1b5e20'></button>
							</div> 
							<!-- Light Green -->
							<div class='palette'> 
								<button data-color='#f1f8e9' title='#f1f8e9'></button>
								<button data-color='#dcedc8' title='#dcedc8'></button>
								<button data-color='#c5e1a5' title='#c5e1a5'></button>
								<button data-color='#aed581' title='#aed581'></button>
								<button data-color='#9ccc65' title='#9ccc65'></button>
								<button data-color='#8bc34a' title='#8bc34a'></button>
								<button data-color='#7cb342' title='#7cb342'></button>
								<button data-color='#689f38' title='#689f38'></button>
								<button data-color='#558b2f' title='#558b2f'></button>
								<button data-color='#33691e' title='#33691e'></button>
							</div> 
							<!-- Lime -->
							<div class='palette'> 
								<button data-color='#f9fbe7' title='#f9fbe7'></button>
								<button data-color='#f0f4c3' title='#f0f4c3'></button>
								<button data-color='#e6ee9c' title='#e6ee9c'></button>
								<button data-color='#dce775' title='#dce775'></button>
								<button data-color='#d4e157' title='#d4e157'></button>
								<button data-color='#cddc39' title='#cddc39'></button>
								<button data-color='#c0ca33' title='#c0ca33'></button>
								<button data-color='#afb42b' title='#afb42b'></button>
								<button data-color='#9e9d24' title='#9e9d24'></button>
								<button data-color='#827717' title='#827717'></button>
							</div> 
							<!-- Yellow -->
							<div class='palette'> 
								<button data-color='#fffde7' title='#fffde7'></button>
								<button data-color='#fff9c4' title='#fff9c4'></button>
								<button data-color='#fff59d' title='#fff59d'></button>
								<button data-color='#fff176' title='#fff176'></button>
								<button data-color='#ffee58' title='#ffee58'></button>
								<button data-color='#ffeb3b' title='#ffeb3b'></button>
								<button data-color='#fdd835' title='#fdd835'></button>
								<button data-color='#fbc02d' title='#fbc02d'></button>
								<button data-color='#f9a825' title='#f9a825'></button>
								<button data-color='#f57f17' title='#f57f17'></button>
							</div> 
							<!-- Amber -->
							<div class='palette'> 
								<button data-color='#fff8e1' title='#fff8e1'></button>
								<button data-color='#ffecb3' title='#ffecb3'></button>
								<button data-color='#ffe082' title='#ffe082'></button>
								<button data-color='#ffd54f' title='#ffd54f'></button>
								<button data-color='#ffca28' title='#ffca28'></button>
								<button data-color='#ffc107' title='#ffc107'></button>
								<button data-color='#ffb300' title='#ffb300'></button>
								<button data-color='#ffa000' title='#ffa000'></button>
								<button data-color='#ff8f00' title='#ff8f00'></button>
								<button data-color='#ff6f00' title='#ff6f00'></button>
							</div> 
							<!-- Orange -->
							<div class='palette'> 
								<button data-color='#fff3e0' title='#fff3e0'></button>
								<button data-color='#ffe0b2' title='#ffe0b2'></button>
								<button data-color='#ffcc80' title='#ffcc80'></button>
								<button data-color='#ffb74d' title='#ffb74d'></button>
								<button data-color='#ffa726' title='#ffa726'></button>
								<button data-color='#ff9800' title='#ff9800'></button>
								<button data-color='#fb8c00' title='#fb8c00'></button>
								<button data-color='#f57c00' title='#f57c00'></button>
								<button data-color='#ef6c00' title='#ef6c00'></button>
								<button data-color='#e65100' title='#e65100'></button>
							</div> 
							<!-- Deep Orange -->
							<div class='palette'> 
								<button data-color='#fbe9e7' title='#fbe9e7'></button>
								<button data-color='#ffccbc' title='#ffccbc'></button>
								<button data-color='#ffab91' title='#ffab91'></button>
								<button data-color='#ff8a65' title='#ff8a65'></button>
								<button data-color='#ff7043' title='#ff7043'></button>
								<button data-color='#ff5722' title='#ff5722'></button>
								<button data-color='#f4511e' title='#f4511e'></button>
								<button data-color='#e64a19' title='#e64a19'></button>
								<button data-color='#d84315' title='#d84315'></button>
								<button data-color='#bf360c' title='#bf360c'></button>
							</div> 
							<!-- Brown -->
							<div class='palette'> 
								<button data-color='#efebe9' title='#efebe9'></button>
								<button data-color='#d7ccc8' title='#d7ccc8'></button>
								<button data-color='#bcaaa4' title='#bcaaa4'></button>
								<button data-color='#a1887f' title='#a1887f'></button>
								<button data-color='#8d6e63' title='#8d6e63'></button>
								<button data-color='#795548' title='#795548'></button>
								<button data-color='#6d4c41' title='#6d4c41'></button>
								<button data-color='#5d4037' title='#5d4037'></button>
								<button data-color='#4e342e' title='#4e342e'></button>
								<button data-color='#3e2723' title='#3e2723'></button>
							</div> 
							<!-- Grey -->
							<div class='palette'> 
								<button data-color='#fafafa' title='#fafafa'></button>
								<button data-color='#f5f5f5' title='#f5f5f5'></button>
								<button data-color='#eeeeee' title='#eeeeee'></button>
								<button data-color='#e0e0e0' title='#e0e0e0'></button>
								<button data-color='#bdbdbd' title='#bdbdbd'></button>
								<button data-color='#9e9e9e' title='#9e9e9e'></button>
								<button data-color='#757575' title='#757575'></button>
								<button data-color='#616161' title='#616161'></button>
								<button data-color='#424242' title='#424242'></button>
								<button data-color='#212121' title='#212121'></button>
							</div> 
							<!-- Blue Grey -->
							<div class='palette'> 
								<button data-color='#eceff1' title='#eceff1'></button>
								<button data-color='#cfd8dc' title='#cfd8dc'></button>
								<button data-color='#b0bec5' title='#b0bec5'></button>
								<button data-color='#90a4ae' title='#90a4ae'></button>
								<button data-color='#78909c' title='#78909c'></button>
								<button data-color='#607d8b' title='#607d8b'></button>
								<button data-color='#546e7a' title='#546e7a'></button>
								<button data-color='#455a64' title='#455a64'></button>
								<button data-color='#37474f' title='#37474f'></button>
								<button data-color='#263238' title='#263238'></button>
							</div>
						</div>

						<!-- Size -->
						<button class='button size' title='Taille'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,12H6V19H9V12H12V9H3M9,4V7H14V19H17V7H22V4H9Z" />
							</svg>
						</button>
						<div class='toolkit'>
							<input type='range' min='8' max='70'/> 
							<label>16</label>
						</div>


						<!-- Clear -->
						<button class='button clear' title='Effacer la mise en forme'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M6,5V5.18L8.82,8H11.22L10.5,9.68L12.6,11.78L14.21,8H20V5H6M3.27,5L2,6.27L8.97,13.24L6.5,19H9.5L11.07,15.34L16.73,21L18,19.73L3.55,5.27L3.27,5Z" />
							</svg>
						</button>
					</div>

					<div class='group_command mode_wysiwyg'>
						<!-- Align left -->
						<button class='button justifyleft' title='Aligné à gauche'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z" />
							</svg>
						</button>

						<!-- Align right -->
						<button class='button justifyright' title='Aligné à droite'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,3H21V5H3V3M9,7H21V9H9V7M3,11H21V13H3V11M9,15H21V17H9V15M3,19H21V21H3V19Z" />
							</svg>
						</button>

						<!-- Align center -->
						<button class='button justifycenter' title='Centré'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,3H21V5H3V3M7,7H17V9H7V7M3,11H21V13H3V11M7,15H17V17H7V15M3,19H21V21H3V19Z" />
							</svg>
						</button>

						<!-- Align justify -->
						<button class='button justifyfull' title='Justifié'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z" />
							</svg>
						</button>

						<!-- Indent -->
						<button class='button indent'  title='Indenté'>
							<svg fill="#444" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
								<path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
								<path d="M0 0h24v24H0z" fill="none"/>
							</svg>
						</button>

						<!-- Oudent -->
						<button class='button outdent'  title='Désindenté'>
							<svg fill="#444" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
								<path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
								<path d="M0 0h24v24H0z" fill="none"/>
							</svg>
						</button>
					</div>

					<div class='group_command mode_wysiwyg'>
						<!-- Header 1 -->
						<button class='button h1'  title='Titre 1'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M14,18V16H16V6.31L13.5,7.75V5.44L16,4H18V16H20V18H14Z" />
							</svg>
						</button>

						<!-- Header 2 -->
						<button class='button h2' title='Titre 2'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M21,18H15A2,2 0 0,1 13,16C13,15.47 13.2,15 13.54,14.64L18.41,9.41C18.78,9.05 19,8.55 19,8A2,2 0 0,0 17,6A2,2 0 0,0 15,8H13A4,4 0 0,1 17,4A4,4 0 0,1 21,8C21,9.1 20.55,10.1 19.83,10.83L15,16H21V18Z" />
							</svg>
						</button>

						<!-- Header 3  -->
						<button class='button h3' title='Titre 3'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M15,4H19A2,2 0 0,1 21,6V16A2,2 0 0,1 19,18H15A2,2 0 0,1 13,16V15H15V16H19V12H15V10H19V6H15V7H13V6A2,2 0 0,1 15,4Z" />
							</svg>
						</button>

						<!-- Header 4  -->
						<button class='button h4' title='Titre 4'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M18,18V13H13V11L18,4H20V11H21V13H20V18H18M18,11V7.42L15.45,11H18Z" />
							</svg>
						</button>
					</div>

					<div class='group_command mode_wysiwyg'>
						<!-- List point  -->
						<button class='button unorderedlist' title='Liste de point'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" />
							</svg>
						</button>

						<!-- List number -->
						<button class='button orderedlist' title='Liste de chiffre'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M7,13H21V11H7M7,19H21V17H7M7,7H21V5H7M2,11H3.8L2,13.1V14H5V13H3.2L5,10.9V10H2M3,8H4V4H2V5H3M2,17H4V17.5H3V18.5H4V19H2V20H5V16H2V17Z" />
							</svg>
						</button>
					</div>

					<div class='group_command mode_wysiwyg'>
						<!-- Link -->
						<button class='button link'  title='Lien'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
							</svg>
						</button>

						<!-- Image -->
						<button class='button image'  title='Image'>
							<svg fill="#444" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24">
								<path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
							</svg>
						</button>
						<div class='toolkit'>
							<div class='upload_img'>
								<input type='file' title="Importer une image depuis l'ordinateur"/>
								<button class='button'>
									<svg fill="#444" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
										<path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
										<path d="M0 0h24v24H0z" fill="none"/>
									</svg>
								</button>
							</div>
							<div class='cloud_img'>
								<input type='text' placeholder="URL Image"/>
								<button class='button' title="Importer depuis le web avec une URL">
									<svg fill="#444" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
										<path d="M0 0h24v24H0z" fill="none"/>
										<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
									</svg>
								</button>
							</div>
						</div>

						<!-- Emoticon -->
						<button class='button emoticone'  title='Emoticône'>
							<svg fill="#444" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 0h24v24H0z" fill="none"/>
								<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
							</svg>
						</button>
						<div class='toolkit emoji'>					
							
							<img src="{$image}angry-face.png"/>
							<img src="{$image}anguished-face.png"/>
							<img src="{$image}astonished-face.png"/>
							<img src="{$image}confounded-face.png"/>
							<img src="{$image}confused-face.png"/>
							<img src="{$image}crying-face.png"/>
							<img src="{$image}disappointed-but-relieved-face.png"/>
							<img src="{$image}disappointed-face.png"/>
							<img src="{$image}dizzy-face.png"/>
							<img src="{$image}drooling-face.png"/>
							<img src="{$image}expressionless-face.png"/>
							<img src="{$image}face-savouring-delicious-food.png"/>
							<img src="{$image}face-screaming-in-fear.png"/>
							<img src="{$image}face-throwing-a-kiss.png"/>
							<img src="{$image}face-with-cold-sweat.png"/>
							<img src="{$image}face-with-finger-covering-closed-lips.png"/>
							<img src="{$image}face-with-head-bandage.png"/>
							<img src="{$image}face-with-look-of-triumph.png"/>
							<img src="{$image}face-with-medical-mask.png"/>
							<img src="{$image}face-with-monocle.png"/>
							<img src="{$image}face-with-one-eyebrow-raised.png"/>
							<img src="{$image}face-with-open-mouth-and-cold-sweat.png"/>
							<img src="{$image}face-with-open-mouth-vomiting.png"/>
							<img src="{$image}face-with-open-mouth.png"/>
							<img src="{$image}face-with-rolling-eyes.png"/>
							<img src="{$image}face-with-stuck-out-tongue-and-tightly-closed-eyes.png"/>
							<img src="{$image}face-with-stuck-out-tongue-and-winking-eye.png"/>
							<img src="{$image}face-with-stuck-out-tongue.png"/>
							<img src="{$image}face-with-tears-of-joy.png"/>
							<img src="{$image}face-with-thermometer.png"/>
							<img src="{$image}fearful-face.png"/>
							<img src="{$image}flushed-face.png"/>
							<img src="{$image}frowning-face-with-open-mouth.png"/>
							<img src="{$image}grimacing-face.png"/>
							<img src="{$image}grinning-face-with-one-large-and-one-small-eye.png"/>
							<img src="{$image}grinning-face-with-smiling-eyes.png"/>
							<img src="{$image}grinning-face-with-star-eyes.png"/>
							<img src="{$image}grinning-face.png"/>
							<img src="{$image}hushed-face.png"/>
							<img src="{$image}kissing-face-with-closed-eyes.png"/>
							<img src="{$image}kissing-face-with-smiling-eyes.png"/>
							<img src="{$image}kissing-face.png"/>
							<img src="{$image}loudly-crying-face.png"/>
							<img src="{$image}money-mouth-face.png"/>
							<img src="{$image}nauseated-face.png"/>
							<img src="{$image}nerd-face.png"/>
							<img src="{$image}neutral-face.png"/>
							<img src="{$image}pensive-face.png"/>
							<img src="{$image}persevering-face.png"/>
							<img src="{$image}pouting-face.png"/>
							<img src="{$image}relieved-face.png"/>
							<img src="{$image}rolling-on-the-floor-laughing.png"/>
							<img src="{$image}serious-face-with-symbols-covering-mouth.png"/>
							<img src="{$image}shocked-face-with-exploding-head.png"/>
							<img src="{$image}sleeping-face.png"/>
							<img src="{$image}sleepy-face.png"/>
							<img src="{$image}slightly-frowning-face.png"/>
							<img src="{$image}slightly-smiling-face.png"/>
							<img src="{$image}smiling-face-with-halo.png"/>
							<img src="{$image}smiling-face-with-heart-shaped-eyes.png"/>
							<img src="{$image}smiling-face-with-open-mouth-and-cold-sweat.png"/>
							<img src="{$image}smiling-face-with-open-mouth-and-smiling-eyes.png"/>
							<img src="{$image}smiling-face-with-open-mouth-and-tightly-closed-eyes.png"/>
							<img src="{$image}smiling-face-with-open-mouth.png"/>
							<img src="{$image}smiling-face-with-smiling-eyes-and-hand-covering-mouth.png"/>
							<img src="{$image}smiling-face-with-smiling-eyes.png"/>
							<img src="{$image}smiling-face-with-sunglasses.png"/>
							<img src="{$image}smirking-face.png"/>
							<img src="{$image}sneezing-face.png"/>
							<img src="{$image}thinking-face.png"/>
							<img src="{$image}tired-face.png"/>
							<img src="{$image}unamused-face.png"/>
							<img src="{$image}upside-down-face.png"/>
							<img src="{$image}weary-face.png"/>
							<img src="{$image}white-frowning-face.png"/>
							<img src="{$image}white-smiling-face.png"/>
							<img src="{$image}winking-face.png"/>
							<img src="{$image}worried-face.png"/>
							<img src="{$image}zipper-mouth-face.png"/>
						</div>
					</div>
					
					<div class='group_command'>
						<!-- Code -->
						<button class='button code'  title='Edition HTML'>
							<svg fill="#444" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 0h24v24H0V0z" fill="none"/>
								<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
							</svg>
						</button>
					</div>
				</div>
				<div class='body'>
					<div class="bloc_content">
						<div class="content" contentEditable="true"></div>
						<textarea class="content hide" name="{$name}"></textarea>
					</div>
					<div class="save_info"></div>
				</div>
			</div>
        `;
    }

	action() {
		super.action();
		let that = this;

		// Reset textarea.
		that.new_element.find("textarea.content").val("");

		that.init_save();

		for(let name in this.commands) {
			that.new_element.find(".button."+name).on("click", function(){
				if (!this.parent().hasClass("disabled")) {
					that.command(that.commands[name]);
				}
				return false;
			});
		}

		for(let i = 1; i <= 4; i++) {
			that.new_element.find(".button.h"+i).on("click", function(){
				if (!this.parent().hasClass("disabled")) {
					that.command("formatBlock", "<h"+i+">");
				}
				return false;
			});
		}

		// Image Toolkit.
		that.new_element.find(".button.image + .toolkit").hide();
		that.new_element.find(".button.image").on("click", function(){
			if (!this.parent().hasClass("disabled")) {
				that.toggle_toolkit(this, "image");

				// Sauvegarde de la sélection.
				that.global_range = document.getSelection().getRangeAt(0);
			}
			return false;
		});

		// Insert image from computer (file to base64).
		that.new_element.find(".button.image + .toolkit input[type='file']").on("change", function(){
			if (this.element.files && this.element.files[0]) {
				let fr = new FileReader();
				fr.onload = function(e) {
					let sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(that.global_range);
					that.command("insertImage", e.target.result);
					that.new_element.find(".button.image").removeClass("active");
					that.new_element.find(".button.image + .toolkit").hide();
				};       
				fr.readAsDataURL( this.element.files[0]);
			}
		});

		// Insert image from url (url to base64).
		that.new_element.find(".button.image + .toolkit input[type='text'] + button").on("click", function(){
			let sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(that.global_range);
			that.command("insertImage", this.prev().val());
			that.new_element.find(".button.image").removeClass("active");
			that.new_element.find(".button.image + .toolkit").hide();
			return false;
		});


		// Size Toolkit.
		that.new_element.find(".button.size + .toolkit").hide();
		that.new_element.find(".button.size").on("click", function(){
			if (!this.parent().hasClass("disabled")) {
				that.toggle_toolkit(this, "size");
			}
			return false;
		});
		that.new_element.find(".button.size + .toolkit input").on("input", function() {
			this.next().node().innerText = this.val();
			that.span_command("font-size", this.val()+"px");
		});

		// Color Toolkit.
		that.new_element.find(".button.color + .toolkit").hide();
		that.new_element.find(".button.color").on("click", function(){
			if (!this.parent().hasClass("disabled")) {
				if (that.toggle_toolkit(this, "color")) {
					let div = that.new_element.find(".button.color + .toolkit .palette button");
					for (let i = 0; i < div.size(); i++) {
						let d = div.eq(i);
						d.node().style.backgroundColor = d.data("color");
					}
				}
			}
			return false;
		});

		that.new_element.find(".button.color + .toolkit .palette button").on("click", function(){
			that.span_command("color", this.data("color"));
			that.new_element.find(".button.color").toggleClass("active");
			that.new_element.find(".button.color + .toolkit").toggle();
			return false;
		});

		// Smiley toolkit.
		that.new_element.find(".button.emoticone + .toolkit").hide();
		that.new_element.find(".button.emoticone").on("click", function(){
			if (!this.parent().hasClass("disabled")) {
				that.toggle_toolkit(this, "emoticone");
			}
			return false;
		});
		that.new_element.find(".button.emoticone + .toolkit img").on("click", function(){
			that.command("insertImage", this.get("src"));
			that.new_element.find(".button.emoticone").toggleClass("active");
			that.new_element.find(".button.emoticone + .toolkit").toggle();
			return false;
		});

		// HTML Editing.
		that.new_element.find(".button.code").on("click", function(){
			let div = that.new_element.find("div.content")
			let textarea = that.new_element.find("textarea.content");
			if (that.data.mode_wysiwyg) {
				textarea.val(div.html());
				div.html("");
			} else {
				div.html(textarea.val());
				textarea.val("");
			}
			that.data.mode_wysiwyg = !that.data.mode_wysiwyg;
			div.toggleClass("hide");
			textarea.toggleClass("hide");
			return false;
		});
	}

	init_save() {
		// If there is a save, it's loaded.
		if (this.data.load_save) {
			let content = localStorage.getItem("ftext_editor_save_" + this.data.save_id);
			this.new_element.find("div.content").html(content);
			this.new_element.find("textarea.content").val(content);
		}

		this.interval_save = setInterval(()=>{
			if (this.data.mode_wysiwyg) {
				localStorage.setItem("ftext_editor_save_" + this.data.save_id, this.new_element.find("div.content").html());
			} else {
				localStorage.setItem("ftext_editor_save_" + this.data.save_id, this.new_element.find("textarea.content").val());
			}
			let date = new Date();
			let h = date.getHours();
			if (h < 10) {
				h = "0" + h;
			}
			let i = date.getMinutes();
			if (i < 10) {
				i = "0" + i;
			}
			let s = date.getSeconds();
			if (s < 10) {
				s = "0" + s;
			}
			let d = date.getDate();
			if (d < 10) {
				d = "0" + d;
			}
			let m = date.getMonth() + 1;
			if (m < 10) {
				m = "0" + m;
			}
			let y = date.getFullYear();
			this.new_element.find(".save_info").html("Dernière sauvegarde : "+d+"/"+m+"/"+y+" à "+h+":"+i+":"+s);
		}, this.data.save_time * 1000);
	}

	handle() {
		super.handle();
		let that = this;

		that.new_element.find("div.content").on("blur", function(){
			that.new_element.find("textarea.content").val(that.new_element.find("div.content").html());
			return false;
		});

		// Security added to get last version into textarea.
		let form = fire.get("#" + that.data.form);
		form = (form.size() === 1) ? (form) : (that.new_element.parents("form"));
		form.on("submit", function(){
			if (that.data.mode_wysiwyg) {
				that.new_element.find("textarea.content").val(that.new_element.find("div.content").html());
			}
		});	
	}

	command(name, arg) {
		if (name === "createLink") {
			arg = prompt("Quelle est l'adresse du lien ?");
			if (!arg) {
				return false;
			}
		}
		if (typeof arg === "undefined" || !arg) {
			arg = "";
		}
		document.execCommand(name, false, arg);
	}

	show_panel(button) {
		button.parent().parent().toggleClass("visible");
		button.parent().children().toggleClass("visible");
	}

	toggle_toolkit(button, class_css) {
		let show = (!button.hasClass("active"));
		// Reset other toolkit.
		this.new_element.find(".toolkit").hide();
		this.new_element.find(".button").removeClass("active");
		// Show toolkit.
		if (show) {
			button.addClass("active");
			button.next().show();
			return true;
		} else {
			button.removeClass("active");
			return false;
		}
	}

	span_command(style, value) {
		let selection = document.getSelection();
		let begin_node = selection.anchorNode;
		let end_node = selection.focusNode;
		if (begin_node !== end_node || selection.anchorOffset !== selection.focusOffset) { // If there is a selection.
			let id = Date.now();
			if (begin_node.nodeName.toLowerCase() === "#text" && begin_node.parentNode.nodeName.toLowerCase() === "span" && begin_node.parentNode.childNodes.length === 1) {
				begin_node = begin_node.parentElement;
			}
			if (begin_node.nodeName && begin_node.nodeName.toLowerCase() === "span" && begin_node.childNodes.length === 1) {
				begin_node.style[style] = value;
				begin_node.setAttribute("data-id", id);
			} else {
				let text = selection.toString();
				text = text.replace(/\n/g, "<br/>");
				this.command("insertHTML", "<span data-id='"+id+"' style='"+style+":" + value + "'>" + text + "</span>");
			}
			// Get element and set selection on it.
			let span = this.new_element.find("div.content span[data-id='"+id+"']");
			span = span.first();
			span.attr("data-id", null);
			let range = document.createRange();
			range.selectNode(span.node().childNodes[0]);
			let sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}
}

fire.component.add(ComponentFTextEditor);