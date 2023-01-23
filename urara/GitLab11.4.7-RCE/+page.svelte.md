---
title: 'Gitlab-11.4.7 Remote Code Execution(RCE) Exploitation'
#image: 
created: 2021-09-03
updated: 2022-12-19
tags:
    - 'gitlab'
    - 'ctf'
    - 'rce'
--- 

- For this challenge we're running a gitlab instance locally 
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/gitlab-11.4.7/images/1.png)
- We have registered an account and logged in
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/gitlab-11.4.7/images/2.png)
- We can check the version here as well
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/gitlab-11.4.7/images/3.png)
- If we visit the official gitlab repository & see at the commits history we can see details about the commits. We are searching for version 11.4.8 as the fix for the previous version would be there.
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/gitlab-11.4.7/images/4.png)
- There is no filtering going we can send any ipv6 url we can bypass the url check.
- There is a exploit [script available](https://github.com/ctrlsam/GitLab-11.4.7-RCE/blob/master/exploit.py)
- So this script is basically importing a new repository using an ipv6 localhost address `git://[0:0:0:0:0:ffff:127.0.0.1]:6379/test/.git` and sending a reverse shell as the payload   
- This script was not working for me so I used this [one](https://github.com/mohinparamasivam/GitLab-11.4.7-Authenticated-Remote-Code-Execution)
- Let's run the exploit 
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/gitlab-11.4.7/images/8.png)
- First step is to generate & download a reverse-shell payload & then using the second option to connect back to us 
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/gitlab-11.4.7/images/9.png)
- Using the 2nd option we successfully ran got a reverse-shell
- This script was a bit different. First we're creating a script which contains a reverse-shell payload & in the next step we're executing it on the victim machine. Hence we're getting a reverse-shell.  

- All the necessary scripts can be found [here](https://gitlab.com/Aviksaikat/write-ups/-/tree/main/challenges/gitlab-11.4.7)