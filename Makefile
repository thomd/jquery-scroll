# compress javascript with uglify-js.

JS_FILES = jquery.scroll.js
JS_FILES_MINIFIED = $(JS_FILES:.js=.min.js)

UGLIFY ?= `which uglifyjs`

js: $(JS_FILES) $(JS_FILES_MINIFIED)
	@@if test -z $(UGLIFY); then \
		echo "You must have the uglifyjs compressor installed."; \
		echo "Install it by running: npm install uglify-js"; \
	fi

%.min.js: %.js
	uglifyjs --no-mangle $< > $@
	@du -h $<
	@du -h $@

.PHONY: clean
clean:
	rm -f $(JS_FILES_MINIFIED)
