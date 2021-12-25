<h1 align="center">
  Zinger Admin Panel
</h1>

This repo contains admin panel for both shop admin and zinger admin to manage zinger core. It provides functionality to manage shops, inventory, users etc.

**This repo is under heavy development and is undergoing a lot of changes**

## Build Instructions
#### Prerequisites
- npm version > 7.20.0
- angular version > 9.1
#### Fork Project
- Fork the Main Repository
- Clone the forked repository locally git clone forked_repo_url
#### Update the hosts file
Add the below lines to your hosts file. This will allow angular to run in zinger.pw subdomain.
>    127.0.0.1	admin.zinger.pw 

>    127.0.0.1	platform.zinger.pw

>    127.0.0.1	api.zinger.pw

The host file is located in the below locations
> linux/mac os - /etc/hosts

>windows - C:\Windows\System32\drivers\etc\hosts 

#### Run the Angular code
- Navigate to the forked repo directory
- ng s

The angular app will be running in the following location
- Admin/Seller Login -  admin.zinger.pw:4200
- Zinger-Admin/Platform login - platform.zinger.pw:4200
