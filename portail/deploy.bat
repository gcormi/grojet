@echo off
echo ==============================================
echo Deploiement du Portail vers Firebase Hosting
echo ==============================================
echo.
echo Veuillez patienter pendant l'envoi de votre code...
call npx --yes firebase-tools deploy --only hosting
echo.
echo Termine ! Vous pouvez fermer cette fenetre et rafraichir votre site en ligne.
pause
