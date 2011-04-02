# jQuery Scroll

a jQuery plugin which renders a custom, CSS styleable vertical scrollbar for arbitrary overflowed content.


## Unit Tests

jquery-scroll contains unit-tests based on Googles [js-test-driver][jstd].


### Usage:

Starting the server & automatically launch the browsers and capture it (browser paths for `Safari`, `Firefox` & `Chrome` are OSX paths):

    > cd jquery-scroll/tests
    > java -jar lib/JsTestDriver-1.2.2.jar --port 8448 --browser lib/safari.sh,lib/firefox.sh,lib/chrome.sh --config scroll.conf

Running the tests:

    > java -jar lib/JsTestDriver-1.2.2.jar --config scroll.conf --tests all


## Documentation

A neat [documentation][docu] is done with the [dox][dox] documentation generator:

    > npm install dox
    > dox --title jquery-scroll jquery.scroll.js css/scrollbar.css > docs/jquery.scroll.html



[jstd]: http://code.google.com/p/js-test-driver/ "project page of js-test-driver"
[dox]: https://github.com/visionmedia/dox "JavaScript documentation generator for node using markdown and jsdoc"
[docu]: https://thomd.github.com/jquery-scroll/docs/jquery.scroll.html "jquery-scroll Documentation"
