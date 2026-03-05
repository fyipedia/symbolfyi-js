Output demo.gif
Set FontSize 14
Set Width 920
Set Height 580
Set Shell "zsh"
Set Theme "Catppuccin Mocha"
Set TypingSpeed 30ms
Set Padding 20

Type "node"
Enter
Sleep 1s

Type "const { getEncodings, getInfo, lookupHtmlEntity } = await import('symbolfyi')"
Enter
Sleep 1.5s

Type "getEncodings('→')"
Enter
Sleep 2.5s

Type "getInfo('∞')"
Enter
Sleep 2.5s

Type "lookupHtmlEntity('&rarr;')"
Enter
Sleep 2s

Type ".exit"
Enter
Sleep 1s
