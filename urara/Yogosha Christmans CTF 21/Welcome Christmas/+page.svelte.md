---
title: 'Welcome Christmans'
image: '/assets/APYxowi.png'
created: 2021-12-29
updated: 2021-12-29
tags:
  - 'ctf'
  - 'yogosha'
---
# Welcome Christmas

> Yogosha Christmas CTF 2021

---

- So this is the first challenge. Let's look at the challenge prompt.
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Welcome_Christmas_DONE/images/1.png)

- We have some naruto info and some names(possibly usernames as this is an OSINT challenge).
- We can see a name `ShisuiYogo`. Let's do some googling. We got a twitter account. Let's look into it.
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Welcome_Christmas_DONE/images/2.png)
- This tweet looks interesting
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Welcome_Christmas_DONE/images/3.png)
- `Important image in a popular website` Hmmmm... what are some popular image hosting platforms.....pinterest, tumblr, flicker etc.
- Well pinterest has too many images (:-()...
- This is where the hint comes in handy.
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Welcome_Christmas_DONE/images/4.png)
- It's clearly sating `Flicker`. Let's go there and search for `Uchiha Shisui`...and **BOOM** we have a user
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Welcome_Christmas_DONE/images/5.png)
- This user has only 1 post let's look into this. So from here there are 2 ways to get the flag & further info

1. We check the `EXIF` data from the webise
![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Welcome_Christmas_DONE/images/6.png)
2. We download the file & then use `exifool`

- I'm a linux guy I'll do the later one. Here is the output of `exiftool`

```bash
$ exiftool 51773456833_95c363f276_o.png                                                                                

ExifTool Version Number         : 12.16
File Name                       : 51773456833_95c363f276_o.png
Directory                       : .
File Size                       : 774 KiB
File Modification Date/Time     : 2021:12:27 18:40:19+05:30
File Access Date/Time           : 2021:12:27 18:40:18+05:30
File Inode Change Date/Time     : 2021:12:27 18:40:28+05:30
File Permissions                : rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 1080
Image Height                    : 1080
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Gamma                           : 2.2
White Point X                   : 0.3127
White Point Y                   : 0.329
Red X                           : 0.64
Red Y                           : 0.33
Green X                         : 0.3
Green Y                         : 0.6
Blue X                          : 0.15
Blue Y                          : 0.06
Background Color                : 255 255 255
Datecreate                      : 2021-12-24T16:52:13+00:00
Datemodify                      : 2021-12-24T16:52:13+00:00
Coded Character Set             : UTF8
Envelope Record Version         : 4
Object Name                     : Yogosha{Shisui_H4s_G00d_ViSion}
Caption-Abstract                : I heard something important is stored in /secret.txt here: http://3.141.159.106 ; Maybe the akatsuki will help the Uchiha clan ?
Application Record Version      : 4
Image Size                      : 1080x1080
Megapixels                      : 1.2
```

- We have the flag here. BTW downlaod full resolution, the flag was not present in the medium resolution file don't know why.
- If you're a nerd & you don't have a life then you can do something like this for fun.

```bash
#!/bin/bash
exiftool 51773456833_95c363f276_o.png | grep -E "Yogosha{.*" | awk '{print $4}'
```

- This is a one-liner to get the flag. Let me explain this, first we're dumping the exif data of the image then we're `grep`ing with `-E` (extended regular expression) tag for the flag format pattern `Yogosha{` followed by a `.` (any character) & `*` (0 or more number of occurrence). Then just to extract the flag bit we're printing the letters in the 4th position of our stdout using `awk`.

![](https://gitlab.com/Aviksaikat/yogoshactf-2021/-/raw/main/Welcome_Christmas_DONE/images/7.png)

- And we're done with the first `OSINT` challenge.

#### flag

```
Yogosha{Shisui_H4s_G00d_ViSion}
```
