## What is this?

a react native app for RepairMaps.com

## Who is it for? 

for your reference, for my safe keeping, and for my clients use 

## Other Somewhat Interesting Facts...

* This is not ready for the app store. It's just a prototype
* Currently for iOS only, though Android will happen
* Uses [dancormier/react-native-swipeout](https://github.com/dancormier/react-native-swipeout), Thanks Dan!
* Uses an offline caching strategy which is network biased

## Known Issues
* When offline attempting to access non-cached content, the app just spins... need to more gracefully handle this.
* When 'clearing cache' the 'last updated on' date should immediately become 'never' but I coudln't figure that out. So for now, it changes when the user returns to the screen.
* UX improvements needed, such as growl messages to inform user that data is being cached/deleted in the background.
* add an actual login, pretty it up, and the usual stuff

## Demo Gif
![RepairMaps Demo](https://cloud.githubusercontent.com/assets/1640318/13160558/e2764584-d64c-11e5-8445-93b6e7914c1f.gif)


