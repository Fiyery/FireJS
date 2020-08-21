# FireJS
Light Jquery librairy with only Vanilla JS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

#### For JS Lib only

1. Take the `res/dist/firejs.min.js` and put in your ressource directory.
2. Call the librairy in your HTML page before your JS script
```
<script type="text/javascript" src="YOUR_RES_DIR/firejs.min.js"></script>
```

#### Prerequisites for Component system

What things you need to install 

- NodeJS
- NPM

### For JS Lib and Component system

1. Put the 
    - `/res`
    - `package.json`
    - `gulpfile.js` 
    
    into your root project
2. Configure the `/res/sass/01_theme.scss` with color you want, focus mainly on `$default-primary-color`
3. Run in console 
```
> cd YOUR_PROJECT_DIR
> npm i 
> gulp
```
4. Call the librairy in your HTML page before your JS script
```
<script type="text/javascript" src="res/dist/min.js"></script>
<link rel="stylesheet" type="text/css" href="res/dist/min.js">
```

## JS Librairy

On going ...

## Component 

### Optimal project structure

The JS librairy is developping to fit this structure and gulpfile.js is configured to this set up

```
/
|    res
|    |    dist
|    |    |    min.css
|    |    |    min.js
|    |    js
|    |    |    component
|    |    |    |    modal
|    |    |    |    minput
|    |    |    |    ...
|    |    |    main
|    |    |    |    firejs.js
|    |    |    |    ...
|    |    sass
|    |    |    main
|    |    |    |    theme.scss
|    src
|    |    ...
```

### List of components

- `<fbutton>` : Material Design button
- `<fgroup_field>` : Intern component for form tag, you don't need to use it
- `<finput>` : Material Design input. Warning, you need write `<finput></finput>` for working
- `<fline_bloc>` : Bloc animate with 2 width animations on event "show" or "hide"
- `<fmodal>` : Material Design modal / popin
- `<fmodal_button>` : Button to show popin with `data-id` attribute whitch contains the id of modal
- `<fpage>` : Material Design pagination bloc witch setup with `data-begin` (start page), `data-end` (last page), `data-current` (current page), `data-target` (url or js visible function), `data-view` (number of current side page show) and `data-urlparam` (name of url param for pagination)
- `<fselect>` : Material Design select
- `<fstate>` : Material Design representation of state / status customable with `data-color`
- `<fsubmit>` : Material Design submit form button
- `<ftab>` : Material Design tab 
- `<ftable>` : Material Design table that thead scroll and sort colum on click 
