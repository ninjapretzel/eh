# VM Version:
## Ubuntu 18.04 in Azure

# Mount data drive
From: 
`https://docs.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal`
```c
$> dmesg | grep SCSI
```
(Find Disc ID in output, eg `sdc`)

Then, make partition, format, and mount (and setup auto-mount for reboots)
```c
$> sudo fdisk /dev/sdc
: n
: p
: 1
: (default)
: (default)
: p 
// (verify results in output)
: w

$> sudo mkfs -t ext4 /dev/sdc1
// (this step will take a while)

// Mount Drive:
$> sudo mkdir /data1
$> sudo mount /dev/sdc1 /data1

// Auto-mount setup:
$> sudo -i blkid
//(find UUID for disk)
//(eg /dev/sdc1: UUID="33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e" TYPE="ext4")

$> sudo vim /etc/fstab
// add line to bottom of file like:
// UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /data1   ext4   defaults,nofail   1   2

```

## Setup Dependencies

Update package managers:
```c
$> sudo apt update
$> sudo apt-get update
```


### NodeJS
```c
$> curl -sL "https://deb.nodesource.com/setup_lts.x" | sudo -E bash -
$> sudo apt-get install -y nodejs

// (Verify)
$> nodejs -v
v12.18.3
$> npm -v
6.14.6

// Install Global Packages:
$> sudo npm i -g nodemon
$> sudo npm i -g pm2
```
### Yarn
```c
$> curl -sS "https://dl.yarnpkg.com/debian/pubkey.gpg" | sudo apt-key add -
$> echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$> sudo apt update && sudo apt install yarn
```

### MongoDB
```c
$> sudo apt install -y mongodb

// (Verify)
$> sudo systemctl status mongodb
//...
Active: active (running) since Sun 2020-08-23 01:53:29 UTC; 8min ago
//...

$> mongo --eval 'db.runCommand({ connectionStatus: 1 })'
	{ /*...*/, "ok" : 1 }

// Steps to Move mongodb to data drive:
// Stop service
$> sudo systemctl stop mongodb
// Copy to data drive, remove original:
$> sudo cp -a /var/lib/mongodb/. /data1/db/
$> sudo rm -rf /var/lib/mongodb/
// edit dbpath to be /data1/db/ in:
$> sudo vim /etc/mongodb.conf
// Change permissions of new directory: 
$> sudo chown -Rf mongodb:mongodb /data1/db
$> sudo systemctl start mongodb
// (Verify again)
$> sudo systemctl status mongodb
//...
Active: active (running) since Sun 2020-08-23 01:53:29 UTC; 8min ago
//...

$> mongo --eval 'db.runCommand({ connectionStatus: 1 })'
	{ /*...*/, "ok" : 1 }
```

## Run app
```c
// Clone source, should run from user home:
$> cd ~
$> git clone "https://github.com/ninjapretzel/eh.git"
$> cd eh
$> yarn

// (if doing development, also do the following:)
$> touch .dev
// (This lets the application know it is a development environment, and will run on localhost.)

$> sudo nodemon app.js
```

