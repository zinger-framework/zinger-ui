<h1 align="center">
  Zinger Web Dashboard
</h1>

A web dashboard for shop owners and platform admin to manage the Zinger core operations. It also provides a functionality to manage shops, inventory, users, etc.

## Prerequisites
#### Dependencies
- npm - `v7.20.0`
- node - `v14.15.0`
- angular - `v9.1`
 
#### Update Hosts
Add the below lines to your hosts file to run the application in custom subdomain.
```shell
127.0.0.1	admin.zinger.pw 
127.0.0.1	platform.zinger.pw
```
Host file location
- Linux/Mac - `/etc/hosts`
- Windows - `C:\Windows\System32\drivers\etc\hosts`

## Setup instructions
#### Fork Project
- Fork the main repository
- Clone the forked repository locally `git clone forked_repo_url`

#### Run Project
- Navigate to root directory & run `ng s`
- The angular application will be running in the following endpoints:
  - Admin(Shop Owner) login -  `admin.zinger.pw:4200`
  - Platform login - `platform.zinger.pw:4200`
