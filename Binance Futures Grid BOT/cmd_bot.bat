@echo OFF

:START

node FM_BOT.js

echo --------------------------------------------------------------------------------


TIMEOUT /T 6 /NOBREAK

CLS
GOTO START

PAUSE