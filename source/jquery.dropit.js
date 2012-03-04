/*
 * dropIt - jQuery Plugin
 *
 * Copyright 2012 Simon Kusterer - simon@soped.com
 */

(function ($) {
	jQuery.fn.dropIt = function (options) {
		var that = this;

		that.options = $.extend({}, jQuery.fn.dropIt.defaults, options);
		var _drop = function (evt) {
			evt.originalEvent.stopPropagation();
			evt.originalEvent.preventDefault();
			var files = evt.originalEvent.dataTransfer.files;

			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var type = _getFiletype(file.fileName);
				if (type === false) {
					continue;
				}

				var processor = that.options.fileTypes[type] || that.options.defaultProcessor;
				var local = _preProcess(file, evt);
				var content = jQuery.fn.dropIt.processors[processor].call(that, file, evt, local, function (content) {
					_postProcess(content, evt, local);
				});
			}
			return false;
		};

		var _getDataAttribute = function(attrName, el, fallback) {
			attrName = 'data-'+that.options.namespace+'-'+attrName;
			return $(el).attr(attrName) || fallback;
		};

		var _dragOver = function (evt) {
			evt.originalEvent.stopPropagation();
			evt.originalEvent.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		};

		var _preProcess = function (file, evt) {
			var insertMode = _getDataAttribute('insert-mode', evt.srcElement, that.options.defaultInsertMode);
			insertMode = insertMode.toLowerCase();
			if (that.options.insertPrompt) {
				insertMode = prompt('Which Insert-Mode do you want to use? (e.g. overwrite, prepend, append)', insertMode);
			}
			if (that.options.insertTypes[insertMode] === undefined) {
				insertMode = that.options.defaultInsertMode;
			}
			return {
				'insertMode':insertMode
			}
		};

		var _postProcess = function (content, evt, local) {
			$(evt.srcElement)[that.options.insertTypes[local.insertMode]](content);
		};

		var _getFiletype = function (fileName) {
			fileName = fileName || '';
			var pieces = fileName.split('.');
			if (pieces.length === 0) {
				return false;
			}
			return pieces[pieces.length - 1].toLowerCase();
		};

		return this.each(function () {
			$(this).bind('dragover', _dragOver);
			$(this).bind('drop', _drop);
		});
	};

	jQuery.fn.dropIt.processors = {
		'html':function (file, evt, local, fn) {
			var that = this;
			var reader = new FileReader();
			reader.onload = (function (theFile) {
				return function (e) {
					fn.call(that, e.target.result);
				};
			})(file);
			reader.readAsText(file);
		},
		'image':function (file, evt, local, fn) {
			var that = this;
			var reader = new FileReader();
			var imageTpl = this.options.tpl.image;
			reader.onload = (function (f) {
				return function (e) {
					fn.call(that, imageTpl.replace('{src}', e.target.result));
				};
			})(file);
			reader.readAsDataURL(file);
		},
		'unknown':function (file, evt, local, fn) {
			//console.log('dunno what todo');
		}
	};

	jQuery.fn.dropIt.defaults = {
		'namespace':'dropit',
		'insertPrompt':false,
		'tpl':{
			'image':'<img src="{src}" />'
		},
		'fileTypes':{
			'html':'html',
			'jpg':'image',
			'png':'image',
			'gif':'image'
		},
		'defaultInsertMode':'append',
		'insertTypes':{
			'overwrite':'html',
			'append':'append',
			'prepend':'prepend'
		},
		'defaultProcessor':'unknown',
		'defaultAccept':false,
		'defaultReject':false
	};
})(jQuery);