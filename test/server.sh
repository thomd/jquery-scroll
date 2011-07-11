#!/bin/sh

# java -jar test/lib/JsTestDriver-1.2.2.jar --port 8448 --browser test/lib/firefox.sh --config test/scroll.conf
java -jar test/lib/JsTestDriver-1.2.2.jar --port 8448 --browser test/lib/firefox.sh,test/lib/safari.sh,test/lib/chrome.sh --config test/scroll.conf
