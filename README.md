npm install
add DB_STRING to .env file

heroku login -i
heroku create simple-rap-api
echo "web: node server.js" > Procfile
git add . 
git commit -m "changes"
git push heroku main