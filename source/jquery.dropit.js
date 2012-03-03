 /*
 * dropIt - jQuery Plugin
 * version: 1.0 (03/03/2012)
 * @requires jQuery v1.6 or later
 *
 * Copyright 2012 Simon Kusterer - simon@soped.com
 *
 */

(function($) {
	jQuery.fn.dropIt = function(options) {
		var that = this;

		that.options = $.extend({}, jQuery.fn.dropIt.defaults, options);
		var _drop = function(evt) {
			evt.originalEvent.stopPropagation();
			evt.originalEvent.preventDefault();
			var files = evt.originalEvent.dataTransfer.files;

			for (var i=0; i<files.length; i++) {
				var file = files[i],
						type = _getFiletype(file.fileName);
				if (type === false) {
					continue;
				}

				var processor = that.options.fileMapper[type] || that.options.defaultProcessor;
				jQuery.fn.dropIt.processors[processor].call(that, file, evt, _preProcess(file, evt));
			}
			return false;
		};

		var _dragOver = function(evt) {
			evt.originalEvent.stopPropagation();
			evt.originalEvent.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		};

		var _preProcess = function(file, evt) {
			var insertMode = $(evt.srcElement).attr('data-dropit-insert-mode') || that.options.defaultInsertMode;
			if (that.options.insertPrompt) {
				insertMode = prompt('Which Insert-Mode do you want to use? (e.g. html, prepend, append)', insertMode);
			}
			return {
				'insertMode': insertMode
			}
		};

		var _getFiletype = function(fileName) {
			fileName = fileName || '';
			var pieces = fileName.split('.');
			if (pieces.length === 0) {
				return false;
			}
			return pieces[pieces.length-1].toLowerCase();
		};

		return this.each(function() {
			$(this).bind('dragover', _dragOver);
			$(this).bind('drop', _drop);
		});
	};

	jQuery.fn.dropIt.processors = {
		'html': function(file, evt, local) {
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					$(evt.srcElement)[local.insertMode](e.target.result);
				};
			})(file);
			reader.readAsText(file);
		},
		'image': function(file, evt, local) {
			var reader = new FileReader(),
					imageTpl = this.options.tpl.image;
			reader.onload = (function(theFile) {
				return function(e) {
					$(evt.srcElement)[local.insertMode](imageTpl.replace('{src}', e.target.result));
				};
			})(file);
			reader.readAsDataURL(file);
		},
		'unknown': function(file, evt, local) {
			//console.log('dunno what todo');
		}
	};

	jQuery.fn.dropIt.defaults = {
		defaultInsertMode: 'append',
		insertPrompt: false,
		tpl: {
			'image': '<img src="{src}" />'
		},
		fileMapper: {
			'html': 'html',
			'jpg': 'image',
			'png': 'image',
			'gif': 'image'
		},
		defaultProcessor: 'unknown'
	}
})(jQuery);