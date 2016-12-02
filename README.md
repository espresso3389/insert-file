# Replace File Name with...

This extension replaces selected file name with its file content either in plain or BASE64 encoded form.

## Instructions

After selecting file name, open context menu (right-click) and select "Replace File Name with File Content" or its variants.

The following image illustrates a very easy way to create `data:` URL from a PNG image file:

![](https://raw.githubusercontent.com/espresso3389/insert-file/master/images/intro.gif)

## Other Features

The extension equips many of "Replace File Name with" commands. To use them, open command palette (`Ctrl-Shift-P` or `⌘-Shift-P`) and type the command name manually.

### Replace File Name with File Content

The command replaces the selected file name with the file's content, assuming the content is UTF-8 encoded.

### Replace File Name with File Content (BASE64)

The command replaces the selected file name with the file's content encoded in BASE64.

### Replace File Name with data: (RFC 2397) Formatted Data

The command replaces the selected file name with the data encoded with [RFC 2397 The "data" URL scheme](http://www.ietf.org/rfc/rfc2397.txt).

Although it is just a combination of BASE64 and Mime-type, it is very useful when embedding file data on HTML or CSS.

### Replace File Name with SHA256 Hash

The command replaces the selected file name with the SHA-256 hash of the file.

### Replace File Name with SHA1 Hash

The command replaces the selected file name with the SHA-1 hash of the file.

### Replace File Name with MD5 Hash

The command replaces the selected file name with the MD5 hash of the file.

### Replace File Name with Absolute (Fully Qualified) Path Name

The command replaces the selected file name (relative to the editing file's path) with its absolute path.

### Replace File Name with Relative Path Name

The command replaces the selected file name (absolute path) with its relative path to the editing file's path.

### Replace File Name with Mime-Type

The command replaces the selected file name with its MIME type. The MIME type is guessing based on the extension of the file. No file content is checked by the extension.

## GitHub URL
https://github.com/espresso3389/insert-file

## Marketplace URL
https://marketplace.visualstudio.com/items?itemName=espresso3389.insert-file