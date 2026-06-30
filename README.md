# What Works
- User submit word button any word including single letters. 
- Reset game button.
- recall tile button(if user doesn't like the word they made recalls all tiles).
- user can only place tile in front or behind of the first tile being place.
- simple error messages if user don't place any tile and submit word(error) and if user places a tile too far from the first tile(+1/-1)(error).
- real time scores.
- game rests on load refresh and button.
- score is saved until reset or window refresh.
- tile goes back to rack if user drops them anywhere.
- score gets updated in real time.
- board can tell which tile is dropped anywhere on board
- tiles in rack on random
- draggable and droppable tiles

# What Somewhat work
- special bouses squares are in. I did all 4 but wasn't able to truly test them. I haven't played scabble in a very long time, so I have no clue if they work the way the original does or not(edge cases and those odd scenarios)(I did something very basic may or may not work properly 100% of the time) in codebase look up extra points.
- When you place a letter on special tile, it doesn't take up the whole tile. The tile and special tile is still seeable. In the original scabble it takes up the whole space but for online I forgot it was the same.
- user can re-drag tile back to the tile box(I spoke to the professor about this in class if user places a tile onto the board by mistake should
                                            the user be able to redrag it somewhere else/place it back into letter word bank(your 7 tiles) she said if original scabble allows it then follow it) it kind of breaks the adjacent rule/first tile rule though.
- it currently keep drawing from the bag of tiles but if there's less than 7, player will start with less than 7. The game continues but with a smaller tile supply.
# What I didn't do
- you can spell any word it doesn't do the word bank check before making a word I think I would need to set up a API for that.
- not the original 15x15 scrabble just single line version.
- didn't follow "Once the tile is placed on the Scrabble board, it can not be moved" due to the original scabble you are allowed to re-move place tiles(spoke to professor about this)


# GitHub Link
https://tennathephantom.github.io/GUI-HW5/