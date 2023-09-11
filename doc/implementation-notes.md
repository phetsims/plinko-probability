# Plinko Probability - implementation notes

## Terminology

- Galton board, or "the board" - the triangular area
- hopper - the thing above the center of the board
- hopper mode buttons - the radio buttons to the right of the hopper on the Lab screen
- balls - the spheres that fall out of the hopper and bounce around on the board
- pegs - the things that the balls bounce off of on the board
- bins - the cylinders below the board, where balls stack up
- histogram - the graph below the board (occupies same space as bins)
- histogram mode buttons - the buttons to the left of the histogram, above the eraser button
- statistics panel - on the Lab screen, the panel that can be expanded/collapsed to show statistics
- play mode buttons - the radio buttons to the right of the green Play button

## Overview

The Galton Board is created with all of the possible pegs. Each of the pegs is given a row and a column and are evenly
spaced. The peg separation is determined by the number of rows displayed. The display of pegs is optimized by using
CanvasNode, see PegsNode.

There is a Ball object with the knowledge of its position and intended position. When an ball instance is created we
generate a probability for a path. Depending on this probability, the ball has some chance of going left of right. Using
random numbers the ball stores the path that it will take and saves it for later use. The ball 'knows' from the moment
it is created which bin it is going to land in.

A ball's motion is divided into four phases, as documented in BallPhase. As the step function gets called, the ball goes
through each of the four phases, updating it's position based on the path that it 'chose' at its creation. Finally, it
ends up at the histogram and it is added to the statistics of the histogram.

The display of balls is optimized by using CanvasNode, see BallsNode. A single ball image (scaled to fit the space
between pegs on the Galton board) is used to render all balls.

The histogram holds all of the statistics of the model. It also holds an array, where each element is the number of
balls in a bin. Each time a ball exits the Galton Board, one of the bins is incremented by one. These numbers are then
used to calculate the mean, variance, standard deviation.

A model-view transform is used to map between model and view coordinate frames. This transform is created in
PlinkoProbabilityCommonView, by mapping the bounds of the Galton board model to bounds of the Galton board view.


