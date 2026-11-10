# Essentials Size

A Zen mod that changes the size of the favicons inside Essentials boxes. The boxes keep Zen's default size, and the icons on normal tabs, pinned tabs and SuperPins are left alone.

![Essentials icons](image.png)

## Use

Set `uc.essentials.size` to a whole number: the icon size as a percent of Zen's default 16px icon. 100 is the default, the range is 25 to 300. Type it into the Essentials Size entry under Settings > Mods, or set the string pref in `about:config`. The icons resize live. Very large values can clip the icon, since the box does not grow.

## Slider (optional)

`essentials-size.uc.mjs` adds a slider and number field, opened by right-clicking an Essential and choosing "Resize Essentials icons...". It needs a userChrome script loader such as Sine and is not part of the Zen store version.

## License

CC BY-NC-SA 4.0, the same as the Zen theme store.
