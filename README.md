# Jinnmail Admin Panel

## Dev
```
npm install
npm start
```

## First Deployment
```
create new ubuntu 20.04 micro instance
sudo apt update
sudo apt install apache2
cd /var/www/html
sudo rm index.html
sudo git clone x .
change environment variables to production values
sudo vim .env
REACT_APP_API_URL=https://<jinnmailapp>/api/v1
install node which comes with npm 
https://cloud.google.com/nodejs/docs/setup
nvm install 12.17.0 instead of nvm install stable
exit out of terminal and come back in
sudo chown -R $USER /var/www/html
npm install
sudo vim /etc/apache2/sites-available/000-default.conf
add two new lines to the bottom of the VirtualHost tag
        ProxyPass / http://127.0.0.1:5000/
        ProxyPassReverse / http://127.0.0.1:5000/
enable proxy mode too
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_balancer
sudo a2enmod proxy_http
npm run build
npm install -g serve
screen
press enter
serve -s build
detach from screen
ctrl a d
sudo service apache2 restart
follow certbot instructions for using https
https://certbot.eff.org/lets-encrypt/ubuntufocal-apache
exit
```

## Subsequent Deployments
```
cd /var/www/html
git pull
screen -x tab
ctrl c
npm run build
serve -s build
detach from screen
ctrl a d
sudo service apache2 restart
exit
```