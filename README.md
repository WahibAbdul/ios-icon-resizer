# ios-icon-resizer
NodeJs script to resize icon for iOS UI elements like Tab bar, navigation bar &amp; tool bar. It will give you the .imageset folder which you can easily drag n drop into Xcode assets folder.

## Getting Started

### Prerequisites
- NodeJS => 6.0

### Installing
Download zip file and unzip in a folder

### Arguments & Values
#### Required
- --element
  - nav_bar
  - tool_bar
  - tab_bar
- --image
  - icon.png
```
node resize.js --element nav_bar --image ic_home.png
```
#### Optional
- --width (Give custom minimum width for resizing at 1x)
- --heigth (Give custom minimum height for resizing at 1x)
- --min (Include if you want to use Apple minimum sizes - Default)
- --max (Include if you want to use Apple maximum sizes)
#### Example 1
```
node resize.js --element nav_bar --min --image ic_home.png
```

#### Example 2
```
node resize.js --element nav_bar --width 24 --image ic_home.png
```

#### Tab bar specific arguments
- --attribute (To specify the type shape of icon) - #### Optional
  - square (Default)
  - circle
  - tall
  - wide
- --type (To specify the type of tab bar) - #### Optional
  - regular (Default)
  - compact
```
node resize.js --element tab_bar --attribute circle --type regular --image ic_home.png
```

## Apple Specified Sizes [1x, 2x, 3x]
- NavigationBar & ToolBar
  - Minimum [25, 50, 75]
  - Maximum [28, 56, 83]
- TabBar
  - Regular
    - Circle [25, 50, 75]
    - Square [23, 46, 69]
    - Tall [28, 56, 84]
    - Wide [31, 62, 93]
  - Compact  
    - Circle [18, 36, 54]
    - Square [17, 34, 51]
    - Tall [20, 40, 60]
    - Wide [23, 46, 69]
