FROM ubuntu:latest

# Install Apache, curl, nano, sudo, and systemctl
RUN apt-get update && apt-get install -y apache2 curl gnupg nano sudo systemctl

# Install Node.js (adjust the version if needed)
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Install pm2 for deployement
RUN npm install pm2 -g

# Copy the API files into the container

# Copy Apache configuration
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Enable necessary Apache modules
RUN a2enmod proxy proxy_http rewrite

# Expose port 80
EXPOSE 80

# Define the startup command
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]