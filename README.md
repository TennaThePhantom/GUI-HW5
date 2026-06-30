# What Works
- User submit word button any word including single letters 
- Reset game button
- recall tile button(if user doesn't like the word they made recalls all tiles)
- user can only place tile in front or behind of the first tile being place
- simple error messages if user don't place any tile and submit word(error) and if user places a tile too far from the first tile(+1/-1)(error)
- real time scores
- game rests on load refresh and button
- score is saved until reset or window refresh
- tile goes back to rack if user drops them anywhere
- score gets updated in real time

# What Somewhat work
- special bouses squares are in. I did all 4 but wasn't able to truly test them. I haven't played scabble in a very long time so I have no clue if they work the way the original does or not(edge cases and those odd scenarios(haven't played scabble so I did something very basic may or may not work properly 100% of the time)) in codebase look up extra points
- When you place a letter on special tile it doesn't take up the whole tile the tile and special tile is still seeable. In the original scabble it takes up the whole space but for online I forgot it was the same.
- user can redrag tile back to the tile box(I spoke to the professor about this in class if user places a tile onto the board by mistake should
                                            the user be able to redrag it somewhere else/place it back into letter word bank(your 7 tiles) she said if original scabble allows it then follow it) it kind of breaks the adjacent rule/first tile rule 



# What I didn't do
- you can spell any word it doesn't do the word bank check before making a word I think I would need to set up a API for that
- not the original 15x15 scrabble just single line version


# Github Link