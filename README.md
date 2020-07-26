# Jinnmail Admin Panel

This is only an admin panel, so there is no need for a test environment

## First Deployment
<br>
```
create new ubuntu 20.04 micro instance
sudo apt update
sudo apt install apache2
cd /var/www/
rm index.html
git clone x .
change environment variables to production values
vim .env
REACT_APP_API_URL=https://<jinnmailapp>/api/v1
sudo service apache2 restart
```