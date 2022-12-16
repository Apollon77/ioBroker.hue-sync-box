![Logo](admin/hueSyncBox.png)
# ioBroker.hue-sync-box

[![NPM version](https://img.shields.io/npm/v/iobroker.hue-sync-box.svg)](https://www.npmjs.com/package/iobroker.hue-sync-box)
[![Downloads](https://img.shields.io/npm/dm/iobroker.hue-sync-box.svg)](https://www.npmjs.com/package/iobroker.hue-sync-box)
![Number of Installations](https://iobroker.live/badges/hue-sync-box-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/hue-sync-box-stable.svg)

![Test and Release](https://github.com/xXBJXx/ioBroker.hue-sync-box/workflows/Test%20and%20Release/badge.svg)

## hue-sync-box adapter for ioBroker

**This adapter uses the service Sentry.io to automatically report exceptions and code errors and new device schemas to me as the developer.
More details see below! [Sentry](#sentry)**

## The adapter requires a Node.js version >= 16.x

### What is the Philips Hue Sync Box?

The Philips Hue Sync Box is a device that allows you to synchronize the colors and lighting effects of your Philips Hue lights with the screen of your
computer screen. This is possible by the Sync Box detecting the colors and light effects of your screen and transmitting them to your Philips
Hue luminaires.

## What is required to use the adapter?

- Philips Hue Sync Box IP address (IPv4 only)
- Hue Sync Box token (see below)

## How do I add the Philips Hue Sync Box to the adapter?

1. Open the adapter configuration and click on the button "Add box".
2. enter a name for the box, the name must be only 1x because it will be used as ID.
3. Enter the IP address of the box. (IPv4 only) (small hint: when entering the IP address, a dot will be inserted automatically at every 3rd number)

   ![name_ip_token](admin/media/name_ip_token.png)
4. Click on the button `register box` a new window will open, where you can register the box (see below)
   ![registration](admin/media/registration.png)
5. As soon as the button `registration` is pressed, the process starts, then you have 5 seconds to press the button on the box and hold it for 
   about 3 seconds until the LED flashes green. (see below)
   ![registration](admin/media/registration_timer.png)
6. as soon as the LED is flashing green, you have to click on the button 'Next' and you will get the token displayed, and it will be entered 
   automatically in the token field. In the field Token. (see below)
   ![token](admin/media/registration_successful.png)
   ![token](admin/media/token.png)
7. Now you can click on the button `add` and the box will be added, then you just have to click on the button `save` to save the config.
   ![Adapter_GUI](admin/media/Adapter_GUI.png)

## Sentry
### What is Sentry.io and what is reported to the servers of that company?

Sentry.io is a service for developers to get an overview about errors from their applications. And exactly this is
implemented in this adapter.

When the adapter crashes, or another Code error happens, this error message that also appears in the ioBroker log is
submitted to Sentry. When you
allowed iobroker GmbH to collect diagnostic data then also your installation ID (this is just a unique ID without any
additional infos about you, email name or such)
is included. This allows Sentry to group errors and show how many unique users are affected by such an error.
All of this helps me to provide error free adapters that basically never crashs.

For more details and information on how to disable error reporting, please refer to the
[Sentry plugin documentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry) <br>
Sentry Reporting is used from js-controller 3.0.

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**
* (Issi) First release


## License
MIT License

Copyright (c) 2021-2022 Issi <issi.dev.iobroker@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.