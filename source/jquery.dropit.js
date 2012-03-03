(function($, jQuery) {
	jQuery.fn.dropIt = function(options) {
		options = $.extend({}, options, jQuery.fn.dropIt.defaults);

		return this.each(function() {

		});
	};

	jQuery.fn.dropIt.defaults = {
		defaultInsertType: 'append',
		tpl: {

		}
	}
})(jQuery, jQuery);