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



[jstd]: http://code.google.com/p/js-test-driver/ "project page of js-test-driver"
