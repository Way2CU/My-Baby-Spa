/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Handle clicking on "start now" buttons.
 * @param object event
 */
Site.handle_dialog_form = function(event) {
	event.preventDefault();
	Site.dialog_form.open();
}

/**
 * Handle clicking on submit button in contact form dialog.
 * @param object event
 */
Site.handle_submit_click = function(event) {
	event.preventDefault();
	Caracal.ContactForm.list[0]._form.trigger('submit');
}

/**
 * Handle loading language constants from the server.
 * @param object data
 */
Site.handle_language_load = function(data) {
	Site.submit_button.innerText = data['send'];
	Site.dialog_form.set_title(data['fill_out']);
}

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	Site.header = document.querySelector('header');

	var ignore_paths = ['/gallery', '/contact'];

	if (ignore_paths.indexOf(window.location.pathname) > -1) {
		Site.header.classList.add('active');

	} else {
		// add class on scroll to header
		window.addEventListener('scroll', function(){
			if (window.scrollY === 0)
				Site.header.classList.remove('active'); else
				Site.header.classList.add('active');
		});
	}

	//Dialog form
	Site.dialog_form = new Caracal.Dialog();
	Site.dialog_form.set_content_from_dom('div#floating_form');

	Site.submit_button = document.createElement('a');
	Site.submit_button.addEventListener('click', Site.handle_submit_click);
	Site.dialog_form.add_control(Site.submit_button);

	// load language constants from the server
	language_handler.getTextArrayAsync(null, ['fill_out', 'send'], Site.handle_language_load);

	//Dialog contact form button
	Site.dialog_contact = document.querySelectorAll('a.contact_form');

	// Conect event listners to buttons in nodelist
	for(var i=0; i < Site.dialog_contact.length; i++) {
		Site.dialog_contact[i].addEventListener('click', Site.handle_dialog_form);
	}
};



// connect document `load` event with handler function
$(Site.on_load);
